import { cn } from "@/lib/utils";

type AvatarBubbleProps = {
  name: string;
  avatar?: string | null;
  className?: string;
};

/**
 * Foydalanuvchi avatarini ko'rsatadi.
 * Rasm bo'lmasa — ismning birinchi harfi (doira ichida) chiqadi.
 */
export function AvatarBubble({ name, avatar, className }: AvatarBubbleProps) {
  if (avatar) {
    return (
      <img
        src={avatar.startsWith("http") ? avatar : `/${avatar.replace(/^\//, "")}`}
        alt={`${name} avatari`}
        loading="lazy"
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-label={`${name} avatari`}
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground",
        className
      )}
    >
      {name.trim().slice(0, 1).toUpperCase() || "?"}
    </span>
  );
}
