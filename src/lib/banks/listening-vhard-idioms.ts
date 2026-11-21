/**
 * Listening VERY HARD 2 — idiomalar bazasi (C2 daraja).
 * Har bir element: audio (tinglatiladigan kontekst jumla, idiomalar shu yerda
 * ishlatilgan), meaning (to'g'ri ma'no), d (3 ta plausibl, lekin xato ma'no).
 * Idiomalar savollarda faqat BIR marotaba ishlatiladi — unikallik kafolatlangan.
 */

export type IdiomItem = {
  idiom: string;
  audio: string;
  meaning: string;
  d: [string, string, string];
};

export const LISTENING_VHARD_IDIOMS: IdiomItem[] = [
  {
    idiom: "a blessing in disguise",
    audio: "Losing that contract was a blessing in disguise: the client went bankrupt two months later.",
    meaning: "an apparent misfortune that ultimately brings good",
    d: ["a secret gift from a rival firm", "a contract signed under false pretences", "an unexpected financial windfall"],
  },
  {
    idiom: "bite the bullet",
    audio: "The fares had to rise, so the board decided to bite the bullet and raise them before the summer season.",
    meaning: "to accept something unpleasant and get it over with",
    d: ["to chew nervously before speaking", "to make a rash decision", "to postpone an unpleasant task"],
  },
  {
    idiom: "a bitter pill to swallow",
    audio: "For the reigning champions, losing to the youngest team in the league was a bitter pill to swallow.",
    meaning: "a humiliating fact that is difficult to accept",
    d: ["a medicine taken without water", "a minor inconvenience", "a victory that came too easily"],
  },
  {
    idiom: "throw in the towel",
    audio: "After three failed attempts to reach the summit, the climbers finally threw in the towel.",
    meaning: "to give up and admit defeat",
    d: ["to celebrate a hard-won victory", "to clean up after a match", "to attack an opponent furiously"],
  },
  {
    idiom: "beat around the bush",
    audio: "Stop beating around the bush and tell me plainly whether the project has been cancelled.",
    meaning: "to avoid the main topic and speak indirectly",
    d: ["to search for something hidden in a garden", "to trim overgrown plants", "to answer a question honestly"],
  },
  {
    idiom: "the tip of the iceberg",
    audio: "The four errors the auditors found are merely the tip of the iceberg; the full report runs to two hundred pages.",
    meaning: "a small visible part of a far bigger problem",
    d: ["the most dangerous single defect", "a frozen mountain summit", "the conclusion of an inquiry"],
  },
  {
    idiom: "once in a blue moon",
    audio: "My retired uncle only checks his emails once in a blue moon, so don't expect a swift reply.",
    meaning: "extremely rarely",
    d: ["every single day", "at exactly midnight", "during a full moon festival"],
  },
  {
    idiom: "a wild goose chase",
    audio: "Sending the interns to the storage basement for a discontinued part turned out to be a wild goose chase.",
    meaning: "a pointless search for something unobtainable",
    d: ["an organised hunting expedition", "a race between two rivals", "a highly profitable errand"],
  },
  {
    idiom: "bite off more than one can chew",
    audio: "By promising three full reports in one week, the intern clearly bit off more than he could chew.",
    meaning: "to take on more than one can manage",
    d: ["to eat greedily at business lunches", "to speak with food in one's mouth", "to refuse all extra duties"],
  },
  {
    idiom: "burn the midnight oil",
    audio: "The whole legal team burned the midnight oil to get the filing ready before dawn.",
    meaning: "to work or study late into the night",
    d: ["to waste electricity carelessly", "to set fire to office papers", "to leave work unusually early"],
  },
  {
    idiom: "bury the hatchet",
    audio: "The two rival publishers finally buried the hatchet and agreed on a joint anniversary edition.",
    meaning: "to end a quarrel and make peace",
    d: ["to hide a weapon for later use", "to dig a hole for a tree", "to start a fresh conflict"],
  },
  {
    idiom: "call it a day",
    audio: "By six o'clock the movers had emptied the van, so the foreman called it a day.",
    meaning: "to stop working because enough has been done",
    d: ["to fix a date for a meeting", "to praise the whole crew", "to work through the night"],
  },
  {
    idiom: "cut corners",
    audio: "The bridge collapsed because the contractor had cut corners on the steel reinforcement.",
    meaning: "to do something badly by skipping proper steps",
    d: ["to take the shortest route", "to save money through honest means", "to drive unusually carefully"],
  },
  {
    idiom: "down to the wire",
    audio: "The election went down to the wire, with the final count announced after midnight.",
    meaning: "unsettled until the very last moment",
    d: ["decided weeks in advance", "about an old telegraph system", "cancelled at the last moment"],
  },
  {
    idiom: "drop the ball",
    audio: "Somebody in accounts dropped the ball: the supplier was never paid, and deliveries stopped.",
    meaning: "to neglect a responsibility and spoil things",
    d: ["to seize an opportunity", "to play a sport poorly", "to delegate a task properly"],
  },
  {
    idiom: "go the extra mile",
    audio: "The night nurse always goes the extra mile, staying beyond her shift to comfort worried patients.",
    meaning: "to make more effort than is expected",
    d: ["to walk long distances on duty", "to overcharge a grateful customer", "to do the bare minimum"],
  },
  {
    idiom: "hit the ground running",
    audio: "The new sales director hit the ground running, closing two major deals in her very first week.",
    meaning: "to begin a task with immediate energy and success",
    d: ["to stumble at the very start", "to arrive late on day one", "to resign after a week"],
  },
  {
    idiom: "in hot water",
    audio: "The accountant found himself in hot water after misfiling the tax returns for a second time.",
    meaning: "in serious trouble",
    d: ["in a warm relaxing bath", "in a comfortable position", "in a professional kitchen"],
  },
  {
    idiom: "leave no stone unturned",
    audio: "Detectives pledged to leave no stone unturned in the search for the missing painter.",
    meaning: "to try every possible means",
    d: ["to wreck the countryside", "to search only one location", "to abandon the effort quickly"],
  },
  {
    idiom: "on the back burner",
    audio: "The scheme has been on the back burner since its funding was diverted to housing.",
    meaning: "postponed and given low priority",
    d: ["being actively prepared now", "the department's top priority", "cancelled permanently"],
  },
  {
    idiom: "out of the woods",
    audio: "Thanks to the mild winter and early repairs, the harvest is finally out of the woods.",
    meaning: "past the point of danger",
    d: ["lost deep in a forest", "only now entering danger", "surrounded by tall trees"],
  },
  {
    idiom: "play devil's advocate",
    audio: "I don't actually oppose the merger; at the meeting I was merely playing devil's advocate.",
    meaning: "to argue against an idea in order to test it",
    d: ["to oppose an idea sincerely", "to insult the committee", "to remain silent throughout"],
  },
  {
    idiom: "pull the plug",
    audio: "With losses mounting, the shareholders voted to pull the plug on the unprofitable ferry route.",
    meaning: "to stop a project or activity completely",
    d: ["to switch off a lamp", "to launch a new venture", "to unblock a kitchen drain"],
  },
  {
    idiom: "put all one's eggs in one basket",
    audio: "Advisers warned the founder against putting all her eggs in one basket by betting everything on a single client.",
    meaning: "to risk everything on a single venture",
    d: ["to shop carefully for groceries", "to organise a picnic", "to invest widely and wisely"],
  },
  {
    idiom: "rock the boat",
    audio: "The manager asked staff not to rock the boat while the takeover was being negotiated.",
    meaning: "to upset a stable situation",
    d: ["to sail straight into a storm", "to improve team morale", "to fish from a small boat"],
  },
  {
    idiom: "spill the beans",
    audio: "The engineer accidentally spilled the beans about the unreleased phone at the conference.",
    meaning: "to reveal a secret",
    d: ["to waste ingredients while cooking", "to prepare a large meal", "to keep quiet deliberately"],
  },
  {
    idiom: "take with a grain of salt",
    audio: "Take the salesman's promises with a grain of salt; he has overquoted every job so far.",
    meaning: "to regard a claim as partly untrue",
    d: ["to believe without any question", "to season food properly", "to remember a promise forever"],
  },
  {
    idiom: "the last straw",
    audio: "When the airline lost his luggage for the third time, it was the last straw, and he filed a formal complaint.",
    meaning: "the final annoyance that makes someone react",
    d: ["the very first difficulty", "a harmful drinking habit", "a timely helping hand"],
  },
  {
    idiom: "turn a blind eye",
    audio: "Inspectors turned a blind eye to the safety violations for years, accepting bribes all the while.",
    meaning: "to deliberately ignore something wrong",
    d: ["to observe something keenly", "to weep openly", "to report the matter at once"],
  },
  {
    idiom: "under the weather",
    audio: "The keynote speaker is feeling under the weather, so tonight's lecture has been postponed.",
    meaning: "slightly ill",
    d: ["in high spirits", "caught in a violent storm", "extremely angry"],
  },
  {
    idiom: "up in the air",
    audio: "With the appeal still up in the air, neither side has signed the contract.",
    meaning: "not yet decided",
    d: ["flying by private plane", "definitely settled", "physically lifted"],
  },
  {
    idiom: "a hard nut to crack",
    audio: "The museum's funding gap is a hard nut to crack, even for our most experienced fundraisers.",
    meaning: "a very difficult problem to solve",
    d: ["a very easy task", "a strong steel container", "a delicious snack"],
  },
  {
    idiom: "add fuel to the fire",
    audio: "The leaked memo only added fuel to the fire, and the strike spread to two more plants.",
    meaning: "to make a bad situation worse",
    d: ["to help calm things down", "to cook a communal dinner", "to light a fireplace"],
  },
  {
    idiom: "back to square one",
    audio: "When the patent was rejected, the inventors found themselves back at square one.",
    meaning: "back to the very beginning with nothing achieved",
    d: ["right at the finishing line", "on a chessboard", "halfway to success"],
  },
  {
    idiom: "behind closed doors",
    audio: "The actual deal was hammered out behind closed doors, away from journalists and cameras.",
    meaning: "in secret, away from the public",
    d: ["at a fully open meeting", "inside a prison cell", "only at midnight"],
  },
  {
    idiom: "blow out of proportion",
    audio: "The press blew the minister's slip of the tongue out of all proportion.",
    meaning: "to exaggerate something far beyond its importance",
    d: ["to inflate a party balloon", "to describe something accurately", "to shrink a problem"],
  },
  {
    idiom: "break the ice",
    audio: "A short team quiz broke the ice, and the new students began chatting freely.",
    meaning: "to relieve initial awkwardness between strangers",
    d: ["to smash a frozen window", "to start an argument", "to freeze a lake"],
  },
  {
    idiom: "burn one's bridges",
    audio: "He burned his bridges by publicly insulting the board, and no university would hire him afterwards.",
    meaning: "to act so as to make return impossible",
    d: ["to build new friendships", "to cross a river safely", "to keep every option open"],
  },
  {
    idiom: "clear the air",
    audio: "The Monday meeting cleared the air: grievances were voiced, apologies made, and work resumed calmly.",
    meaning: "to remove tension by open discussion",
    d: ["to pollute a crowded room", "to avoid a painful topic", "to cancel a meeting"],
  },
  {
    idiom: "cost an arm and a leg",
    audio: "Repairs to the cathedral organ cost an arm and a leg, so the parish launched a fundraising drive.",
    meaning: "to be extremely expensive",
    d: ["to cause physical injury", "to be surprisingly cheap", "to require major surgery"],
  },
  {
    idiom: "cry over spilled milk",
    audio: "Yes, the file was deleted, but crying over spilled milk won't bring it back; let's rebuild it.",
    meaning: "to waste time regretting what cannot be undone",
    d: ["to clean a messy kitchen", "to celebrate a small accident", "to preserve dairy products"],
  },
  {
    idiom: "fly off the handle",
    audio: "The foreman flew off the handle when he saw the cracked beam, shouting at everyone present.",
    meaning: "to lose one's temper suddenly",
    d: ["to turn a door handle", "to leave a room quietly", "to lose one's job"],
  },
  {
    idiom: "get cold feet",
    audio: "Two days before the auction, the buyer got cold feet and quietly withdrew his bid.",
    meaning: "to become too nervous to act",
    d: ["to feel physically frozen", "to walk barefoot outdoors", "to act with bold confidence"],
  },
  {
    idiom: "give the green light",
    audio: "The safety regulator gave the green light to the new tunnel after two years of testing.",
    meaning: "to officially approve a plan",
    d: ["to reject a plan outright", "to start a motor race", "to plant new trees"],
  },
  {
    idiom: "have second thoughts",
    audio: "On signing the lease, the young couple began to have second thoughts about the neighbourhood.",
    meaning: "to begin to doubt a decision",
    d: ["to think twice as fast", "to recall an old friend", "to plan carefully in advance"],
  },
  {
    idiom: "hit the nail on the head",
    audio: "You hit the nail on the head: the delay was caused by the permit, nothing else.",
    meaning: "to describe a problem exactly",
    d: ["to injure oneself badly", "to miss the point entirely", "to repair broken furniture"],
  },
  {
    idiom: "keep one's fingers crossed",
    audio: "We are keeping our fingers crossed that the storm spares the vineyards this week.",
    meaning: "to hope for good luck",
    d: ["to promise solemnly", "to stretch before sport", "to type very quickly"],
  },
  {
    idiom: "kill two birds with one stone",
    audio: "By cycling to the office, Farhod kills two birds with one stone: exercise and savings.",
    meaning: "to achieve two aims with a single action",
    d: ["to hunt with great efficiency", "to waste an opportunity", "to harm the environment"],
  },
  {
    idiom: "let sleeping dogs lie",
    audio: "The dispute is twenty years old; my advice is to let sleeping dogs lie.",
    meaning: "to avoid stirring up an old quarrel",
    d: ["to keep pets indoors", "to wake up very early", "to reopen an old case"],
  },
  {
    idiom: "make a mountain out of a molehill",
    audio: "A single typo in the draft — honestly, you are making a mountain out of a molehill.",
    meaning: "to treat a tiny problem as huge",
    d: ["to do major landscaping work", "to solve a giant problem", "to ignore a real crisis"],
  },
  {
    idiom: "move heaven and earth",
    audio: "The consul moved heaven and earth to reunite the family before the holidays.",
    meaning: "to do everything possible",
    d: ["to cause an earthquake", "to do nothing at all", "to demolish a building"],
  },
  {
    idiom: "not lift a finger",
    audio: "While the neighbours struggled with the flood, the landlord did not lift a finger to help.",
    meaning: "to make no effort to help",
    d: ["to help with enthusiasm", "to point accusingly", "to work extremely hard"],
  },
  {
    idiom: "off the hook",
    audio: "The witness was let off the hook after the prosecutor dropped the summons.",
    meaning: "freed from a duty or from trouble",
    d: ["hung up on a caller", "caught on a fishing line", "given a heavier punishment"],
  },
  {
    idiom: "on thin ice",
    audio: "After three written warnings, the junior clerk knows he is on thin ice with the director.",
    meaning: "in a very risky position",
    d: ["skating with confidence", "in complete safety", "on solid frozen ground"],
  },
  {
    idiom: "paint oneself into a corner",
    audio: "By promising tax cuts without service cuts, the minister painted herself into a corner.",
    meaning: "to create a difficulty for oneself by one's own actions",
    d: ["to decorate a room neatly", "to hide from danger", "to plan very cleverly"],
  },
  {
    idiom: "pass the buck",
    audio: "Whenever deadlines slip, the deputy passes the buck to his assistants.",
    meaning: "to shift responsibility to someone else",
    d: ["to pay in cash", "to accept the blame", "to lend money freely"],
  },
  {
    idiom: "raise the bar",
    audio: "The defending champion raised the bar with a world record in the very first round.",
    meaning: "to set a higher standard for others",
    d: ["to lower the standards", "to block an entrance", "to close a pub early"],
  },
  {
    idiom: "read between the lines",
    audio: "The reply was polite, but reading between the lines, the ministry had already refused the request.",
    meaning: "to understand what is indirectly expressed",
    d: ["to read very slowly", "to misread a text", "to skim a document quickly"],
  },
  {
    idiom: "see eye to eye",
    audio: "After long talks, the two boards finally saw eye to eye on the merger terms.",
    meaning: "to agree completely",
    d: ["to argue endlessly", "to both need glasses", "to meet in person"],
  },
  {
    idiom: "sit on the fence",
    audio: "Unable to please either faction, the chairman sat on the fence throughout the debate.",
    meaning: "to avoid committing to either side",
    d: ["to support both sides openly", "to choose one side firmly", "to trespass on private land"],
  },
  {
    idiom: "smooth sailing",
    audio: "With the permits finally granted, the rest of the project should be smooth sailing.",
    meaning: "progress without difficulty",
    d: ["a dangerous voyage", "a stormy open sea", "a series of constant delays"],
  },
  {
    idiom: "take the bull by the horns",
    audio: "Rather than delay again, the mayor took the bull by the horns and announced the reform.",
    meaning: "to deal with a difficulty boldly and directly",
    d: ["to flee from danger", "to injure an animal", "to postpone a decision again"],
  },
  {
    idiom: "throw caution to the wind",
    audio: "Investors threw caution to the wind and sank their savings into the untested venture.",
    meaning: "to act boldly without worrying about risk",
    d: ["to be extremely careful", "to check the forecast", "to lose one's belongings"],
  },
  {
    idiom: "weather the storm",
    audio: "Thanks to its cash reserves, the old bookshop weathered the storm of online competition.",
    meaning: "to survive a difficult period",
    d: ["to be destroyed by rain", "to start a hurricane", "to forecast bad weather"],
  },
];
