import { cn } from "@/lib/utils";
import { CHAT_AVATAR_COLORS } from "@/lib/chat-i18n";

type ChatAvatarProps = {
  emoji: string;
  color: string;
  name: string;
  /** Do'kondan olingan avatar rasmi (data URL) — bo'lsa rasm ko'rsatiladi */
  image?: string | null;
  className?: string;
  emojiClassName?: string;
  online?: boolean;
};

/** Chat avatari — rasm (agar bo'lsa) yoki emoji + rangli doira (ixtiyoriy online nuqta) */
export function ChatAvatar({
  emoji,
  color,
  name,
  image,
  className,
  emojiClassName,
  online,
}: ChatAvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {image ? (
        <img
          src={image}
          alt={`${name} avatari`}
          className="size-full select-none rounded-full object-cover"
        />
      ) : (
        <span
          aria-label={`${name} avatari`}
          className={cn(
            "flex size-full select-none items-center justify-center rounded-full",
            CHAT_AVATAR_COLORS[color] ?? CHAT_AVATAR_COLORS.sky
          )}
        >
          <span className={cn("leading-none", emojiClassName ?? "text-lg")}>{emoji}</span>
        </span>
      )}
      {online !== undefined ? (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-[35%] rounded-full border-2 border-card",
            online ? "bg-emerald-500" : "bg-muted-foreground/40"
          )}
        />
      ) : null}
    </span>
  );
}
