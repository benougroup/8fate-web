# 8FATE Asset Manifest (Authoritative)

Root: `apps/web/src/assets/images/`

## 1. Zodiac（生肖）

Rules:
- Chicken includes rooster head.
- Each zodiac has light and dark.
- No mixed zodiac icons.
- Characters + minimal animal integration.

Zodiac assets (light/dark):
- mouse, ox, tiger, rabbit, dragon, snake, horse, sheep, monkey, rooster, dog, pig

## 2. Five Elements（五行）

Semantic rule:
- `regular` = normal brush strokes
- `mono` = textured black/white only
- `texture` = same design, with color

Each element exists in light and dark for every variant:
- water, wood, fire, earth, metal

## 3. Directions（方向）

Critical rules:
1. No mixed-direction images.
2. No arrows baked into direction images.
3. Mixed directions are composed at runtime in UI.
4. Arrow placement and rotation handled by HTML/CSS.
5. Arrow assets are standalone.

Single-direction characters (light/dark):
- east, west, north, south

Mixed directions are composed in UI:
- east+north, east+south, west+north, west+south

## 4. Arrows (Standalone)

Rules:
- Rotate/position via CSS.
- Reused as back button asset.

Arrows:
- pointright (forward)
- pointleft (back)

## 5. Notification (Traditional Alarm Drum)

Rules:
- Same artwork.
- Different filenames indicate state.
- Red dot / red stick head indicates unread.

States:
- none
- unread

## 6. UI Symbols (Calligraphic)

Symbols (light/dark):
- exclamation_mark
- question_mark
- warning
- x_circle_around

## 7. Background variants

Standard background:
- background001 (light/dark)

Additional test variants:
- grey
- purple

Note: future Settings UI will allow selecting a background variant.

## DO NOT rules

- Do not recolor PNG/JPG assets.
- Do not convert to SVG.
- Do not create mixed-direction images.
- Arrow rotation is CSS-only.
