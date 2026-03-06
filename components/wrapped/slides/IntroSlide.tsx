import Image from "next/image";
import { WrappedData } from "@/app/types/types";

export default function IntroSlide({ data }: { data: WrappedData }) {
  return (
    <div className="slide flex flex-col items-center justify-center bg-background gap-6 text-center px-6">
      {data.avatarUrl && (
        <Image
          src={data.avatarUrl}
          alt={data.username}
          width={72}
          height={72}
          className="rounded-full border border-border"
        />
      )}
      <div>
        <p className="font-mono text-xs text-muted-foreground mb-2 uppercase tracking-widest">
          GitHub Wrapped
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight">
          @{data.username}
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          {data.year} in review
        </p>
      </div>
      <p className="font-mono text-xs text-muted-foreground animate-bounce mt-8">
        scroll to explore ↓
      </p>
    </div>
  );
}
