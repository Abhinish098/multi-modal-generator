import { ICONS } from "../constants/config";

const DESCRIPTIONS = {
  image:    "Generate high-quality images from text prompts",
  video:    "Create short video clips from descriptive prompts",
  object3d: "Generate exportable 3D mesh objects from descriptions",
};

const LABELS = {
  image:    "Image Generation",
  video:    "Video Generation",
  object3d: "3D Object Generation",
};

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Header({ active, onMenuClick }) {
  return (
    <div style={{
      padding: "18px 24px",
      borderBottom: "1px solid #1a1c26",
      background: "#0d0e14",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      flexShrink: 0,
    }}>
      {/* Hamburger — mobile only via CSS */}
      <button
        onClick={onMenuClick}
        className="mmg-hamburger"
        style={{
          display: "none",
          background: "transparent", border: "1px solid #2a2d35",
          borderRadius: "8px", color: "#9ca3af",
          cursor: "pointer", padding: "7px",
          alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "border-color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2d35"}
      >
        <HamburgerIcon />
      </button>

      {/* Title + description */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <span style={{ color: "#6366f1", flexShrink: 0 }}>{ICONS[active]}</span>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.01em", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {LABELS[active]}
          </h1>
          <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {DESCRIPTIONS[active]}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mmg-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
