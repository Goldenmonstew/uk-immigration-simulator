import type { SourceRef } from '../types';

// Home Office "Public funds" guidance (SRC-006, updated 2025-04-09), which
// Earned Settlement follows "in the first instance" (SRC-001 p18).
// benefitType is the benefit's English name in upper snake case.

export interface Benefit {
  benefitType: string;
  name: string;
  source: SourceRef;
}

function from(anchor: string) {
  const source: SourceRef = { srcId: 'SRC-006', locator: `#${anchor}` };
  return (benefitType: string, name: string): Benefit => ({
    benefitType,
    name,
    source,
  });
}

const open = from('benefits-open-to-new-claims');
const closed = from('benefits-closed-to-new-claims');
const other = from('other-benefits');
const scotland = from('social-security-scotland-benefits');
const contributory = from('contributory-benefits-and-statutory-payments');

export const publicFundsBenefits: {
  /** Public funds for immigration purposes. */
  publicFunds: Benefit[];
  /** Contributory benefits and statutory payments: not public funds. */
  notPublicFunds: Benefit[];
} = {
  publicFunds: [
    open('UNIVERSAL_CREDIT', 'Universal Credit'),
    open('STATE_PENSION_CREDIT', 'State Pension Credit'),
    open('PERSONAL_INDEPENDENCE_PAYMENT', 'Personal Independence Payment'),
    open('ATTENDANCE_ALLOWANCE', 'Attendance Allowance'),
    open('CARERS_ALLOWANCE', 'Carer’s Allowance'),
    open('DISABILITY_LIVING_ALLOWANCE', 'Disability Living Allowance'),
    open('HOUSING_BENEFIT', 'Housing Benefit'),
    open('HEALTH_IN_PREGNANCY_GRANT', 'Health in Pregnancy Grant'),
    // Social Fund payments (England and Wales; Northern Ireland)
    open('MATERNITY_EXPENSES_PAYMENT', 'Maternity Expenses Payment'),
    open(
      'SURE_START_MATERNITY_GRANT_PAYMENT',
      'Sure Start Maternity Grant Payment',
    ),
    open('FUNERAL_EXPENSES_PAYMENT', 'Funeral Expenses Payment'),
    open('COLD_WEATHER_PAYMENT', 'Cold Weather Payment'),
    open('WINTER_FUEL_PAYMENT', 'Winter Fuel Payment'),
    open('BUDGETING_LOAN_PAYMENT', 'Budgeting Loan Payment'),
    closed('SEVERE_DISABLEMENT_ALLOWANCE', 'Severe Disablement Allowance'),
    closed(
      'INCOME_BASED_EMPLOYMENT_AND_SUPPORT_ALLOWANCE',
      'Income Based Employment and Support Allowance',
    ),
    closed(
      'INCOME_BASED_JOBSEEKERS_ALLOWANCE',
      'Income Based Job Seekers Allowance',
    ),
    closed('INCOME_SUPPORT', 'Income Support'),
    closed('CHILD_TAX_CREDIT', 'Child Tax Credit'),
    closed('WORKING_TAX_CREDIT', 'Working Tax Credit'),
    other('CHILD_BENEFIT', 'Child Benefit'),
    other(
      'SOCIAL_HOUSING_AND_HOMELESSNESS_ASSISTANCE',
      'Social Housing & Homelessness Assistance',
    ),
    other('COUNCIL_TAX_REDUCTION', 'Council Tax Reduction Schemes'),
    other(
      'NI_DISCRETIONARY_SUPPORT_PAYMENT',
      'Discretionary Support Payment (Welfare Reform (Northern Ireland) Order 2015, article 135)',
    ),
    other(
      'LOCAL_AUTHORITY_DISCRETIONARY_PAYMENT',
      'Discretionary Payment by a local authority (Localism Act 2011, section 1)',
    ),
    scotland('CHILD_DISABILITY_PAYMENT', 'Child Disability Payment'),
    scotland('ADULT_DISABILITY_PAYMENT', 'Adult Disability Payment'),
    scotland('CARERS_ALLOWANCE_SUPPLEMENT', 'Carer’s Allowance Supplement'),
    scotland('SCOTTISH_CHILD_PAYMENT', 'Scottish Child Payment'),
    scotland('FUNERAL_SUPPORT_PAYMENT', 'Funeral Support Payment'),
    scotland('JOB_START_PAYMENT', 'Job Start Payment'),
    scotland(
      'CHILD_WINTER_HEATING_ASSISTANCE',
      'Child Winter Heating Assistance',
    ),
    scotland('WINTER_HEATING_PAYMENT', 'Winter Heating Payment'),
    scotland(
      'SCOTTISH_WELFARE_FUND_PAYMENT',
      'Payment from a Welfare Fund (Welfare Funds (Scotland) Act 2015)',
    ),
    scotland('CARERS_SUPPORT_PAYMENT', 'Carer’s Support Payment'),
    scotland(
      'PENSION_AGE_DISABILITY_PAYMENT',
      'Pension Age Disability Payment',
    ),
    scotland(
      'PENSION_AGE_WINTER_HEATING_PAYMENT',
      'Pension Age Winter Heating Payment',
    ),
    scotland(
      'SCOTTISH_ADULT_DISABILITY_LIVING_ALLOWANCE',
      'Scottish Adult Disability Living Allowance',
    ),
  ],
  notPublicFunds: [
    contributory(
      'NEW_STYLE_JOBSEEKERS_ALLOWANCE',
      'New-Style Jobseeker’s Allowance',
    ),
    contributory(
      'GUARDIANS_ALLOWANCE',
      'Guardian’s Allowance (if in receipt of Child Benefit)',
    ),
    contributory(
      'NEW_STYLE_EMPLOYMENT_AND_SUPPORT_ALLOWANCE',
      'New Style Employment and Support Allowance',
    ),
    contributory('MATERNITY_ALLOWANCE', 'Maternity Allowance'),
    contributory('STATE_PENSION', 'State Pension'),
    contributory('STATUTORY_SICK_PAY', 'Statutory Sick Pay'),
    contributory('BEREAVEMENT_SUPPORT_PAYMENT', 'Bereavement Support Payment'),
    contributory(
      'INDUSTRIAL_INJURIES_DISABLEMENT_BENEFIT',
      'Industrial Injuries Disablement Benefit',
    ),
    contributory('STATUTORY_MATERNITY_PAY', 'Statutory Maternity Pay'),
    contributory('STATUTORY_PATERNITY_PAY', 'Statutory Paternity Pay'),
    contributory('STATUTORY_ADOPTION_PAY', 'Statutory Adoption Pay'),
    contributory(
      'STATUTORY_SHARED_PARENTAL_PAY',
      'Statutory Shared Parental Pay',
    ),
    contributory(
      'STATUTORY_PARENTAL_BEREAVEMENT_PAY',
      'Statutory Parental Bereavement Pay',
    ),
  ],
};
