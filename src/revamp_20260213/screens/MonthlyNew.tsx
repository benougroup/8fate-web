import React, { useEffect, useState } from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { PageContent } from "../components/PageContent";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { CardFlip } from "../components/CardFlip";
import { LifeDomainCard } from "../components/LifeDomainCard";
import { Grid } from "../components/Grid";
import { Badge } from "../components/Badge";
import type { MonthlyFortune } from "../services/mock/baziTypes";
import { MOCK_MONTHLY_FORTUNE } from "../services/mock/baziDataExtended";

export const MonthlyNew: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyFortune | null>(null);
  const [isLuckFlipped, setIsLuckFlipped] = useState(false);

  useEffect(() => {
    // Simulate loading monthly data
    setTimeout(() => {
      setMonthlyData(MOCK_MONTHLY_FORTUNE);
    }, 300);
  }, []);

  if (!monthlyData) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title="Monthly" />
          <PageContent className="revamp-innerPageContent">
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              Loading monthly fortune...
            </div>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  // Luck & Avoid Flip Card
  const luckFrontContent = (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--c-ink)" }}>
        Luck This Month
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {monthlyData.luck.map((item, idx) => (
          <li key={idx} style={{ fontSize: "14px", color: "var(--c-text)" }}>
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const luckBackContent = (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>❌</div>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--c-ink)" }}>
        Avoid This Month
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {monthlyData.avoid.map((item, idx) => (
          <li key={idx} style={{ fontSize: "14px", color: "var(--c-text)" }}>
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar
          title={monthlyData.month}
          subtitle={`流月（${monthlyData.chineseMonth}）`}
        />
        <PageContent className="revamp-innerPageContent">
        {/* Monthly Overview */}
        <section style={{ marginBottom: "32px" }}>
          <p style={{ 
            fontSize: "15px", 
            lineHeight: "1.7", 
            color: "var(--c-text)", 
            textAlign: "center",
            fontStyle: "italic"
          }}>
            {monthlyData.overview}
          </p>
        </section>

        {/* Monthly Luck & Avoid - Interactive Flip Card */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Monthly Guidance
          </h2>
          <div 
            onClick={() => setIsLuckFlipped(!isLuckFlipped)}
            style={{ cursor: "pointer", height: "240px" }}
          >
            <CardFlip
              frontContent={luckFrontContent}
              backContent={luckBackContent}
              isFlipped={isLuckFlipped}
            />
          </div>
          <p style={{ 
            textAlign: "center", 
            fontSize: "12px", 
            color: "var(--c-text-muted)", 
            marginTop: "8px" 
          }}>
            Tap to flip
          </p>
        </section>

        {/* Monthly Fortune Hints */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Fortune Hints
          </h2>
          <Grid columns={2} gap="12px">
            <div style={{ 
              padding: "16px", 
              background: "var(--c-surface-solid)", 
              borderRadius: "12px",
              border: "1px solid var(--c-border)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "var(--c-text-muted)", marginBottom: "8px" }}>
                Lucky Color
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <div style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  background: monthlyData.luckyColor,
                  border: "2px solid var(--c-border)"
                }} />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--c-ink)" }}>
                  {monthlyData.luckyColor}
                </span>
              </div>
            </div>

            <div style={{ 
              padding: "16px", 
              background: "var(--c-surface-solid)", 
              borderRadius: "12px",
              border: "1px solid var(--c-border)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "var(--c-text-muted)", marginBottom: "8px" }}>
                Lucky Number
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--c-accent)" }}>
                {monthlyData.luckyNumber}
              </div>
            </div>

            <div style={{ 
              padding: "16px", 
              background: "var(--c-surface-solid)", 
              borderRadius: "12px",
              border: "1px solid var(--c-border)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "var(--c-text-muted)", marginBottom: "8px" }}>
                Active Element
              </div>
              <Badge variant="success">{monthlyData.activeElement}</Badge>
            </div>

            <div style={{ 
              padding: "16px", 
              background: "var(--c-surface-solid)", 
              borderRadius: "12px",
              border: "1px solid var(--c-border)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "var(--c-text-muted)", marginBottom: "8px" }}>
                Watch Element
              </div>
              <Badge variant="warning">{monthlyData.weakElement}</Badge>
            </div>
          </Grid>
        </section>

        {/* Life Domains - Core Section */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Life Domains — Monthly Trends
          </h2>
          <Grid columns={2} gap="16px">
            {monthlyData.lifeDomains.map((domain, idx) => (
              <LifeDomainCard key={idx} domain={domain} />
            ))}
          </Grid>
        </section>

        {/* Day Master × Month Interaction */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ 
            padding: "20px", 
            background: "var(--c-surface-solid)", 
            borderRadius: "12px",
            border: "1px solid var(--c-border)"
          }}>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              marginBottom: "12px",
              color: "var(--c-ink)",
              textAlign: "center"
            }}>
              How You Interact with This Month
            </h3>
            <p style={{ 
              fontSize: "14px", 
              lineHeight: "1.6", 
              color: "var(--c-text)",
              textAlign: "center"
            }}>
              {monthlyData.dayMasterInteraction}
            </p>
          </div>
        </section>

        {/* Protection / Support Recommendation */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ 
            padding: "20px", 
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
            borderRadius: "12px",
            border: "1px solid var(--c-border)"
          }}>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: "var(--c-ink)",
              textAlign: "center"
            }}>
              🛡️ Protection Focus
            </h3>
            <p style={{ 
              fontSize: "15px", 
              fontWeight: "600",
              color: "var(--c-accent)",
              textAlign: "center",
              marginBottom: "12px"
            }}>
              {monthlyData.protectionFocus}
            </p>
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              margin: 0, 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px"
            }}>
              {monthlyData.protectionSuggestions.map((suggestion, idx) => (
                <li key={idx} style={{ 
                  fontSize: "13px", 
                  color: "var(--c-text)",
                  textAlign: "center"
                }}>
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upcoming Feature Teaser */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ 
            padding: "20px", 
            background: "var(--c-surface-solid)", 
            borderRadius: "12px",
            border: "1px dashed var(--c-border)",
            textAlign: "center",
            opacity: 0.6
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔮</div>
            <h3 style={{ 
              fontSize: "14px", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: "var(--c-text-muted)"
            }}>
              Coming Soon
            </h3>
            <p style={{ 
              fontSize: "13px", 
              color: "var(--c-text-muted)"
            }}>
              Pick the best days this month for important decisions
            </p>
          </div>
        </section>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
};
