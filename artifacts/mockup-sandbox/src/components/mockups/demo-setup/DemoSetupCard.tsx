import { useState, useEffect, useRef } from "react";

type Phase = "setup" | "scanning";
type StepStatus = "idle" | "connecting" | "done";

interface StepDef {
  id: string;
  label: string;
  sub: string;
  delay: number;
  donDelay: number;
  color: string;
  icon: React.ReactNode;
}

function IconWA() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function IconIG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function IconFB() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function IconBrain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.66z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.66z"/>
    </svg>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" className="w-4 h-4">
      <path d="M3 8l3.5 3.5L13 4.5"/>
    </svg>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative inline-flex items-center transition-all duration-300 focus:outline-none"
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? "#22c55e" : "rgba(255,255,255,0.12)",
        border: on ? "none" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: on ? "0 0 10px rgba(34,197,94,0.4)" : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: on ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          transition: "left 0.25s ease",
        }}
      />
    </button>
  );
}

function InputField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {icon && <span style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>{icon}</span>}
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "monospace" }}>{value}</span>
      </div>
    </div>
  );
}

function StepRow({ step, status, isLast }: { step: StepDef; status: StepStatus; isLast: boolean }) {
  const visible = status !== "idle";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
        opacity: visible ? 1 : 0.2,
        transform: `translateY(${visible ? 0 : 6}px)`,
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${step.color}18`,
        border: `1px solid ${step.color}30`,
        color: step.color,
        flexShrink: 0,
      }}>
        {step.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{step.label}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{step.sub}</div>
      </div>

      {/* Status indicator */}
      <div style={{ flexShrink: 0 }}>
        {status === "idle" && (
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
        )}
        {status === "connecting" && <Spinner color={step.color} />}
        {status === "done" && (
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e30", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckIcon />
          </div>
        )}
      </div>
    </div>
  );
}

export function DemoSetupCard() {
  const [demoCase, setDemoCase] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");
  const [stepStates, setStepStates] = useState<Record<string, StepStatus>>({});
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps: StepDef[] = [
    { id: "instagram", label: "Instagram", sub: "Connecting business account", delay: 400, donDelay: 1800, color: "#E1306C", icon: <IconIG /> },
    { id: "whatsapp", label: "WhatsApp Business", sub: "Linking WABA · +49 123 456 789", delay: 900, donDelay: 2400, color: "#25D366", icon: <IconWA /> },
    { id: "messenger", label: "Messenger", sub: "Connecting CareCompass page", delay: 1600, donDelay: 3100, color: "#0084FF", icon: <IconFB /> },
    { id: "website", label: "Website Crawl", sub: "AI scanning carecompass.me", delay: 2400, donDelay: 4200, color: "#8B5CF6", icon: <IconGlobe /> },
    { id: "knowledge", label: "Knowledge Base", sub: "Building AI context…", delay: 3400, donDelay: 99999, color: "#F59E0B", icon: <IconBrain /> },
  ];

  function startScanning() {
    setPhase("scanning");
    setStepStates({});
    setProgress(0);

    // Progress bar animates up to ~78% and stops
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 3;
      if (p >= 78) { p = 78; if (intervalRef.current) clearInterval(intervalRef.current); }
      setProgress(p);
    }, 200);

    steps.forEach((step) => {
      const t1 = setTimeout(() => {
        setStepStates((prev) => ({ ...prev, [step.id]: "connecting" }));
      }, step.delay);
      const t2 = setTimeout(() => {
        setStepStates((prev) => ({ ...prev, [step.id]: "done" }));
      }, step.donDelay);
      timersRef.current.push(t1, t2);
    });
  }

  function handleClose() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("setup");
    setStepStates({});
    setProgress(0);
    setDemoCase(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(34,197,94,0.06) 0%, #060b12 55%)" }}>

      {/* Glow behind card */}
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        position: "relative",
        width: 440,
        borderRadius: 20,
        background: "linear-gradient(160deg, #0e1724 0%, #0b1118 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}>

        {/* Top green accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #22c55e, transparent)" }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 16 16" fill="#22c55e" style={{ width: 14, height: 14 }}><path d="M8 2l1.76 3.57L14 6.36l-3 2.93.71 4.14L8 11.32l-3.71 2.11.71-4.14L2 6.36l4.24-.79L8 2z"/></svg>
              </div>
              <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>New Demo</span>
              {phase === "scanning" && (
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: 20, background: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.25)", marginLeft: 4 }}>
                  Creating
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
              {phase === "setup" ? "Configure client channels & AI knowledge" : "Setting up your demo environment…"}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.4)", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 14, height: 14 }}>
              <path d="M12 4L4 12M4 4l8 8"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          {phase === "setup" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Demo case toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${demoCase ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.3s" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Demo Case</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Pre-fill with sample client data</div>
                </div>
                <Toggle on={demoCase} onChange={setDemoCase} />
              </div>

              {/* Form fields — revealed when toggle is ON */}
              <div style={{ overflow: "hidden", maxHeight: demoCase ? 400 : 0, opacity: demoCase ? 1 : 0, transition: "max-height 0.45s ease, opacity 0.35s ease" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <InputField label="WABA Number" value="+49 123 456 789" icon={<IconWA />} />
                  <InputField label="Facebook Page" value="CareCompass · Page ID 83921045" icon={<IconFB />} />
                  <InputField label="Website" value="carecompass.me" icon={<IconGlobe />} />
                </div>
              </div>

              {/* Scan button */}
              <button
                onClick={demoCase ? startScanning : undefined}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: demoCase ? "pointer" : "not-allowed",
                  background: demoCase
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "rgba(255,255,255,0.05)",
                  color: demoCase ? "white" : "rgba(255,255,255,0.2)",
                  boxShadow: demoCase ? "0 4px 20px rgba(34,197,94,0.3)" : "none",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.02em",
                }}
              >
                {demoCase ? "Scan & Connect Channels →" : "Enable Demo Case to continue"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Steps */}
              {steps.map((step, i) => (
                <StepRow
                  key={step.id}
                  step={step}
                  status={stepStates[step.id] ?? "idle"}
                  isLast={i === steps.length - 1}
                />
              ))}

              {/* Progress bar */}
              <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Deployment</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24" }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #22c55e, #16a34a)", width: `${progress}%`, transition: "width 0.3s ease" }} />
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8, margin: "8px 0 0" }}>
                  This may take a few minutes while we scan your site and connect your channels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
