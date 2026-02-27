import { useState, useEffect, useCallback } from "react";

type VerifyStatus = "waiting" | "verifying" | "granted" | "denied";

const STATUS_CONFIG = {
  waiting: { label: "AWAITING SCAN", color: "text-neon-blue", ringColor: "border-neon-blue/40", bgGlow: "shadow-[0_0_60px_hsl(200_100%_50%/0.1)]" },
  verifying: { label: "VERIFYING IDENTITY", color: "neon-text", ringColor: "border-primary/60", bgGlow: "shadow-[0_0_60px_hsl(152_100%_50%/0.15)]" },
  granted: { label: "ACCESS GRANTED", color: "neon-text", ringColor: "border-primary", bgGlow: "shadow-[0_0_100px_hsl(152_100%_50%/0.25)]" },
  denied: { label: "ACCESS DENIED", color: "text-destructive", ringColor: "border-destructive/60", bgGlow: "shadow-[0_0_60px_hsl(0_100%_55%/0.15)]" },
};

const LiveVerification = () => {
  const [status, setStatus] = useState<VerifyStatus>("waiting");
  const [shake, setShake] = useState(false);

  const simulateVerification = useCallback(async () => {
    if (status !== "waiting") return;
    setStatus("verifying");

    // Simulated API call
    try {
      // fetch('/api/verify')
      await new Promise((r) => setTimeout(r, 3000));
      const result = Math.random() > 0.3 ? "granted" : "denied";
      setStatus(result);

      if (result === "denied") {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      setTimeout(() => setStatus("waiting"), 4000);
    } catch {
      setStatus("waiting");
    }
  }, [status]);

  const cfg = STATUS_CONFIG[status];

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* Fullscreen immersive layout */}
      <div className={`relative flex flex-col items-center justify-center transition-all duration-500 ${shake ? "animate-shake" : ""}`}>
        {/* Biometric Scanner */}
        <div className={`relative w-72 h-72 md:w-[28rem] md:h-[28rem] transition-shadow duration-700 ${cfg.bgGlow}`}>
          {/* Outer decorative ring */}
          <div className={`absolute inset-0 rounded-full border-2 ${cfg.ringColor} transition-colors duration-500 ${status === "waiting" ? "animate-breathe" : ""}`} />

          {/* Rotating ring (only when verifying) */}
          {status === "verifying" && (
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-primary border-r-primary/30 animate-bio-rotate" />
          )}

          {/* Second rotating ring */}
          {status === "verifying" && (
            <div className="absolute inset-7 rounded-full border border-transparent border-b-primary/40 border-l-primary/20" style={{ animation: "bio-rotate 5s linear infinite reverse" }} />
          )}

          {/* Granted pulse rings */}
          {status === "granted" && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-expand-pulse" />
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-expand-pulse" style={{ animationDelay: "200ms" }} />
            </>
          )}

          {/* Camera viewport */}
          <div className="absolute inset-12 md:inset-16 rounded-full bg-secondary/30 backdrop-blur-sm border border-border/20 overflow-hidden flex items-center justify-center">
            {/* Simulated camera feed */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-graphite to-background">
              <svg viewBox="0 0 100 100" className="w-28 h-28 md:w-40 md:h-40 text-muted-foreground/20">
                <ellipse cx="50" cy="38" rx="20" ry="26" fill="none" stroke="currentColor" strokeWidth="1" />
                <ellipse cx="50" cy="85" rx="32" ry="18" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Scan line */}
              {(status === "verifying" || status === "waiting") && (
                <div className="absolute inset-0 scan-line" />
              )}

              {/* Granted overlay */}
              {status === "granted" && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 text-primary animate-scale-in" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Denied overlay */}
              {status === "denied" && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/5">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 text-destructive animate-scale-in" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Corner brackets */}
          {[
            "-top-2 -left-2 border-t-2 border-l-2",
            "-top-2 -right-2 border-t-2 border-r-2",
            "-bottom-2 -left-2 border-b-2 border-l-2",
            "-bottom-2 -right-2 border-b-2 border-r-2",
          ].map((cls, i) => (
            <div key={i} className={`absolute w-6 h-6 ${cfg.ringColor} ${cls} transition-colors duration-500`} />
          ))}
        </div>

        {/* Floating status panel */}
        <div className="mt-8 glass-panel px-8 py-5 text-center">
          <div className={`font-display text-lg md:text-xl tracking-[0.3em] ${cfg.color} transition-colors duration-500`}>
            {cfg.label}
          </div>
          <div className="font-body text-sm text-muted-foreground mt-2 tracking-wider">
            {status === "waiting" && "Position face within the scanner frame"}
            {status === "verifying" && "Analyzing biometric data..."}
            {status === "granted" && "Welcome to the Premium Lounge"}
            {status === "denied" && "Verification failed — please try again"}
          </div>
        </div>

        {/* CTA */}
        {status === "waiting" && (
          <button onClick={simulateVerification} className="btn-neon mt-6 animate-slide-up">
            INITIATE SCAN
          </button>
        )}
      </div>

      {/* Side data readout */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 font-body text-xs text-muted-foreground/50 tracking-wider">
        <span>TERMINAL: LNG-04</span>
        <span>PROTOCOL: BIO-256</span>
        <span>LATENCY: 12ms</span>
        <span className={cfg.color}>STATUS: {status.toUpperCase()}</span>
      </div>
    </main>
  );
};

export default LiveVerification;
