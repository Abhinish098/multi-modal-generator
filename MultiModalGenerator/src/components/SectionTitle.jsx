export default function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
      <div style={{
        width: "3px",
        height: "18px",
        background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
        borderRadius: "2px",
      }} />
      <h3 style={{
        margin: 0,
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#9ca3af",
      }}>
        {children}
      </h3>
    </div>
  );
}
