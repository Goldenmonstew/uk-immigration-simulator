import type { zhCN } from './zh-CN';

export const en: Partial<Record<keyof typeof zhCN, string>> = {
  'site.name': 'UK Immigration Path Simulator',
  'site.englishName': 'My Immigration Path',
  'site.skip': 'Skip to main content',
  'site.home': 'Home',
  'site.footer':
    'General policy information and hypothetical scenario modelling',
  'home.title': 'Explore potentially relevant immigration pathways',
  'home.intro':
    'Use your timeline to explore potentially relevant pathways, key conditions and unresolved details.',
  'home.scope':
    'This version focuses on current Skilled Worker settlement and the announced Earned Settlement reforms. Other routes may need further review.',
  'home.start': 'Start simulation',
  'home.before': 'Before you start',
  'home.prepare':
    'Have your visa dates, absences and earnings by tax year ready. Leave uncertain information blank.',
  'home.privacy':
    'No account or document uploads. Inputs are processed in your browser and drafts are saved on this device. Other people using a shared device may see your draft.',
  'home.disclaimerTitle': 'About this simulator',
  'home.disclaimer':
    'Based on the information you entered, these rules may be relevant. This simulator provides general policy information and hypothetical scenario modelling. It does not determine your legal immigration status or guarantee the outcome of an application.',
  'policy.asOf': 'Policy checked as of',
  'policy.LAW': 'Current law',
  'policy.ANNOUNCED': 'Announced reforms',
  'policy.CURRENT_LAW': 'Current law',
  'policy.ANNOUNCED_NOT_IN_FORCE': 'Announced, not in force',
  'policy.IN_FORCE_FUTURE_VERSION': 'Future version',
  'policy.hypothesis':
    'The reforms column assumes that the rule set applies on the simulation date. Announced rules are not yet in force.',
  'result.title': 'Your pathway simulation',
  'result.intro':
    'Read the potentially relevant rules and information gaps together with their sources and assumptions.',
  'result.loading': 'Reading the scenario on this device…',
  'result.empty':
    'There is no simulation result yet. Please complete the questionnaire.',
  'result.edit': 'Edit inputs',
  'result.mock':
    'Development preview: fictional examples, not an assessment of your inputs.',
  'result.shortCircuit': 'This scenario needs regulated advice',
  'result.advice': 'Seek regulated advice',
  'result.adviceText':
    'These circumstances depend on legal and evidential details that this simulator does not assess. Consider an IAA-registered immigration adviser or another appropriately qualified legal professional.',
  'result.adviceLink': 'About the Immigration Advice Authority (IAA)',
  'result.pathway': 'Pathway duration',
  'result.routeGroup': 'Route group',
  'result.years': 'years',
  'result.earliest': 'Earliest possible date',
  'result.undetermined': 'Not yet determined',
  'result.why': 'Why',
  'result.FAIL': 'Not met',
  'result.UNKNOWN': 'Unknown / unresolved',
  'result.PASS': 'Met',
  'result.noRules':
    'There are no rule details to display yet. This does not mean the conditions are met.',
  'result.noGroupRules': 'No rules in this group.',
  'result.assumptions': 'Assumptions',
  'result.assumptionCount': 'items',
  'result.noAssumptions': 'The engine has not provided additional assumptions.',
  'result.missingAssessment': 'No assessment is available for this rule set.',
  'result.sources': 'Sources',
  'result.pendingDetails': 'Details pending government decision',
  'whatif.title': 'Scenario lab · What-if',
  'whatif.intro':
    'Adjust inputs to compare rules, durations and dates instantly. Changes apply only to this page and do not update your questionnaire draft. Refreshing returns to the baseline.',
  'whatif.empty':
    'There is no completed questionnaire draft yet. Complete the questionnaire before comparing scenarios.',
  'whatif.unsupported':
    'The scenario lab is not available for this scenario requiring professional review. Return to the results for details.',
  'whatif.controls': 'Adjust the scenario',
  'whatif.date': 'Simulation date',
  'whatif.income': 'Personal annual earnings',
  'whatif.enableIncome': 'Enable earnings override',
  'whatif.incomeHint':
    'Set personal annual earnings to X for the most recent N completed tax years. When disabled, draft earnings are retained. Preset buttons enable the override.',
  'whatif.incomeYears': 'Most recent N tax years',
  'whatif.earnings': 'Annual earnings X (GBP)',
  'whatif.incomeSlider': 'Adjust annual earnings with the slider',
  'whatif.noPublicFunds': 'Assume no public funds received before applying',
  'whatif.noAbsences': 'Assume no absences',
  'whatif.reset': 'Reset',
  'whatif.back': 'Back to results',
  'whatif.before': 'Before',
  'whatif.after': 'After',
  'whatif.outcome': 'Outcome',
  'whatif.becameMet': 'Changed to met',
  'whatif.becameUnmet': 'Changed to not met / unknown',
  'whatif.stillUnmet': 'Still not met',
  'whatif.unchanged': 'Same as the current scenario',
  'form.unknown': 'Not provided / unsure',
  'form.fixErrors': 'Please check the highlighted fields.',
  'english.level': 'English CEFR level or exemption',
  'english.life': 'Life in the UK',
  'english.exempt': 'Exempt',
  'english.passed': 'Passed',
  'date.incomeWindow': 'Current income years',
  'error.date': 'Enter a valid date.',
  'error.dob':
    'Date of birth cannot be later than today or the simulation date.',
  'error.number': 'Enter a valid amount of 0 or more.',
  'outcome.LIKELY_ELIGIBLE': 'Likely eligible',
  'outcome.LIKELY_ELIGIBLE.description':
    'All assessed rules in this rule set are met. This does not guarantee an application outcome.',
  'outcome.LIKELY_NOT_ELIGIBLE': 'Likely not eligible',
  'outcome.LIKELY_NOT_ELIGIBLE.description':
    'A rule is not met and providing missing information would not change this assessment.',
  'outcome.POTENTIALLY_ELIGIBLE':
    'Potentially eligible, pending policy details',
  'outcome.POTENTIALLY_ELIGIBLE.description':
    'No rules fail, but some depend on details the government has not yet determined.',
  'outcome.INSUFFICIENT_INFORMATION': 'Insufficient information',
  'outcome.INSUFFICIENT_INFORMATION.description':
    'The inputs are insufficient for an assessment. Review the information gaps in the rule details.',
  'outcome.POLICY_NOT_YET_IN_FORCE': 'Pending commencement arrangements',
  'outcome.POLICY_NOT_YET_IN_FORCE.description':
    'The assessment depends on when and how rules that are not yet in force take effect.',
  'outcome.REQUIRES_REGULATED_REVIEW': 'Requires regulated review',
  'outcome.REQUIRES_REGULATED_REVIEW.description':
    'A regulated professional needs to review this scenario and its evidence.',
  'screening.hint':
    'Answer yes or no; no event details are needed. A yes to any of the first three questions (criminal records, immigration breaches, or asylum or human-rights history) takes you directly to regulated advice. A yes to government debt continues the questionnaire for assessment by the rules engine.',
  'benefits.publicFunds': 'Public funds',
  'benefits.notPublicFunds': 'Not public funds',
};
