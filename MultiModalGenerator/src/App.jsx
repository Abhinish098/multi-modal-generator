import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import ImageForm from "./modules/ImageForm";
import VideoForm from "./modules/VideoForm";
import ObjectForm from "./modules/ObjectForm";

const FORMS = {
  image:    <ImageForm />,
  video:    <VideoForm />,
  object3d: <ObjectForm />,
};

export default function App() {
  const [active, setActive] = useState("image");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          height: 100%;
          background: #0d0e14;
          color: #e5e7eb;
          font-family: 'Outfit', sans-serif;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 3px; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Desktop layout ── */
        .mmg-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Main content area ── */
        .mmg-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .mmg-content {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px;
        }

        .mmg-form-wrap {
          max-width: 640px;
          width: 100%;
          animation: fadeIn 0.25s ease;
        }

        /* ── Tablet tweaks ── */
        @media (max-width: 1024px) {
          .mmg-content {
            padding: 24px 24px;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .mmg-shell {
            /* sidebar is position:fixed on mobile, so shell is just the main column */
            display: block;
            height: 100vh;
            overflow: hidden;
          }

          .mmg-main {
            height: 100vh;
          }

          .mmg-content {
            padding: 20px 16px;
          }

          .mmg-form-wrap {
            max-width: 100%;
          }
        }

        /* ── Small phones ── */
        @media (max-width: 480px) {
          .mmg-content {
            padding: 16px 12px;
          }
        }
      `}</style>

      <div className="mmg-shell">
        <Sidebar
          active={active}
          setActive={setActive}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="mmg-main">
          <Header active={active} onMenuClick={() => setMobileOpen(true)} />

          <div className="mmg-content">
            <div className="mmg-form-wrap" key={active}>
              {FORMS[active]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
