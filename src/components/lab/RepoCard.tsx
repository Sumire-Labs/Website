import { GitHubRepo, getRelativeTime } from "@/lib/github";

// 言語カラー（GitHubの言語カラーを参考）
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#239120",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Lua: "#000080",
  Zig: "#ec915c",
};

function getLanguageColor(language: string): string {
  return languageColors[language] || "#8b8b8b";
}

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const langColor = repo.language ? getLanguageColor(repo.language) : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-5 block transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-base truncate">{repo.name}</h3>
        {repo.language && langColor && (
          <span
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full shrink-0"
            style={{
              backgroundColor: `${langColor}20`,
              color: langColor,
              border: `1px solid ${langColor}40`
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {repo.forks_count}
        </span>
        <span className="ml-auto">{getRelativeTime(repo.updated_at)}</span>
      </div>
    </a>
  );
}
