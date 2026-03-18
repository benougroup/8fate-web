import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

type TimeSlot = {
  id: string;
  label: string;
  timeRange: string;
  isPremium: boolean;
};

const TIME_SLOTS: TimeSlot[] = [
  {
    id: "morning",
    label: t("timeFinder.morning"),
    timeRange: "06:00 - 12:00",
    isPremium: false,
  },
  {
    id: "morning_afternoon",
    label: t("timeFinder.morningAfternoon"),
    timeRange: "10:00 - 14:00",
    isPremium: true, // Premium slot
  },
  {
    id: "afternoon",
    label: t("timeFinder.afternoon"),
    timeRange: "12:00 - 18:00",
    isPremium: false,
  },
  {
    id: "afternoon_evening",
    label: t("timeFinder.afternoonEvening"),
    timeRange: "16:00 - 20:00",
    isPremium: true, // Premium slot
  },
  {
    id: "evening",
    label: t("timeFinder.evening"),
    timeRange: "18:00 - 24:00",
    isPremium: false,
  },
];

type TimeFinderModalProps = {
  onSelect: (time: string) => void;
  onClose: () => void;
};

export function TimeFinderModal({ onSelect, onClose }: TimeFinderModalProps) {
  const navigate = useNavigate();
  const { isPremium } = usePreferences();

  function handleSlotClick(slot: TimeSlot) {
    if (slot.isPremium && !isPremium) {
      // Redirect to premium page
      navigate("/premium");
      onClose();
      return;
    }

    // Select the time range
    onSelect(slot.timeRange);
  }

  return (
    <div className="revamp-timeFinderModal" onClick={onClose}>
      <div
        className="revamp-timeFinderCard"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--s-4)" }}>
          <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: 700, marginBottom: "var(--s-2)" }}>
            {t("timeFinder.title")}
          </h2>
          <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-text-muted)" }}>
            {t("timeFinder.subtitle")}
          </p>
        </div>

        {/* Time Slots */}
        <div className="revamp-timeFinderSlots">
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className={`revamp-timeFinderSlot ${
                slot.isPremium && !isPremium ? "revamp-timeFinderSlot--locked" : ""
              }`}
              onClick={() => handleSlotClick(slot)}
            >
              <div>
                <div className="revamp-timeFinderSlotLabel">{slot.label}</div>
                <div className="revamp-timeFinderSlotTime">{slot.timeRange}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          style={{ width: "100%", marginTop: "var(--s-4)" }}
        >
          {t("common.close")}
        </Button>
      </div>
    </div>
  );
}
