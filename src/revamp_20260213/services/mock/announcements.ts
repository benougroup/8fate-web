import lunarHorizonImage from "@/assets/images/ui/background_001.png";
import starlightRitualImage from "@/assets/images/ui/background_002.png";
import announcementsData from "./announcements.json";

export type Announcement = {
  id: string;
  image: string;
  url: string;
  languages: string[];
};

const announcementImageMap: Record<string, string> = {
  "lunar-horizon": lunarHorizonImage,
  "starlight-ritual": starlightRitualImage,
};

export const announcements = announcementsData as Announcement[];

export const resolveAnnouncementImage = (imageKey: string): string =>
  announcementImageMap[imageKey] ?? lunarHorizonImage;

export const getAnnouncementsForLocale = (locale: string): Announcement[] =>
  announcements.filter((item) => item.languages.includes(locale));

export const getAnnouncementById = (id: string): Announcement | undefined =>
  announcements.find((item) => item.id === id);

export const buildAnnouncementUrl = (url: string, locale: string): string => {
  try {
    const resolved = new URL(url);
    resolved.searchParams.set("lang", locale);
    return resolved.toString();
  } catch {
    return url;
  }
};
