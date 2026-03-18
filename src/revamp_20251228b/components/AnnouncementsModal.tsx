import * as React from "react";
import { t } from "../i18n/t";
import { buildAnnouncementUrl, getAnnouncementsForLocale, resolveAnnouncementImage } from "../services/mock/announcements";
import { usePreferences } from "../stores/preferencesStore";
import { Button } from "./Button";
import { CarouselIndicator } from "./CarouselIndicator";
import { PillLink } from "./PillButton";
import { ScrollWindow } from "./ScrollWindow";
import { Text } from "./Text";

type AnnouncementsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AnnouncementsModal({ open, onClose }: AnnouncementsModalProps) {
  const { locale } = usePreferences();
  const announcements = getAnnouncementsForLocale(locale);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0 });
    }
  }, [open]);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }

    const handleScroll = () => {
      const width = node.clientWidth || 1;
      const index = Math.round(node.scrollLeft / width);
      setActiveIndex(index);
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = (index: number) => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    const width = node.clientWidth;
    node.scrollTo({ left: width * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <ScrollWindow open={open} onClose={onClose} title={t("announcements.title")}>
      <div className="revamp-announcementModal">
        {announcements.length ? (
          <>
            <div className="revamp-announcementCarousel" ref={scrollRef}>
              {announcements.map((item) => {
                const learnMoreUrl = buildAnnouncementUrl(item.url, locale);
                return (
                  <article key={item.id} className="revamp-announcementSlide">
                    <img
                      className="revamp-announcementImage"
                      src={resolveAnnouncementImage(item.image)}
                      alt=""
                    />
                    <div className="revamp-announcementContent">
                      <Text className="revamp-announcementTitle">
                        {t("announcements.cardTitle", { id: item.id })}
                      </Text>
                      <Text className="revamp-announcementBody">
                        {t("announcements.cardBody")}
                      </Text>
                      <div className="revamp-announcementActions">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            window.open(learnMoreUrl, "_blank", "noopener,noreferrer")
                          }
                        >
                          {t("announcements.learnMore")}
                        </Button>
                        <PillLink to={`/announcement/${item.id}`}>
                          {t("announcements.viewDetails")}
                        </PillLink>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <CarouselIndicator
              count={announcements.length}
              activeIndex={activeIndex}
              onSelect={handleSelect}
              getAriaLabel={(index) =>
                t("announcements.carouselLabel", { index: index + 1 })
              }
            />
          </>
        ) : (
          <Text className="revamp-announcementEmpty">
            {t("announcements.emptyBody")}
          </Text>
        )}
      </div>
    </ScrollWindow>
  );
}
