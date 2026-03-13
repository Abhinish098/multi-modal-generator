export default function Textarea({ style = {}, ...props }) {
  return (
    <textarea
      style={{
        width: "100%",
        background: "#111318",
        border: "1px solid #2a2d35",
        borderRadius: "8px",
        color: "#e5e7eb",
        fontSize: "14px",
        padding: "12px 14px",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "inherit",
        resize: "vertical",
        minHeight: "90px",
        lineHeight: 1.6,
        transition: "border-color 0.2s",
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = "#2a2d35"}
      {...props}
    />
  );
}
