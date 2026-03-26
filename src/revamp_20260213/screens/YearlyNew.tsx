import React, { useEffect, useState } from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { PageContent } from "../components/PageContent";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Accordion, AccordionGroup } from "../components/Accordion";
import { MonthCalendar } from "../components/MonthCalendar";
import { LifeDomainCard } from "../components/LifeDomainCard";
import { CardFlip } from "../components/CardFlip";
import { Grid } from "../components/Grid";
import { Badge } from "../components/Badge";
import type { YearlyForecast } from "../services/mock/baziTypes";
import { MOCK_YEARLY_FORECAST } from "../services/mock/baziDataExtended";

export const YearlyNew: React.FC = () => {
  const [yearlyData, setYearlyData] = useState<YearlyForecast | null>(null);
  const [isLuckFlipped, setIsLuckFlipped] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading yearly data
    setTimeout(() => {
      setYearlyData(MOCK_YEARLY_FORECAST);
    }, 300);
  }, []);

  if (!yearlyData) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title="Yearly" backTo="/portfolio" />
          <PageContent className="revamp-innerPageContent">
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              Loading yearly forecast...
            </div>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month === selectedMonth ? null : month);
  };

  // Luck & Avoid Flip Card
  const luckFrontContent = (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--c-ink)" }}>
        Luck This Year
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {yearlyData.luck.map((item, idx) => (
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
        Avoid This Year
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {yearlyData.avoid.map((item, idx) => (
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
          title={`${yearlyData.year} 流年`}
          subtitle={`Year of the ${yearlyData.zodiac}`}
          backTo="/portfolio"
          iconLabel="year"
        />
        <PageContent className="revamp-innerPageContent">
        {/* Yearly Overview */}
        <section style={{ marginBottom: "32px" }}>
          <p style={{ 
            fontSize: "15px", 
            lineHeight: "1.7", 
            color: "var(--c-text)", 
            textAlign: "center",
            marginBottom: "20px"
          }}>
            {yearlyData.overview}
          </p>
        </section>

        {/* First Half vs Second Half - Accordion */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Year Analysis
          </h2>
          <AccordionGroup>
            <Accordion title="First Half (January - June)" icon="🌱" defaultOpen>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--c-text)" }}>
                {yearlyData.firstHalfAnalysis}
              </p>
            </Accordion>
            <Accordion title="Second Half (July - December)" icon="🌾">
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--c-text)" }}>
                {yearlyData.secondHalfAnalysis}
              </p>
            </Accordion>
          </AccordionGroup>
        </section>

        {/* Yearly Luck & Avoid - Interactive Flip Card */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Yearly Guidance
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

        {/* Life Domains - Yearly Outlook */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Life Domains — Yearly Outlook
          </h2>
          <Grid columns={2} gap="16px">
            {yearlyData.lifeDomains.map((domain, idx) => (
              <LifeDomainCard key={idx} domain={domain} />
            ))}
          </Grid>
        </section>

        {/* Key Months - Interactive Calendar */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "16px", 
            textAlign: "center",
            color: "var(--c-ink)"
          }}>
            Key Months
          </h2>
          <MonthCalendar
            favorableMonths={yearlyData.favorableMonths}
            unfavorableMonths={yearlyData.unfavorableMonths}
            criticalMonths={yearlyData.criticalMonths}
            onMonthClick={handleMonthClick}
          />
          
          {/* Selected Month Detail */}
          {selectedMonth && (
            <div style={{ 
              marginTop: "16px",
              padding: "16px", 
              background: "var(--c-surface-solid)", 
              borderRadius: "12px",
              border: "1px solid var(--c-border)",
              animation: "fadeIn 0.3s"
            }}>
              <h3 style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                marginBottom: "8px",
                color: "var(--c-ink)"
              }}>
                Month {selectedMonth} Details
              </h3>
              {yearlyData.monthlyPredictions[selectedMonth - 1] && (
                <>
                  <p style={{ 
                    fontSize: "14px", 
                    color: "var(--c-text)",
                    marginBottom: "8px"
                  }}>
                    {yearlyData.monthlyPredictions[selectedMonth - 1].prediction}
                  </p>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "var(--c-text-muted)",
                    fontStyle: "italic"
                  }}>
                    Element: {yearlyData.monthlyPredictions[selectedMonth - 1].elementInteraction}
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Protection Strategy */}
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
              marginBottom: "12px",
              color: "var(--c-ink)",
              textAlign: "center"
            }}>
              🛡️ Annual Protection Strategy
            </h3>
            <p style={{ 
              fontSize: "14px", 
              lineHeight: "1.6", 
              color: "var(--c-text)",
              textAlign: "center"
            }}>
              {yearlyData.protectionStrategy}
            </p>
            <div style={{ 
              marginTop: "16px",
              textAlign: "center"
            }}>
              <Badge variant="info">Premium: Personalized Protection Items</Badge>
            </div>
          </div>
        </section>

        {/* 10-Year Luck Pillar Context */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ 
            padding: "20px", 
            background: "var(--c-surface-solid)", 
            borderRadius: "12px",
            border: "1px solid var(--c-border)",
            textAlign: "center"
          }}>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: "var(--c-ink)"
            }}>
              🔮 10-Year Context
            </h3>
            <p style={{ 
              fontSize: "14px", 
              color: "var(--c-text)",
              marginBottom: "12px"
            }}>
              {yearlyData.luckPillarContext}
            </p>
            <button
              onClick={() => window.location.href = "/luck-pillars"}
              style={{
                padding: "8px 16px",
                background: "var(--c-accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s"
              }}
            >
              View Luck Pillars →
            </button>
          </div>
        </section>
         </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
};
