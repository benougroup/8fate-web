# Bazi Pages Analysis & Redesign Plan

## Page-by-Page Breakdown

### 1. Chart Page (Natal Chart)
**Original**: Desktop-focused, wide layout with Four Pillars grid
**Elements**:
- Four Pillars display (Year, Month, Day, Hour)
- Heavenly Stems and Earthly Branches
- Ten Gods labels
- Five Elements bar chart
- Element analysis text
- AI insights section
- Action buttons (Save, Download PDF, Share)

**Redesign for v20260213**:
- Mobile-first responsive grid (2x2 on mobile, 4x1 on desktop)
- Glass morphism cards for each pillar
- Animated element bars
- Collapsible AI insights
- FloatingRadialNav for navigation

**New Reusable Components**:
- `BaziPillarCard` - Display single pillar with stem/branch
- `ElementBalanceChart` - Five elements visualization
- `ElementAnalysisCard` - Text analysis of elements
- `TenGodBadge` - Ten God label component

---

### 2. Reading Page (Life Analysis)
**Original**: Long-form desktop layout with sections
**Elements**:
- Day Master introduction
- Career analysis
- Wealth analysis
- Health analysis
- Relationship analysis
- Element-based personality
- Strengths and weaknesses
- Life path guidance

**Redesign for v20260213**:
- Scrollable sections with PageSection
- Accordion for collapsible content
- Icon-based section headers
- Mobile-optimized reading flow

**New Reusable Components**:
- `LifeAnalysisSection` - Reusable analysis section
- `DayMasterCard` - Day Master introduction card
- `StrengthWeaknessGrid` - Strengths/weaknesses display
- `LifePathGuidance` - Guidance recommendations

---

### 3. Luck Pillars Page (大運)
**Original**: Timeline with pillar cards
**Elements**:
- Luck pillar timeline (10-year cycles)
- Current period highlighting
- Age markers
- Element per period
- Period analysis text
- Element interaction warnings

**Redesign for v20260213**:
- Horizontal scrollable timeline on mobile
- Vertical timeline on desktop
- Current pillar highlighted with animation
- Tap/click for detailed analysis

**New Reusable Components**:
- `LuckPillarTimeline` - Timeline visualization
- `LuckPillarCard` - Individual pillar card
- `PeriodAnalysisModal` - Detailed period info
- `AgeMarker` - Age indicator component

---

### 4. Forecast Page (Yearly Predictions)
**Original**: Year tabs with monthly breakdown
**Elements**:
- Year selector (2026, 2027, etc.)
- Yearly overview
- Monthly predictions grid
- Element interactions
- Favorable/unfavorable periods
- Specific recommendations

**Redesign for v20260213**:
- Tab navigation for years
- Monthly grid with color coding
- Expandable month details
- Element clash warnings

**New Reusable Components**:
- `YearSelector` - Year navigation tabs
- `MonthlyGrid` - 12-month grid display
- `MonthDetailCard` - Expandable month info
- `FavorablePeriodBadge` - Period indicator
- `ElementClashWarning` - Warning component

---

### 5. Compatibility Page
**Original**: Two-column comparison
**Elements**:
- Profile selector (Person A & B)
- Chart comparison side-by-side
- Element harmony analysis
- Compatibility score
- Relationship dynamics
- Strengths and challenges
- Recommendations

**Redesign for v20260213**:
- Stacked layout on mobile
- Side-by-side on desktop
- Compatibility score wheel
- Color-coded harmony indicators

**New Reusable Components**:
- `ProfileComparisonCard` - Profile selector
- `CompatibilityScoreWheel` - Score visualization
- `HarmonyIndicator` - Element harmony display
- `RelationshipDynamicsCard` - Dynamics analysis
- `CompatibilityRecommendations` - Advice section

---

### 6. Auspicious Dates Page
**Original**: Calendar with date filtering
**Elements**:
- Activity type selector
- Date range picker
- Calendar view with scoring
- Favorable dates highlighted
- Date details on click
- Clash warnings

**Redesign for v20260213**:
- Mobile-friendly calendar
- Filter chips for activities
- Date cards with scores
- Color-coded dates

**New Reusable Components**:
- `ActivityTypeSelector` - Activity filter chips
- `AuspiciousCalendar` - Calendar with scoring
- `DateScoreCard` - Individual date info
- `DateDetailModal` - Detailed date analysis
- `ClashDateWarning` - Warning indicator

---

