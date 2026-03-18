import * as React from "react";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { AlertDialog, type AlertDialogAction } from "../components/AlertDialog";
import { BottomSheet } from "../components/BottomSheet";
import { Button } from "../components/Button";
import { CardFlip } from "../components/CardFlip";
import { InfoPopover } from "../components/InfoPopover";
import {
  HorizontalCardRail,
  HorizontalCardRailItem,
} from "../components/HorizontalCardRail";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageDivider } from "../components/PageDivider";
import { PageHeader } from "../components/PageHeader";
import { PillButton, PillLink } from "../components/PillButton";
import { ScrollWindow } from "../components/ScrollWindow";
import { SectionCard } from "../components/SectionCard";
import { SkinToggleIcon } from "../components/SkinToggleIcon";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TopBar } from "../components/TopBar";
import { UiIcon } from "../components/UiIcon";
import { NotificationCenter } from "../components/NotificationCenter";
import { RadioGroup, RadioOption } from "../components/RadioGroup";
import { FiveElementRadarChart } from "../components/FiveElementRadarChart";
import { RoundedBarChart } from "../components/RoundedBarChart";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

const TIME_OPTIONS = [
  "preview.components.options.morning",
  "preview.components.options.afternoon",
  "preview.components.options.evening",
  "preview.components.options.night",
];

const RAIL_ITEMS = [
  {
    title: "preview.components.railItems.focus.title",
    description: "preview.components.railItems.focus.body",
    href: "https://example.com/clarity",
    iconKey: "today",
  },
  {
    title: "preview.components.railItems.anchor.title",
    description: "preview.components.railItems.anchor.body",
    iconKey: "luck",
  },
  {
    title: "preview.components.railItems.momentum.title",
    description: "preview.components.railItems.momentum.body",
    iconKey: "avoid",
  },
  {
    title: "preview.components.railItems.alignment.title",
    description: "preview.components.railItems.alignment.body",
    iconKey: "protection",
  },
  {
    title: "preview.components.railItems.simplicity.title",
    description: "preview.components.railItems.simplicity.body",
    iconKey: "upcoming",
  },
  {
    title: "preview.components.railItems.radiance.title",
    description: "preview.components.railItems.radiance.body",
    iconKey: "energy_boost",
  },
] satisfies Array<{
  title: string;
  description: string;
  href?: string;
  iconKey: IconKey;
}>;

const ELEMENT_LABELS = [
  "preview.components.charts.labels.wood",
  "preview.components.charts.labels.fire",
  "preview.components.charts.labels.earth",
  "preview.components.charts.labels.metal",
  "preview.components.charts.labels.water",
] as const;

