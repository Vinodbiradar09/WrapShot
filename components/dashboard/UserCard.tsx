import { Props } from "@/app/types/types";
import Image from "next/image";
export default function UserCard({ username, avatarUrl }: Props) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={username}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-display font-bold text-sm text-muted-foreground">
          {username[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-display font-semibold text-sm text-foreground truncate">
          {username}
        </p>
        <p className="font-mono text-xs text-muted-foreground">@{username}</p>
      </div>
    </div>
  );
}
