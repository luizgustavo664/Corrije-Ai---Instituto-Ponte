import { useState } from "react";
import { XMarkIcon, ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface Props {
  onClose: () => void;
}

export function CompartilharModal({ onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const url = "https://urlexemplo.com/prova/abc123";

  function handleCopy() {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <div
        className="bg-white rounded-2xl flex flex-col gap-5 relative"
        style={{
          width: 500,
          padding: "32px 32px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:opacity-70 transition-opacity"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <XMarkIcon className="w-4 h-4" style={{ color: "#6A7181" }} />
        </button>

        {/* Title */}
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#000" }}>
          Publicar e Compartilhar
        </h2>

        {/* URL row */}
        <div className="flex gap-2 items-center">
          <div
            className="flex-1 flex items-center px-3 rounded-xl"
            style={{
              height: 44,
              border: "1px solid #D7D7D9",
              backgroundColor: "#F7F8FA",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#444",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {url}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center rounded-xl shrink-0 hover:opacity-80 transition-all"
            style={{
              width: 44,
              height: 44,
              border: "1.5px solid #D7D7D9",
              backgroundColor: copied ? "#6B6FA3" : "#fff",
            }}
            title="Copiar link"
          >
            {copied
              ? <CheckIcon className="w-[18px] h-[18px]" style={{ color: "#F9B233" }} />
              : <ClipboardDocumentIcon className="w-[18px] h-[18px]" style={{ color: "#6A7181" }} />
            }
          </button>
        </div>

        {/* QR Code area */}
        <div
          className="rounded-2xl flex flex-col items-center justify-center gap-4"
          style={{
            backgroundColor: "#F7F8FA",
            border: "1px solid #E6E6E6",
            padding: "32px 0 28px",
          }}
        >
          {/* QR code placeholder drawn with SVG */}
          <div
            className="rounded-2xl flex items-center justify-center bg-white"
            style={{ width: 160, height: 160, border: "1px solid #E0E0E0" }}
          >
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
              {/* Top-left finder */}
              <rect x="5" y="5" width="30" height="30" rx="4" fill="#1a1a1a" />
              <rect x="11" y="11" width="18" height="18" rx="2" fill="white" />
              <rect x="16" y="16" width="8" height="8" rx="1" fill="#1a1a1a" />
              {/* Top-right finder */}
              <rect x="75" y="5" width="30" height="30" rx="4" fill="#1a1a1a" />
              <rect x="81" y="11" width="18" height="18" rx="2" fill="white" />
              <rect x="86" y="16" width="8" height="8" rx="1" fill="#1a1a1a" />
              {/* Bottom-left finder */}
              <rect x="5" y="75" width="30" height="30" rx="4" fill="#1a1a1a" />
              <rect x="11" y="81" width="18" height="18" rx="2" fill="white" />
              <rect x="16" y="86" width="8" height="8" rx="1" fill="#1a1a1a" />
              {/* Data modules (simplified) */}
              <rect x="42" y="5"  width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="50" y="5"  width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="58" y="5"  width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="13" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="58" y="13" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="21" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="50" y="21" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="50" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="58" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="66" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="50" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="58" y="50" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="58" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="50" y="58" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="66" y="58" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="75" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="83" y="50" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="75" y="58" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="99" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="5"  y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="13" y="50" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="5"  y="58" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="21" y="42" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="29" y="50" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="75" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="50" y="75" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="83" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="58" y="83" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="66" y="75" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="42" y="99" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="58" y="91" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="66" y="99" width="6" height="6" rx="1" fill="#1a1a1a" />
              <rect x="50" y="99" width="6" height="6" rx="1" fill="#1a1a1a" />
            </svg>
          </div>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6A7181" }}>
            QR Code da prova
          </p>
        </div>
      </div>
    </div>
  );
}