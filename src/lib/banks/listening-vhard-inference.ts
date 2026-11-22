/**
 * Listening VERY HARD 2 — mazmun/xulosa banklari (C2 daraja).
 * Har bir blok: tinglatiladigan jumla (audio), to'g'ri xulosa (correct) va
 * 3 ta plausibl lekin xato xulosa (d). Generatorlar bu bazalarni 2 xil
 * grammatik ramka bilan o'qiydi → har bir element 2 ta unikal audio oladi.
 */

/** Taqiqlovchi qoidalar (inversiya: "Under no circumstances...") */
export type RuleItem = { subj: string; pred: string; correct: string; d: [string, string, string] };
export const RULES: RuleItem[] = [
  {
    subj: "laboratory samples",
    pred: "be left unrefrigerated overnight",
    correct: "The samples must be kept refrigerated at all times",
    d: ["Samples may stay out if the lab is busy", "Refrigeration is optional for short stays", "Only blood samples need refrigeration"],
  },
  {
    subj: "visitors",
    pred: "touch the manuscripts without gloves",
    correct: "Gloves are required for handling the manuscripts",
    d: ["Visitors may touch the manuscripts freely", "Gloves are provided but unnecessary", "Only the staff may wear gloves"],
  },
  {
    subj: "the elevator",
    pred: "be used during a fire alarm",
    correct: "Stairs, not the elevator, must be used during a fire",
    d: ["The elevator is the safest escape route", "Alarms are only practice drills", "Elevator use depends on the floor"],
  },
  {
    subj: "the archive",
    pred: "be opened to the public on Mondays",
    correct: "The archive is closed to the public on Mondays",
    d: ["The archive opens early on Mondays", "Mondays are the busiest visiting day", "Public access needs no booking"],
  },
  {
    subj: "cameras",
    pred: "be brought into the courtroom",
    correct: "Filming inside the courtroom is forbidden",
    d: ["Cameras are welcome in the courtroom", "Only the press may film the trial", "Filming stops after the verdict"],
  },
  {
    subj: "refunds",
    pred: "be granted after the deadline",
    correct: "No refunds are possible once the deadline passes",
    d: ["Refunds are always negotiable", "The deadline applies to members only", "Late refunds carry a small fee"],
  },
  {
    subj: "the reagent",
    pred: "be mixed with bleach",
    correct: "Mixing the reagent with bleach is dangerous and banned",
    d: ["The reagent cleans best with bleach", "Bleach strengthens the reagent", "The mixture is required weekly"],
  },
  {
    subj: "phones",
    pred: "be switched on in the exam hall",
    correct: "Phones must stay switched off in the exam hall",
    d: ["Phones may be used between sections", "Only silent phones are allowed", "The rule applies to staff alone"],
  },
  {
    subj: "the data",
    pred: "be shared with third parties",
    correct: "The data must never be given to outsiders",
    d: ["Sharing needs only verbal consent", "Partners receive the data automatically", "The data is public after a year"],
  },
  {
    subj: "minors",
    pred: "enter the restricted wing",
    correct: "The restricted wing is adults only",
    d: ["Children may enter with a guide", "The wing opens to families weekly", "Age checks are only random"],
  },
  {
    subj: "the vault",
    pred: "be left unlocked",
    correct: "The vault must be locked whenever unattended",
    d: ["The vault lock is only ceremonial", "Daytime unlocking is normal", "Locks are checked once a year"],
  },
  {
    subj: "smoking",
    pred: "be permitted near the fuel depot",
    correct: "Smoking near the fuel depot is strictly banned",
    d: ["Smoking is allowed beyond the fence line only", "The depot has a smoking corner", "The ban covers visitors only"],
  },
  {
    subj: "candidates",
    pred: "consult printed notes at any stage",
    correct: "No printed materials are allowed during any stage",
    d: ["Notes are allowed in the oral part", "Only dictionaries are banned", "Candidates may annotate their papers"],
  },
  {
    subj: "pets",
    pred: "be admitted to the food hall",
    correct: "No animals are allowed inside the food hall",
    d: ["Small pets travel in baskets", "Guide dogs stay outside as well", "The rule applies to dogs alone"],
  },
  {
    subj: "the alarm",
    pred: "be silenced manually",
    correct: "Silencing the alarm by hand is forbidden",
    d: ["Staff may mute the alarm briefly", "The alarm has a manual override", "Only false alarms are silenced"],
  },
  {
    subj: "the ladder",
    pred: "be used on uneven ground",
    correct: "The ladder must only stand on level ground",
    d: ["Uneven ground is stable enough", "The ladder adjusts to any slope", "Only tall ladders need level ground"],
  },
  {
    subj: "overtime",
    pred: "be approved without a signed form",
    correct: "Overtime needs a signed form in advance",
    d: ["Overtime is paid automatically", "Forms are only for night shifts", "Managers may skip the paperwork"],
  },
  {
    subj: "vehicles",
    pred: "park along the east wing",
    correct: "Parking beside the east wing is prohibited",
    d: ["The east wing has visitor spaces", "Parking is free after six", "Only lorries are restricted"],
  },
  {
    subj: "passwords",
    pred: "be written down anywhere",
    correct: "Passwords must never be recorded on paper",
    d: ["Written passwords are kept in safes", "Only root passwords are protected", "Notes are allowed on personal devices"],
  },
  {
    subj: "the reactor",
    pred: "run below the minimum temperature",
    correct: "The reactor must never fall below its minimum temperature",
    d: ["Low temperatures save fuel", "The minimum applies at night only", "The reactor shuts itself down safely"],
  },
];

