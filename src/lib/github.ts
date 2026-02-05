const ORG_NAME = "Sumire-Labs";
const GITHUB_API = "https://api.github.com";

// 1時間キャッシュ（レート制限対策）
const CACHE_OPTIONS = { next: { revalidate: 3600 } };

export interface GitHubOrg {
  login: string;
  name: string;
  description: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface GitHubMember {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  payload: {
    commits?: { message: string }[];
    size?: number;
    action?: string;
    ref?: string;
    ref_type?: string;
  };
  created_at: string;
}

// 組織情報を取得
export async function getOrganization(): Promise<GitHubOrg | null> {
  try {
    const res = await fetch(`${GITHUB_API}/orgs/${ORG_NAME}`, CACHE_OPTIONS);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// リポジトリ一覧を取得
export async function getRepositories(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/orgs/${ORG_NAME}/repos?sort=updated&per_page=20`,
      CACHE_OPTIONS
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// メンバー一覧を取得
export async function getMembers(): Promise<GitHubMember[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/orgs/${ORG_NAME}/members`,
      CACHE_OPTIONS
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// 最近の活動を取得
export async function getRecentActivity(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/orgs/${ORG_NAME}/events?per_page=10`,
      CACHE_OPTIONS
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// イベントタイプを日本語に変換
export function getEventDescription(event: GitHubEvent): string {
  const repoName = event.repo.name.split("/")[1];

  switch (event.type) {
    case "PushEvent":
      const commits = event.payload.size || event.payload.commits?.length || 1;
      return `${repoName} に ${commits} 件のコミットをプッシュ`;
    case "CreateEvent":
      if (event.payload.ref_type === "repository") {
        return `リポジトリ ${repoName} を作成`;
      }
      return `${repoName} に ${event.payload.ref_type} "${event.payload.ref}" を作成`;
    case "DeleteEvent":
      return `${repoName} の ${event.payload.ref_type} "${event.payload.ref}" を削除`;
    case "IssuesEvent":
      return `${repoName} の Issue を ${event.payload.action}`;
    case "PullRequestEvent":
      return `${repoName} の PR を ${event.payload.action}`;
    case "WatchEvent":
      return `${repoName} にスターを付けた`;
    case "ForkEvent":
      return `${repoName} をフォーク`;
    case "ReleaseEvent":
      return `${repoName} の新しいリリースを ${event.payload.action}`;
    default:
      return `${repoName} で活動`;
  }
}

// 相対時間を取得
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "たった今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP");
}
