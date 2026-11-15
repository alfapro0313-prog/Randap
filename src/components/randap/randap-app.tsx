"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Sidebar, type ViewName } from "./sidebar";
import { Header } from "./header";
import { VideoCard, VideoGrid } from "./video-card";
import { WatchView } from "./watch";
import { ShortsView } from "./shorts";
import { UploadView } from "./upload";
import { ProfileView } from "./profile";
import { ChannelView } from "./channel";
import { useDeviceMe } from "@/lib/randap-client";
import type { ChannelInfo, Me, VideoItem } from "@/lib/randap-types";

type Feed = {
  videos: VideoItem[];
  shorts: VideoItem[];
  loading: boolean;
};

export function RandapApp() {
  const { deviceKey, me, setMe } = useDeviceMe();
  const [view, setView] = useState<ViewName>("home");
  const [videoId, setVideoId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [query, setQuery] = useState("");
  const [feed, setFeed] = useState<Feed>({ videos: [], shorts: [], loading: true });
  const [channel, setChannel] = useState<ChannelInfo | null>(null);

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

  useEffect(() => {
    const t = window.setTimeout(() => void fetchFeed(), 0);
    return () => window.clearTimeout(t);
  }, [fetchFeed]);

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
      setQuery("");
      window.scrollTo({ top: 0 });
      if (next === "subs" || next === "home" || next === "videos" || next === "shorts") {
        void loadFeed(true);
      }
      if (next === "profile") {
        refreshMe();
        void loadFeed(true);
      }
      if (next === "channel" && channelId) {
        loadChannel(channelId);
      }
    },
    [channelId, loadChannel, loadFeed, refreshMe]
  );

  const openVideo = useCallback(
    (video: VideoItem) => {
      setVideoId(video.id);
      setView("watch");
      window.scrollTo({ top: 0 });
    },
    []
  );

  const openChannel = useCallback(
    (id: string) => {
      setChannelId(id);
      setView("channel");
      loadChannel(id);
      window.scrollTo({ top: 0 });
    },
    [loadChannel]
  );

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

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      setFeed((prev) => ({ ...prev, loading: true }));
      fetch(`/api/videos?kind=all&q=${encodeURIComponent(q)}&limit=60`)
        .then((r) => r.json())
        .then((data) => {
          setFeed({
            videos: data.ok ? data.videos : [],
            shorts: [],
            loading: false,
          });
          setView("videos");
          window.scrollTo({ top: 0 });
        })
        .catch(() => setFeed((prev) => ({ ...prev, loading: false })));
    },
    []
  );

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
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            me={me}
            initialQuery={query}
            onSearch={search}
            onNavigate={navigate}
          />

          <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 md:pb-8 md:pl-6 lg:px-8">
            {view === "home" ? (
              <div className="flex flex-col gap-8">
                <VideoGrid
                  videos={feed.videos}
                  loading={feed.loading}
                  onOpen={openVideo}
                  onOpenChannel={openChannel}
                  emptyText="Hozircha video yo'q. Chap menyudagi + tugmasi bilan birinchisini yuklang."
                />

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
                  {query ? `Qidiruv: "${query}"` : "Videos — barcha videolar"}
                </h1>
                <VideoGrid
                  videos={feed.videos}
                  loading={feed.loading}
                  onOpen={openVideo}
                  onOpenChannel={openChannel}
                  emptyText={
                    query
                      ? `"${query}" bo'yicha natija topilmadi.`
                      : "Videos bo'limi hozircha bo'sh. + tugmasi bilan video yuklang."
                  }
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
                onOpenWatch={(id) => {
                  setVideoId(id);
                  setView("watch");
                  window.scrollTo({ top: 0 });
                }}
              />
            ) : null}

            {view === "subs" ? (
              <SubsFeed deviceKey={deviceKey} onOpen={openVideo} onOpenChannel={openChannel} />
            ) : null}

            {view === "watch" ? (
              <WatchView
                videoId={videoId}
                deviceKey={deviceKey}
                onBack={() => navigate("home")}
                onOpenChannel={openChannel}
                onLikeChanged={loadFeed}
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
                onOpen={openVideo}
                onOpenChannel={openChannel}
                onNavigateUpload={() => navigate("upload")}
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
