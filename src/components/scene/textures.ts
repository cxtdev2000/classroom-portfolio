import { createRandom, handFont, roundedRect, type CanvasDraw } from "./canvas-texture";
import { palette } from "./palette";

// Module-level draw functions for every CanvasTexture in the classroom (stable references).

function chalkText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string) {
  ctx.font = `${size}px ${handFont}`;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 3;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

export const drawChalkboard: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = palette.chalkboard;
  ctx.fillRect(0, 0, w, h);

  // Faint eraser smudges.
  const random = createRandom(7);
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.02 + random() * 0.03})`;
    ctx.beginPath();
    ctx.ellipse(random() * w, random() * h, 40 + random() * 90, 14 + random() * 26, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  chalkText(ctx, "Chào mừng các em đến lớp Toán!", w / 2, 78, 50, "#fdfbf3");
  ctx.strokeStyle = palette.blush;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(250, 100);
  ctx.quadraticCurveTo(w / 2, 118, w - 250, 100);
  ctx.stroke();

  ctx.textAlign = "left";
  chalkText(ctx, "a² + b² = c²", 60, 180, 44, "#fdfbf3");
  chalkText(ctx, "Δ = b² − 4ac", 60, 250, 44, palette.sunny);
  chalkText(ctx, "(a + b)² = a² + 2ab + b²", 60, 320, 36, "#fdfbf3");
  chalkText(ctx, "S = π · r²", 60, 390, 44, palette.blush);
  chalkText(ctx, "x = (−b ± √Δ) / 2a", 60, 455, 34, palette.sky);

  // Right triangle with labelled sides.
  ctx.strokeStyle = "#fdfbf3";
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(640, 430);
  ctx.lineTo(900, 430);
  ctx.lineTo(640, 200);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeRect(640, 400, 30, 30);
  chalkText(ctx, "a", 605, 330, 36, palette.sunny);
  chalkText(ctx, "b", 760, 475, 36, palette.sunny);
  chalkText(ctx, "c", 790, 300, 36, palette.sunny);

  // Little circle doodle with radius.
  ctx.strokeStyle = palette.blush;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(915, 190, 55, 0, Math.PI * 2);
  ctx.moveTo(915, 190);
  ctx.lineTo(965, 170);
  ctx.stroke();
  chalkText(ctx, "r", 935, 168, 28, palette.blush);
  chalkText(ctx, "♥", 960, 480, 34, palette.blush);
};

export const drawFloor: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(3);
  const rows = 6;
  const rowHeight = h / rows;
  for (let row = 0; row < rows; row++) {
    const offset = (row % 2) * (w / 2);
    for (let plank = -1; plank < 2; plank++) {
      const shade = 0.94 + random() * 0.08;
      ctx.fillStyle = `rgb(${241 * shade}, ${212 * shade}, ${170 * shade})`;
      ctx.fillRect(offset + plank * (w / 2), row * rowHeight, w / 2, rowHeight);
      ctx.fillStyle = palette.floorLine;
      ctx.fillRect(offset + plank * (w / 2), row * rowHeight, 3, rowHeight);
    }
    ctx.fillStyle = palette.floorLine;
    ctx.fillRect(0, row * rowHeight, w, 3);
  }
};

export const drawBulletinBoard: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = palette.cork;
  ctx.fillRect(0, 0, w, h);
  const random = createRandom(11);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(120,70,30,${random() * 0.18})`;
    ctx.fillRect(random() * w, random() * h, 2 + random() * 3, 2 + random() * 3);
  }

  // Header ribbon.
  ctx.fillStyle = palette.blush;
  roundedRect(ctx, 190, 26, w - 380, 78, 38);
  ctx.fill();
  ctx.fillStyle = palette.ink;
  ctx.textAlign = "center";
  ctx.font = `bold 44px ${handFont}`;
  ctx.fillText("Góc Văn Nghệ & Sự Kiện", w / 2, 80);

  const cards = [
    { x: 60, y: 140, color: palette.sunny, title: "20/11", lines: ["Tiết mục múa", "đạt giải cao ★"], tilt: -0.05 },
    { x: 380, y: 150, color: palette.sky, title: "Khai giảng", lines: ["Biên đạo văn nghệ", "toàn trường"], tilt: 0.04 },
    { x: 700, y: 135, color: palette.mint, title: "Trung thu", lines: ["Rước đèn ông sao", "phá cỗ cả lớp"], tilt: -0.03 },
    { x: 120, y: 390, color: palette.lavender, title: "Ngày hội STEM", lines: ["Thiết kế & trang trí"], tilt: 0.05 },
    { x: 560, y: 395, color: "#ffffff", title: "Rung chuông vàng", lines: ["Toán học ♪"], tilt: -0.04 },
  ];

  for (const card of cards) {
    ctx.save();
    ctx.translate(card.x + 130, card.y + 95);
    ctx.rotate(card.tilt);
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = card.color;
    roundedRect(ctx, -130, -95, 260, 190, 16);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = palette.ink;
    ctx.font = `bold 38px ${handFont}`;
    ctx.fillText(card.title, 0, -20);
    ctx.font = `26px ${handFont}`;
    card.lines.forEach((line, index) => ctx.fillText(line, 0, 25 + index * 34));
    // Push pin.
    ctx.fillStyle = palette.red;
    ctx.beginPath();
    ctx.arc(0, -78, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(-3, -81, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Scattered sticker stars.
  ctx.font = `40px ${handFont}`;
  ctx.fillStyle = palette.sunny;
  ctx.fillText("★", 960, 380);
  ctx.fillText("★", 40, 620);
  ctx.fillStyle = palette.berry;
  ctx.fillText("♥", 470, 620);
  ctx.fillText("♪", 960, 600);
};

export const drawGeometryPoster: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = palette.sky;
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, w - 16, h - 16);

  ctx.textAlign = "center";
  ctx.fillStyle = palette.ink;
  ctx.font = `bold 56px ${handFont}`;
  ctx.fillText("Hình học vui", w / 2, 96);

  const shapes = [
    { label: "Tròn", color: palette.blush, draw: (x: number, y: number) => ctx.arc(x, y, 62, 0, Math.PI * 2) },
    { label: "Vuông", color: palette.sunny, draw: (x: number, y: number) => ctx.rect(x - 58, y - 58, 116, 116) },
    {
      label: "Tam giác",
      color: palette.mint,
      draw: (x: number, y: number) => {
        ctx.moveTo(x, y - 66);
        ctx.lineTo(x + 70, y + 56);
        ctx.lineTo(x - 70, y + 56);
        ctx.closePath();
      },
    },
    {
      label: "Lục giác",
      color: palette.lavender,
      draw: (x: number, y: number) => {
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const px = x + Math.cos(angle) * 64;
          const py = y + Math.sin(angle) * 64;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      },
    },
  ];

  shapes.forEach((shape, index) => {
    const x = index % 2 === 0 ? w * 0.28 : w * 0.72;
    const y = index < 2 ? 250 : 490;
    ctx.beginPath();
    shape.draw(x, y);
    ctx.fillStyle = shape.color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();
    ctx.fillStyle = palette.ink;
    ctx.font = `34px ${handFont}`;
    ctx.fillText(shape.label, x, y + 115);
  });
};

