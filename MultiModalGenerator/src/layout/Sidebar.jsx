import { ICONS } from "../constants/config";

const MODES = [
  { id: "image",    label: "Image Generation",    icon: ICONS.image },
  { id: "video",    label: "Video Generation",     icon: ICONS.video },
  { id: "object3d", label: "3D Object Generation", icon: ICONS.object3d },
];

export { MODES };

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const handleSelect = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 40,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
          display: "none",
        }}
        className="mmg-backdrop"
      />

      {/* Sidebar */}
      <aside className="mmg-sidebar" style={{
        width: "240px", minWidth: "240px",
        background: "#0a0b10",
        borderRight: "1px solid #1a1c26",
        display: "flex", flexDirection: "column",
        flexShrink: 0, zIndex: 50,
      }}>
        {/* Logo row */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1a1c26", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.04em", color: "#f9fafb" }}>MultiModal</span>
            </div>
            <p style={{ fontSize: "11px", color: "#4b5563", letterSpacing: "0.05em", paddingLeft: "38px" }}>Generator</p>
          </div>
          {/* Close btn — visible on mobile only via CSS */}
          <button onClick={() => setMobileOpen(false)} className="mmg-close-btn" style={{ display: "none", background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", padding: "2px", marginTop: "2px" }}>
            <CloseIcon />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#374151", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px" }}>Generators</p>
          {MODES.map(m => {
            const isActive = active === m.id;
            return (
              <button key={m.id} onClick={() => handleSelect(m.id)} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "11px 12px", borderRadius: "10px", border: "none", borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent", background: isActive ? "#16181f" : "transparent", color: isActive ? "#a5b4fc" : "#6b7280", fontSize: "13px", fontWeight: isActive ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left", marginBottom: "2px", transition: "all 0.15s" }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#111318"; e.currentTarget.style.color = "#9ca3af"; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}}>
                <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1c26" }}>
          <p style={{ fontSize: "11px", color: "#374151" }}>v0.1.0 — alpha</p>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .mmg-backdrop { display: block !important; }
          .mmg-close-btn { display: flex !important; }
          .mmg-sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.25s ease;
            box-shadow: ${mobileOpen ? "8px 0 32px rgba(0,0,0,0.6)" : "none"};
          }
        }
      `}</style>
    </>
  );
}
