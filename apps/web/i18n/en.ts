import type { zhCN } from './zh-CN';

export const en: Record<keyof typeof zhCN, string> = {
  'game.actionUnavailable':
    'This cannot be done now. Check the time, place and what you have.',
  'game.abroad': 'Away from town',
  'game.abroadText':
    'The days pass while you are abroad. Read any messages before continuing your journey.',
  'game.continueJourney': 'Continue the journey',
  'game.returned': 'Welcome home',
  'game.returnedText':
    'Your journey has been added to your timeline. The town is waiting for you.',
  'game.promotion': 'Promotion!',
  'game.title': 'Immigration Life',
  'game.returnSimulator': '← Simulator',
  'game.places': 'Places',
  'game.fastShort': 'Fast fwd',
  'game.endDayShort': 'End day',
  'game.tapToReveal': 'Tap the dialogue to reveal the full line',
  'game.entry': 'Play a round · Immigration Life',
  'game.entryDesc':
    'Work, meet neighbours and see how everyday choices shape your immigration timeline in a pixel-art town.',
  'game.disclaimer':
    'Fictional characters and events for learning. This is not immigration advice.',
  'game.intro':
    'Make a home in a small town. Work, learn, meet people, and make the seasons your own.',
  'game.chooseCharacter': 'Who is moving to town?',
  'game.startAs': 'Start with {name}',
  'game.continue': 'Continue last game',
  'game.newGame': 'Start over',
  'game.date': 'Game date',
  'game.results': 'One life, two sets of rules',
  'game.ending': 'Your story in town',
  'game.lifeMemories': 'Little things that stayed with you',
  'game.memoryFriends': 'People you remember',
  'game.memoryHome': 'A home made your own',
  'game.memoryLunch': 'A photograph on the green',
  'game.memoryLunchText':
    'You joined your neighbours at the long table and took a photograph together.',
  'game.memoryGarden': 'Things you planted',
  'game.memoryDishes': 'Dishes you made',
  'game.memoryFlowerbed': 'The community flowerbed sign',
  'game.memoryFlowerbedText':
    'The flowerbed you tended with your neighbours now has its own little sign.',
  'game.collection': 'Collection',
  'game.collectionFish': 'Fish you caught',
  'game.collectionDishes': 'Dishes you made',
  'game.collectionHint':
    'Things you caught or cooked stay here, even after you eat or give them away.',
  'game.collectionFirst': 'First: Year {year} · {season}',
  'game.collectionMemory.pond':
    'You caught it at the park pond on a {weather} day.',
  'game.collectionMemory.home': 'You made it at home on a {weather} day.',
  'game.collectionWeather.sunny': 'sunny',
  'game.collectionWeather.cloudy': 'cloudy',
  'game.collectionWeather.rain': 'rainy',
  'game.collectionWeather.snow': 'snowy',
  'game.collectionUnknown': 'Not yet recorded',
  'game.collectionHarvests':
    'Harvest records: {count} harvest{count:s} across {kinds} crop{kinds:s}.',
  'game.lunchScene': 'Neighbourhood lunch · 12:00–16:00',
  'game.lunchTables': 'The tables and chairs you borrowed',
  'game.lunchFood': 'The food you brought is on the table',
  'game.openTimeline': 'Open this timeline in the simulator',
  'game.replay': 'Play again',
  'game.changeCharacter': 'Change character',
  'game.saved': 'Saved in this browser. Come back whenever you like.',
  'game.storageUnavailable':
    'Local storage is unavailable. You can keep playing, but progress may be lost when you refresh or close the page.',
  'game.yearQuarter': 'Year {year} · Quarter {quarter}',
  'game.actionsLeft': '{count} action points',
  'game.visaShort': '{count}m',
  'game.visa': 'Permission: {count} month{count:s} left',
  'game.renewedThisSeason': 'You renewed this season.',
  'game.renewedThrough':
    'You renewed this season. The expiry date on that renewal was {date}.',
  'game.visaUrgent': 'Permission expiry approaching',
  'game.money': 'Savings',
  'game.mood': 'Mood',
  'game.health': 'Health',
  'game.english': 'English',
  'game.career': 'Career',
  'game.season1': 'Winter',
  'game.season2': 'Spring',
  'game.season3': 'Summer',
  'game.season4': 'Autumn',
  'game.town': 'Town map',
  'game.controls':
    'Arrow keys / WASD to walk · Tap to walk · E / Space to interact',
  'game.touchControls': 'Tap the map to walk · Tap the prompt to interact',
  'game.nextHeart': 'Next heart: {count} / 100',
  'game.fullHearts': 'All hearts full',
  'game.destinations': 'Where to?',
  'game.endQuarter': 'End this quarter',
  'game.close': '✕ Close',
  'game.continuePlaying': 'Continue',
  'game.actionCost': '{count} action points',
  'game.noActions': 'No actions are available right now.',
  'game.effects': 'Expected changes',
  'game.timelineEffect': 'Updates the timeline',
  'game.endingConfirm':
    'This will end this game. Ready to bring this story to a close?',
  'game.endingEffect': 'Ends this story',
  'game.reformSettlement': 'Simulate submission under the reform assumptions',
  'game.reformSettlementConfirm':
    'Simulate submitting your settlement application under the reform assumptions and end this game?',
  'game.settlementAssessmentAtSubmission':
    'These settlement assessments use the details from when you submitted in the game.',
  'game.timelineChanged':
    'The timeline and both assessments have been updated.',
  'game.changes': 'What changed',
  'game.noChanges': 'No stat changes.',
  'game.event': 'News around town',
  'game.quarterSummary': 'This quarter in review',
  'game.quarterChanges':
    'Stat changes from actions, events and the end-of-quarter update',
  'game.wellbeingAtSettlement':
    'What made the biggest difference at the season’s end',
  'game.settlementSource.seasonWear': 'The season’s wear and tear',
  'game.settlementSource.overtimeWear': 'Extra wear from overtime',
  'game.settlementSource.brighterHome': 'A brighter home',
  'game.settlementSource.walkingClub': 'Hiking coaching',
  'game.settlementSource.furnishings': 'Home furnishings',
  'game.cropsCleared':
    'The season changed, and crops left in the ground were cleared from {count} of your plots.',
  'game.eventReview': 'What happened this quarter',
  'game.noEvents': 'A quiet quarter has its charms.',
  'game.progressChanges': 'Before → after the start of your new game year',
  'game.nextQuarter': 'Welcome the next season',
  'game.seeEnding': 'Read your story',
  'game.achievements': 'Keepsakes along the way',
  'game.noAchievements': 'The journey is a keepsake of its own.',
  'game.currentLaw': 'Current law',
  'game.reform': 'Announced reforms',
  'game.councilDetails': 'Visit the town hall for details',
  'game.progressHint':
    'Progress tracks time accumulated. Read the outcome and rules to understand eligibility.',
  'game.loading': 'Loading the town…',
  'game.netIncome': 'Net quarterly income after bills',
  'game.yearSummary': 'Year-end review',
  'game.earned': 'Earned',
  'game.unearned': 'Still to discover',
  'game.fee': 'Fee',
  'game.travelRecall':
    'Depart today; travel skips the remaining days of this season.',
  'game.visaReminderTitle': 'A new quarter: check your permission dates',
  'game.visaReminder':
    'Your current permission has {count} month{count:s} left, and no further permission is recorded from the date it expires. Visit the visa centre to see available actions and fees.',
  'game.fastVisaWarning':
    'Your permission runs continuously until {date}, with no further permission after that. Fast-forwarding runs past that date to the end of the quarter, so visit the visa centre first.',
  'game.fastVisaWarningNone':
    'No current permission is recorded. Fast-forwarding runs to the end of the quarter, so visit the visa centre first.',
  'game.missingRules': 'Still needed: {rules}',
  'game.visaVisit': 'Visit the visa centre',
  'game.musicOn': 'Music: on',
  'game.musicOff': 'Music: off',
  'game.musicUnavailable': 'Music could not be played.',
  'game.location.home': 'Home',
  'game.location.work': 'Work',
  'game.location.college': 'College',
  'game.location.gp': 'GP clinic',
  'game.location.pub': 'Pub & park',
  'game.location.council': 'Town hall',
  'game.location.visa': 'Visa centre',
  'game.location.station': 'Station',
  'site.about': 'About',
  'site.version': 'Version {version}',
  'error.title': 'Something went wrong on this page',
  'error.body':
    'The page hit an unexpected error. Drafts and game progress saved in this browser should still be available; unsaved changes may be lost on reload. Try again first; if it keeps happening, please report the error below.',
  'error.retry': 'Try again',
  'error.home': 'Back to the home page',
  'error.report': 'Report this on GitHub',
  'error.privacy':
    'The report is pre-filled with the page address, version and error message, not your inputs; you can review it before submitting.',
  'result.reportRule': 'Is this wrong?',
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
    'The current law column models main applicants on Skilled Worker, Hong Kong BN(O), Global Talent, Appendix FM partner routes (5-year and 10-year), refugee routes (Appendix Settlement Protection), UK Ancestry, Innovator Founder and Private Life. It also assesses Long Residence. Dependant coverage includes Skilled Worker, Hong Kong BN(O) (partners, children and adult dependant relatives), Global Talent (partners and children), children of Appendix FM partners on the 10-year route, and children of Appendix FM partners on the 5-year route (paragraph 298 of Part 8 of the Immigration Rules). The separate settlement requirements of other routes and their dependants still show insufficient information. This does not mean that those routes have no settlement pathway.',
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
    'The site uses only Cloudflare Web Analytics for visitor statistics, without cookies. Questionnaire inputs and simulation results are not sent. When a page fails, its path, the error type and code location, the version and the browser type are sent to an error log for this site on Cloudflare, kept for a few days and never including the error text or your inputs.',
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
    'To assess your settlement as a dependant, enter the principal applicant’s timeline and any details of settlement already granted.',
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
  'screening.settledWorkerPartner':
    'The principal applicant’s screening requires regulated review. Current Skilled Worker partner settlement is assessed on the partner’s own circumstances (SW 38.1 and 39.1(b)).',
  'principal.settled': 'Has the principal applicant already settled?',
  'principal.settledDate': 'Date settlement was granted',
  'principal.settledRoute':
    'Immigration route held when settlement was granted',
  'episodes.immigrationSalaryList':
    'Was the job on the Immigration Salary List for this grant?',
  'episodes.immigrationSalaryListHint':
    'The Immigration Salary List is a government list of occupations; jobs on it can use a lower salary threshold. Check your SOC code against the version in force when this CoS was issued, including any regional or job conditions in the entry. Leave it blank if unsure: the simulator infers what it can from the SOC code and the list entry and marks the rest as to be confirmed.',
  'episodes.immigrationSalaryListLink':
    'See Appendix Immigration Salary List (GOV.UK)',
  'episodes.dependantOf': 'Dependant relationship',
  'episodes.partnerDependant': 'Partner dependant (principal is your partner)',
  'episodes.childDependant': 'Child dependant (principal is your parent)',
  'episodes.relativeDependant':
    'Adult dependant relative (the principal applicant is my child, grandchild, sibling or parent; HK 59.1)',
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
  'site.chineseShort': 'ZH',
  'site.shortName': 'UK paths',
  'site.name': 'UK Immigration Path Simulator',
  'site.skip': 'Skip to main content',
  'site.home': 'Home',
  'site.footer':
    'General policy information and hypothetical scenario modelling',
  'home.title': 'Explore potentially relevant immigration pathways',
  'home.intro':
    'Use your timeline to explore potentially relevant pathways, key conditions and unresolved details.',
  'home.scopeTitle': 'Modelled scope',
  'home.scope':
    'Compare current settlement pathways with the announced Earned Settlement reforms. The current law column models main applicants on Skilled Worker, Hong Kong BN(O), Global Talent, Appendix FM partner routes (5-year and 10-year), refugee routes (Appendix Settlement Protection), UK Ancestry, Innovator Founder and Private Life. It also assesses Long Residence. Dependant coverage includes Skilled Worker, Hong Kong BN(O) (partners, children and adult dependant relatives), Global Talent (partners and children), children of Appendix FM partners on the 10-year route, and children of Appendix FM partners on the 5-year route (paragraph 298 of Part 8 of the Immigration Rules). The separate settlement requirements of other routes and their dependants still show insufficient information.',
  'home.start': 'Start simulation',
  'home.before': 'Before you start',
  'home.prepare':
    'Have your permission dates, absences and earnings by tax year ready. Leave uncertain information blank.',
  'home.privacy':
    'No account or document uploads. Inputs are processed in your browser and drafts are saved on this device. Other people using a shared device may see your draft.',
  'home.disclaimerTitle': 'About this simulator',
  'home.disclaimer':
    'Based on the information you entered, these rules may be relevant. This simulator provides general policy information and hypothetical scenario modelling. It does not determine your legal immigration status, is not immigration or legal advice, and does not guarantee the outcome of an application.',
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
  'result.navigation': 'Jump to an assessment',
  'result.jumpTo': 'Jump to {column}',
  'gap.title': 'What is missing',
  'gap.met': 'You meet the modelled requirements for this pathway.',
  'gap.earliest':
    'Based on the current situation, the earliest projected application date is {date} (assuming permission continues without a gap and the other requirements are still met then)',
  'gap.completion':
    'The selected pathway completes conditionally on {date}, provided the other requirements are still met then; this is not the earliest application date',
  'gap.reassess':
    'If no further counted public funds are received, shorter pathways can be reassessed from {date}',
  'gap.reassessPrincipal':
    'This date comes from the principal applicant’s record: if the principal applicant receives no further counted public funds, shorter pathways can be reassessed from {date}',
  'gap.wait':
    ', approximately {years} year{years:s} and {months} month{months:s} after the simulation date (rounded up to the next month).',
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
  'result.earliest': 'Earliest projected application date',
  'result.completion': 'Conditional completion date',
  'result.reassessment': 'Shorter pathways reassessed from',
  'result.basis': 'Based on the {years}-year pathway ({route})',
  'result.basisNoRoute': 'Based on the {years}-year pathway',
  'result.thisPathway': 'Conditions on this pathway',
  'result.otherPathways': 'Other pathways (shows why they were not used)',
  'result.shorterBlocked': 'Why shorter pathways were not used:',
  'result.shorterPathway': '{years}-year pathway',
  'result.shorterPathwayEntry': '{years}-year pathway ({entry})',
  'result.shorterNotMet': '{pathway} – not met: {rules}',
  'result.shorterUnconfirmed': '{pathway} – still to be confirmed: {rules}',
  'result.entry.ES-EARNINGS-3Y': 'earnings',
  'result.entry.ES-EARNINGS-5Y': 'earnings',
  'result.entry.ES-BRITISH-CONNECTION': 'British connection',
  'result.entry.ES-PUBLIC-SERVICE': 'public service occupation',
  'result.entry.ES-TRANSITIONAL-CARE-WORKER':
    'care worker transitional arrangement',
  'result.entry.ES-TRANSITIONAL-HEALTH-EDUCATION':
    'health and education transitional arrangement',
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
  'whatif.trip': 'Add one more trip abroad',
  'whatif.tripFrom': 'Departure date',
  'whatif.tripTo': 'Return date',
  'whatif.tripDays':
    '{days} whole day{days:s} away. Current law counts whole days only, not the departure and return days; the reform column counts both days as a modelling assumption (PD-054).',
  'whatif.tripIncomplete':
    'Enter both the departure and return dates for this trip to count.',
  'whatif.tripInvalid':
    'The return date is before the departure date, so this trip is not counted.',
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
  'error.savings':
    'Enter a whole savings amount of 0 or more, or leave blank if not provided.',
  'outcome.LIKELY_ELIGIBLE': 'Likely eligible',
  'outcome.LIKELY_ELIGIBLE.description':
    'You meet the modelled requirements for at least one pathway in this assessment. This does not guarantee an application outcome.',
  'outcome.LIKELY_NOT_ELIGIBLE': 'Likely not eligible',
  'outcome.LIKELY_NOT_ELIGIBLE.description':
    'The simulator has not identified a pathway you meet on this date. Review the requirements and any missing information below.',
  'outcome.POTENTIALLY_ELIGIBLE':
    'Potentially eligible, pending policy details',
  'outcome.POTENTIALLY_ELIGIBLE.description':
    'At least one pathway has no unmet requirements and depends on unresolved policy details.',
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
  'pilot.entryTitle': 'Other countries (pilots)',
  'au.entryDesc':
    'Use your visa and travel record to work out the dates for subclass 191, 186 TRT, the partner permanent stage, the Resident Return visa and citizenship residence.',
  'au.entryLink': 'Open the Australia pilot',
  'au.title':
    'Australia: permanent residence, return visa and citizenship dates (pilot)',
  'au.intro':
    'From your Australian visas and trips, this works out the steps that depend on time alone: subclass 191, the 186 Temporary Residence Transition stream, the partner visa permanent stage, the Resident Return visa and the citizenship residence requirement. Points-tested visas (such as 189, 190 and 491) are out of scope.',
  'au.scope':
    'The pilot checks only the time requirements written in the regulations. It does not check English, health, character, employer nomination, regional residence or other requirements; each result lists them. Your entries are processed in your browser and are not saved or uploaded.',
  'au.basics': 'About you',
  'au.simulationDate': 'Simulation date',
  'au.simulationDateHint':
    'Results are worked out for this date. It starts as today.',
  'au.dateOfBirth': 'Date of birth',
  'au.firstArrival':
    'Date you first arrived in Australia (leave blank if you have not arrived yet)',
  'au.visas': 'Your visas',
  'au.visasHint':
    'Enter each visa in date order, including bridging visas; leave out ETAs, special purpose visas and maritime crew visas. The start date is the day it came into effect. A new substantive visa ends the visas before it; a new bridging visa ends only an earlier bridging visa, not a substantive one (Migration Act s82). You can leave the end date blank for a visa that was ended this way or is still in effect; visas starting on the same day are taken in the order entered.',
  'au.visa': 'Visa {n}',
  'au.subclass': 'Visa subclass',
  'au.from': 'Start date',
  'au.to': 'End date (leave blank if still in effect)',
  'au.addVisa': 'Add a visa',
  'au.remove': 'Remove',
  'au.trips': 'Trips outside Australia',
  'au.tripsHint':
    'Add a row for each time you left Australia. You can include planned trips.',
  'au.trip': 'Trip {n}',
  'au.departed': 'Date you left Australia',
  'au.returned': 'Date you came back',
  'au.addTrip': 'Add a trip',
  'au.sponsored':
    'While on a 457/482 or related bridging visa, after arriving I always worked full time in Australia for my sponsor in the visa occupation (paid leave is fine, unpaid leave is not)',
  'au.partner': 'I applied for a partner visa (820/801 or 309/100)',
  'au.partnerLodged': 'Date you applied for the partner visa',
  'au.partnerStream': 'Where you applied',
  'au.onshore': 'In Australia (820/801)',
  'au.offshore': 'Outside Australia (309/100)',
  'au.longTerm':
    'We were already in a long-term partner relationship when I applied: 3 years as spouses or de facto partners, or 2 years with a dependent child of us both (not a step-child)',
  'au.submit': 'Calculate',
  'au.errorSummary': 'Fix the items marked in red first.',
  'au.error.date': 'Enter a valid date.',
  'au.error.order': 'This date cannot be before the start date.',
  'au.error.beforeBirth':
    'The first arrival cannot be before your date of birth.',
  'au.error.beforeArrival':
    'A trip cannot start before your first arrival; enter your first arrival if you have trips.',
  'pilot.resultTitle': 'Results',
  'pilot.policyAsOf': 'Based on official sources checked on {date}.',
  'pilot.status.MET': 'Time requirements met on the simulation date',
  'pilot.status.FUTURE': 'Time requirements met from {date}',
  'pilot.status.NOT_MET': 'Not met with your record',
  'pilot.status.UNKNOWN': 'More information needed',
  'pilot.status.NOT_APPLICABLE': 'Does not apply',
  'pilot.checks': 'Checks on the simulation date',
  'pilot.met': 'Met',
  'pilot.notMet': 'Not met',
  'pilot.unknownCheck': 'Not known',
  'pilot.notChecked': 'Not checked',
  'pilot.assumptions': 'Assumptions',
  'pilot.pending': 'Pending details',
  'pilot.disclaimer':
    'These dates follow the time requirements written in the law only. This is not immigration or legal advice; check the immigration authority’s records and official pages before you apply.',
  'au.sub.491': '491 Skilled Work Regional (Provisional)',
  'au.sub.494': '494 Skilled Employer Sponsored Regional (Provisional)',
  'au.sub.482': '482 Skills in Demand / Temporary Skill Shortage',
  'au.sub.457': '457 Temporary Work (Skilled)',
  'au.sub.820': '820 Partner (temporary, in Australia)',
  'au.sub.309': '309 Partner (temporary, outside Australia)',
  'au.sub.bridging-trt':
    'Bridging visa (for a 457, 482, 186 or 187 application)',
  'au.sub.bridging': 'Bridging visa (for another application)',
  'au.sub.other-temporary':
    'Other temporary visa (student, graduate, visitor and so on)',
  'au.sub.189': '189 Skilled Independent (permanent)',
  'au.sub.190': '190 Skilled Nominated (permanent)',
  'au.sub.191': '191 Permanent Residence (Skilled Regional)',
  'au.sub.186': '186 Employer Nomination Scheme (permanent)',
  'au.sub.801': '801 Partner (permanent, in Australia)',
  'au.sub.100': '100 Partner (permanent, outside Australia)',
  'au.sub.155': '155 Resident Return visa (permanent)',
  'au.sub.other-permanent': 'Other permanent visa',
  'nz.entryLink': 'Open the New Zealand pilot',
  'nz.entryDesc':
    'Use your resident visa and travel record to work out when your travel conditions end and the dates for the permanent resident visa and citizenship presence.',
  'nz.title':
    'New Zealand: dates for the permanent resident visa and citizenship (pilot)',
  'nz.intro':
    'From your New Zealand resident visa and trips, this works out three steps that depend on time alone: when your resident visa travel conditions end, the days needed for a permanent resident visa, and the presence requirement for citizenship. Whether you can get a resident visa (Skilled Migrant points, employers, investment and so on) is out of scope.',
  'nz.scope':
    'The pilot checks only the time requirements written in the immigration instructions and the Citizenship Act. It does not check character, English, conditions on your resident visa or other requirements; each result lists them. Your entries are processed in your browser and are not saved or uploaded.',
  'nz.basics': 'About you',
  'nz.simulationDate': 'Simulation date',
  'nz.simulationDateHint':
    'Results are worked out for this date. It starts as today.',
  'nz.dateOfBirth': 'Date of birth',
  'nz.firstArrival': 'Date you first arrived in New Zealand (on any visa)',
  'nz.visas': 'Resident visa',
  'nz.residentGranted': 'Date your resident visa was granted',
  'nz.residentGrantedHint':
    'If it was granted outside New Zealand, you are in New Zealand as a resident only from your next arrival.',
  'nz.category': 'Residence category',
  'nz.category.general':
    'General (Skilled Migrant, partner, work to residence and others)',
  'nz.category.parent': 'Parent',
  'nz.category.religious-worker': 'Religious Worker',
  'nz.category.aip-growth': 'Active Investor Plus: Growth',
  'nz.category.aip-balanced': 'Active Investor Plus: Balanced',
  'nz.travelConditionsEnd':
    'Travel conditions expiry date on your visa (optional)',
  'nz.travelConditionsEndHint':
    'The Expiry date travel on your eVisa. If blank, it is worked out under the current rule; older visas may differ, so entering it is better.',
  'nz.conditionsOutstanding':
    'My resident visa has s49 conditions (such as employment, investment or sponsorship) not yet met or removed',
  'nz.prvGranted':
    'Date your permanent resident visa was granted (leave blank if you do not have one)',
  'nz.trips': 'Trips abroad',
  'nz.tripsHint':
    'Add a row for each time you left New Zealand after becoming a resident. If your resident visa was granted while you were abroad, include that trip too. You can include planned trips.',
  'nz.trip': 'Trip {n}',
  'nz.departed': 'Date you left New Zealand',
  'nz.returned': 'Date you came back to New Zealand',
  'nz.addTrip': 'Add a trip',
  'nz.remove': 'Remove',
  'nz.submit': 'Work out dates',
  'nz.errorSummary': 'Fix the items marked in red first.',
  'nz.error.date': 'Enter a valid date.',
  'nz.error.order': 'This date cannot be before the start date.',
  'nz.error.beforeBirth':
    'Your first arrival cannot be before your date of birth.',
  'nz.error.beforeArrival': 'A trip cannot start before your first arrival.',
  'nz.error.prvOrder':
    'The permanent resident visa cannot be granted before the resident visa.',
  'home.disclaimerEnglish':
    'Based on the information you entered, these rules may be relevant. This simulator provides general policy information and hypothetical scenario modelling. It does not determine your legal immigration status, is not immigration or legal advice, and does not guarantee the outcome of an application.',
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
  'step.episodes': 'Immigration permission history',
  'step.absences': 'Time outside the UK',
  'step.income': 'Earnings by tax year',
  'step.benefits': 'Benefits and statutory payments',
  'step.relationships': 'Family relationships',
  'step.english': 'English and Life in the UK',
  'step.date': 'Simulation date',
  'basic.dob': 'Date of birth',
  'basic.nationality': 'Nationality',
  'basic.nationalityHint':
    'Type a country name in English or Chinese, or its three-letter code (ISO 3166-1 alpha-3), for example China or CHN.',
  'basic.nationalitySelected': 'Selected: {name} ({code})',
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
  'episodes.innovatorSettlementCriteria':
    'Settlement endorsement criteria met by the business (INNF 17.1(f))',
  'episodes.innovatorCriteriaHint':
    'Select every criterion met. Leaving all unchecked means “None of the above”.',
  'episodes.innovatorCriteriaNone': 'None of the above',
  'episodes.innovatorSettlementEndorser':
    'Who issued your Innovator Founder settlement endorsement?',
  'episodes.innovatorSettlementEndorserHint':
    'If it is a Legacy Endorsing Body, compare it with the body that supported your last grant of permission (INNF 17.5).',
  'episodes.innovatorEndorser.NON_LEGACY': 'A non-legacy Endorsing Body',
  'episodes.innovatorEndorser.LEGACY_SAME': 'The same Legacy Endorsing Body',
  'episodes.innovatorEndorser.LEGACY_DIFFERENT':
    'A different Legacy Endorsing Body',
  'episodes.innovatorCriteria.INVESTMENT':
    'At least £50,000 invested in the business and actively spent furthering it (INNF 17.1(f)(i))',
  'episodes.innovatorCriteria.CUSTOMERS':
    'Customer numbers at least doubled in the last 3 years and exceed the average for comparable UK businesses (INNF 17.1(f)(ii))',
  'episodes.innovatorCriteria.RESEARCH_AND_IP':
    'Significant research and development activity, with an application for intellectual property protection in the UK (INNF 17.1(f)(iii))',
  'episodes.innovatorCriteria.REVENUE':
    'At least £1,000,000 in annual gross revenue in the last full accounting year (INNF 17.1(f)(iv))',
  'episodes.innovatorCriteria.EXPORT_REVENUE':
    'At least £500,000 in annual gross revenue in the last full accounting year, including at least £100,000 from exports (INNF 17.1(f)(v))',
  'episodes.innovatorCriteria.JOBS':
    'At least 10 full-time equivalent jobs created for settled workers (INNF 17.1(f)(vi))',
  'episodes.innovatorCriteria.JOBS_WITH_SALARY':
    'At least 5 full-time-equivalent jobs created for settled workers, each paying an average of at least £25,000 a year in gross salary, excluding allowances (INNF 17.1(f)(vii))',
  'episodes.privateLifeRoute': 'Basis of Appendix Private Life permission',
  'episodes.privateLifeRoute.CHILD':
    'Granted as a child (under 18, with at least 7 years of continuous residence in the UK; PL 3.1 / 10.1)',
  'episodes.privateLifeRoute.YOUNG_ADULT':
    'Aged 18–24, arrived before 18 and has lived continuously in the UK for at least half their life (PL 4.1)',
  'episodes.privateLifeRoute.ADULT':
    'Other (aged 18 or over on the date of application: more than 20 years of continuous residence in the UK, or very significant obstacles to integration into the country they would have to live in if required to leave the UK; PL 5.1)',
  'benefits.protectionStatusRevoked':
    'My protection status has been revoked or I have renounced it (STP 4.1)',
  'benefits.asylumSupportRepayment':
    'Do you need to repay asylum support costs?',
  'result.protectionNotice':
    'Protection route conclusions reflect only the published policy framework. Article 31 safeguards, whether time before the routes launch will count, and repayment and public funds details have not yet been published. Read these conclusions alongside the pending details.',
  'episodes.hint':
    'Enter the start and end dates of each grant of immigration permission. Leave the list empty if you have none.',
  'episodes.item': 'Permission period',
  'episodes.add': 'Add a permission period',
  'episodes.empty': 'No permission periods added.',
  'episodes.route': 'Immigration route',
  'episodes.from': 'Valid from',
  'episodes.to': 'Valid to',
  'episodes.roleHint':
    'Choose dependant if this permission was granted as someone else’s dependant, for example the partner or child of a Skilled Worker or Global Talent holder, whether or not you were granted at the same time. Otherwise choose main applicant, for example a Skilled Worker, or a partner of a British citizen or settled person holding a family visa.',
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
  'income.simulationDate':
    'Tax years are listed for the simulation date {date}; change it in the last step.',
  'income.copyAbove': 'Same as {year}',
  'income.earnings': 'Personal annual earnings',
  'income.partner': 'Partner annual earnings (optional)',
  'income.partnerHint':
    'Leave partner earnings blank if you are not relying on them.',
  'income.cashSavings': 'Cash savings (you and your partner combined, £)',
  'income.cashSavingsHint':
    'Savings can cover an income shortfall: at least £{base} plus the shortfall (E-LTRP.3.1(b); settlement applications do not multiply by 2.5 under E-ILRP.1.3(1A)). Enter 0 if you have no savings.',
  'benefits.partnerSpecifiedBenefit':
    "My partner receives a benefit listed in E-LTRP.3.3(a) (such as Carer's Allowance, Personal Independence Payment, Disability Living Allowance or Attendance Allowance)",
  'benefits.hint':
    'Enter any benefits or statutory payments received. Public funds are the benefits and services listed in the Immigration Rules, such as Universal Credit, Housing Benefit, Child Benefit and Personal Independence Payment. Statutory payments are paid by employers under the law, such as Statutory Maternity Pay and Statutory Sick Pay, and are not public funds. The reform column uses this definition as a modelling assumption; the final scope and exemptions are still to be set (PD-013). Leave the end date blank if it is still being received.',
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
  'error.nationality':
    'Choose a country or territory from the list, or enter its three-letter code from the list.',
  'error.range': 'The end date must not be before the start date.',
  'error.soc': 'Enter a four-digit SOC 2020 occupation code, or leave blank.',
  'game.day': 'Day {day} of 3',
  'game.morning': 'Good morning',
  'game.beginDay': 'Get up and start the day',
  'game.mailCount': '{count} letter{count:s} in your mailbox',
  'game.noFestival': 'An ordinary day, with little things to look forward to.',
  'game.sunny': 'Sunny',
  'game.cloudy': 'Cloudy',
  'game.rain': 'Rain',
  'game.snow': 'Snow',
  'game.workday': 'Workday',
  'game.weekend': 'Weekend',
  'game.special': 'Special day',
  'game.fastForward': 'Fast-forward this season',
  'game.fastConfirm':
    'Follow a daily routine for the rest of the season, stopping for events.',
  'game.endDay': 'Call it a day',
  'game.sleep': 'Go to sleep',
  'game.sleepConfirm':
    'Return to bed and end the day? Any unread events will arrive first.',
  'game.confirm': 'Confirm',
  'game.cancel': 'Not yet',
  'game.daysReview': 'Days of this season',
  'game.bag': 'Bag',
  'game.friends': 'Townsfolk',
  'game.gift': 'Give a gift',
  'game.giftDone': 'You already gave a gift today',
  'game.emptyBag': 'Your bag is empty.',
  'game.eat': 'Eat',
  'game.cook': 'Cook',
  'game.kitchen': 'Kitchen',
  'game.kitchenHint': 'Cook at the kitchen in your home.',
  'game.recipeNeeds': 'Needs',
  'game.buy': 'Buy',
  'game.quantity': 'Quantity',
  'game.purchased': 'Added to your bag',
  'game.itemFallback': 'Item',
  'game.hours': 'Opening hours',
  'game.closed': 'Closed now',
  'game.closedLabel': 'Closed',
  'game.noVisaActions': 'No immigration actions are available here right now.',
  'game.tooLate':
    'There is not enough time to finish before closing at {time}.',
  'game.tooLateSome':
    'Some things cannot be finished before closing at {time}; only those that still fit today are listed.',
  'game.openAllDay': 'Open all day',
  'game.minutes': '{count} minutes',
  'game.peopleHere': 'People here',
  'game.talk': 'Talk',
  'game.finishedTalking': 'See you later',
  'game.reveal': 'Show full line',
  'game.plot': 'Plot {count}',
  'game.plant': 'Plant',
  'game.water': 'Water',
  'game.watered': 'Watered today',
  'game.harvest': 'Harvest',
  'game.growth': 'Growth {count} / {days}',
  'game.cropMaturity': 'Days to maturity with watering · {days}',
  'game.cropMature': 'Ready to harvest.',
  'game.cropTimeLeft': 'Days left this season after today · {days}',
  'game.cropSeasonWarning':
    'Any crops left in the ground will be cleared when the season changes.',
  'game.noSeeds': 'No seeds for this season. Visit the corner shop.',
  'game.rentFirst': 'Rent a plot at the allotment shed first.',
  'game.fish': 'Fish',
  'game.cast': 'Cast the line',
  'game.waitingFish': 'Watch the float…',
  'game.bite': 'A bite! Reel in now!',
  'game.reel': 'Reel in',
  'game.fishWin': 'Caught it!',
  'game.fishMiss': 'It got away',
  'game.castingFish': 'A swing of the rod; the line lands…',
  'game.reelingFish': 'Pulling the line back in…',
  'game.fishEasy': 'Easy mode (2 seconds)',
  'game.fishEasyHint':
    'When the float dips, press Space / E or tap Reel in within 2 seconds. Space / E also casts the line.',
  'game.fishFirst': 'First catch! Added to your collection.',
  'game.fishCollected': 'Hello again! See this fish in your collection.',
  'game.fishJunk': 'A little pond surprise, brought safely ashore.',
  'game.fishRetry': 'Try again. No game time or items were used.',
  'game.kitchenAdd': 'Add {item} × {count}',
  'game.kitchenServe': 'Plate up and serve',
  'game.kitchenStep': 'Step {step} / {total}',
  'game.kitchenSkip': 'Skip the steps and finish cooking',
  'game.kitchenRecipes': 'Back to recipes',
  'game.kitchenComment': 'A little homemade goodness, just right.',
  'game.kitchenNoIngredients':
    'You do not have the ingredients for any dish yet: vegetables come from allotment harvests, and perch from the pond.',
  'game.prepare-dumplings': 'Fold the dumplings and simmer',
  'game.prepare-summer-corn': 'Turn the corn on the grill',
  'game.prepare-turnip-soup': 'Stir the simmering soup',
  'game.prepare-corn-soup': 'Stir until creamy',
  'game.prepare-baked-potato': 'Bake until fluffy inside',
  'game.prepare-salad': 'Toss gently',
  'game.prepare-fish-and-potatoes': 'Turn the fish in the pan',
  'game.prepare-strawberry-jam': 'Stir until the jam thickens',
  'game.fishHint':
    'When the float dips, press Space / E or tap Reel in within 0.6 seconds.',
  'game.mailbox': 'Mailbox',
  'game.readMail': 'Read the next letter',
  'game.noMail': 'All caught up with the post.',
  'game.desk': 'Desk',
  'game.bed': 'Bed',
  'game.exitHome': 'Leave home',
  'game.interact': 'Interact: {name}',
  'game.goHome': 'Go home',
  'game.muted': 'Sound off',
  'game.unmuted': 'Sound on',
  'game.continueFast': 'Continue the routine after this event',
  'game.eventResult': 'What happened next',
};
