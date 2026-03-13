import { useState } from "react";
import { ICONS } from "../constants/config";

export default function GenerateButton({ label = "Generate" }) {
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <button
      onClick={handle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
        padding: "13px",
        background: loading ? "#3730a3" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        opacity: loading ? 0.8 : 1,
      }}
    >
      {loading ? (
        <>
          <span style={{
            width: "14px",
            height: "14px",
            border: "2px solid #ffffff44",
            borderTopColor: "#fff",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }} />
          Processing...
        </>
      ) : (
        <>{ICONS.generate} {label}</>
      )}
    </button>
  );
}
