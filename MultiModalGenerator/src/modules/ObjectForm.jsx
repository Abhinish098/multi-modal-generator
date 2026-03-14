import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import Label from "../components/Label";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import SectionTitle from "../components/SectionTitle";
import { MESH_STYLES, FORMATS } from "../constants/config";
import { randomSeed } from "../utils/randomSeed";
import { generateObject } from "../services/objectService";

function Select({ children, ...props }) {
  return (
    <select style={{ width: "100%", background: "#111318", border: "1px solid #2a2d35", borderRadius: "8px", color: "#e5e7eb", fontSize: "14px", padding: "10px 14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
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

// ── Step tracker ──────────────────────────────────────────────────────────────
const STEPS_LIST = [
  "Connecting to ComfyUI",
  "Queuing prompt",
  "Generating preview image",
  "Removing background",
  "Generating 3D mesh",
  "Retrieving result",
];

function GeneratingCard({ currentStep }) {
  return (
    <div style={{ background: "#16181f", border: "1px solid #2e3150", borderRadius: "12px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "56px", height: "56px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #1e1f2e" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#6366f1", animation: "spin 0.8s linear infinite" }} />
          <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#8b5cf6", animation: "spin 1.2s linear infinite reverse" }} />
        </div>
      </div>
      <p style={{ fontSize: "15px", fontWeight: 600, color: "#e5e7eb", margin: "0 0 4px", textAlign: "center" }}>Generating 3D object…</p>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 24px", textAlign: "center" }}>This can take 2–5 minutes</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {STEPS_LIST.map((step, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", background: active ? "#1e1f2e" : "transparent", border: `1px solid ${active ? "#2e3150" : "transparent"}`, transition: "all 0.3s" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? "#1a3a2a" : active ? "#1e1f2e" : "#111318", border: `1.5px solid ${done ? "#4ade80" : active ? "#6366f1" : "#2a2d35"}` }}>
                {done
                  ? <span style={{ color: "#4ade80", fontSize: "11px" }}>✓</span>
                  : active
                    ? <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", display: "block", animation: "pulse 1s ease-in-out infinite" }} />
                    : <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#374151", display: "block" }} />
                }
              </div>
              <span style={{ fontSize: "13px", color: done ? "#9ca3af" : active ? "#e5e7eb" : "#4b5563", fontWeight: active ? 500 : 400 }}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ images, glbUrl, onGenerateAgain }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#4ade80", fontSize: "16px" }}>✓</span>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#e5e7eb" }}>3D object generated</span>
        </div>
        <button onClick={onGenerateAgain} style={{ fontSize: "12px", color: "#6b7280", background: "transparent", border: "1px solid #2a2d35", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#a5b4fc"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2d35"; e.currentTarget.style.color = "#6b7280"; }}>
          ↺ Generate again
        </button>
      </div>

      {/* Preview images */}
      {images.length > 0 && (
        <Card>
          <SectionTitle>Preview images</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
            {images.map((url, i) => (
              <div key={i} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #2a2d35" }}>
                <img src={url} alt={`Preview ${i + 1}`} style={{ width: "100%", display: "block" }} onError={e => e.target.style.display = "none"} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* GLB download */}
      {glbUrl ? (
        <Card>
          <SectionTitle>3D mesh file</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#111318", borderRadius: "8px", border: "1px solid #2a2d35" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#e5e7eb", margin: "0 0 2px" }}>output.glb</p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>GLB format — open in Blender, Three.js, or any 3D viewer</p>
            </div>
            <a href={glbUrl} download="output.glb" target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#a5b4fc", background: "#1e1f2e", border: "1px solid #2e3150", borderRadius: "8px", padding: "8px 16px", textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2a2d4a"; e.currentTarget.style.borderColor = "#6366f1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1e1f2e"; e.currentTarget.style.borderColor = "#2e3150"; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download GLB
            </a>
          </div>
        </Card>
      ) : (
        <div style={{ padding: "12px 16px", background: "#1a1a0a", border: "1px solid #3a3a1a", borderRadius: "8px" }}>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>⚠ GLB file not found in output — the mesh may have saved under a different path. Check ComfyUI's output folder directly.</p>
        </div>
      )}
    </div>
  );
}

// ── Error card ────────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }) {
  return (
    <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <span style={{ color: "#f87171", fontSize: "18px", flexShrink: 0 }}>✕</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#fca5a5", margin: "0 0 4px" }}>Generation failed</p>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 12px", wordBreak: "break-word" }}>{message}</p>
        <button onClick={onRetry} style={{ fontSize: "12px", color: "#f87171", background: "transparent", border: "1px solid #3a1a1a", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>↺ Try again</button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ObjectForm() {
  const [description,    setDescription]    = useState("");
  const [keywords,       setKeywords]       = useState("");
  const [cfg,            setCfg]            = useState(8);
  const [steps,          setSteps]          = useState(20);
  const [meshStyle,      setMeshStyle]      = useState("Realistic");
  const [activeFormat,   setActiveFormat]   = useState("GLB");
  const [seed,           setSeed]           = useState(randomSeed());
  const [pbrTextures,    setPbrTextures]    = useState(true);

  const [status,         setStatus]         = useState("idle");
  const [currentStep,    setCurrentStep]    = useState(0);
  const [resultImages,   setResultImages]   = useState([]);
  const [glbUrl,         setGlbUrl]         = useState(null);
  const [errorMessage,   setErrorMessage]   = useState("");

  const resultRef = useRef(null);

  useEffect(() => {
    if ((status === "success" || status === "error") && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  // Build positive prompt from description + keywords
  const buildPrompt = () => {
    const parts = [description.trim(), keywords.trim()].filter(Boolean);
    return parts.join(", ");
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setStatus("error");
      setErrorMessage("Please enter an object description before generating.");
      return;
    }

    setStatus("loading");
    setCurrentStep(0);
    setResultImages([]);
    setGlbUrl(null);
    setErrorMessage("");

    try {
      setCurrentStep(0);
      await new Promise(r => setTimeout(r, 400));
      setCurrentStep(1);

      const { images, glbUrl: glb } = await generateObject(
        {
          positivePrompt: buildPrompt(),
          negativePrompt: "low quality, blurry, deformed, extra limbs",
          cfg,
          steps,
          meshStyle,
          seed,
        },
        (phase) => {
          if (phase === "queued")   setCurrentStep(2);
          if (phase === "complete") setCurrentStep(5);
        }
      );

      setResultImages(images);
      setGlbUrl(glb);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message ?? "Something went wrong. Check the ComfyUI server.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResultImages([]);
    setGlbUrl(null);
    setErrorMessage("");
    setCurrentStep(0);
  };

  return (
    <>
      <style>{`
        .fmt-grid { display: flex; gap: 8px; flex-wrap: wrap; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @media (max-width: 480px) {
          .fmt-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Description card */}
        <Card>
          <SectionTitle>Description</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <Label>Object description</Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="A worn leather armchair with brass nail trim, realistic surface texture, aged patina…"
              />
            </div>
            <div>
              <Label>Reference keywords</Label>
              <Input
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. antique, wooden, weathered, ornate"
              />
            </div>
          </div>
        </Card>

        {/* Mesh settings card */}
        <Card>
          <SectionTitle>Mesh settings</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <RangeField label="CFG Scale" min={1} max={20} value={cfg} onChange={e => setCfg(Number(e.target.value))} />
            <RangeField label="Steps"     min={10} max={50} value={steps} onChange={e => setSteps(Number(e.target.value))} />

            <div>
              <Label>Mesh style</Label>
              <Select value={meshStyle} onChange={e => setMeshStyle(e.target.value)}>
                {MESH_STYLES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </div>

            <div>
              <Label>Export format</Label>
              <div className="fmt-grid">
                {FORMATS.map(f => (
                  <button key={f} onClick={() => setActiveFormat(f)} style={{ padding: "7px 16px", borderRadius: "8px", border: `1px solid ${activeFormat === f ? "#6366f1" : "#2a2d35"}`, background: activeFormat === f ? "#1e1f2e" : "transparent", color: activeFormat === f ? "#a5b4fc" : "#6b7280", fontSize: "13px", cursor: "pointer", fontFamily: "monospace", fontWeight: 600, transition: "all 0.15s" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "#111318", borderRadius: "8px", border: "1px solid #2a2d35" }}>
              <input type="checkbox" id="tex" checked={pbrTextures} onChange={e => setPbrTextures(e.target.checked)} style={{ accentColor: "#6366f1", width: "16px", height: "16px", flexShrink: 0 }} />
              <label htmlFor="tex" style={{ fontSize: "14px", color: "#d1d5db", cursor: "pointer", lineHeight: 1.4 }}>
                Generate PBR textures (albedo, normal, roughness)
              </label>
            </div>

            <div>
              <Label>Seed</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <Input value={seed} onChange={e => setSeed(e.target.value)} style={{ fontFamily: "monospace" }} />
                <button onClick={() => setSeed(randomSeed())} style={{ padding: "10px 14px", background: "#1a1c26", border: "1px solid #2a2d35", borderRadius: "8px", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2d35"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16,3 21,3 21,8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21,16 21,21 16,21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
                  Random
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Generate button */}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Generate 3D Object
            </>
          )}
        </button>

        {/* Loading */}
        {status === "loading" && <GeneratingCard currentStep={currentStep} />}

        {/* Error */}
        {status === "error" && (
          <div ref={resultRef}><ErrorCard message={errorMessage} onRetry={handleReset} /></div>
        )}

        {/* Success */}
        {status === "success" && (
          <div ref={resultRef}>
            <ResultCard images={resultImages} glbUrl={glbUrl} onGenerateAgain={handleReset} />
          </div>
        )}

      </div>
    </>
  );
}