/** Shart gaplari (implied reality: aslida nima bo'lgan) */
export type CondItem = { audio: string; correct: string; d: [string, string, string] };
export const CONDITIONS: CondItem[] = [
  {
    audio: "Had the committee approved the funding, the expedition would have departed for Antarctica in December.",
    correct: "The funding was not approved",
    d: ["The expedition left in December", "The committee doubled the funding", "December departures are routine"],
  },
  {
    audio: "Were the board to accept the takeover, the plant would be modernised within a year.",
    correct: "The takeover has not been accepted",
    d: ["Modernisation is already complete", "The plant was sold last year", "The board demanded a year"],
  },
  {
    audio: "But for the engineer's quick reaction, the whole production line would have shut down.",
    correct: "The engineer's reaction prevented a shutdown",
    d: ["The line shut down anyway", "The engineer ignored the alarm", "The shutdown lasted a week"],
  },
  {
    audio: "If the shipment had arrived on Monday, the product launch would not have been postponed.",
    correct: "The shipment failed to arrive on time",
    d: ["The launch went ahead as planned", "Monday shipments are always late", "The launch was never scheduled"],
  },
  {
    audio: "Had the alarm sounded earlier, the east wing would have been evacuated in time.",
    correct: "The evacuation happened too late",
    d: ["The alarm was only a drill", "The east wing has no exits", "The evacuation finished early"],
  },
  {
    audio: "But for the heavy fog, the ferry would have docked before noon.",
    correct: "The ferry docked later because of fog",
    d: ["The ferry sailed an hour early", "The fog lifted before noon", "The ferry never docked at all"],
  },
  {
    audio: "Had the pilot not diverted, the aircraft would have run out of fuel.",
    correct: "The pilot's diversion prevented a fuel emergency",
    d: ["The aircraft ran out of fuel", "The pilot refused to divert", "Fuel reserves were plentiful"],
  },
  {
    audio: "Were the museum to extend its hours, attendance would surely rise.",
    correct: "The museum has not extended its hours",
    d: ["Attendance rises every month", "The museum closes at dawn", "Longer hours reduced attendance"],
  },
  {
    audio: "Had the contract been signed in March, the bypass road would be open today.",
    correct: "The contract was not signed in March",
    d: ["The road opened ahead of plan", "March signing is customary", "The road was cancelled"],
  },
  {
    audio: "If the samples had been stored correctly, the results would have been valid.",
    correct: "The samples were stored incorrectly",
    d: ["The results were fully valid", "Storage had no effect on results", "Fresh samples were collected"],
  },
  {
    audio: "But for the translator's error, the treaty would have been ratified in June.",
    correct: "A translation mistake delayed the ratification",
    d: ["The translator worked flawlessly", "The treaty failed for other reasons", "Ratification needs no translation"],
  },
  {
    audio: "Had the tenants paid on time, the owner would not have withheld the deposits.",
    correct: "The tenants fell behind on payments",
    d: ["The deposits were refunded twice", "The owner lost the records", "Rent was paid early"],
  },
  {
    audio: "Were the tunnel to be widened, freight costs would fall sharply.",
    correct: "The tunnel has not yet been widened",
    d: ["Freight costs are already falling", "The widening finished in May", "Costs are unrelated to width"],
  },
  {
    audio: "Had the weather cleared, the rescue would have finished by dusk.",
    correct: "Bad weather prolonged the rescue",
    d: ["The rescue ended by dusk", "The forecast promised sunshine", "The rescue was called off"],
  },
  {
    audio: "If the committee had ever met, the proposal would now be law.",
    correct: "The committee never convened",
    d: ["The proposal became law quickly", "Meetings are held weekly", "Parliament rejected the proposal"],
  },
  {
    audio: "But for an anonymous donation, the library would have closed its doors in May.",
    correct: "The donation kept the library open",
    d: ["The library closed in May", "The donation was too small", "No donation was ever made"],
  },
  {
    audio: "Had the inspection been passed, the bridge would have reopened in April.",
    correct: "The bridge stayed closed after failing inspection",
    d: ["The bridge reopened in April", "Inspections are purely formal", "The bridge never closed"],
  },
  {
    audio: "Were the rules relaxed, part-time students could enrol on the course.",
    correct: "Part-time students cannot enrol under current rules",
    d: ["Enrolment opens next week", "The rules were already relaxed", "Part-time numbers are rising"],
  },
  {
    audio: "Had the courier read the label, the parcel would not be sitting in Madrid.",
    correct: "The parcel went to the wrong city",
    d: ["The label was double-checked", "Madrid was the destination", "The courier took a shortcut"],
  },
  {
    audio: "Had the scaffolding been inspected weekly, the accident would never have happened.",
    correct: "The scaffolding was not inspected as required",
    d: ["Inspections happened every week", "The accident was unavoidable", "Scaffolding was brand new"],
  },
];

