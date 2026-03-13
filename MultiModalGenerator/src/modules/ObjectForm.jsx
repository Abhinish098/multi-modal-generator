import { useState } from "react";
import Card from "../components/Card";
import Label from "../components/Label";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import SectionTitle from "../components/SectionTitle";
import GenerateButton from "../components/GenerateButton";
import { MESH_STYLES, FORMATS } from "../constants/config";

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

export default function ObjectForm() {
  const [detail, setDetail] = useState(5);
  const [smooth, setSmooth] = useState(3);
  const [activeFormat, setActiveFormat] = useState("GLB");

  return (
    <>
      <style>{`
        .fmt-grid { display: flex; gap: 8px; flex-wrap: wrap; }
        @media (max-width: 480px) {
          .fmt-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Card>
          <SectionTitle>Description</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><Label>Object description</Label><Textarea placeholder="A worn leather armchair with brass nail trim, realistic surface texture, aged patina..." /></div>
            <div><Label>Reference keywords</Label><Input placeholder="e.g. antique, wooden, weathered, ornate" /></div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Mesh settings</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <RangeField label="Polygon detail" min={1} max={10} value={detail} onChange={e => setDetail(e.target.value)} />
            <RangeField label="Surface smoothing" min={0} max={5} value={smooth} onChange={e => setSmooth(e.target.value)} />

            <div><Label>Mesh style</Label>
              <Select>{MESH_STYLES.map(s => <option key={s}>{s}</option>)}</Select>
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
              <input type="checkbox" id="tex" defaultChecked style={{ accentColor: "#6366f1", width: "16px", height: "16px", flexShrink: 0 }} />
              <label htmlFor="tex" style={{ fontSize: "14px", color: "#d1d5db", cursor: "pointer", lineHeight: 1.4 }}>
                Generate PBR textures (albedo, normal, roughness)
              </label>
            </div>
          </div>
        </Card>

        <GenerateButton label="Generate 3D Object" />
      </div>
    </>
  );
}
