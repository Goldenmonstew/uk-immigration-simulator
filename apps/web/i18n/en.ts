import type { zhCN } from './zh-CN';

export const en: Record<keyof typeof zhCN, string> = {
  'site.about': 'About',
  'site.feedback': 'Feedback',
  'about.title': 'How this simulator works',
  'about.intro':
    'This is a reference and learning tool that models settlement pathways using published policy. Adjust scenarios and compare outcomes to explore how rules affect a timeline, with a light element of play.',
  'about.limits':
    'It does not determine your legal immigration status, guarantee an application outcome or replace regulated immigration advice. For advice on a real application, consult a suitably qualified professional who can consider your evidence and the applicable rules.',
  'about.link': 'Read about the method, scope and privacy',
  'about.columnsTitle': 'Understanding the two result columns',
  'about.currentLaw':
    'The current law column uses the current version of the Immigration Rules registered in this project to assess potentially relevant settlement conditions on the simulation date.',
  'about.currentLawScope':
    'The current law column models Skilled Worker (including dependants), main applicants on Hong Kong BN(O), Global Talent and Appendix FM partner routes (5-year and 10-year), and Long Residence. The separate settlement requirements of other routes, and dependants on the Hong Kong BN(O), Global Talent and Appendix FM routes, still show insufficient information. This does not mean that those routes have no settlement pathway.',
  'about.reforms':
    'The announced reforms column uses Earned Settlement policy and is labelled “Announced, not in force”. It assumes that the rule set applies on the simulation date. This does not mean the reforms have taken effect or will necessarily take this form.',
  'about.reformScope':
    'The reforms column covers core permission, high talent, British connection, family and private life, and protection routes, including family and transitional provisions. Routes that do not count towards settlement, such as Visit and Student, are subject to the corresponding restrictions. Routes outside the framework, such as Hong Kong BN(O), and protection route dependants are referred for professional review.',
  'about.informationGaps':
    'Unclassified routes (such as Other) or missing required inputs may still produce insufficient information. Unresolved policy may also leave a rule UNKNOWN. Read the outcome, rule details and assumptions together; unknown does not mean met or not met.',
  'about.sourcesTitle': 'Sources and policy check date',
  'about.sources':
    'Policy figures, rules and source references come from government documents and Immigration Rules registered in this project. The check date describes the material used by this model; it is not a live feed from government websites.',
  'about.policyLink': 'View rule sets, parameters and official sources',
  'about.pendingTitle': 'What pending details (PD-xxx) mean',
  'about.pending':
    'PD-xxx is a project reference for policy details that the government has not yet clarified, not a government document number. These markers identify assessments that depend on unresolved details. The rules list on the policy page includes the relevant references and official sources; gaps must not be filled with guesses.',
  'about.pendingLink': 'View pending details and sources in the rules list',
  'about.privacyTitle': 'How your inputs are stored',
  'about.localPrivacy':
    'Inputs are processed in your browser. Questionnaire drafts and saved scenarios are stored only in this browser’s localStorage and are not uploaded to this site’s server. Other people using a shared device may see them.',
  'about.sharePrivacy':
    'A share link contains all the inputs you entered, including principal applicant information. Anyone with the link can read and load those inputs, so share it only with people you trust.',
  'about.analyticsPrivacy':
    'The site uses only Cloudflare Web Analytics for visitor statistics, without cookies. Questionnaire inputs and simulation results are not sent.',
  'about.feedbackTitle': 'Feedback',
  'about.feedbackIntro':
    'If you find a policy interpretation error, a figure that does not match its source or a page problem, please report it in a GitHub issue.',
  'about.feedbackLink': 'Give feedback on GitHub',
  'about.feedbackPrivacy':
    'GitHub issues are public. Do not post share links, personal information or document details.',
  'result.print': 'Print or save as PDF',
  'scenarios.title': 'Saved scenarios on this device',
  'scenarios.privacy':
    'Scenarios stay in this browser and are not uploaded. Other people using this device may see them. Summaries are recalculated using the current policy.',
  'scenarios.defaultName': 'Scenario',
  'scenarios.name': 'Scenario name',
  'scenarios.save': 'Save this scenario',
  'scenarios.saved': 'Scenario saved on this device.',
  'scenarios.empty': 'No saved scenarios yet.',
  'scenarios.load': 'Load',
  'scenarios.delete': 'Delete',
  'scenarios.confirmDelete': 'Delete scenario “{name}”?',
  'scenarios.unavailable':
    'Unable to read or save scenarios. Check that browser storage is available.',
  'step.principal': 'Principal applicant',
  'principal.banner': 'Entering details for: principal applicant',
  'principal.sharedDate': 'Shared simulation date:',
  'principal.hint':
    'A dependant settles with the principal applicant, so their timeline is needed.',
  'principal.start': 'Enter the principal applicant’s timeline',
  'principal.edit': 'Edit the principal applicant’s timeline',
  'principal.return': 'Return to the applicant questionnaire',
  'principal.finish': 'Finish and return to the applicant questionnaire',
  'principal.saved':
    'The principal applicant’s timeline is complete. Continue with the applicant questionnaire.',
  'principal.incomplete':
    'Complete the principal applicant’s timeline to continue.',
  'principal.required': 'Complete the principal applicant’s timeline first.',
  'principal.prefix': 'Principal applicant: ',
  'principal.settled': 'Has the principal applicant already settled?',
  'principal.settledDate': 'Date settlement was granted',
  'principal.settledRoute': 'Visa route held when settlement was granted',
  'episodes.immigrationSalaryList':
    'Is the sponsored job on the Immigration Salary List?',
  'episodes.immigrationSalaryListHint':
    'If unsure, the job is treated as not being on the list.',
  'episodes.dependantOf': 'Dependant relationship',
  'episodes.partnerDependant': 'Partner dependant (principal is your partner)',
  'episodes.childDependant': 'Child dependant (principal is your parent)',
  'result.principal': 'Principal applicant’s assessment',
  'site.navigation': 'Main navigation',
  'site.policy': 'Policy',
  'site.chinese': 'Chinese',
  'policyPage.title': 'Policy basis',
  'policyPage.notDisplayed': 'Not shown on the results page',
  'policyPage.ruleSets': 'Rule sets',
  'policyPage.parameters': 'Parameters',
  'policyPage.name': 'Name',
  'policyPage.value': 'Value',
  'policyPage.rules': 'Rules',
  'policyPage.changelog': 'Policy changelog',
  'policyPage.sources': 'Source register',
  'policyPage.bestYears': '{required} of {window} years',
  'policyPage.applicationsFrom': 'for applications from',
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
    'Compare current settlement pathways with the announced Earned Settlement reforms. The current law column models Skilled Worker (including dependants), main applicants on Hong Kong BN(O), Global Talent and Appendix FM partner routes (5-year and 10-year), and Long Residence. The separate settlement requirements of other routes, and dependants on the Hong Kong BN(O), Global Talent and Appendix FM routes, still show insufficient information.',
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
  'policy.IN_FORCE_FUTURE_VERSION.effectiveFrom': 'Laid, in force from {date}',
  'policy.IN_FORCE_FUTURE_VERSION': 'Future version',
  'policy.hypothesis':
    'The reforms column assumes that the rule set applies on the simulation date. Announced rules are not yet in force.',
  'result.title': 'Your pathway simulation',
  'gap.title': 'What is missing',
  'gap.met': 'All modelled requirements are met.',
  'gap.earliest': 'Based on the current situation, the earliest date is {date}',
  'gap.wait':
    ', approximately {years} years and {months} months after the simulation date (rounded up to the next month).',
  'gap.pending': 'Pending government clarification',
  'gap.input': 'Provide missing information',
  'gap.more': 'More',
  'gap.less': 'Show less',
  'gap.try': 'Try in What-if',
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
  'share.copy': 'Copy share link',
  'share.privacy':
    'This link contains all the information you entered. Share it only with people you trust.',
  'share.copied': 'Share link copied.',
  'share.manual': 'Copying was not available. Copy the link below manually.',
  'share.loaded': 'Shared scenario loaded. You can edit the inputs.',
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
    'Only a yes to criminal records stops the questionnaire and directs you to regulated advice. Enter immigration breach records for the rules engine to assess alongside your route. Government debt is also assessed by the engine.',
  'benefits.publicFunds': 'Public funds',
  'benefits.notPublicFunds': 'Not public funds',
  'site.language': 'Language',
  'home.disclaimerEnglish':
    'Based on the information you entered, these rules may be relevant. This simulator provides general policy information and hypothetical scenario modelling. It does not determine your legal immigration status or guarantee the outcome of an application.',
  'form.title': 'Enter your timeline',
  'form.step': 'Step',
  'form.of': 'of',
  'form.saved':
    'Your draft is saved on this device. Your inputs are not uploaded.',
  'form.storageUnavailable':
    'Storage is unavailable. Your inputs are kept while you navigate, but may be lost if you refresh or close the page.',
  'form.continue': 'Continue',
  'form.back': 'Back',
  'form.results': 'View results',
  'form.remove': 'Remove',
  'form.optional': 'Optional',
  'form.yes': 'Yes',
  'form.no': 'No',
  'form.choose': 'Select an option',
  'step.basic': 'About you',
  'step.screening': 'Check if you need professional advice',
  'step.episodes': 'Visa history',
  'step.absences': 'Time outside the UK',
  'step.income': 'Earnings by tax year',
  'step.benefits': 'Benefits and statutory payments',
  'step.relationships': 'Family relationships',
  'step.english': 'English and Life in the UK',
  'step.date': 'Simulation date',
  'country.CHN': 'China',
  'country.HKG': 'Hong Kong',
  'country.IND': 'India',
  'country.PAK': 'Pakistan',
  'country.NGA': 'Nigeria',
  'country.USA': 'United States',
  'country.GBR': 'United Kingdom',
  'country.CAN': 'Canada',
  'country.AUS': 'Australia',
  'country.SGP': 'Singapore',
  'basic.dob': 'Date of birth',
  'basic.nationality': 'Nationality',
  'basic.nationalityHint':
    'Enter a three-letter country code (ISO 3166-1 alpha-3), for example CHN.',
  'screening.criminality':
    'Do you have a criminal record in the UK or overseas?',
  'screening.breach': 'Have you breached immigration rules?',
  'screening.breachHint':
    'This includes overstaying, breaching visa conditions, deception, obstructing immigration control or illegal entry. Illegal entry as an adult on a non-protection route still leads to regulated review by the engine.',
  'screening.debt': 'Do you have any outstanding government debt?',
  'screening.message':
    'You have reported a criminal record, which needs regulated professional assessment. This simulator stops the automated assessment here and does not collect further information.',
  'breaches.title': 'Immigration breach records',
  'breaches.item': 'Breach record',
  'breaches.add': 'Add a breach record',
  'breaches.type': 'Breach type',
  'breaches.date': 'Date of the breach (required)',
  'breaches.article31':
    'Do you consider yourself protected by Refugee Convention Article 31?',
  'breaches.required':
    'Add at least one breach record, or answer no to immigration breaches.',
  'episodes.resettlementScheme': 'Resettlement or sponsorship route',
  'episodes.sustainedActivity': 'Sustained activity on this route',
  'episodes.globalTalentEndorsement':
    'Endorsement or prize for your first Global Talent permission',
  'episodes.globalTalentEndorsementHint':
    'If your endorsing body is not listed below, leave this as “Not provided / unsure”.',
  'episodes.endorsement.RESEARCH_BODY':
    'Research body endorsement (Royal Society, British Academy, Royal Academy of Engineering or UKRI)',
  'episodes.endorsement.ARTS_COUNCIL_ENGLAND':
    'Arts Council England endorsement',
  'episodes.endorsement.TECH_NATION': 'Tech Nation endorsement',
  'episodes.endorsement.PRIZE': 'A prize listed in Prestigious Prizes',
  'episodes.globalTalentCriteria': 'Endorsement criteria',
  'episodes.criteria.EXCEPTIONAL_TALENT': 'exceptional talent',
  'episodes.criteria.EXCEPTIONAL_PROMISE': 'exceptional promise',
  'episodes.familyPermission': 'Appendix FM permission type',
  'episodes.familyPermission.PARTNER_FIVE_YEAR': 'Partner, 5-year route',
  'episodes.familyPermission.PARTNER_TEN_YEAR': 'Partner, 10-year route',
  'episodes.familyPermission.PARENT': 'Parent of a child',
  'episodes.familyPermissionHint':
    'Enter your partner’s status in the Family relationships step, and your own and your partner’s income for the last completed tax year in the Earnings by tax year step (for the 5-year route’s financial requirement).',
  'benefits.asylumSupportRepayment':
    'Do you need to repay asylum support costs?',
  'result.protectionNotice':
    'Protection route conclusions reflect only the published policy framework. Article 31 safeguards, whether time before the routes launch will count, and repayment and public funds details have not yet been published. Read these conclusions alongside the pending details.',
  'episodes.hint':
    'Enter the validity dates for each visa granted to you. Leave the list empty if you have no visa history.',
  'episodes.item': 'Visa period',
  'episodes.add': 'Add a visa period',
  'episodes.empty': 'No visa periods added.',
  'episodes.route': 'Visa route',
  'episodes.from': 'Valid from',
  'episodes.to': 'Valid to',
  'episodes.role': 'Applicant role',
  'episodes.MAIN': 'Main applicant',
  'episodes.DEPENDANT': 'Dependant',
  'episodes.soc': 'SOC 2020 occupation code (optional)',
  'episodes.salary': 'Sponsored annual salary (GBP, optional)',
  'absences.hint':
    'Enter the dates you left and returned to the UK. Continue if you have no absences. You can remove existing entries.',
  'absences.item': 'Absence',
  'absences.add': 'Add an absence',
  'absences.empty': 'No absences added.',
  'absences.from': 'Date you left the UK',
  'absences.to': 'Date you returned',
  'income.hint':
    'Enter earnings for the 7 completed UK tax years before the simulation date. Leave unknown amounts blank. Enter 0 for no earnings. All amounts are in GBP.',
  'income.taxYearHint':
    'The UK tax year runs from 6 April to 5 April the following year. Changing the simulation date in the final step updates these years.',
  'income.earnings': 'Personal annual earnings',
  'income.partner': 'Partner annual earnings (optional)',
  'income.partnerHint':
    'Leave partner earnings blank if you are not relying on them.',
  'benefits.hint':
    'Enter benefits or statutory payments you have received. The rules engine determines whether they count as public funds and their effect. Leave the end date blank if payments are ongoing.',
  'benefits.item': 'Payment record',
  'benefits.add': 'Add a payment record',
  'benefits.empty': 'No payment records added.',
  'benefits.type': 'Benefit or payment name',
  'benefits.from': 'Start date',
  'benefits.to': 'End date (optional)',
  'relationships.hint':
    'Add a partner, parent or child relevant to this scenario. Names and identity documents are not needed.',
  'relationships.item': 'Family relationship',
  'relationships.add': 'Add a family relationship',
  'relationships.empty': 'No family relationships added.',
  'relationships.type': 'Relationship to you',
  'relationships.PARTNER': 'Partner',
  'relationships.PARENT': 'Parent',
  'relationships.CHILD': 'Child',
  'relationships.status': 'Their status',
  'relationships.BRITISH_CITIZEN': 'British citizen',
  'relationships.SETTLED': 'Settled',
  'relationships.OTHER': 'Other',
  'english.hint':
    'Select “Not provided / unsure” if you are unsure whether an exemption applies.',
  'date.label': 'Which date would you like to simulate?',
  'date.hint':
    'The default is today. You can choose another date. Changing it updates the income years. Check them before viewing your results.',
  'date.reviewIncome': 'Go back to check earnings',
  'error.required': 'Complete this field.',
  'error.nationality': 'Enter a three-letter country code.',
  'error.range': 'The end date must not be before the start date.',
  'error.soc': 'Enter a four-digit SOC 2020 occupation code, or leave blank.',
};