/** Hedging — gapiruvchining munosabati */
export type HedgeItem = { audio: string; correct: string; d: [string, string, string] };
export const HEDGES: HedgeItem[] = [
  {
    audio: "The findings are, by and large, quite encouraging, though the small sample does leave some room for doubt.",
    correct: "Positive but with reservations",
    d: ["Entirely dismissive", "Completely indifferent", "Openly hostile"],
  },
  {
    audio: "The proposal is not without merit; nevertheless, its costings remain, frankly, speculative.",
    correct: "Sympathetic but doubtful about the costs",
    d: ["Enthusiastically supportive", "Rejecting the idea outright", "Puzzled by the whole proposal"],
  },
  {
    audio: "I would not go so far as to call the results conclusive, but they are certainly suggestive.",
    correct: "Moderately convinced",
    d: ["Fully convinced", "Entirely unconvinced", "Amused but uninterested"],
  },
  {
    audio: "The new engine is, in most respects, a marked improvement — the noise level aside.",
    correct: "Favourable with one minor reservation",
    d: ["Disappointed by the engine", "Deafened by the noise", "Indifferent to the design"],
  },
  {
    audio: "Whether the reform will succeed is, at this stage, anybody's guess.",
    correct: "Uncertain about the outcome",
    d: ["Certain of failure", "Promising quick success", "Refusing to comment"],
  },
  {
    audio: "The pilot scheme has, if anything, slightly exceeded our modest expectations.",
    correct: "Mildly positive",
    d: ["Sharply critical", "Wildly overexcited", "Neutral to the point of boredom"],
  },
  {
    audio: "The witness's account is broadly consistent, allowing for a few trivial discrepancies.",
    correct: "Largely believable",
    d: ["Wholly fabricated", "Contradicted at every turn", "Too dull to assess"],
  },
  {
    audio: "The device is safe, as far as we can tell from the trials conducted so far.",
    correct: "Positive but not fully certain",
    d: ["Declaring the device unsafe", "Puzzled by the trials", "Proud of a finished product"],
  },
  {
    audio: "The manuscript is, without question, genuine; its authorship, however, is another matter.",
    correct: "Sure of the object, unsure of its author",
    d: ["Calling the manuscript a fake", "Naming the author with certainty", "Doubting the document's age"],
  },
  {
    audio: "The approach is elegant, admittedly, yet its practical value is debatable.",
    correct: "Admiring the idea, doubting its usefulness",
    d: ["Scorning the approach", "Planning to apply it at once", "Confused by the elegance"],
  },
  {
    audio: "The sales figures are nothing short of remarkable, given the recession.",
    correct: "Strongly impressed",
    d: ["Deeply worried by the numbers", "Doubting the figures exist", "Angry about the recession"],
  },
  {
    audio: "The software is usable, though I would hesitate to call it finished.",
    correct: "Critical of the unfinished state",
    d: ["Delighted with the release", "Refusing to test it again", "Praising the documentation"],
  },
  {
    audio: "The evidence points, tentatively, toward an earlier date than previously supposed.",
    correct: "Offering a provisional conclusion",
    d: ["Announcing a final verdict", "Rejecting all dating methods", "Leaving the question untouched"],
  },
  {
    audio: "The committee is broadly satisfied, save for one dissenting voice.",
    correct: "Nearly unanimous approval",
    d: ["A divided committee", "A rejected report", "A committee in chaos"],
  },
  {
    audio: "The therapy shows promise, though it would be premature to celebrate.",
    correct: "Hopeful but cautious",
    d: ["Already celebrating a cure", "Condemning the therapy", "Bored by the trial"],
  },
  {
    audio: "The report is thorough — exhaustive, even — but somewhat inaccessible to lay readers.",
    correct: "Praise mixed with criticism",
    d: ["Pure admiration", "Pure dismissal", "Confusion about the purpose"],
  },
  {
    audio: "By no stretch of the imagination can the delay be called minor.",
    correct: "Strong criticism of the delay",
    d: ["Forgiving the delay", "Calling it a small slip", "Ignoring the schedule"],
  },
  {
    audio: "The forecast is, on balance, optimistic, with reservations about rainfall.",
    correct: "Generally positive with caveats",
    d: ["Predicting a disaster", "Cheerfully certain", "Anxious about everything"],
  },
];

