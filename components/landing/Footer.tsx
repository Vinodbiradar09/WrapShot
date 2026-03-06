export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="font-display font-bold text-sm text-foreground">
          WrapShot
        </span>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} WrapShot
        </p>
      </div>
    </footer>
  );
}
