import { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  name: string;
  timestamp: string;
  status: string;
  terminal: string;
  confidence: number;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logs");

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();

      // Ensure array safety
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }

      setError(null);
    } catch (err) {
      console.error("Log fetch error:", err);
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status: string) => {
    const lower = status.toLowerCase();

    if (lower.includes("granted")) {
      return "text-primary border-primary/30 bg-primary/5";
    }

    if (lower.includes("denied")) {
      return "text-destructive border-destructive/30 bg-destructive/5";
    }

    return "text-muted-foreground border-border bg-secondary/10";
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 md:px-8 pt-24 pb-12">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl tracking-wider neon-text-subtle">
            ACCESS LOGS
          </h1>
          <p className="font-body text-sm text-muted-foreground tracking-wider mt-1">
            TERMINAL LOG VIEWER — LIVE
          </p>
        </div>

        {/* Terminal Panel */}
        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-3 border-b border-border/30 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
            <span className="font-body text-xs text-muted-foreground tracking-[0.2em]">
              LIVE FEED — {logs.length} ENTRIES
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              Loading logs...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-6 py-12 text-center text-destructive">
              {error}
            </div>
          )}

          {/* Logs */}
          {!loading && !error && (
            <div className="divide-y divide-border/20">
              {logs.length === 0 && (
                <div className="px-6 py-12 text-center text-muted-foreground">
                  NO LOGS YET
                </div>
              )}

              {logs.map((log) => (
                <div
                  key={log.id}
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-secondary/20 transition-colors duration-200"
                >
                  <span className="text-xs w-20">{log.id}</span>

                  <span className="text-sm w-40 text-muted-foreground">
                    {log.timestamp}
                  </span>

                  <span className="flex-1 font-display text-sm tracking-wider">
                    {log.name}
                  </span>

                  <span className="text-xs w-20 text-muted-foreground">
                    {log.terminal}
                  </span>

                  <span className="text-xs w-20 text-muted-foreground">
                    {typeof log.confidence === "number"
                      ? `${log.confidence.toFixed(2)}%`
                      : "0%"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded border text-xs tracking-wider ${getStatusStyle(
                      log.status
                    )}`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LogsPage;