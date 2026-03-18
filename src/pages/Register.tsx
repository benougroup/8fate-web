import React from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_002.png";
import iconStart from "@/assets/images/general icons/start_icon.png";

// --- COMPONENTS ---
import AppShell from "@/components/AppShell";
import BackgroundScreen from "@/components/BackgroundScreen";
import Button from "@/components/Button";

// --- SERVICES ---
import { getSession } from "@services/sessionStore";

export default function Register() {
  const navigate = useNavigate();
  const session = getSession();
  const name = session?.name || "Traveler";
  const email = "Test_email@gmail.com";

  const handleStart = () => {
    // Flow: Register -> Terms -> Profile Setup
    navigate("/terms", { state: { mode: "accept" } });
  };

  return (
    <AppShell hideNav>
      <style>{`
        .reg-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          color: #fff;
        }
        .reg-content {
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244, 215, 62, 0.2) 0%, rgba(0,0,0,0) 70%);
          border: 1px solid rgba(244, 215, 62, 0.4);
          display: grid;
          place-items: center;
          margin-bottom: 8px;
          box-shadow: 0 0 30px rgba(244, 215, 62, 0.15);
        }
        .main-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #F4D73E;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        .email-tag {
          background: rgba(255,255,255,0.1);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-top: -12px;
        }
      `}</style>

      <BackgroundScreen backgroundImage={backgroundImage} contentClassName="reg-screen">
        <div className="reg-content">
          <div className="icon-circle">
            <img src={iconStart} className="main-icon" alt="Start" />
          </div>

          <div>
            <h1 className="title">Welcome, {name}</h1>
            <div style={{ height: 12 }} />
            <div className="email-tag">{email}</div>
            <div style={{ height: 12 }} />
            <p className="subtitle">Your account has been successfully created.</p>
            <p className="subtitle" style={{ fontSize: 14, opacity: 0.6, marginTop: 8 }}>
              To reveal your destiny chart and lucky elements, we need to map your birth details.
            </p>
          </div>

          <Button variant="primary" size="lg" onClick={handleStart} style={{ width: "100%", marginTop: 16 }}>
            Begin Your Journey
          </Button>
        </div>
      </BackgroundScreen>
    </AppShell>
  );
}
