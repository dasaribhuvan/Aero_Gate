import { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  name: string;
  status: "granted" | "denied" | "pending";
  terminal: string;
  confidence: number;
}

const MOCK_LOGS: LogEntry[] = [
  { id: "LG-0041", timestamp: "2026-02-27 14:32:11", name: "A. CHEN", status: "granted", terminal: "LNG-04", confidence: 99.2 },
  { id: "LG-0040", timestamp: "2026-02-27 14:28:44", name: "M. KOWALSKI", status: "granted", terminal: "LNG-02", confidence: 97.8 },
  { id: "LG-0039", timestamp: "2026-02-27 14:25:03", name: "UNKNOWN", status: "denied", terminal: "LNG-04", confidence: 34.1 },
  { id: "LG-0038", timestamp: "2026-02-27 14:19:57", name: "J. NAKAMURA", status: "granted", terminal: "LNG-01", confidence: 98.5 },
  { id: "LG-0037", timestamp: "2026-02-27 14:15:22", name: "S. OKAFOR", status: "denied", terminal: "LNG-03", confidence: 41.7 },
  { id: "LG-0036", timestamp: "2026-02-27 14:10:08", name: "R. PATEL", status: "granted", terminal: "LNG-02", confidence: 99.6 },
  { id: "LG-0035", timestamp: "2026-02-27 14:05:33", name: "L. DUBOIS", status: "pending", terminal: "LNG-01", confidence: 72.3 },
  { id: "LG-0034", timestamp: "2026-02-27 13:58:19", name: "T. MÜLLER", status: "granted", terminal: "LNG-04", confidence: 96.9 },
];

const STATUS_STYLES = {
  granted: "text-primary border-primary/30 bg-primary/5",
  denied: "text-destructive border-destructive/30 bg-destructive/5",
  pending: "text-neon-amber border-neon-amber/30 bg-neon-amber/5",
};

const LogsPage = () => {
  const [filter, setFilter] = useState<"all" | "granted" | "denied" | "pending">("all");
  const [search, setSearch] = useState("");
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);

  const filtered = MOCK_LOGS.filter((log) => {
    if (filter !== "all" && log.status !== filter) return false;
    if (search && !log.name.toLowerCase().includes(search.toLowerCase()) && !log.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Animate rows in
  useEffect(() => {
    setVisibleLogs([]);
    filtered.forEach((log, i) => {
      setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log]);
      }, i * 80);
    });
  }, [filter, search]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 md:px-8 pt-24 pb-12">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl tracking-wider neon-text-subtle">ACCESS LOGS</h1>
          <p className="font-body text-sm text-muted-foreground tracking-wider mt-1">TERMINAL LOG VIEWER // REAL-TIME FEED</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="neon-input w-full pl-4 pr-10"
              placeholder="Search by name or ID..."
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {/* Filter toggles */}
          <div className="flex gap-2">
            {(["all", "granted", "denied", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`neon-toggle font-display text-xs tracking-wider ${filter === f ? "active" : ""}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal viewer */}
        <div className="glass-panel overflow-hidden">
          {/* Terminal header */}
          <div className="px-6 py-3 border-b border-border/30 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
            <span className="font-body text-xs text-muted-foreground tracking-[0.2em]">LIVE FEED — {filtered.length} ENTRIES</span>
            <span className="ml-auto font-body text-xs text-muted-foreground/40 animate-terminal-blink">█</span>
          </div>

          {/* Log entries */}
          <div className="divide-y divide-border/20">
            {visibleLogs.map((log, i) => (
              <div
                key={log.id}
                className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:bg-secondary/20 transition-colors duration-200 animate-row-enter"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* ID */}
                <span className="font-body text-xs text-muted-foreground/60 w-20 shrink-0">{log.id}</span>

                {/* Timestamp */}
                <span className="font-body text-sm text-muted-foreground w-40 shrink-0">{log.timestamp}</span>

                {/* Name */}
                <span className="font-display text-sm tracking-wider flex-1">{log.name}</span>

                {/* Terminal */}
                <span className="font-body text-xs text-muted-foreground/50 w-20 shrink-0">{log.terminal}</span>

                {/* Confidence */}
                <div className="w-24 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          log.confidence > 90 ? "bg-primary" : log.confidence > 60 ? "bg-neon-amber" : "bg-destructive"
                        }`}
                        style={{ width: `${log.confidence}%` }}
                      />
                    </div>
                    <span className="font-body text-xs text-muted-foreground">{log.confidence}%</span>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`font-display text-xs tracking-wider px-3 py-1 rounded border ${STATUS_STYLES[log.status]} w-24 text-center shrink-0`}>
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {visibleLogs.length === 0 && (
            <div className="px-6 py-12 text-center font-body text-muted-foreground tracking-wider">
              NO MATCHING RECORDS
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LogsPage;
