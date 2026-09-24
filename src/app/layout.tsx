import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { profile } from "@/content/portfolio";
import "./globals.css";

const bodyFont = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
});

const displayFont = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${profile.classroomName} — ${profile.role}`,
  description: `Portfolio 3D của cô ${profile.name}: giới thiệu, kinh nghiệm giảng dạy, hoạt động văn nghệ và liên hệ trong một lớp học nhỏ xinh.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
