export type VideoKind = "video" | "short";

export type ChannelBrief = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
};

export type VideoItem = {
  id: string;
  title: string;
  description: string | null;
  thumbPath: string;
  videoPath: string;
  kind: VideoKind;
  durationSec: number;
  allowComments: boolean;
  views: number;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  uploader: ChannelBrief;
};

export type CommentItem = {
  id: string;
  body: string;
  createdAt: string;
  author: ChannelBrief;
};

export type VideoDetail = VideoItem & {
  likedByMe: boolean;
  subscribedByMe: boolean;
  subscriberCount: number;
  comments: CommentItem[];
};

export type Me = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  points: number;
  videoCount: number;
};

export type ChannelInfo = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  points: number;
  subscriberCount: number;
  subscribedByMe: boolean;
  videoCount: number;
  videos: VideoItem[];
};

export type SubscribedChannel = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
};

export type LessonItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  durationMin: number;
};

export type QuizSummary = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  bestScore: number | null;
};

export type SectionItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  quizzes: QuizSummary[];
  lessons: LessonItem[];
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
};

export type QuizData = {
  id: string;
  title: string;
  description: string;
  subject: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  total: number;
  questions: QuizQuestion[];
};

export type QuizResult = {
  score: number;
  total: number;
  pointsEarned: number;
  userPoints: number;
  correctIndexes: number[];
  bestScore: number;
};

export type LeaderEntry = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  points: number;
  videoCount: number;
  isMe: boolean;
};

export type LeaderMe = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  points: number;
  videoCount: number;
  isMe: boolean;
  rank: number;
};

export type SearchUser = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  points: number;
  videoCount: number;
};

export type SearchData = {
  users: SearchUser[];
  videos: VideoItem[];
};

export const MAX_SHORT_SEC = 80;

/* ---------- Chat ---------- */

export type ChatLang = "en" | "ru" | "uz";

export type ChatProfileItem = {
  deviceKey: string;
  name: string;
  emoji: string;
  color: string;
  bio: string;
  online: boolean;
  lastSeenAt: string;
};

export type ChatMessageItem = {
  id: string;
  kind: "text" | "sticker" | "image" | "system";
  content: string;
  mine: boolean;
  createdAt: string;
};

export type ChatConversationItem = {
  id: string;
  isRandom: boolean;
  ended: boolean;
  partner: ChatProfileItem | null;
  lastMessage: {
    kind: ChatMessageItem["kind"];
    content: string;
    mine: boolean;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
};

export type ChatNotificationItem = {
  conversationId: string;
  senderName: string;
  senderEmoji: string;
  senderColor: string;
  preview: string;
  createdAt: string;
};
