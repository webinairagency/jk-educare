import { cookies } from "next/headers";

export type Lang = "en" | "ta";
export const LANG_COOKIE = "jk_lang";

const en = {
  greet: "Vanakkam",
  home: "Home", materials: "Study material", progress: "My progress", signOut: "Sign out", switchTo: "தமிழ்",
  liveNow: "Live now", nextClass: "Next class", missed: "Missed classes",
  missedNote: "You didn't join these live. Watch the recordings to catch up.",
  upcoming: "Upcoming", recordings: "All recordings",
  stUpcoming: "Upcoming", stLive: "Live now", stProcessing: "Recording coming", stRecorded: "Recorded", stMissed: "Missed",
  join: "Watch live", watch: "Watch recording", openYT: "Open in YouTube app (for chat)",
  notStarted: "The class hasn't started on YouTube yet. The player will show it as soon as the teacher goes live.",
  noLiveLink: "The live link isn't ready yet. Refresh in a minute.",
  cdPrefix: "Join opens in", cdD: "d", cdH: "h", cdM: "m", cdOpening: "Opening now…",
  noClasses: "No classes scheduled yet. New classes appear here as soon as JK sir adds them.",
  noRecordings: "Recordings of finished classes will appear here.",
  loadErr: "Classes couldn't load right now. Try again in a minute.",
  back: "‹ All classes", addCal: "Add to Google Calendar", notesPdf: "Class notes (PDF)",
  missedLive: "You missed this class live. Watch the full recording above.",
  processing: "This class has ended. The recording will appear here once JK sir adds the link.",
  play: "Play recording", dataNote: "Uses mobile data. Use Wi-Fi if you can.", openRec: "Open the recording",
  install: "Install as app", iosHint: "On iPhone: tap Share, then Add to Home Screen.",
  all: "All", tNotes: "Notes", tQB: "Question bank", tKey: "Answer key", tExam: "Model exam",
  noMaterials: "No material here yet. JK sir adds notes, question banks and answer keys after classes.",
  open: "Open",
  searchMat: "Search study material", folders: "Subjects", backAll: "All subjects", noResults: "Nothing found. Try a different word.", clear: "Clear", showFolders: "Show all subjects",
  rollNo: "Roll number", group: "Group", board: "Board",
  attended: "Joined live", finished: "Classes so far", missedCount: "Missed", watchMissed: "Watch missed classes",
  progressNote: "Counted when you open a class in this portal while it is live.",
  watchNow: "Watch now", toWatch: "To catch up", inPrefix: "in", today: "Today",
  tabUpcoming: "Upcoming", tabMissed: "Missed", tabRec: "Recordings",
  search: "Search topic or teacher", allDays: "Show all days", noneHere: "Nothing here yet.",
  watched: "Watched", joinedOf: "Joined live", allCaught: "All caught up",
  stEnded: "Class ended", joinZoom: "Join on Zoom", joinMeet: "Join on Google Meet", joinLink: "Join the class", liveClass: "Live class",
  noRecording: "This class was held on Zoom / Google Meet, so there is no recording.", joinHint: "Opens in a new tab. Zoom and Google Meet classes are not recorded here.",
  neetJee: "NEET / JEE", neetJeeSub: "Free NEET and JEE preparation: live classes, recordings and study material.", backExam: "‹ NEET / JEE", examNone: "No NEET / JEE classes yet",
  resources: "Study resources", file: "file", files: "files", soon: "Coming soon", yt: "YouTube Live", startsAt: "Starts",
};
type T = typeof en;

