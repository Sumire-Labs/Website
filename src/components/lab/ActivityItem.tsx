import Image from "next/image";
import { GitHubEvent, getEventDescription, getRelativeTime } from "@/lib/github";

interface ActivityItemProps {
  event: GitHubEvent;
}

export function ActivityItem({ event }: ActivityItemProps) {
  const description = getEventDescription(event);

  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-[var(--bg-glass)]">
      <Image
        src={event.actor.avatar_url}
        alt={event.actor.login}
        width={36}
        height={36}
        className="rounded-full shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{event.actor.login}</span>
          <span className="text-[var(--muted-foreground)]"> が </span>
          <span className="text-[var(--muted-foreground)]">{description}</span>
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {getRelativeTime(event.created_at)}
        </p>
      </div>
    </div>
  );
}