/** Akademik jumla paraphrasi */
export type ParaItem = { audio: string; correct: string; d: [string, string, string] };
export const PARAPHRASES: ParaItem[] = [
  {
    audio: "What the study demonstrably lacks is a control group of sufficient size.",
    correct: "The study's control group is too small",
    d: ["The study compares two equal groups", "The study needs no controls", "The groups were randomly assigned"],
  },
  {
    audio: "It is the methodology, rather than the data, that the reviewers question.",
    correct: "The reviewers doubt how the study was carried out",
    d: ["The dataset itself is faulty", "The reviewers praised the method", "Only the statistics were checked"],
  },
  {
    audio: "Nowhere in the report is the funding source disclosed.",
    correct: "The report omits who paid for the research",
    d: ["The funding is listed in an appendix", "Two sponsors are named openly", "Funding was refused"],
  },
  {
    audio: "Only after the third revision did the journal accept the paper.",
    correct: "The paper was rejected twice",
    d: ["The paper was accepted at once", "The journal demanded no changes", "The authors withdrew the paper"],
  },
  {
    audio: "Little does the public realise how contingent these forecasts are.",
    correct: "The forecasts rest on assumptions few people know about",
    d: ["The forecasts are always accurate", "The public helped build the model", "The forecasts are legally binding"],
  },
  {
    audio: "Rarely has a policy been adopted with so little supporting evidence.",
    correct: "The policy lacked evidence behind it",
    d: ["Evidence flooded the debate", "The policy was shelved for study", "Trials preceded the adoption"],
  },
  {
    audio: "Not until the second survey did the trend become apparent.",
    correct: "The first survey missed the trend",
    d: ["The trend appeared immediately", "Only one survey was run", "The trend was known for years"],
  },
  {
    audio: "The committee stopped short of calling the results fraudulent.",
    correct: "The committee nearly, but not quite, alleged fraud",
    d: ["Fraud was officially proven", "Fraud was never considered", "The committee cleared the authors"],
  },
  {
    audio: "So severe was the drought that reservoirs fell to record lows.",
    correct: "The drought was exceptionally harsh",
    d: ["Rain refilled the reservoirs", "The drought was mild", "Reservoirs hit record highs"],
  },
  {
    audio: "Under no interpretation of the statute does the clause apply here.",
    correct: "The clause is irrelevant to this case",
    d: ["The clause clearly covers the case", "Lawyers disagree about wording", "The statute was amended twice"],
  },
  {
    audio: "It was the second trial, not the first, that yielded the decisive data.",
    correct: "The decisive data came from the second trial",
    d: ["The first trial settled everything", "Both trials failed", "The data came from a survey"],
  },
  {
    audio: "Hardly had the trial begun when the jurors raised objections.",
    correct: "Objections came almost immediately",
    d: ["The trial ran smoothly for weeks", "Objections came after the verdict", "The jurors stayed silent"],
  },
  {
    audio: "The findings should be interpreted with considerable caution, the authors concede.",
    correct: "The authors themselves warn against overconfidence",
    d: ["The authors insist on certainty", "Reviewers demanded more caution", "The findings were withdrawn"],
  },
  {
    audio: "In no sense does the endorsement constitute a guarantee.",
    correct: "The endorsement promises nothing about success",
    d: ["The endorsement is a formal guarantee", "Guarantees accompany every deal", "The endorsement was withdrawn"],
  },
  {
    audio: "Scarcely a month passed without another delay being announced.",
    correct: "Delays were announced almost monthly",
    d: ["The schedule was never touched", "One delay covered everything", "Delays were rare and brief"],
  },
  {
    audio: "What matters is not the sample size per se but its representativeness.",
    correct: "How typical the sample is matters most",
    d: ["Bigger samples are always better", "Size is the only concern", "The sample was chosen at random"],
  },
  {
    audio: "Little by little, the algorithm's accuracy was eroded by drift in the input data.",
    correct: "Gradually the accuracy declined as inputs changed",
    d: ["Accuracy improved after retraining", "The inputs stayed perfectly stable", "The drift was fixed overnight"],
  },
  {
    audio: "At no stage were the participants told which arm of the trial they were in.",
    correct: "The trial kept participants blind",
    d: ["Participants chose their own arm", "Results were mailed to everyone", "Only doctors were informed"],
  },
];