export function ComponentsPreview() {
  const { theme } = usePreferences();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selection, setSelection] = React.useState<string | null>(null);
  const [radioSelection, setRadioSelection] = React.useState<string | null>(null);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isScrollWindowOpen, setIsScrollWindowOpen] = React.useState(false);
  const [alertDialogType, setAlertDialogType] = React.useState<
    "ok" | "yes-no" | "proceed-discard" | null
  >(null);

  const closeAlertDialog = () => setAlertDialogType(null);
  const alertDialogActions: AlertDialogAction[] = (() => {
    if (!alertDialogType) {
      return [];
    }

    if (alertDialogType === "ok") {
      return [
        {
          key: "ok",
          label: t("revamp.alertDialog.ok"),
          variant: "primary",
          onPress: closeAlertDialog,
        },
      ];
    }

    if (alertDialogType === "yes-no") {
      return [
        {
          key: "yes",
          label: t("revamp.alertDialog.yes"),
          variant: "primary",
          onPress: closeAlertDialog,
        },
        {
          key: "no",
          label: t("revamp.alertDialog.no"),
          variant: "secondary",
          onPress: closeAlertDialog,
        },
      ];
    }

    return [
      {
        key: "proceed",
        label: t("revamp.alertDialog.proceed"),
        variant: "primary",
        onPress: closeAlertDialog,
      },
      {
        key: "discard",
        label: t("revamp.alertDialog.discard"),
        variant: "danger",
        onPress: closeAlertDialog,
      },
    ];
  })();

  const isAlertDialogOpen = alertDialogType !== null;
  const alertDialogBlocking = alertDialogType === "proceed-discard";

  return (
    <Page>
      <PageCard>
        <TopBar
          left={
            <>
              <UiIcon name="brand" size="sm" alt={t("icons.brandAlt")} />
              <span className="revamp-topBarTitle">{t("brand.geonLogoAlt")}</span>
            </>
          }
          center={t("preview.banner.title")}
          right={
            <>
              <NotificationCenter />
              <SkinToggleIcon />
            </>
          }
        />
        <PageContent>
          <Stack gap="md">
            <PageHeader
              title={t("preview.components.title")}
              subtitle={t("preview.components.subtitle")}
            />
            <SectionCard
              title={t("preview.components.dividerTitle")}
              subtitle={t("preview.components.dividerBody")}
            >
              <PageDivider />
            </SectionCard>
            <SectionCard
              title={t("preview.components.sheetTitle")}
              subtitle={t("preview.components.sheetBody")}
            >
              <Stack gap="sm" align="start">
                <PillButton type="button" onClick={() => setIsOpen(true)}>
                  {t("preview.components.sheetCta")}
                </PillButton>
                {selection ? (
                  <Text>{t("preview.components.sheetSelection", { selection })}</Text>
                ) : null}
              </Stack>
            </SectionCard>
            <SectionCard
              title={t("preview.components.scrollWindowTitle")}
              subtitle={t("preview.components.scrollWindowBody")}
            >
              <Stack gap="sm" align="start">
                <PillButton type="button" onClick={() => setIsScrollWindowOpen(true)}>
                  {t("preview.components.scrollWindowCta")}
                </PillButton>
              </Stack>
            </SectionCard>
            <SectionCard
              title={t("preview.components.alertDialogTitle")}
              subtitle={t("preview.components.alertDialogBody")}
            >
              <Stack gap="sm" align="start">
                <div className="revamp-buttonRow">
                  <Button
                    variant="secondary"
                    onClick={() => setAlertDialogType("ok")}
                  >
                    {t("preview.components.alertDialogCtaOk")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setAlertDialogType("yes-no")}
                  >
                    {t("preview.components.alertDialogCtaYesNo")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setAlertDialogType("proceed-discard")}
                  >
                    {t("preview.components.alertDialogCtaProceedDiscard")}
                  </Button>
                </div>
              </Stack>
            </SectionCard>
            <SectionCard
              title={t("preview.components.infoPopoverTitle")}
              subtitle={t("preview.components.infoPopoverBody")}
            >
              <Stack gap="sm" align="start">
                <div className="revamp-infoPopoverRow">
                  <Text>{t("preview.components.infoPopoverContent")}</Text>
                  <InfoPopover content={t("preview.components.infoPopoverContent")} />
                </div>
              </Stack>
            </SectionCard>
            <SectionCard
              title={t("preview.components.radioTitle")}
              subtitle={t("preview.components.radioBody")}
            >
              <RadioGroup
                name="preview-radio"
                value={radioSelection}
                onChange={(nextValue) => setRadioSelection(nextValue)}
              >
                <RadioOption
                  value="morning"
                  label={t("preview.components.options.morning")}
                  description={t("preview.components.radioDescription")}
                />
                <RadioOption
                  value="evening"
                  label={t("preview.components.options.evening")}
                  description={t("preview.components.radioDescription")}
                />
              </RadioGroup>
            </SectionCard>
            <SectionCard
              title={t("preview.components.cardFlipTitle")}
              subtitle={t("preview.components.cardFlipBody")}
            >
              <Stack gap="sm" align="start">
                <CardFlip
                  front={
                    <div className="revamp-cardFlipPanel">
                      <div className="revamp-cardFlipHeader">
                        <UiIcon name="time" size="sm" />
                        <div className="revamp-cardFlipTitle">
                          {t("home.sections.today")}
                        </div>
                      </div>
                      <Text>{t("preview.components.cardFlipFront")}</Text>
                    </div>
                  }
                  back={
                    <div className="revamp-cardFlipPanel">
                      <div className="revamp-cardFlipTitle">
                        {t("preview.components.cardFlipBackTitle")}
                      </div>
                      <Text>{t("preview.components.cardFlipBack")}</Text>
                    </div>
                  }
                  isFlipped={isFlipped}
                  onFlipChange={setIsFlipped}
                  ariaLabel={t("preview.components.cardFlipLabel")}
                />
                <Text muted>{t("preview.components.cardFlipHint")}</Text>
                <PillButton type="button" onClick={() => setIsFlipped((prev) => !prev)}>
                  {t("preview.components.cardFlipCta")}
                </PillButton>
              </Stack>
            </SectionCard>
            <SectionCard
              title={t("preview.components.railTitle")}
              subtitle={t("preview.components.railBody")}
            >
              <HorizontalCardRail>
                {RAIL_ITEMS.map((item) => (
                  <HorizontalCardRailItem
                    key={item.title}
                    title={t(item.title)}
                    description={t(item.description)}
                    href={item.href}
                    imageSrc={getIconSrc(theme, item.iconKey)}
                  />
                ))}
              </HorizontalCardRail>
            </SectionCard>
            <SectionCard
              title={t("preview.components.chartsTitle")}
              subtitle={t("preview.components.chartsBody")}
            >
              <div className="revamp-chartPreview">
                <div className="revamp-chartPreviewPanel">
                  <FiveElementRadarChart
                    values={{ wood: 82, fire: 68, earth: 74, metal: 58, water: 90 }}
                    labels={ELEMENT_LABELS.map((label) => t(label)) as [
                      string,
                      string,
                      string,
                      string,
                      string,
                    ]}
                  />
                </div>
                <div className="revamp-chartPreviewPanel">
                  <RoundedBarChart
                    series={[
                      { label: t("preview.components.charts.bars.focus"), value: 78 },
                      { label: t("preview.components.charts.bars.rest"), value: 54 },
                      { label: t("preview.components.charts.bars.flow"), value: 92 },
                    ]}
                    max={100}
                    showLabels
                  />
                </div>
              </div>
            </SectionCard>
            <SectionCard
              title={t("preview.components.buttonsTitle")}
              subtitle={t("preview.components.buttonsBody")}
            >
              <Stack gap="sm" align="start">
                <div className="revamp-buttonRow">
                  <Button variant="primary">{t("preview.components.buttonsPrimary")}</Button>
                  <Button variant="secondary">{t("preview.components.buttonsSecondary")}</Button>
                  <Button variant="ghost">{t("preview.components.buttonsGhost")}</Button>
                  <Button variant="contrast">{t("preview.components.buttonsContrast")}</Button>
                </div>
                <div className="revamp-buttonRow">
                  <Button size="sm">{t("preview.components.buttonsSmall")}</Button>
                  <Button size="lg">{t("preview.components.buttonsLarge")}</Button>
                  <Button pill>{t("preview.components.buttonsPill")}</Button>
                </div>
              </Stack>
            </SectionCard>
            <PillLink to="/__preview/home">{t("preview.components.back")}</PillLink>
          </Stack>
        </PageContent>
      </PageCard>
      <BottomSheet
        isOpen={isOpen}
        title={t("preview.components.sheetDialogTitle")}
        onClose={() => setIsOpen(false)}
      >
        <Stack gap="sm" align="start">
          {TIME_OPTIONS.map((optionKey) => {
            const optionLabel = t(optionKey);
            return (
              <PillButton
                key={optionKey}
                type="button"
                onClick={() => {
                  setSelection(optionLabel);
                  setIsOpen(false);
                }}
              >
                {optionLabel}
              </PillButton>
            );
          })}
        </Stack>
      </BottomSheet>
      <ScrollWindow
        open={isScrollWindowOpen}
        title={t("preview.components.scrollWindowDialogTitle")}
        onClose={() => setIsScrollWindowOpen(false)}
        footer={
          <Button variant="secondary" onClick={() => setIsScrollWindowOpen(false)}>
            {t("revamp.overlay.close")}
          </Button>
        }
      >
        <Stack gap="sm">
          <Text>{t("preview.components.scrollWindowDialogBody")}</Text>
          <Text>{t("preview.components.scrollWindowDialogBodyAlt")}</Text>
        </Stack>
      </ScrollWindow>
      <AlertDialog
        open={isAlertDialogOpen}
        title={t("preview.components.alertDialogPromptTitle")}
        message={t("preview.components.alertDialogPromptMessage")}
        onClose={closeAlertDialog}
        actions={alertDialogActions}
        blocking={alertDialogBlocking}
      />
    </Page>
  );
}
