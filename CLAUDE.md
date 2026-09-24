@AGENTS.md

## Project notes

- 3D classroom portfolio (R3F + drei + GSAP). All models are procedural in `src/components/scene/`; no downloaded assets.
- Content lives only in `src/content/portfolio.ts`; UI overlays in `src/components/ui/` read from it.
- In-scene text (chalkboard, posters, plates) is drawn via `useCanvasTexture` in `scene/textures.ts` with system fonts, so Vietnamese renders without a CDN font. Keep draw functions module-level so the texture memo stays stable.
- Camera framings are in `scene/camera-views.ts`; section views keep the model left of center for the right-side panel. `CameraRig` applies orbit limits only after the overview tween finishes, because OrbitControls clamps would fight the close-up tweens.
- next/font variables are `--font-nunito` / `--font-baloo`; don't reuse Tailwind theme names (`--font-sans`) or they become circular.
- Dev: `pnpm dev --port 3458` (see `.claude/launch.json`).
