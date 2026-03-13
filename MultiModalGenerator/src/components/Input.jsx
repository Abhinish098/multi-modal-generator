export default function Input({ style = {}, ...props }) {
  return (
    <input
      style={{
        width: "100%",
        background: "#111318",
        border: "1px solid #2a2d35",
        borderRadius: "8px",
        color: "#e5e7eb",
        fontSize: "14px",
        padding: "10px 14px",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "inherit",
        transition: "border-color 0.2s",
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = "#2a2d35"}
      {...props}
    />
  );
}
