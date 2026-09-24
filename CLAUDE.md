@AGENTS.md

## Project notes

- 3D classroom portfolio (R3F + drei + GSAP). All models are procedural in `src/components/scene/`; no downloaded assets.
- Content lives only in `src/content/portfolio.ts`; UI overlays in `src/components/ui/` read from it.
- In-scene text (chalkboard, posters, plates) is drawn via `useCanvasTexture` in `scene/textures.ts` with system fonts, so Vietnamese renders without a CDN font. Keep draw functions module-level so the texture memo stays stable.
- Camera framings are in `scene/camera-views.ts`; section views keep the model left of center for the right-side panel. `CameraRig` applies orbit limits only after the overview tween finishes, because OrbitControls clamps would fight the close-up tweens.
- next/font variables are `--font-nunito` / `--font-baloo`; don't reuse Tailwind theme names (`--font-sans`) or they become circular.
- Dev: `pnpm dev --port 3458` (see `.claude/launch.json`).
- Background music: `music/youtube-music.ts` is a module-level store (works across the Canvas and Html React roots) around one YouTube IFrame player, mounted on the in-scene TV via drei `<Html transform>` with `pointerEvents="none"` so clicks reach the TV hotspot. It uses `occlude="blending"` + `zIndexRange={[0, 0]}` so it sits behind the canvas (lifted by `.scene-canvas` in `globals.css`) and props in front hide it; other `<Html>` overlays need `zIndexRange` ≥ 10 to stay above the canvas. Start playback inside the intro button click (autoplay policy). The TV is a camera focus (`FocusId = SectionId | "tv"`) with no content panel.
- Portrait phones: `frameForAspect` in `camera-views.ts` rebuilds desktop frames (wider fov, backs off to fit `focus`, drops it above the bottom sheet). Views with no `focus` get the capped overview pull-back; `sheet: false` for views without a content panel (TV).
- Clickable props ("pokes"): wrap in `Pokeable` from `scene/pokeable.tsx` and drive animation in `useFrame` from `usePoke()` + `secondsSince()`. Pokes are only enabled in overview via `PokeProvider`. `Hotspot` disables them for its children, so shared props like `Plant` stay inert inside a hotspot and the click opens the section. Clicks with a drag `delta` over 6px are ignored.
