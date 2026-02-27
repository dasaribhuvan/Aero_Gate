import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "HOME" },
  { path: "/verify", label: "VERIFY" },
  { path: "/register", label: "REGISTER" },
  { path: "/logs", label: "LOGS" },
];

const TopNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded border border-primary/60 flex items-center justify-center relative overflow-hidden">
          <div className="w-3 h-3 bg-primary rounded-sm" />
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300" />
        </div>
        <span className="font-display text-sm tracking-[0.3em] neon-text-subtle">AEROGATE</span>
      </Link>

      {/* Links */}
      <div className="glass-panel px-2 py-1 flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded font-display text-xs tracking-[0.15em] transition-all duration-300 ${
              pathname === item.path
                ? "text-primary bg-primary/10 shadow-[0_0_15px_hsl(152_100%_50%/0.15)]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
        <span className="font-body text-sm text-muted-foreground tracking-wider">SYSTEM ONLINE</span>
      </div>
    </nav>
  );
};

export default TopNav;