const ta: T = {
  greet: "வணக்கம்",
  home: "முகப்பு", materials: "படிப்புப் பொருட்கள்", progress: "என் முன்னேற்றம்", signOut: "வெளியேறு", switchTo: "English",
  liveNow: "நேரலையில்", nextClass: "அடுத்த வகுப்பு", missed: "தவறவிட்ட வகுப்புகள்",
  missedNote: "இந்த வகுப்புகளில் நேரலையில் கலந்துகொள்ளவில்லை. பதிவுகளைப் பார்த்துப் படிக்கவும்.",
  upcoming: "வரவிருக்கும் வகுப்புகள்", recordings: "அனைத்துப் பதிவுகள்",
  stUpcoming: "வரவிருக்கிறது", stLive: "நேரலையில்", stProcessing: "பதிவு விரைவில்", stRecorded: "பதிவு உள்ளது", stMissed: "தவறவிட்டது",
  join: "நேரலையில் பார்க்க", watch: "பதிவைப் பார்க்க", openYT: "YouTube செயலியில் திற (Chat-க்கு)",
  notStarted: "வகுப்பு இன்னும் YouTube-இல் தொடங்கவில்லை. ஆசிரியர் நேரலைக்கு வந்ததும் இங்கே தெரியும்.",
  noLiveLink: "நேரலை இணைப்பு இன்னும் தயாராகவில்லை. ஒரு நிமிடம் கழித்து புதுப்பிக்கவும்.",
  cdPrefix: "இணைய இன்னும்", cdD: " நாள்", cdH: " மணி", cdM: " நிமி", cdOpening: "இப்போது திறக்கிறது…",
  noClasses: "இன்னும் வகுப்புகள் அட்டவணையிடப்படவில்லை. JK சார் சேர்த்ததும் இங்கே தெரியும்.",
  noRecordings: "முடிந்த வகுப்புகளின் பதிவுகள் இங்கே தெரியும்.",
  loadErr: "வகுப்புகளை இப்போது ஏற்ற முடியவில்லை. ஒரு நிமிடம் கழித்து மீண்டும் முயலவும்.",
  back: "‹ அனைத்து வகுப்புகள்", addCal: "Google Calendar-இல் சேர்", notesPdf: "வகுப்புக் குறிப்புகள் (PDF)",
  missedLive: "இந்த வகுப்பை நேரலையில் தவறவிட்டீர்கள். முழுப் பதிவை மேலே பார்க்கவும்.",
  processing: "இந்த வகுப்பு முடிந்தது. JK சார் இணைப்பைச் சேர்த்ததும் பதிவு இங்கே வரும்.",
  play: "பதிவை இயக்கு", dataNote: "மொபைல் டேட்டா செலவாகும். முடிந்தால் Wi-Fi பயன்படுத்தவும்.", openRec: "பதிவைத் திற",
  install: "செயலியாக நிறுவு", iosHint: "iPhone-இல்: Share-ஐத் தட்டி Add to Home Screen-ஐத் தேர்ந்தெடுக்கவும்.",
  all: "அனைத்தும்", tNotes: "குறிப்புகள்", tQB: "வினா வங்கி", tKey: "விடைக் குறிப்பு", tExam: "மாதிரித் தேர்வு",
  noMaterials: "இன்னும் பொருட்கள் இல்லை. வகுப்புகளுக்குப் பிறகு JK சார் சேர்ப்பார்.",
  open: "திற",
  searchMat: "படிப்புப் பொருட்களைத் தேடு", folders: "பாடங்கள்", backAll: "அனைத்துப் பாடங்கள்", noResults: "எதுவும் கிடைக்கவில்லை. வேறு சொல்லில் தேடுங்கள்.", clear: "அழி", showFolders: "அனைத்துப் பாடங்களையும் காட்டு",
  rollNo: "பதிவு எண்", group: "பிரிவு", board: "பாடத்திட்டம்",
  attended: "நேரலையில் கலந்தவை", finished: "இதுவரை வகுப்புகள்", missedCount: "தவறவிட்டவை", watchMissed: "தவறவிட்ட வகுப்புகளைப் பார்க்க",
  progressNote: "நேரலை நேரத்தில் இந்தப் போர்ட்டலில் வகுப்பைத் திறக்கும்போது கணக்கிடப்படும்.",
  watchNow: "இப்போது பார்க்க", toWatch: "பார்க்க வேண்டியவை", inPrefix: "இன்னும்", today: "இன்று",
  tabUpcoming: "வரவிருப்பவை", tabMissed: "தவறவிட்டவை", tabRec: "பதிவுகள்",
  search: "தலைப்பு அல்லது ஆசிரியர் தேடு", allDays: "அனைத்து நாட்களும்", noneHere: "இங்கே இன்னும் எதுவும் இல்லை.",
  watched: "பார்த்தது", joinedOf: "நேரலையில் கலந்தவை", allCaught: "அனைத்தும் பார்த்தாகிவிட்டது",
  stEnded: "வகுப்பு முடிந்தது", joinZoom: "Zoom-இல் சேர", joinMeet: "Google Meet-இல் சேர", joinLink: "வகுப்பில் சேர", liveClass: "நேரலை வகுப்பு",
  noRecording: "இந்த வகுப்பு Zoom / Google Meet-இல் நடந்தது, எனவே பதிவு இல்லை.", joinHint: "புதிய தாவலில் திறக்கும். Zoom, Google Meet வகுப்புகள் இங்கே பதிவு செய்யப்படாது.",
  neetJee: "NEET / JEE", neetJeeSub: "இலவச NEET, JEE தயாரிப்பு: நேரலை வகுப்புகள், பதிவுகள், படிப்புப் பொருட்கள்.", backExam: "‹ NEET / JEE", examNone: "NEET / JEE வகுப்புகள் இன்னும் இல்லை",
  resources: "படிப்பு வளங்கள்", file: "கோப்பு", files: "கோப்புகள்", soon: "விரைவில்", yt: "YouTube நேரலை", startsAt: "தொடக்கம்",
};

export const STR: Record<Lang, T> = { en, ta };
export type Strings = T;

export async function getT() {
  const lang: Lang = (await cookies()).get(LANG_COOKIE)?.value === "ta" ? "ta" : "en";
  return { lang, t: STR[lang] };
}
