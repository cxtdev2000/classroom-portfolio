import type { SectionId } from "@/content/portfolio";

export type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

export type ViewId = SectionId | "overview" | "intro";

// Camera framing for each section. Section views are shifted along the camera's right axis
// so the hotspot model sits left of center, leaving room for the content panel on the right.
export const cameraViews: Record<ViewId, CameraView> = {
  intro: { position: [15, 12, 18], target: [0, 1, 0] },
  overview: { position: [7.6, 5.6, 9.6], target: [-0.4, 1.3, -0.5] },
  about: { position: [1.7, 2.2, 2.4], target: [1.7, 2.1, -3.95] },
  experience: { position: [3.7, 2.2, 0.9], target: [3.6, 0.95, -2.2] },
  activities: { position: [-0.35, 2.1, -2.3], target: [-4.95, 1.8, -2.3] },
  contact: { position: [-3.05, 1.8, 7.2], target: [-3.05, 1.0, 2.9] },
};
