import Image from "next/image";
import { GitHubMember } from "@/lib/github";

interface MemberCardProps {
  member: GitHubMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <a
      href={member.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 hover:bg-[var(--bg-glass)] hover:scale-105"
    >
      <Image
        src={member.avatar_url}
        alt={member.login}
        width={56}
        height={56}
        className="rounded-full border-2 border-[var(--border-glass)]"
      />
      <span className="text-sm font-medium truncate max-w-[80px]">
        {member.login}
      </span>
    </a>
  );
}
