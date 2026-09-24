import type { SectionId } from "@/content/portfolio";

type Vec3 = [number, number, number];

export type CameraView = {
  position: Vec3;
  target: Vec3;
  /** Center of the object a close-up is about; used to reframe it on portrait screens. */
  focus?: Vec3;
  /** Whether a bottom-sheet panel covers the lower screen on mobile (default true when focused). */
  sheet?: boolean;
};

/** Anything the camera can zoom to: a content section or the music TV. */
export type FocusId = SectionId | "tv";

export type ViewId = FocusId | "overview" | "intro";

// Camera framing for each section. Section views are shifted along the camera's right axis
// so the hotspot model sits left of center, leaving room for the content panel on the right.
export const cameraViews: Record<ViewId, CameraView> = {
  intro: { position: [15, 12, 18], target: [0, 1, 0] },
  overview: { position: [7.6, 5.6, 9.6], target: [-0.4, 1.3, -0.5] },
  about: { position: [1.7, 2.2, 2.4], target: [1.7, 2.1, -3.95], focus: [0.3, 2.2, -3.95] },
  experience: { position: [3.7, 2.2, 0.9], target: [3.6, 0.95, -2.2], focus: [2.8, 0.95, -2.2] },
  activities: { position: [-0.35, 2.1, -2.3], target: [-4.95, 1.8, -2.3], focus: [-4.95, 1.5, -1.2] },
  contact: { position: [-3.05, 1.8, 7.2], target: [-3.05, 1.0, 2.9], focus: [-3.8, 1.0, 2.9] },
  tv: { position: [4.4, 2.8, -1.85], target: [4.4, 2.8, -3.54], focus: [4.4, 2.8, -3.54], sheet: false },
};

// Portrait phones see a far narrower slice of the room at the desktop fov, so they get a wider
// lens and frames rebuilt from the desktop ones (see frameForAspect).
export const LANDSCAPE_FOV = 40;
export const PORTRAIT_FOV = 50;

const DESKTOP_ASPECT = 1.6;
const halfTan = (fov: number) => Math.tan((fov * Math.PI) / 360);

/** How far the overview camera pulls back on a portrait screen (1 on landscape screens). */
export function overviewPullBack(aspect: number) {
  return aspect >= 1 ? 1 : Math.min(2.2, (1.2 / aspect) ** 0.75);
}

/**
 * Desktop frames assume a wide screen with the content panel on the right. On portrait screens the
 * camera keeps the same viewing direction but backs off until the focused object fits the width, and
 * shifts down so the object sits in the strip above the bottom-sheet panel.
 */
export function frameForAspect(view: CameraView, aspect: number): CameraView {
  if (aspect >= 1) return view;
  const { position, target, focus, sheet = true } = view;
  if (!focus) {
    const pull = overviewPullBack(aspect);
    return { target, position: target.map((t, i) => t + (position[i] - t) * pull) as Vec3 };
  }
  const offset = position.map((p, i) => p - target[i]) as Vec3;
  const widen = (halfTan(LANDSCAPE_FOV) * DESKTOP_ASPECT) / (halfTan(PORTRAIT_FOV) * aspect);
  const scale = widen * (sheet ? 0.5 : 0.7);
  const distance = Math.hypot(...offset) * scale;
  const drop = sheet ? 0.42 * distance * halfTan(PORTRAIT_FOV) : 0;
  const lowered = (point: Vec3): Vec3 => [point[0], point[1] - drop, point[2]];
  return {
    target: lowered(focus),
    position: lowered(focus.map((f, i) => f + offset[i] * scale) as Vec3),
  };
}
