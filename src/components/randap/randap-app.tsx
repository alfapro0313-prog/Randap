"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Sidebar, type ViewName } from "./sidebar";
import { Header } from "./header";
import { VideoCard, VideoGrid } from "./video-card";
import { WatchView } from "./watch";
import { ShortsView } from "./shorts";
import { UploadView } from "./upload";
import { ProfileView } from "./profile";
import { ChannelView } from "./channel";
import { SectionsGrid, SectionDetail } from "./sections";
import { OrganishView, TopicDetailView } from "./organish";
import { QuizView } from "./quiz";
import { LessonView } from "./lesson";
import { BallarView } from "./ballar";
import { SearchView } from "./search";
import { PortalView } from "./portal";
import { useDeviceMe } from "@/lib/randap-client";
import type {
  ChannelInfo,
  LessonItem,
  Me,
  SectionItem,
  SubscribedChannel,
  VideoItem,
} from "@/lib/randap-types";

type Feed = {
  videos: VideoItem[];
  shorts: VideoItem[];
  loading: boolean;
};

export function RandapApp() {
  const { deviceKey, me, setMe } = useDeviceMe();
  const [view, setView] = useState<ViewName>("portal");
  const [videoId, setVideoId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [feed, setFeed] = useState<Feed>({ videos: [], shorts: [], loading: true });
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [sections, setSections] = useState<SectionItem[] | null>(null);
  const [subs, setSubs] = useState<SubscribedChannel[]>([]);
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [topicId, setTopicId] = useState("");
  const [quizId, setQuizId] = useState("");
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      const [videosRes, shortsRes] = await Promise.all([
        fetch("/api/videos?kind=video&limit=60"),
        fetch("/api/videos?kind=short&limit=60"),
      ]);
      const videosData = await videosRes.json();
      const shortsData = await shortsRes.json();
      setFeed({
        videos: videosData.ok ? (videosData.videos ?? []) : [],
        shorts: shortsData.ok ? (shortsData.videos ?? []) : [],
        loading: false,
      });
    } catch {
      setFeed({ videos: [], shorts: [], loading: false });
    }
  }, []);

  const loadFeed = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setFeed((prev) => ({ ...prev, loading: true }));
      }
      await fetchFeed();
    },
    [fetchFeed]
  );

  const fetchSections = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setSections(null);
      const res = await fetch("/api/sections");
      const data = await res.json();
      if (data.ok) setSections(data.sections as SectionItem[]);
    } catch {
      // ignore
    }
  }, []);

  const fetchSubs = useCallback(async () => {
    try {
      if (!deviceKey) return;
      const res = await fetch(
        `/api/subscriptions?deviceId=${encodeURIComponent(deviceKey)}`
      );
      const data = await res.json();
      if (data.ok) setSubs(data.channels as SubscribedChannel[]);
    } catch {
      // ignore
    }
  }, [deviceKey]);

  useEffect(() => {
    const t = window.setTimeout(() => void fetchFeed(), 0);
    return () => window.clearTimeout(t);
  }, [fetchFeed]);

  useEffect(() => {
    const t = window.setTimeout(() => void fetchSections(), 0);
    return () => window.clearTimeout(t);
  }, [fetchSections]);

  useEffect(() => {
    const t = window.setTimeout(() => void fetchSubs(), 0);
    return () => window.clearTimeout(t);
  }, [fetchSubs]);

  const loadChannel = useCallback(
    async (id: string) => {
      setChannel(null);
      try {
        const res = await fetch(
          `/api/channel?id=${encodeURIComponent(id)}&deviceKey=${encodeURIComponent(deviceKey)}`
        );
        const data = await res.json();
        if (data.ok) setChannel(data.channel as ChannelInfo);
      } catch {
        // ignore
      }
    },
    [deviceKey]
  );

  const refreshMe = useCallback(() => {
    fetch(`/api/me?deviceKey=${encodeURIComponent(deviceKey)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.ok) setMe(data.me as Me);
      })
      .catch(() => undefined);
  }, [deviceKey, setMe]);

  const navigate = useCallback(
    (next: ViewName) => {
      setView(next);
      window.scrollTo({ top: 0 });
      if (
        next === "subs" ||
        next === "portal" ||
        next === "home" ||
        next === "videos" ||
        next === "shorts"
      ) {
        void loadFeed(true);
      }
      if (next === "portal" || next === "home" || next === "sections") {
        void fetchSections();
      }
      if (next === "profile") {
        refreshMe();
        void loadFeed(true);
      }
      if (next === "ballar") {
        // BallarView o'zi yuklaydi
      }
    },
    [fetchSections, loadFeed, refreshMe]
  );

  const openVideo = useCallback(
    (video: VideoItem) => {
      setVideoId(video.id);
      setView("watch");
      window.scrollTo({ top: 0 });
    },
    []
  );

  const openVideoId = useCallback((id: string) => {
    setVideoId(id);
    setView("watch");
    window.scrollTo({ top: 0 });
  }, []);

  const openChannel = useCallback(
    (id: string) => {
      setChannelId(id);
      setView("channel");
      loadChannel(id);
      window.scrollTo({ top: 0 });
    },
    [loadChannel]
  );

  const openSection = useCallback(
    (section: SectionItem) => {
      setCurrentSection(section);
      setView("section");
      window.scrollTo({ top: 0 });
    },
    []
  );

  const openQuiz = useCallback((id: string) => {
    setQuizId(id);
    setView("quiz");
    window.scrollTo({ top: 0 });
  }, []);

  const openTopic = useCallback((id: string) => {
    setTopicId(id);
    setView("organishTopic");
    window.scrollTo({ top: 0 });
  }, []);

  const openLesson = useCallback(
    (lessonId: string) => {
      if (!currentSection) return;
      const lesson = currentSection.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setView("lesson");
        window.scrollTo({ top: 0 });
      }
    },
    [currentSection]
  );

  const search = useCallback((q: string) => {
    setSearchQuery(q);
    setView("search");
    window.scrollTo({ top: 0 });
  }, []);

  const refreshSubs = useCallback(() => {
    void fetchSubs();
  }, [fetchSubs]);

  async function toggleChannelSubscribe() {
    if (!channel) return;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: channel.id, deviceId: deviceKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setChannel((prev) =>
          prev
            ? {
                ...prev,
                subscribedByMe: data.subscribed,
                subscriberCount: data.count,
              }
            : prev
        );
        refreshSubs();
        toast({
          title: data.subscribed
            ? `${channel.name} kanaliga obuna bo'ldingiz`
            : "Obuna bekor qilindi",
        });
      } else {
        toast({ title: "Xatolik", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Xatolik", description: "Qayta urinib ko'ring", variant: "destructive" });
    }
  }

  async function renameMe(name: string): Promise<boolean> {
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, name }),
      });
      const data = await res.json();
      if (data.ok) {
        setMe(data.me as Me);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async function uploadAvatar(file: File): Promise<boolean> {
    try {
      const form = new FormData();
      form.set("deviceKey", deviceKey);
      form.set("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: form });
      const data = await res.json();
      if (data.ok) {
        setMe((prev) =>
          prev ? { ...prev, avatar: data.avatar as string } : prev
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  const myVideos = me ? feed.videos.filter((v) => v.uploader.id === me.id) : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <Sidebar
          view={view}
          onNavigate={navigate}
          me={me}
          watchKind={
            feed.videos.find((v) => v.id === videoId)?.kind ??
            feed.shorts.find((v) => v.id === videoId)?.kind
          }
          subs={subs}
          onOpenChannel={openChannel}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            me={me}
            initialQuery={searchQuery}
            onSearch={search}
            onNavigate={navigate}
            onOpenChannel={openChannel}
            onOpenVideo={openVideoId}
          />

          <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 md:pb-8 md:pl-6 lg:px-8">
            {view === "portal" ? (
              <PortalView
                videosCount={feed.videos.length}
                shortsCount={feed.shorts.length}
                sections={sections ?? []}
                loading={feed.loading || sections === null}
                onEnterVideos={() => navigate("home")}
                onEnterTests={() => navigate("sections")}
                onEnterOrganish={() => navigate("organish")}
                onOpenBallar={() => navigate("ballar")}
              />
            ) : null}

            {view === "home" ? (
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">
                      Hozirgi videolar
                    </h2>
                    <button
                      onClick={() => navigate("videos")}
                      className="flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Barchasi
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <VideoGrid
                    videos={feed.videos}
                    loading={feed.loading}
                    onOpen={openVideo}
                    onOpenChannel={openChannel}
                    emptyText="Hozircha video yo'q. Chap menyudagi + tugmasi bilan birinchisini yuklang."
                  />
                </div>

                {feed.shorts.length > 0 ? (
                  <section aria-label="Shorts tanlovi" className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-foreground">Shorts</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                      {feed.shorts.slice(0, 12).map((short) => (
                        <div key={short.id} className="w-44 shrink-0">
                          <VideoCard
                            video={short}
                            onOpen={openVideo}
                            onOpenChannel={openChannel}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : null}

            {view === "videos" ? (
              <div className="flex flex-col gap-5">
                <h1 className="text-lg font-bold text-foreground">
                  Videos — barcha videolar
                </h1>
                <VideoGrid
                  videos={feed.videos}
                  loading={feed.loading}
                  onOpen={openVideo}
                  onOpenChannel={openChannel}
                  emptyText="Videos bo'limi hozircha bo'sh. + tugmasi bilan video yuklang."
                />
              </div>
            ) : null}

            {view === "shorts" ? (
              <ShortsView
                shorts={feed.shorts}
                loading={feed.loading}
                deviceKey={deviceKey}
                onBack={() => navigate("home")}
                onOpenChannel={openChannel}
                onOpenWatch={openVideoId}
              />
            ) : null}

            {view === "subs" ? (
              <SubsFeed deviceKey={deviceKey} onOpen={openVideo} onOpenChannel={openChannel} />
            ) : null}

            {view === "search" ? (
              <SearchView
                query={searchQuery}
                onOpen={openVideo}
                onOpenChannel={openChannel}
              />
            ) : null}

            {view === "sections" ? (
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold text-foreground">
                      Testlar — hamma fanlar
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Fan tanlang, testlarni yechib ball to&apos;plang
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("ballar")}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    <Trophy className="size-3.5" aria-hidden="true" />
                    Ballar
                  </button>
                </div>
                <SectionsGrid
                  sections={sections ?? []}
                  loading={sections === null}
                  onOpen={openSection}
                  columns={2}
                />
              </div>
            ) : null}

            {view === "section" ? (
              <SectionDetail
                subject={currentSection}
                loading={!currentSection}
                onBack={() => navigate("sections")}
                onStartQuiz={openQuiz}
                onOpenLesson={openLesson}
              />
            ) : null}

            {view === "quiz" ? (
              <QuizView
                quizId={quizId}
                deviceKey={deviceKey}
                onBack={() => {
                  void fetchSections();
                  navigate("sections");
                }}
                onFinished={() => {
                  refreshMe();
                  void fetchSections();
                }}
              />
            ) : null}

            {view === "lesson" ? (
              <LessonView
                lesson={currentLesson}
                subject={currentSection}
                onBack={() => navigate("section")}
                onNextLesson={openLesson}
              />
            ) : null}

            {view === "organish" ? (
              <OrganishView onOpenTopic={openTopic} />
            ) : null}

            {view === "organishTopic" ? (
              <TopicDetailView
                topicId={topicId}
                onBack={() => navigate("organish")}
              />
            ) : null}

            {view === "ballar" ? <BallarView deviceKey={deviceKey} /> : null}

            {view === "watch" ? (
              <WatchView
                videoId={videoId}
                deviceKey={deviceKey}
                onBack={() => navigate("home")}
                onOpenChannel={openChannel}
                onLikeChanged={loadFeed}
                onSubscribedChanged={refreshSubs}
              />
            ) : null}

            {view === "upload" ? (
              <UploadView
                deviceKey={deviceKey}
                onBack={() => navigate("home")}
                onUploaded={(id) => {
                  refreshMe();
                  setVideoId(id);
                  setView("watch");
                  loadFeed();
                  window.scrollTo({ top: 0 });
                }}
              />
            ) : null}

            {view === "profile" ? (
              <ProfileView
                me={me}
                deviceKey={deviceKey}
                videos={myVideos}
                loading={feed.loading}
                onRename={renameMe}
                onAvatarUpload={uploadAvatar}
                onOpen={openVideo}
                onOpenChannel={openChannel}
                onNavigateUpload={() => navigate("upload")}
                onNavigateBallar={() => navigate("ballar")}
              />
            ) : null}

            {view === "channel" ? (
              <ChannelView
                channel={channel}
                loading={!channel}
                deviceKey={deviceKey}
                onSubscribe={toggleChannelSubscribe}
                onOpen={openVideo}
                onOpenChannel={openChannel}
                onBack={() => navigate("home")}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

function SubsFeed({
  deviceKey,
  onOpen,
  onOpenChannel,
}: {
  deviceKey: string;
  onOpen: (video: VideoItem) => void;
  onOpenChannel: (uploaderId: string) => void;
}) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(
      `/api/videos?subscribedOnly=1&deviceId=${encodeURIComponent(deviceKey)}&limit=60`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setVideos(data.ok ? data.videos : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [deviceKey]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-bold text-foreground">
        Obuna bo&apos;lgan kanallar videolari
      </h1>
      <VideoGrid
        videos={videos}
        loading={loading}
        onOpen={onOpen}
        onOpenChannel={onOpenChannel}
        emptyText="Hozircha obuna yo'q. Video ko'rib, kanalga obuna bo'ling — bu yerda yangi videolari chiqadi."
      />
    </div>
  );
}
