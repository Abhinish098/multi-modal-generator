export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#16181f",
      border: "1px solid #1f2130",
      borderRadius: "12px",
      padding: "20px",
      ...style,
    }}>
      {children}
    </div>
  );
}