/** Qoidadan istisnolar (save/except) */
export type ExceptItem = { audio: string; correct: string; d: [string, string, string] };
export const EXCEPTIONS: ExceptItem[] = [
  {
    audio: "All participants are expected to attend the briefing, save those who have already completed the induction module.",
    correct: "Those who completed the induction module",
    d: ["Everyone without exception", "The newest employees only", "The briefing organisers"],
  },
  {
    audio: "Every manuscript must be digitised this quarter, the illuminated folios excepted, which require manual handling.",
    correct: "The illuminated folios",
    d: ["All manuscripts are exempt", "Nothing may be digitised", "The scanning operators"],
  },
  {
    audio: "The curfew applies to all districts, Central Avenue alone excepted.",
    correct: "Central Avenue",
    d: ["Every district equally", "The outer suburbs only", "No one is exempt"],
  },
  {
    audio: "Submissions must be written in English, though appendices may remain in the original language.",
    correct: "The appendices",
    d: ["The whole submission", "The reference list", "Nothing is exempt"],
  },
  {
    audio: "All staff undergo annual training; the night shift alone is exempt until spring.",
    correct: "The night shift, until spring",
    d: ["Day staff as well", "Managers only", "No exemptions exist"],
  },
  {
    audio: "Each candidate shall sit the oral exam, native speakers of the target language alone excepted.",
    correct: "Native speakers of the target language",
    d: ["Every candidate equally", "Foreign applicants only", "The examiners themselves"],
  },
  {
    audio: "The fee applies universally; students on full scholarships are the sole exception.",
    correct: "Fully funded scholarship students",
    d: ["All students", "Part-time students", "International students"],
  },
  {
    audio: "All vehicles are banned from the square, delivery vans between five and seven a.m. excepted.",
    correct: "Delivery vans in the early morning",
    d: ["All vehicles", "Private cars at noon", "Bicycles only"],
  },
  {
    audio: "Every file is backed up nightly, with the video archive as the lone exception owing to its size.",
    correct: "The video archive",
    d: ["Nothing is backed up", "All documents", "The email folders"],
  },
  {
    audio: "Visits are by appointment only, school groups on Wednesdays excepted.",
    correct: "School groups on Wednesdays",
    d: ["All visitors", "Weekend tourists", "Foreign delegations"],
  },
  {
    audio: "The warranty covers all components, batteries alone excepted.",
    correct: "The batteries",
    d: ["Everything is covered", "The charger only", "Nothing is covered"],
  },
  {
    audio: "All exhibitions are ticketed; the permanent collection alone remains free.",
    correct: "The permanent collection",
    d: ["Every exhibition", "Guest exhibitions", "The gift shop"],
  },
  {
    audio: "Each department reports weekly, the legal office excepted on grounds of confidentiality.",
    correct: "The legal office",
    d: ["All departments equally", "Human resources", "The finance team"],
  },
  {
    audio: "All essays are marked anonymously, the doctoral seminars excepted.",
    correct: "The doctoral seminars",
    d: ["Every essay", "First-year essays", "The marking team"],
  },
  {
    audio: "Phones are prohibited throughout the building, medical staff on call excepted.",
    correct: "Medical staff on call",
    d: ["All employees", "Visitors", "Security guards"],
  },
  {
    audio: "The rule binds every tenant, with the ground-floor café excepted under its lease.",
    correct: "The ground-floor café",
    d: ["All tenants", "Top-floor flats", "The landlord"],
  },
  {
    audio: "All samples are frozen immediately, the mineral cores excepted.",
    correct: "The mineral cores",
    d: ["Every sample", "Blood samples", "The tissue slides"],
  },
  {
    audio: "Every volunteer works weekends, the coordinators alone exempted.",
    correct: "The coordinators",
    d: ["All volunteers", "New volunteers", "The weekend teams"],
  },
];

