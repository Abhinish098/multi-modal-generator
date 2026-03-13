import { useState } from "react";
import Card from "../components/Card";
import Label from "../components/Label";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import SectionTitle from "../components/SectionTitle";
import GenerateButton from "../components/GenerateButton";
import { ICONS, VIDEO_STYLES, VIDEO_RESOLUTIONS } from "../constants/config";
import { randomSeed } from "../utils/randomSeed";

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

export default function VideoForm() {
  const [duration, setDuration] = useState(4);
  const [fps, setFps] = useState(24);
  const [seed, setSeed] = useState(randomSeed());
  const [resolution, setResolution] = useState("1080p");

  return (
    <>
      <style>{`
        .res-grid { display: flex; gap: 8px; }
        .seed-row-v { display: flex; gap: 8px; }
        @media (max-width: 480px) {
          .res-grid { display: grid; grid-template-columns: 1fr 1fr; }
          .seed-row-v { flex-direction: column; }
          .seed-row-v button { width: 100% !important; justify-content: center; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Card>
          <SectionTitle>Prompt</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><Label>Scene description</Label><Textarea placeholder="A slow cinematic pan over a misty mountain range at sunrise, birds flying in the distance..." /></div>
            <div><Label>Negative prompt</Label><Textarea placeholder="shaky, low resolution, artifacts, distortion..." style={{ minHeight: "70px" }} /></div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Video settings</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <RangeField label="Duration" min={1} max={30} value={duration} onChange={e => setDuration(e.target.value)} unit="s" />
            <RangeField label="Frame rate" min={12} max={60} value={fps} onChange={e => setFps(e.target.value)} unit=" fps" />

            <div><Label>Visual style</Label>
              <Select>{VIDEO_STYLES.map(s => <option key={s}>{s}</option>)}</Select>
            </div>

            <div>
              <Label>Resolution</Label>
              <div className="res-grid">
                {VIDEO_RESOLUTIONS.map(r => (
                  <button key={r} onClick={() => setResolution(r)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `1px solid ${resolution === r ? "#6366f1" : "#2a2d35"}`, background: resolution === r ? "#1e1f2e" : "transparent", color: resolution === r ? "#a5b4fc" : "#6b7280", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Seed</Label>
              <div className="seed-row-v">
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

        <GenerateButton label="Generate Video" />
      </div>
    </>
  );
}
