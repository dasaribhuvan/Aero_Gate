import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const BiometricIllustration = () => {
  const [scanAngle, setScanAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-breathe" />
      {/* Mid ring rotating */}
      <div
        className="absolute inset-4 rounded-full border-2 border-transparent border-t-primary/60 border-r-primary/30"
        style={{ transform: `rotate(${scanAngle}deg)` }}
      />
      {/* Inner ring counter-rotating */}
      <div
        className="absolute inset-10 rounded-full border border-transparent border-b-primary/40 border-l-primary/20"
        style={{ transform: `rotate(${-scanAngle * 0.7}deg)` }}
      />
      {/* Center face placeholder */}
      <div className="absolute inset-16 md:inset-20 rounded-full bg-secondary/40 backdrop-blur-sm border border-border/30 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Face silhouette */}
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 text-primary/30">
            <ellipse cx="50" cy="40" rx="22" ry="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="50" cy="85" rx="35" ry="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="42" cy="36" r="3" fill="currentColor" opacity="0.4" />
            <circle cx="58" cy="36" r="3" fill="currentColor" opacity="0.4" />
          </svg>
          {/* Scan line */}
          <div className="absolute inset-0 scan-line" />
        </div>
      </div>
      {/* Corner markers */}
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 border-primary/50 ${cls}`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
      {/* Floating data points */}
      <div className="absolute -right-4 top-1/4 font-body text-xs text-primary/50 tracking-wider animate-float">
        ID:SCAN
      </div>
      <div className="absolute -left-8 bottom-1/3 font-body text-xs text-primary/50 tracking-wider animate-float delay-300">
        BIO:READY
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      {/* Diagonal split background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 diagonal-clip-left bg-gradient-to-br from-background via-background to-graphite" />
        <div className="absolute inset-0 diagonal-clip-right bg-gradient-to-bl from-graphite-light/50 via-background to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 pt-24 gap-12 lg:gap-0">
        {/* Left: Typography */}
        <div className="flex-1 max-w-2xl animate-slide-left">
          <div className="font-body text-sm tracking-[0.4em] text-muted-foreground mb-4 uppercase">
            Premium Lounge Access
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 relative">
            <span className="block text-foreground">BIOMETRIC</span>
            <span className="block neon-text relative">
              VERIFICATION
              {/* Light beam */}
              <span className="absolute inset-0 overflow-hidden pointer-events-none">
                <span className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-light-beam" />
              </span>
            </span>
            <span className="block text-foreground/60 text-3xl md:text-4xl lg:text-5xl mt-2">PLATFORM</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
            Next-generation AI-powered identity verification for exclusive airport lounges.
            Seamless. Secure. Instantaneous.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/verify">
              <button className="btn-neon relative" onClick={handleCTAClick}>
                {ripple && (
                  <span
                    className="absolute rounded-full bg-foreground/30 pointer-events-none"
                    style={{
                      left: ripple.x - 10,
                      top: ripple.y - 10,
                      width: 20,
                      height: 20,
                      animation: "ripple 0.6s ease-out forwards",
                    }}
                  />
                )}
                BEGIN SCAN
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-ghost-neon">REGISTER</button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-12 flex gap-8 font-body">
            {[
              { value: "99.7%", label: "ACCURACY" },
              { value: "<0.3s", label: "SCAN TIME" },
              { value: "256-BIT", label: "ENCRYPTION" },
            ].map((stat) => (
              <div key={stat.label} className="animate-slide-up opacity-0 animate-fade-delayed">
                <div className="text-2xl font-semibold neon-text-subtle">{stat.value}</div>
                <div className="text-xs tracking-[0.2em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Biometric illustration */}
        <div className="flex-1 flex items-center justify-center animate-slide-right">
          <BiometricIllustration />
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-4 left-8 font-body text-xs text-muted-foreground/40 tracking-[0.3em]">
        AEROGATE v2.1 // TERMINAL ACTIVE
      </div>
      <div className="absolute bottom-4 right-8 font-body text-xs text-muted-foreground/40 tracking-[0.3em]">
        {new Date().toISOString().split("T")[0]}
      </div>
    </main>
  );
};

export default LandingPage;
