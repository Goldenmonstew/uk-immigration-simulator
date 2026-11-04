import type { Fixture } from '../../engine/src/types';
import { clFamilyPartnerFiveYears } from './cl-family-partner-five-years';
import { clGlobalTalentThreeYears } from './cl-global-talent-three-years';
import { clHkbnoFiveYears } from './cl-hkbno-five-years';
import { clRefugeeFiveYears } from './cl-refugee-five-years';
import { esIndividualC } from './es-individual-c-combined-income';
import { esIndividualD } from './es-individual-d-public-funds';
import { esP16MaternityBestYears } from './es-p16-maternity-best-years';
import { esP19IndividualAPublicService } from './es-p19-individual-a-public-service';
import { esP19IndividualBBritishConnection } from './es-p19-individual-b-british-connection';
import { esP31IndividualAPartnerArrivesTogether } from './es-p31-individual-a-partner-arrives-together';
import { esP31IndividualBPartnerArrivesLater } from './es-p31-individual-b-partner-arrives-later';
import { esP31IndividualBPartnerJoinsLater } from './es-p31-individual-b-partner-joins-later';
import { esP31IndividualCChildDependant } from './es-p31-individual-c-child-dependant';
import { esP31IndividualDYoungAdultDependant } from './es-p31-individual-d-young-adult-dependant';
import { esP31IndividualEDependantAt25 } from './es-p31-individual-e-dependant-at-25';
import { esP40IndividualAUrsResettlement } from './es-p40-individual-a-urs-resettlement';
import { esP40IndividualBCoreProtectionToWork } from './es-p40-individual-b-core-protection-to-work';
import { esP40IndividualCIllegalEntryToWork } from './es-p40-individual-c-illegal-entry-to-work';
import { esP40IndividualDIllegalEntryCoreProtection } from './es-p40-individual-d-illegal-entry-core-protection';
import { esP45IndividualACareWorkerEligible } from './es-p45-individual-a-care-worker-eligible';
import { esP45IndividualBCareWorkerIneligible } from './es-p45-individual-b-care-worker-ineligible';
import { esP45IndividualCCareWorkerAfterCutoff } from './es-p45-individual-c-care-worker-after-cutoff';

export const fixtures: Fixture[] = [
  esIndividualC,
  esIndividualD,
  esP16MaternityBestYears,
  esP19IndividualAPublicService,
  esP19IndividualBBritishConnection,
  esP31IndividualAPartnerArrivesTogether,
  esP31IndividualBPartnerArrivesLater,
  esP31IndividualBPartnerJoinsLater,
  esP31IndividualCChildDependant,
  esP31IndividualDYoungAdultDependant,
  esP31IndividualEDependantAt25,
  esP40IndividualAUrsResettlement,
  esP40IndividualBCoreProtectionToWork,
  esP40IndividualCIllegalEntryToWork,
  esP40IndividualDIllegalEntryCoreProtection,
  esP45IndividualACareWorkerEligible,
  esP45IndividualBCareWorkerIneligible,
  esP45IndividualCCareWorkerAfterCutoff,
  clHkbnoFiveYears,
  clGlobalTalentThreeYears,
  clFamilyPartnerFiveYears,
  clRefugeeFiveYears,
];
