/**
 * AuspiciousDates.tsx — Auspicious Date Picker (revamp_20260213)
 *
 * Layout:
 *  1. ContentPageTopBar (menu page — no back button)
 *  2. Page title + subtitle (SectionTitleRow with ?)
 *  3. Month navigator (← MONTH YEAR →)
 *  4. Mini calendar grid — days with auspicious score dots
 *     - Only months from sign-up date up to today are accessible
 *     - Future months are locked
 *  5. Selected date detail card:
 *     - Day pillar (compact horizontal)
 *     - Score bar
 *     - Favorable / Unfavorable activities
 *     - Analysis (premium-locked for isPremium dates)
 */
import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { ContentPageTopBar } from "../components/ContentPageTopBar";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";
import { MOCK_AUSPICIOUS_DATES } from "../services/mock/baziData";
import type { AuspiciousDate } from "../services/mock/baziTypes";

const MONTH_NAMES_FULL = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function scoreColor(score: number) {
  if (score >= 85) return "var(--c-success)";
  if (score >= 70) return "var(--c-accent)";
  if (score >= 50) return "var(--c-warning)";
  return "var(--c-error)";
}

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Avoid";
}

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function MiniCalendar({
  year, month, dates, selectedDate, onSelect, minDate, maxDate,
}: {
  year: number; month: number; dates: AuspiciousDate[];
  selectedDate: string | null; onSelect: (d: AuspiciousDate) => void;
  minDate: Date; maxDate: Date;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateMap: Record<string, AuspiciousDate> = {};
  for (const ad of dates) {
    const [y, m] = ad.date.split("-").map(Number);
    if (y === year && m - 1 === month) dateMap[ad.date] = ad;
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="revamp-calendar">
      <div className="revamp-calendarHeader">
        {DAY_NAMES.map((d) => (
          <div key={d} className="revamp-calendarDayName">{d}</div>
        ))}
      </div>
      <div className="revamp-calendarGrid">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="revamp-calendarDay revamp-calendarDay--empty" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const ad = dateMap[dateStr];
          const cellDate = new Date(year, month, day);
          const isAccessible = cellDate >= minDate && cellDate <= maxDate;
          const isSelected = selectedDate === dateStr;
          const isToday = toYMD(new Date()) === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={!isAccessible || !ad}
              onClick={() => { if (ad && isAccessible) onSelect(ad); }}
              className={[
                "revamp-calendarDay",
                isSelected ? "revamp-calendarDay--selected" : "",
                isToday ? "revamp-calendarDay--today" : "",
                !isAccessible ? "revamp-calendarDay--disabled" : "",
                ad && isAccessible ? "revamp-calendarDay--hasReading" : "",
              ].filter(Boolean).join(" ")}
            >
              <span className="revamp-calendarDayNum">{day}</span>
              {ad && isAccessible && (
                <span className="revamp-calendarDot" style={{ background: scoreColor(ad.score) }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AuspiciousDates() {
  const { isPremium } = usePreferences();
  const { profile } = useProfile();

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const signUpDate = React.useMemo(() => {
    if (profile.signUpDate) {
      const d = new Date(profile.signUpDate);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [profile.signUpDate]);

  const [calYear, setCalYear] = React.useState(today.getFullYear());
  const [calMonth, setCalMonth] = React.useState(today.getMonth());
  const [selectedDate, setSelectedDate] = React.useState<AuspiciousDate | null>(null);

  const canGoPrev = new Date(calYear, calMonth, 1) > new Date(signUpDate.getFullYear(), signUpDate.getMonth(), 1);
  const canGoNext = new Date(calYear, calMonth, 1) < new Date(today.getFullYear(), today.getMonth(), 1);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };
  const goNext = () => {
    if (!canGoNext) return;
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };

  const monthDates = MOCK_AUSPICIOUS_DATES.filter((ad) => {
    const [y, m] = ad.date.split("-").map(Number);
    return y === calYear && m - 1 === calMonth;
  });

  React.useEffect(() => {
    if (monthDates.length > 0) setSelectedDate(monthDates[0]);
    else setSelectedDate(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calYear, calMonth]);

  const isLocked = selectedDate?.isPremium && !isPremium;

  return (
    <Page>
      <PageCard>
        <ContentPageTopBar />
        <PageContent>
          <Stack gap="lg">

            <div>
              <h1 style={{ fontSize: "var(--fs-xl)", fontWeight: 800, marginBottom: 4 }}>
                {t("bazi.auspicious.title")}
              </h1>
              <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-text-muted)" }}>
                {t("bazi.auspicious.subtitle")}
              </p>
            </div>

            {/* Month Navigator */}
            <div className="revamp-calendarNav">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                className="revamp-calendarNavBtn"
                aria-label="Previous month"
              >
                ←
              </button>
              <span className="revamp-calendarNavLabel">
                {MONTH_NAMES_FULL[calMonth]} {calYear}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="revamp-calendarNavBtn"
                aria-label="Next month"
              >
                →
              </button>
            </div>

            {/* Legend */}
            <div className="revamp-calendarLegend">
              {[
                { label: "Excellent", color: "var(--c-success)" },
                { label: "Good", color: "var(--c-accent)" },
                { label: "Fair", color: "var(--c-warning)" },
              ].map(({ label, color }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--fs-xs)" }}>
                  <span className="revamp-calendarLegendDot" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>

            {/* Calendar */}
            <MiniCalendar
              year={calYear}
              month={calMonth}
              dates={MOCK_AUSPICIOUS_DATES}
              selectedDate={selectedDate?.date ?? null}
              onSelect={setSelectedDate}
              minDate={signUpDate}
              maxDate={today}
            />

            {monthDates.length === 0 && (
              <Card>
                <Text muted style={{ textAlign: "center", padding: "var(--s-4) 0" }}>
                  No auspicious dates recorded for this month.
                </Text>
              </Card>
            )}

            {/* Selected Date Detail */}
            {selectedDate && (
              <PageSection>
                <div style={{ marginBottom: "var(--s-2)", display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
                  <span style={{ fontSize: "var(--fs-xs)", color: "var(--c-text-muted)" }}>日柱</span>
                  <span style={{ fontWeight: 800, fontSize: "var(--fs-md)", color: "var(--c-ink)" }}>
                    {new Date(selectedDate.date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric"
                    })}
                  </span>
                </div>

                {/* Score */}
                <Card style={{ marginBottom: "var(--s-3)" }}>
                  <Stack gap="sm">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontWeight: 700, fontSize: "var(--fs-lg)" }}>
                        {scoreLabel(selectedDate.score)}
                      </Text>
                      <Text style={{ fontWeight: 800, fontSize: "var(--fs-xl)", color: scoreColor(selectedDate.score) }}>
                        {selectedDate.score}/100
                      </Text>
                    </div>
                    <div className="revamp-scoreBar">
                      <div className="revamp-scoreBarFill"
                        style={{ width: `${selectedDate.score}%`, background: scoreColor(selectedDate.score) }} />
                    </div>
                  </Stack>
                </Card>

                {/* Day Pillar */}
                <div style={{ marginBottom: "var(--s-3)" }}>
                  <BaziPillarCard pillar={selectedDate.dayPillar} label={t("bazi.chart.dayPillar")} compact />
                </div>

                {/* Favorable / Unfavorable */}
                <Card style={{ marginBottom: "var(--s-3)" }}>
                  <Stack gap="md">
                    <div>
                      <Text style={{ fontWeight: 700, color: "var(--c-success)", marginBottom: "var(--s-1)" }}>
                        ✓ {t("bazi.auspicious.favorableFor")}
                      </Text>
                      <div className="revamp-tagRow">
                        {selectedDate.favorableFor.map((item) => (
                          <span key={item} className="revamp-tag revamp-tag--success">{item}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Text style={{ fontWeight: 700, color: "var(--c-error)", marginBottom: "var(--s-1)" }}>
                        ✗ {t("bazi.auspicious.unfavorableFor")}
                      </Text>
                      <div className="revamp-tagRow">
                        {selectedDate.unfavorableFor.map((item) => (
                          <span key={item} className="revamp-tag revamp-tag--error">{item}</span>
                        ))}
                      </div>
                    </div>
                  </Stack>
                </Card>

                {/* Analysis */}
                <Card>
                  {isLocked ? (
                    <Stack gap="sm" align="center">
                      <div style={{ fontSize: "2rem" }}>🔒</div>
                      <Text style={{ fontWeight: 700, textAlign: "center" }}>Premium Reading</Text>
                      <Text muted style={{ textAlign: "center", fontSize: "var(--fs-sm)" }}>
                        Upgrade to Premium to unlock the full analysis for this date.
                      </Text>
                      <button type="button" className="revamp-premiumCta"
                        onClick={() => { window.location.href = "/premium"; }}>
                        Unlock Premium
                      </button>
                    </Stack>
                  ) : (
                    <Stack gap="xs">
                      <Text style={{ fontWeight: 700 }}>{t("bazi.auspicious.analysis")}</Text>
                      <Text muted>{selectedDate.analysis}</Text>
                    </Stack>
                  )}
                </Card>
              </PageSection>
            )}
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