### 7. Daily Reading (Component/Page)
**Original**: Card-based daily fortune
**Elements**:
- Current date display
- Daily fortune text
- Element interactions
- Do's and Don'ts lists
- Lucky elements/colors
- Favorable directions
- Activity recommendations

**Redesign for v20260213**:
- Hero card with date
- Icon-based do's/don'ts
- Color swatches for lucky colors
- Compass for directions

**New Reusable Components**:
- `DailyFortuneCard` - Main fortune display
- `DoDontList` - Do's and Don'ts with icons
- `LuckyElementBadges` - Lucky elements display
- `FavorableDirectionCompass` - Direction indicator
- `DailyRecommendations` - Activity suggestions

---

### 8. Glossary Page
**Original**: List/grid of terms
**Elements**:
- Search functionality
- Category filters
- Term cards with Chinese/English
- Detailed explanations
- Related terms links

**Redesign for v20260213**:
- Search bar at top
- Category chips
- Grid of term cards
- Modal for details

**New Reusable Components**:
- `GlossarySearch` - Search input
- `CategoryFilter` - Category chips
- `TermCard` - Individual term card
- `TermDetailModal` - Detailed explanation
- `RelatedTermsLinks` - Related terms navigation

---

### 9. History Page
**Original**: Timeline of readings
**Elements**:
- Reading history list
- Snapshot cards
- Date filters
- Comparison view

**Redesign for v20260213**:
- Vertical timeline
- Snapshot cards with preview
- Filter by date range
- Compare button

**New Reusable Components**:
- `HistoryTimeline` - Timeline visualization
- `SnapshotPreviewCard` - Snapshot card
- `DateRangeFilter` - Date filter
- `ComparisonView` - Side-by-side comparison

---

### 10. User Profile Page
**Original**: Form-based profile management
**Elements**:
- Profile list
- Add/edit profile form
- Birth date/time/location inputs
- Profile cards
- Delete confirmation

**Redesign for v20260213**:
- Profile cards grid
- Add button with modal
- Form with validation
- Location picker with map

**New Reusable Components**:
- `ProfileCard` - Individual profile card
- `ProfileForm` - Add/edit form
- `BirthDateTimePicker` - Date/time input
- `LocationPicker` - Location input with map
- `ProfileDeleteDialog` - Confirmation dialog

---

### 11. Chat Page (AI Assistant)
**Original**: Chat interface
**Elements**:
- Message history
- Input box
- Profile context indicator
- Conversation list
- New conversation button

**Redesign for v20260213**:
- Full-height chat layout
- Message bubbles (user/assistant)
- Typing indicator
- Profile badge
- Conversation sidebar

**New Reusable Components**:
- `ChatMessageBubble` - Message display
- `ChatInput` - Message input
- `TypingIndicator` - Loading animation
- `ConversationList` - Chat history sidebar
- `ProfileContextBadge` - Active profile indicator

---

### 12. Settings Page
**Original**: Simple settings form
**Elements**:
- Language selector
- Timezone selector
- Theme toggle
- Notification preferences

**Redesign for v20260213**:
- Settings sections
- Toggle switches
- Dropdown selectors
- Save confirmation

**New Reusable Components**:
- `SettingsSection` - Section wrapper
- `LanguageSelector` - Language dropdown
- `TimezoneSelector` - Timezone dropdown
- `ThemeToggle` - Theme switch
- `SettingsSaveButton` - Save button with feedback

---

## Component Priority

### Phase 1: Core Bazi Components
1. BaziPillarCard
2. ElementBalanceChart
3. TenGodBadge
4. DayMasterCard

### Phase 2: Analysis Components
5. LifeAnalysisSection
6. ElementAnalysisCard
7. StrengthWeaknessGrid

### Phase 3: Timeline Components
8. LuckPillarTimeline
9. LuckPillarCard
10. HistoryTimeline

### Phase 4: Interactive Components
11. AuspiciousCalendar
12. CompatibilityScoreWheel
13. ProfileComparisonCard

### Phase 5: Utility Components
14. GlossarySearch
15. TermCard
16. ChatMessageBubble
17. ProfileForm

---

## Design Principles

1. **Mobile-First**: All layouts start with mobile and scale up
2. **Glass Morphism**: Consistent with v20260213 aesthetic
3. **Reusable**: Components work across multiple pages
4. **Accessible**: Proper ARIA labels and keyboard navigation
5. **Animated**: Smooth transitions and loading states
6. **i18n Ready**: All text through translation system