/** Implied evaluation — concessive maqtov/tanqid */
export type EvalItem = { audio: string; correct: string; d: [string, string, string] };
export const EVALUATIONS: EvalItem[] = [
  {
    audio: "It is to the team's considerable credit that the deadline was met, albeit by the narrowest of margins.",
    correct: "The deadline was met, but only with great difficulty",
    d: ["The team finished months early", "The deadline was missed", "Outsiders did the work"],
  },
  {
    audio: "Admittedly the prototype works, but whether it can be mass-produced is another question.",
    correct: "Mass production remains uncertain",
    d: ["Mass production begins next week", "The prototype never worked", "Costs are already settled"],
  },
  {
    audio: "Few would dispute the value of the scheme; the funding, however, is a sticking point.",
    correct: "Most accept the scheme, but money is the obstacle",
    d: ["Nobody supports the scheme", "Funding was settled long ago", "The scheme is worthless"],
  },
  {
    audio: "The report is commendably concise, though some readers may find it terse to the point of obscurity.",
    correct: "The report is short but possibly too unclear",
    d: ["The report is far too long", "The report is perfectly clear", "The report was never read"],
  },
  {
    audio: "The singer's debut was, at worst, uneven; at best, it was electrifying.",
    correct: "The debut had weak moments and brilliant ones",
    d: ["The debut was a total failure", "The debut was uniformly perfect", "The debut was cancelled"],
  },
  {
    audio: "The bridge has served admirably for a century — hardly grounds, one would think, for demolition.",
    correct: "The speaker opposes demolishing the bridge",
    d: ["The bridge is unsafe", "Demolition starts in May", "The speaker is neutral"],
  },
  {
    audio: "The apprentice's errors are, if nothing else, instructive.",
    correct: "The mistakes are useful to learn from",
    d: ["The apprentice should be dismissed", "The errors were intentional", "Nothing can be learned"],
  },
  {
    audio: "The council's handling of the flood was, charitably speaking, slow.",
    correct: "The speaker criticises the council's slow response",
    d: ["The council acted swiftly", "The flood was minor", "The speaker praises the council"],
  },
  {
    audio: "The translation is faithful to a fault, preserving even the original's tedium.",
    correct: "The translation is accurate but boring",
    d: ["The translation is inaccurate", "The translation is thrilling", "The translation was abandoned"],
  },
  {
    audio: "The team's caution is understandable, though it borders on timidity.",
    correct: "The team is cautious almost to a fault",
    d: ["The team is reckless", "The team never hesitates", "The speaker admires the boldness"],
  },
  {
    audio: "One could hardly ask for a more dedicated curator than Dr. Ibrohimov.",
    correct: "Dr. Ibrohimov is extremely dedicated",
    d: ["Dr. Ibrohimov is neglectful", "The curator resigned", "Dr. Ibrohimov is average"],
  },
  {
    audio: "The findings are suggestive rather than definitive, and the authors say as much.",
    correct: "The authors are honest about their limits",
    d: ["The authors overstate their case", "The findings are conclusive", "Critics found the flaw"],
  },
  {
    audio: "The restaurant's popularity is remarkable, given the service, which is, to put it kindly, unhurried.",
    correct: "The service is slow",
    d: ["The service is lightning fast", "The food is terrible", "The restaurant is empty"],
  },
  {
    audio: "The draft is superior in every respect save one: its length.",
    correct: "The only flaw is the length",
    d: ["The draft is flawless", "The draft is too shallow", "The draft was rejected"],
  },
  {
    audio: "The seminar was, for the most part, well attended — the final session, conspicuously, was not.",
    correct: "Few attended the final session",
    d: ["Attendance broke records", "Every session was full", "The seminar was cancelled"],
  },
  {
    audio: "The machinery, though antiquated, has yet to fail us once.",
    correct: "The machinery is old but dependable",
    d: ["The machinery breaks weekly", "New machines were installed", "The machinery is dangerous"],
  },
  {
    audio: "The paper's contribution is modest, its execution flawless.",
    correct: "Well executed but a small contribution",
    d: ["Badly executed but important", "Both flawed and minor", "Groundbreaking and careless"],
  },
  {
    audio: "The negotiations ended, if not in agreement, then at least in mutual understanding.",
    correct: "No deal was reached, but relations improved",
    d: ["A full agreement was signed", "Talks collapsed in shouting", "The parties refuse to meet again"],
  },
];

