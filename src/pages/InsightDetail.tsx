import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppShell from "@/components/AppShell";
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconBack from "@/assets/images/general icons/back_page_icon.png";
import BackgroundScreen from "@/components/BackgroundScreen";
import DetailHeader from "@/components/DetailHeader";
import GlassCard from "@/components/GlassCard";

const INSIGHT_CONTENT: Record<string, { title: string; body: string }> = {
  career: {
    title: "Career Reading",
    body:
      "This section reveals your career potential and strengths using ancient Chinese Metaphysics. It helps identify ideal professions, areas for growth, and talents you can develop in your work life.",
  },
  family: {
    title: "Family Reading",
    body:
      "This section provides insights into your relationship with family members. It reflects emotional dynamics, support systems, and challenges within your family based on your chart.",
  },
  love: {
    title: "Love Reading",
    body:
      "The Love Reading analyzes your romantic destiny—your emotional needs, ideal partner traits, and relationship patterns. It can also show compatibility and areas to grow in love.",
  },
  talent: {
    title: "Talent Reading",
    body:
      "Your natural gifts and creative potential are revealed here. This section explores skills, personal strengths, and talents that help you stand out or find your life calling.",
  },
  wealth: {
    title: "Wealth Reading",
    body:
      "This reading helps you understand your wealth potential, earning capacity, and attitude toward money. It can show how to grow prosperity through work, timing, and alignment with your element.",
  },
  health: {
    title: "Health Reading",
    body:
      "Your chart offers clues about your physical constitution and energetic balance. Understanding your elemental weaknesses helps you proactively maintain vitality and balance.",
  },
};

export default function InsightDetail() {
  const navigate = useNavigate();
  const { category } = useParams();
  const content = INSIGHT_CONTENT[category || ""] || {
    title: "Insight",
    body: "Content unavailable.",
  };

  return (
    <AppShell>
      <style>{`
        .insight-screen {
          padding: 20px 20px 100px;
          color: #fff;
        }
        .insight-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .insight-card {
          padding: 24px;
          min-height: 200px;
        }
        .body-text {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.9;
          white-space: pre-wrap;
        }
      `}</style>

      <BackgroundScreen
        backgroundImage={backgroundImage}
        className="insight-screen"
        contentClassName="insight-content"
      >
        <DetailHeader title={content.title} backIcon={iconBack} onBack={() => navigate(-1)} />

        <GlassCard className="glass-card insight-card">
          <p className="body-text">{content.body}</p>
        </GlassCard>
      </BackgroundScreen>
    </AppShell>
  );
}
