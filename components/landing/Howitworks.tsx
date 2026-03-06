const STEPS = [
  {
    n: "01",
    title: "Connect GitHub",
    desc: "Sign in with GitHub OAuth. Read-only — we never see your code.",
  },
  {
    n: "02",
    title: "Pick your years",
    desc: "Choose which years to import. We sync commits, PRs, and issues.",
  },
  {
    n: "03",
    title: "Get your Wrapped",
    desc: "Full year breakdown with AI insights and a shareable card.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 pb-24 border-t border-border">
      <div className="max-w-5xl mx-auto pt-16">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          How it works
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground mb-12">
          Three steps. Done.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n}>
              <span className="font-mono text-xs text-primary block mb-3">
                {n}
              </span>
              <p className="font-display font-semibold text-sm text-foreground mb-2">
                {title}
              </p>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