/** Professor da'volari (lecture claims) */
export type ClaimItem = { prof: string; claim: string; audio: string; correct: string; d: [string, string, string] };
export const CLAIMS: ClaimItem[] = [
  {
    prof: "Hale",
    claim: "the decline began decades before industrialisation",
    audio: "In her keynote, Professor Hale disputed the widely held view that the decline began with industrialisation, arguing instead that it started decades earlier.",
    correct: "The decline began decades before industrialisation",
    d: ["The decline began with industrialisation", "The decline never happened", "Industrialisation ended the decline"],
  },
  {
    prof: "Sattarov",
    claim: "the bridge is a medieval structure, not a Roman one",
    audio: "Dr. Sattarov challenged the textbook account that the bridge was Roman, presenting evidence of medieval construction.",
    correct: "The bridge is medieval, not Roman",
    d: ["The bridge is Roman in origin", "The bridge has no dated stones", "The textbook is correct"],
  },
  {
    prof: "Wood",
    claim: "supplements benefit only those with a deficiency",
    audio: "Professor Wood argued that vitamin supplements benefit only the deficient, contradicting the belief that they help everyone.",
    correct: "Supplements help only people lacking vitamins",
    d: ["Supplements help everyone equally", "Supplements are always harmful", "Deficiency tests are useless"],
  },
  {
    prof: "Lee",
    claim: "climate now drives urban growth more than jobs do",
    audio: "Dr. Lee contested the assumption that cities grow because of jobs, claiming that climate now plays the larger role.",
    correct: "Climate matters more than jobs for urban growth",
    d: ["Jobs remain the main driver", "Cities are shrinking fast", "Climate has no effect on migration"],
  },
  {
    prof: "Ortiz",
    claim: "the manuscript's ink dates to the twelfth century",
    audio: "Professor Ortiz rejected the idea that the manuscript is a forgery, dating its ink to the twelfth century.",
    correct: "The manuscript is genuine and old",
    d: ["The manuscript is a modern fake", "The ink was tested only once", "The parchment is nineteenth-century"],
  },
  {
    prof: "Hassan",
    claim: "a decades-long drought, not invasion, collapsed the empire",
    audio: "Dr. Hassan disputed that the empire fell to invasion, attributing its collapse to a decades-long drought.",
    correct: "Drought, not invasion, destroyed the empire",
    d: ["Invaders sacked the capital", "The empire declined peacefully", "Plague emptied the cities"],
  },
  {
    prof: "Novak",
    claim: "pesticides, rather than disease, drive honeybee declines",
    audio: "Professor Novak argued that honeybee declines stem from pesticides rather than disease, against common belief.",
    correct: "Pesticides are the main cause of bee decline",
    d: ["Disease is the main cause", "Bee numbers are rising", "Both causes are irrelevant"],
  },
  {
    prof: "Chen",
    claim: "the evidence that language shapes thought is weak",
    audio: "Dr. Chen challenged the claim that language shapes thought, calling the evidence weak.",
    correct: "Language probably does not shape thought",
    d: ["Language fully determines thought", "The evidence is overwhelming", "Thought shapes language never"],
  },
  {
    prof: "Adeyemi",
    claim: "local Shona builders erected Great Zimbabwe",
    audio: "Professor Adeyemi disputed that Great Zimbabwe was built by foreigners, crediting local Shona builders.",
    correct: "The Shona built Great Zimbabwe themselves",
    d: ["Foreigners built the city", "The city has no known builders", "The city dates to antiquity"],
  },
  {
    prof: "Rivera",
    claim: "a larger flood occurred in 1743",
    audio: "Dr. Rivera rejected the notion that the recent flood was unprecedented, citing an even larger one in 1743.",
    correct: "A bigger flood happened in 1743",
    d: ["The recent flood was the biggest ever", "Floods never struck the region", "Records begin in 1900"],
  },
  {
    prof: "Kim",
    claim: "memory consolidates only during deep sleep",
    audio: "Professor Kim argued that sleep consolidates memory only during its deep phases, not throughout the night.",
    correct: "Memory consolidation happens in deep sleep only",
    d: ["All sleep stages consolidate memory", "Sleep never aids memory", "Naps are superior to sleep"],
  },
  {
    prof: "Aliyev",
    claim: "silk reached Europe through Spain before Venice",
    audio: "Dr. Aliyev contested that silk reached Europe via Venice first, documenting an earlier Spanish route.",
    correct: "Silk entered Europe through Spain earlier",
    d: ["Venice was the first European hub", "Silk came by sea to Lisbon", "Silk never reached Europe"],
  },
  {
    prof: "Brown",
    claim: "bone growth shows dinosaurs were warm-blooded",
    audio: "Professor Brown disputed that dinosaurs were cold-blooded, citing bone growth patterns.",
    correct: "Dinosaurs were probably warm-blooded",
    d: ["Dinosaurs were cold-blooded reptiles", "Bone patterns prove nothing", "Dinosaurs were mammals"],
  },
  {
    prof: "Petrov",
    claim: "pigment analysis shows a pupil painted the canvas",
    audio: "Dr. Petrov argued that the painting is by a pupil, not the master, on grounds of pigment analysis.",
    correct: "A student painted the picture",
    d: ["The master signed the canvas", "The pigments are modern", "Two masters collaborated"],
  },
  {
    prof: "Okafor",
    claim: "farming spread by cultural transmission, not migration",
    audio: "Professor Okafor rejected the idea that agriculture spread by migration, favouring cultural transmission between peoples.",
    correct: "Farming spread through ideas, not moving populations",
    d: ["Farmers migrated with their crops", "Farming appeared everywhere at once", "Hunting replaced farming"],
  },
  {
    prof: "Weber",
    claim: "the cathedral's spire was added a century later",
    audio: "Dr. Weber challenged the view that the cathedral's spire was original, showing it was added a century later.",
    correct: "The spire was a later addition",
    d: ["The spire is original twelfth-century work", "The spire collapsed in 1600", "The cathedral never had a spire"],
  },
  {
    prof: "Singh",
    claim: "the lead-poisoning theory of Rome's fall is anecdotal",
    audio: "Professor Singh disputed that lead poisoning caused Rome's decline, calling the evidence anecdotal.",
    correct: "Lead probably did not doom Rome",
    d: ["Lead pipes destroyed Rome", "The evidence is conclusive", "Rome fell in a single year"],
  },
  {
    prof: "Kowalski",
    claim: "the city's walls were symbolic rather than defensive",
    audio: "Dr. Kowalski argued that the city's walls were symbolic rather than defensive, pointing to their low height.",
    correct: "The walls were built for show, not defence",
    d: ["The walls stopped every siege", "The walls were fifteen metres high", "No walls ever stood there"],
  },
  {
    prof: "Meyer",
    claim: "gene variants explain why coffee affects sleep differently",
    audio: "Professor Meyer rejected the assumption that coffee harms sleep universally, pointing to gene variants.",
    correct: "Coffee's effect on sleep varies with genes",
    d: ["Coffee ruins everyone's sleep", "Coffee never affects sleep", "Sleep needs no study"],
  },
  {
    prof: "Tosheva",
    claim: "the map is a symbolic diagram, not a chart of the Americas",
    audio: "Dr. Tosheva disputed that the old map shows the Americas, reading it as a symbolic diagram.",
    correct: "The map is symbolic, not geographic",
    d: ["The map charts the Americas", "The map is a modern fake", "The map shows trade winds"],
  },
];