export const drawLaptopScreen: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = palette.lavender;
  ctx.fillRect(0, 0, w, 36);
  ctx.fillStyle = palette.ink;
  ctx.font = `bold 22px ${handFont}`;
  ctx.fillText("Đồ thị hàm số", 16, 26);

  const originX = w / 2;
  const originY = h * 0.68;
  const unit = 38;
  ctx.strokeStyle = "#e6e2f0";
  ctx.lineWidth = 1;
  for (let x = originX % unit; x < w; x += unit) {
    ctx.beginPath();
    ctx.moveTo(x, 36);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = originY % unit; y < h; y += unit) {
    if (y < 36) continue;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(w, originY);
  ctx.moveTo(originX, 36);
  ctx.lineTo(originX, h);
  ctx.stroke();

  ctx.strokeStyle = palette.berry;
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let px = 0; px <= w; px += 4) {
    const x = (px - originX) / unit;
    const y = x * x - 2 * x;
    const py = originY - y * unit;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.fillStyle = palette.berry;
  ctx.font = `bold 24px ${handFont}`;
  ctx.fillText("y = x² − 2x", w - 170, 70);
};

export const drawNamePlate: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = palette.blush;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = palette.paper;
  roundedRect(ctx, 10, 10, w - 20, h - 20, 18);
  ctx.fill();
  ctx.fillStyle = palette.ink;
  ctx.textAlign = "center";
  ctx.font = `bold 50px ${handFont}`;
  ctx.fillText("Cô Phương Anh", w / 2, h / 2 + 4);
  ctx.font = `26px ${handFont}`;
  ctx.fillStyle = palette.berry;
  ctx.fillText("GV Toán · Chủ nhiệm", w / 2, h / 2 + 44);
};

export const drawMailboxPlate: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = palette.paper;
  roundedRect(ctx, 0, 0, w, h, 30);
  ctx.fill();
  ctx.fillStyle = palette.berry;
  ctx.textAlign = "center";
  ctx.font = `bold 58px ${handFont}`;
  ctx.fillText("Thư gửi cô ♥", w / 2, h / 2 + 20);
};

export const drawGlobe: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, w, h);
  const random = createRandom(21);
  ctx.fillStyle = palette.leaf;
  for (let i = 0; i < 14; i++) {
    const x = random() * w;
    const y = h * 0.15 + random() * h * 0.7;
    ctx.beginPath();
    ctx.ellipse(x, y, 20 + random() * 40, 12 + random() * 26, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
};

function drawDigitBlock(digit: string, color: string): CanvasDraw {
  return (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = palette.paper;
    roundedRect(ctx, 14, 14, w - 28, h - 28, 20);
    ctx.fill();
    ctx.fillStyle = palette.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold 84px ${handFont}`;
    ctx.fillText(digit, w / 2, h / 2 + 4);
  };
}

export const digitBlocks = [
  { digit: "1", color: palette.blush, draw: drawDigitBlock("1", palette.blush) },
  { digit: "2", color: palette.sky, draw: drawDigitBlock("2", palette.sky) },
  { digit: "3", color: palette.sunny, draw: drawDigitBlock("3", palette.sunny) },
  { digit: "+", color: palette.mint, draw: drawDigitBlock("+", palette.mint) },
];
