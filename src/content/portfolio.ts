// Portfolio content — edit this file to personalize the site.
// Every section key maps to a hotspot inside the 3D classroom scene.

export type SectionId = "about" | "experience" | "activities" | "contact";

export const profile = {
  name: "Trần Thị Phương Anh",
  role: "Giáo viên Toán học & Chủ nhiệm lớp",
  classroomName: "Lớp học của cô Phương Anh",
};

export const sectionTitles: Record<SectionId, string> = {
  about: "Giới thiệu",
  experience: "Kinh nghiệm",
  activities: "Hoạt động",
  contact: "Liên hệ",
};

export const about = {
  paragraphs: [
    "Xin chào! Cô là Trần Thị Phương Anh — giáo viên Toán tận tâm với hơn 4 năm kinh nghiệm giảng dạy, bồi dưỡng học sinh từ bậc THCS đến ôn thi chuyển cấp.",
    "Cô luôn chủ động đổi mới phương pháp, tích hợp công nghệ giáo dục để khơi gợi tư duy logic và niềm say mê môn Toán. Ngoài chuyên môn, cô tiên phong dẫn dắt phong trào văn thể mỹ và hoạt động ngoại khóa, xây dựng môi trường học đường thân thiện, năng động.",
  ],
  skillGroups: [
    {
      title: "Chuyên môn & Sư phạm",
      items: [
        "Quản lý lớp học & nghiệp vụ chủ nhiệm",
        "Đổi mới phương pháp dạy học theo GDPT 2018",
        "Phân hóa & luyện thi chuyển cấp môn Toán",
      ],
    },
    {
      title: "Công nghệ & Phần mềm",
      items: ["GeoGebra", "Canva Pro", "MS PowerPoint", "Quizizz / Kahoot", "Google Classroom", "Word / Excel"],
    },
  ],
  educationTitle: "Học vấn",
  education: {
    school: "Trường Đại học Hải Phòng",
    degree: "Cử nhân Sư phạm Toán học (hệ chính quy)",
    notes: [
      "Điểm rèn luyện toàn khóa: Xuất sắc",
      "Đội văn nghệ Đoàn trường, chiến dịch Mùa hè xanh, Tiếp sức mùa thi",
    ],
  },
};

export type Job = {
  title: string;
  place: string;
  period: string;
  highlights: string[];
};

export const experience: Job[] = [
  {
    title: "Giáo viên Bộ môn Toán & Giáo viên Chủ nhiệm",
    place: "Trường THCS Trần Hưng Đạo – Q. Kiến An, Hải Phòng",
    period: "2024 – nay",
    highlights: [
      "Giảng dạy Toán cho 2 lớp THCS (40–45 HS/lớp) với giáo án tích hợp bài giảng điện tử tương tác (GeoGebra, Canva, Quizizz).",
      "Chủ nhiệm lớp: 98% học sinh đạt Hạnh kiểm Tốt, trên 85% đạt Học lực Khá – Giỏi.",
      "Biên đạo tiết mục văn nghệ đạt giải cao tại hội diễn 20/11 và Lễ Khai giảng toàn trường.",
      "Ban tổ chức, thiết kế và trang trí Rung chuông vàng Toán học, Ngày hội STEM, Hội khỏe Phù Đổng.",
      "Kết nối chặt chẽ với phụ huynh để định hướng tâm lý và giáo dục học sinh cá biệt.",
    ],
  },
  {
    title: "Giáo viên Luyện thi Toán & Quản lý lớp",
    place: "Trung tâm Bồi dưỡng Văn hóa & Luyện thi Toán",
    period: "2022 – 2024",
    highlights: [
      "Dạy Toán nâng cao và luyện thi vào lớp 10; biên soạn ngân hàng bài tập phân dạng trực quan, dễ hiểu.",
      "Hơn 90% học sinh cải thiện điểm số rõ rệt (tăng 1.5 – 3.0 điểm), nhiều em đỗ điểm cao vào THPT công lập.",
      "Áp dụng sơ đồ tư duy (Mindmap) giúp học sinh nhớ công thức và phản xạ nhanh các dạng hình học, đại số.",
    ],
  },
  {
    title: "Gia sư Chuyên Toán & Phát triển Tư duy Logic",
    place: "Gia sư tự do & Dự án Gia sư Sư phạm",
    period: "2020 – 2022",
    highlights: [
      "Kèm 1-1 và nhóm nhỏ cho học sinh THCS mất gốc hoặc cần bồi dưỡng nâng cao; cá nhân hóa lộ trình giúp các em lấy lại tự tin.",
    ],
  },
];

export const activities = {
  intro: "Ngoài giờ lên lớp, cô là “linh hồn” của các ngày hội và tiết mục văn nghệ trong trường.",
  talents: [
    "Biên đạo múa, dàn dựng tiết mục văn nghệ học sinh & tập thể",
    "Tổ chức sự kiện, ngày hội lớn: 20/11, Khai giảng, Trung thu, STEM",
    "Trang trí sân khấu, thiết kế hội thi & không gian lớp học sáng tạo",
  ],
  certificatesTitle: "Chứng chỉ & ghi nhận",
  certificates: [
    "Cử nhân Sư phạm Toán học chính quy",
    "Chứng chỉ Ứng dụng CNTT trong Dạy học",
    "Gương mặt tích cực trong Công tác Đoàn – Đội & Phong trào thanh niên trường học",
  ],
};

export type ContactLink = { label: string; value: string; href: string };

export const contact: { intro: string; links: ContactLink[] } = {
  intro: "Phụ huynh, học sinh hay đồng nghiệp muốn trao đổi về việc học Toán? Hãy gửi thư cho cô nhé!",
  links: [
    { label: "Email", value: "anhtranphuonghoang@gmail.com", href: "mailto:anhtranphuonghoang@gmail.com" },
    { label: "Điện thoại", value: "0328 477 461", href: "tel:+84328477461" },
    { label: "Địa chỉ", value: "Kiến An, TP. Hải Phòng", href: "https://maps.google.com/?q=Kien+An,+Hai+Phong" },
  ],
};
