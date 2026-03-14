import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import Label from "../components/Label";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import SectionTitle from "../components/SectionTitle";
import { ICONS, SAMPLERS, ASPECT_RATIOS } from "../constants/config";
import { randomSeed } from "../utils/randomSeed";
import { generateImage } from "../services/imageService";

function Select({ children, ...props }) {
  return (
    <select
      style={{ width: "100%", background: "#111318", border: "1px solid #2a2d35", borderRadius: "8px", color: "#e5e7eb", fontSize: "14px", padding: "10px 14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = "#2a2d35"}
      {...props}
    >
      {children}
    </select>
  );
}

function RangeField({ label, min, max, value, onChange, unit = "" }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <Label>{label}</Label>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#a5b4fc", background: "#1e1f2e", padding: "2px 10px", borderRadius: "20px", border: "1px solid #2e3150" }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={onChange}
        style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer", height: "4px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#4b5563", marginTop: "4px" }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ── Animated loading card ─────────────────────────────────────────────────────
function GeneratingCard({ steps, currentStep }) {
  return (
    <div style={{ background: "#16181f", border: "1px solid #2e3150", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
      {/* Spinner */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "56px", height: "56px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #1e1f2e" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#6366f1", animation: "spin 0.8s linear infinite" }} />
          <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#8b5cf6", animation: "spin 1.2s linear infinite reverse" }} />
        </div>
      </div>

      <p style={{ fontSize: "15px", fontWeight: 600, color: "#e5e7eb", margin: "0 0 6px" }}>Generating your image…</p>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 24px" }}>This usually takes 15–60 seconds</p>

      {/* Step indicators */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
        {steps.map((step, i) => {
          const done    = i < currentStep;
          const active  = i === currentStep;
          const pending = i > currentStep;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", background: active ? "#1e1f2e" : "transparent", border: `1px solid ${active ? "#2e3150" : "transparent"}`, transition: "all 0.3s" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? "#1a3a2a" : active ? "#1e1f2e" : "#111318", border: `1.5px solid ${done ? "#4ade80" : active ? "#6366f1" : "#2a2d35"}`, transition: "all 0.3s" }}>
                {done
                  ? <span style={{ color: "#4ade80", fontSize: "11px" }}>✓</span>
                  : active
                    ? <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", display: "block", animation: "pulse 1s ease-in-out infinite" }} />
                    : <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#374151", display: "block" }} />
                }
              </div>
              <span style={{ fontSize: "13px", color: done ? "#9ca3af" : active ? "#e5e7eb" : "#4b5563", fontWeight: active ? 500 : 400, transition: "all 0.3s" }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Result card with download ─────────────────────────────────────────────────
function ResultCard({ urls, onGenerateAgain }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#4ade80", fontSize: "16px" }}>✓</span>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#e5e7eb" }}>
            {urls.length} image{urls.length > 1 ? "s" : ""} generated
          </span>
        </div>
        <button onClick={onGenerateAgain} style={{ fontSize: "12px", color: "#6b7280", background: "transparent", border: "1px solid #2a2d35", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#a5b4fc"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2d35"; e.currentTarget.style.color = "#6b7280"; }}>
          ↺ Generate again
        </button>
      </div>

      {urls.map((url, i) => (
        <div key={i} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #1f2130", position: "relative", background: "#111318" }}>
          <img
            src={url}
            alt={`Generated image ${i + 1}`}
            style={{ width: "100%", display: "block", borderRadius: "12px 12px 0 0" }}
            onError={e => { e.target.style.display = "none"; }}
          />
          {/* Download bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#16181f", borderTop: "1px solid #1f2130" }}>
            <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>
              image_{i + 1}.png
            </span>
            <a
              href={url}
              download={`generated_image_${i + 1}.png`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#a5b4fc", background: "#1e1f2e", border: "1px solid #2e3150", borderRadius: "6px", padding: "6px 14px", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2a2d4a"; e.currentTarget.style.borderColor = "#6366f1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1e1f2e"; e.currentTarget.style.borderColor = "#2e3150"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Error card ────────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }) {
  return (
    <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <span style={{ color: "#f87171", fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>✕</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#fca5a5", margin: "0 0 4px" }}>Generation failed</p>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 12px", wordBreak: "break-word" }}>{message}</p>
        <button onClick={onRetry} style={{ fontSize: "12px", color: "#f87171", background: "transparent", border: "1px solid #3a1a1a", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#f87171"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#3a1a1a"}>
          ↺ Try again
        </button>
      </div>
    </div>
  );
}

// ── GENERATION STEPS ──────────────────────────────────────────────────────────
const STEPS_LIST = [
  "Connecting to ComfyUI",
  "Queuing prompt",
  "Generating image",
  "Retrieving result",
];

// ── Main component ────────────────────────────────────────────────────────────
export default function ImageForm() {
  const [positivePrompt, setPositivePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [cfg,     setCfg]     = useState(8);
  const [steps,   setSteps]   = useState(20);
  const [sampler, setSampler] = useState("Euler a");
  const [ratio,   setRatio]   = useState("1:1");
  const [seed,    setSeed]    = useState(randomSeed());

  // "idle" | "loading" | "success" | "error"
  const [status,       setStatus]       = useState("idle");
  const [currentStep,  setCurrentStep]  = useState(0);
  const [results,      setResults]      = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const resultRef = useRef(null);

  // Auto-scroll to result when done
  useEffect(() => {
    if ((status === "success" || status === "error") && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  const handleGenerate = async () => {
    if (!positivePrompt.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a positive prompt before generating.");
      return;
    }

    setStatus("loading");
    setCurrentStep(0);
    setResults([]);
    setErrorMessage("");

    try {
      // Step 0 — connecting (immediate)
      setCurrentStep(0);
      await new Promise(r => setTimeout(r, 400));

      // Step 1 — queuing (happens inside generateImage but we advance UI)
      setCurrentStep(1);

      const urls = await generateImage(
        { positivePrompt, negativePrompt, cfg, steps, sampler, aspectRatio: ratio, seed },
        // Progress callback — called after prompt queued, then after poll succeeds
        (phase) => {
          if (phase === "queued")    setCurrentStep(2);
          if (phase === "complete")  setCurrentStep(3);
        }
      );

      setCurrentStep(4); // all done
      setResults(urls);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message ?? "Something went wrong. Check the ComfyUI server.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResults([]);
    setErrorMessage("");
    setCurrentStep(0);
  };

  return (
    <>
      <style>{`
        .ratio-grid { display: flex; gap: 8px; flex-wrap: wrap; }
        .seed-row   { display: flex; gap: 8px; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @media (max-width: 480px) {
          .seed-row { flex-direction: column; }
          .seed-row button { width: 100% !important; justify-content: center; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* ── Prompt card ── */}
        <Card>
          <SectionTitle>Prompt</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <Label>Positive prompt</Label>
              <Textarea value={positivePrompt} onChange={e => setPositivePrompt(e.target.value)}
                placeholder="Masterpiece, high-res, 2k, cinematic lighting…" />
            </div>
            <div>
              <Label>Negative prompt</Label>
              <Textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)}
                placeholder="blurry, low quality, watermark, deformed…" style={{ minHeight: "70px" }} />
            </div>
          </div>
        </Card>

        {/* ── Settings card ── */}
        <Card>
          <SectionTitle>Advanced settings</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <RangeField label="CFG Scale" min={1} max={20} value={cfg}   onChange={e => setCfg(Number(e.target.value))} />
            <RangeField label="Steps"     min={10} max={150} value={steps} onChange={e => setSteps(Number(e.target.value))} />

            <div>
              <Label>Sampler</Label>
              <Select value={sampler} onChange={e => setSampler(e.target.value)}>
                {SAMPLERS.map(s => <option key={s}>{s}</option>)}
              </Select>
            </div>

            <div>
              <Label>Aspect ratio</Label>
              <div className="ratio-grid">
                {ASPECT_RATIOS.map(r => (
                  <button key={r} onClick={() => setRatio(r)} style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${ratio === r ? "#6366f1" : "#2a2d35"}`, background: ratio === r ? "#1e1f2e" : "transparent", color: ratio === r ? "#a5b4fc" : "#6b7280", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Seed</Label>
              <div className="seed-row">
                <Input value={seed} onChange={e => setSeed(e.target.value)} style={{ fontFamily: "monospace" }} />
                <button onClick={() => setSeed(randomSeed())} style={{ padding: "10px 14px", background: "#1a1c26", border: "1px solid #2a2d35", borderRadius: "8px", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0, transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2d35"}>
                  {ICONS.random} Random
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Generate button ── */}
        <button
          onClick={handleGenerate}
          disabled={status === "loading"}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", background: status === "loading" ? "#2d2b5a" : "linear-gradient(135deg, #4f46e5, #7c3aed)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", cursor: status === "loading" ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s", opacity: status === "loading" ? 0.7 : 1 }}
        >
          {status === "loading" ? (
            <>
              <span style={{ width: "14px", height: "14px", border: "2px solid #ffffff33", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              Generating…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>
              Generate Image
            </>
          )}
        </button>

        {/* ── Loading state ── */}
        {status === "loading" && (
          <GeneratingCard steps={STEPS_LIST} currentStep={currentStep} />
        )}

        {/* ── Error state ── */}
        {status === "error" && (
          <div ref={resultRef}>
            <ErrorCard message={errorMessage} onRetry={handleReset} />
          </div>
        )}

        {/* ── Success: result images ── */}
        {status === "success" && (
          <div ref={resultRef}>
            <ResultCard urls={results} onGenerateAgain={handleReset} />
          </div>
        )}

      </div>
    </>
  );
}
