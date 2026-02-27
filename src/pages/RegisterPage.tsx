import { useState } from "react";

const RegisterPage = () => {
  const [step, setStep] = useState(0); // 0=form, 1=success
  const [formData, setFormData] = useState({ name: "", email: "", passport: "", expiry: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })
    await new Promise((r) => setTimeout(r, 1500));
    setStep(1);
  };

  if (step === 1) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 grid-bg pointer-events-none" />
        <div className="relative z-10 glass-panel-strong p-12 text-center max-w-md animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-primary flex items-center justify-center animate-pulse-neon">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl neon-text tracking-wider mb-3">REGISTERED</h2>
          <p className="font-body text-muted-foreground">Biometric profile created successfully. You may now proceed to verification.</p>
          <button onClick={() => { setStep(0); setFormData({ name: "", email: "", passport: "", expiry: "" }); }} className="btn-ghost-neon mt-6">
            NEW REGISTRATION
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 glass-panel p-8 md:p-12 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl md:text-3xl tracking-wider neon-text-subtle mb-2">REGISTER</h1>
          <p className="font-body text-muted-foreground text-sm tracking-wider">BIOMETRIC PROFILE ENROLLMENT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-left" style={{ animationDelay: "100ms" }}>
            <label className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-2 block">FULL NAME</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="neon-input w-full"
              placeholder="Enter full name"
            />
          </div>

          <div className="animate-slide-right" style={{ animationDelay: "200ms" }}>
            <label className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-2 block">EMAIL</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="neon-input w-full"
              placeholder="Enter email address"
            />
          </div>

          <div className="animate-slide-left" style={{ animationDelay: "300ms" }}>
            <label className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-2 block">PASSPORT NUMBER</label>
            <input
              type="text"
              required
              value={formData.passport}
              onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
              className="neon-input w-full"
              placeholder="e.g. AB1234567"
            />
          </div>

          <div className="animate-slide-right" style={{ animationDelay: "400ms" }}>
            <label className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-2 block">PASSPORT EXPIRY</label>
            <input
              type="date"
              required
              value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              className="neon-input w-full"
            />
          </div>

          {/* Biometric capture pad placeholder */}
          <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <label className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-2 block">BIOMETRIC CAPTURE</label>
            <div className="border-2 border-dashed border-border/40 rounded-lg p-8 text-center hover:border-primary/40 transition-colors duration-300 cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M6 21v-1a6 6 0 0112 0v1" />
                </svg>
              </div>
              <p className="font-body text-sm text-muted-foreground tracking-wider">TAP TO CAPTURE BIOMETRIC DATA</p>
            </div>
          </div>

          <button type="submit" className="btn-neon w-full mt-4">
            ENROLL PROFILE
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
