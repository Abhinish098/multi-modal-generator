export default function Label({ children }) {
  return (
    <label style={{
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#6b7280",
      marginBottom: "6px",
      display: "block",
    }}>
      {children}
    </label>
  );
}
