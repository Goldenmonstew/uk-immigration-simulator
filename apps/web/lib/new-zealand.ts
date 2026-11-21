import type {
  Locale,
  NzRequest,
  NzResidentCategory,
} from '@uk-immigration/engine';
import type { TranslationKey } from '../i18n';
import { validDate } from './questionnaire';

export interface NzTripRow {
  departed: string;
  returned: string;
}

export interface NzForm {
  simulationDate: string;
  dateOfBirth: string;
  firstArrival: string;
  residentGranted: string;
  category: NzResidentCategory;
  prvGranted: string;
  travelConditionsEnd: string;
  conditionsOutstanding: boolean;
  trips: NzTripRow[];
}

export type NzErrors = Partial<Record<string, TranslationKey>>;

export const emptyNzTrip = (): NzTripRow => ({ departed: '', returned: '' });

export function emptyNzForm(today: string): NzForm {
  return {
    simulationDate: today,
    dateOfBirth: '',
    firstArrival: '',
    residentGranted: '',
    category: 'general',
    prvGranted: '',
    travelConditionsEnd: '',
    conditionsOutstanding: false,
    trips: [],
  };
}

/** Field ids with an error message key; empty when the form can be evaluated. */
export function validateNzForm(form: NzForm): NzErrors {
  const errors: NzErrors = {};
  const date = (id: string, value: string, optional = false) => {
    if (optional && !value) return;
    if (!validDate(value)) errors[id] = 'nz.error.date';
  };
  date('nz-simulation-date', form.simulationDate);
  date('nz-date-of-birth', form.dateOfBirth);
  date('nz-first-arrival', form.firstArrival);
  date('nz-resident-granted', form.residentGranted);
  date('nz-prv-granted', form.prvGranted, true);
  date('nz-travel-conditions-end', form.travelConditionsEnd, true);
  if (
    validDate(form.firstArrival) &&
    validDate(form.dateOfBirth) &&
    form.firstArrival < form.dateOfBirth
  )
    errors['nz-first-arrival'] = 'nz.error.beforeBirth';
  if (validDate(form.prvGranted) && form.prvGranted < form.residentGranted)
    errors['nz-prv-granted'] = 'nz.error.prvOrder';
  form.trips.forEach((trip, i) => {
    date(`nz-trip-${i}-departed`, trip.departed);
    date(`nz-trip-${i}-returned`, trip.returned);
    if (validDate(trip.returned) && trip.returned < trip.departed)
      errors[`nz-trip-${i}-returned`] = 'nz.error.order';
    if (validDate(trip.departed) && trip.departed < form.firstArrival)
      errors[`nz-trip-${i}-departed`] = 'nz.error.beforeArrival';
  });
  return errors;
}

export function nzRequest(form: NzForm, locale: Locale): NzRequest {
  return {
    simulationDate: form.simulationDate,
    dateOfBirth: form.dateOfBirth,
    firstArrival: form.firstArrival,
    residentVisa: { granted: form.residentGranted, category: form.category },
    ...(form.prvGranted ? { permanentResidentVisa: form.prvGranted } : {}),
    ...(form.travelConditionsEnd
      ? { travelConditionsEnd: form.travelConditionsEnd }
      : {}),
    ...(form.conditionsOutstanding ? { conditionsOutstanding: true } : {}),
    trips: form.trips,
    locale,
  };
}
