export type VideoKind = "video" | "short";

export type ChannelBrief = {
  id: string;
  name: string;
  handle: string;
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
  comments: CommentItem[];
};

export type Me = {
  id: string;
  name: string;
  handle: string;
  videoCount: number;
};

export type ChannelInfo = {
  id: string;
  name: string;
  handle: string;
  subscriberCount: number;
  subscribedByMe: boolean;
  videoCount: number;
  videos: VideoItem[];
};

export const MAX_SHORT_SEC = 80;
