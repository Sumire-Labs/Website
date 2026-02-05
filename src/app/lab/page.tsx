import Image from "next/image";
import {
  getOrganization,
  getRepositories,
  getRecentActivity,
} from "@/lib/github";
import { RepoCard } from "@/components/lab/RepoCard";
import { ActivityItem } from "@/components/lab/ActivityItem";

const members = [
  { name: "Hag/Gha", image: "/images/members/hag.png" },
  { name: "Hayatea", image: "/images/members/hayatea.png" },
  { name: "Nameco", image: "/images/members/nameco.png" },
  { name: "Pepeyukke", image: "/images/members/pepeyukke.png" },
  { name: "Mugiwo", image: "/images/members/mugiwo.png" },
];

const pinnedRepoNames = ["Celeritas-Extra", "Website", "SumireBOT", "SumireVoxBot"];

export default async function LabPage() {
  const [org, repos, activity] = await Promise.all([
    getOrganization(),
    getRepositories(),
    getRecentActivity(),
  ]);

  // ピン止めリポジトリをフィルタリング
  const pinnedRepos = repos.filter((repo) => pinnedRepoNames.includes(repo.name));
  const otherRepos = repos.filter((repo) => !pinnedRepoNames.includes(repo.name));

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Sumire Labs
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {org?.description || "GitHub 組織の公開プロジェクト"}
          </p>
          {org && (
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[var(--muted-foreground)]">
              <span>{org.public_repos} リポジトリ</span>
              <span>{org.followers} フォロワー</span>
            </div>
          )}
        </div>

        {/* Pinned Repositories */}
        {pinnedRepos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.08 3.08 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 10l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L10 11.06l-2.204 2.205c-.968.968-2.623.5-2.94-.832l-.584-2.454a3.08 3.08 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826Z" />
              </svg>
              Pinned
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </section>
        )}

        {/* Other Repositories */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Repositories</h2>
          {otherRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-[var(--muted-foreground)]">
              リポジトリが見つかりませんでした
            </div>
          )}
        </section>

        {/* Members */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Members</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {members.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:bg-[var(--bg-glass)] hover:scale-105"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border-glass)] bg-[var(--bg-glass)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{member.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          {activity.length > 0 ? (
            <div className="glass-card p-2">
              <div className="divide-y divide-[var(--border-glass)]">
                {activity.map((event) => (
                  <ActivityItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-[var(--muted-foreground)]">
              最近の活動はありません
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
