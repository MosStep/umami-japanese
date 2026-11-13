import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import mascotImg from '../assets/mascot-fox.webp';
import { Share2 } from 'lucide-react';

export interface RecapDay {
  label: string;
  active: boolean;
  frozen: boolean;
}

interface Props {
  days: RecapDay[];
  minutes: number;
  reviews: number;
  newWords: number;
  clips: number;
  streak: number;
  range: string;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/** Draws the 1080×1350 share image (Instagram portrait / LINE friendly). */
const drawRecap = async (p: Props): Promise<HTMLCanvasElement> => {
  const W = 1080;
  const H = 1350;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  try {
    await document.fonts?.ready;
  } catch {}
  const font = (size: number, weight = 700) => `${weight} ${size}px "Noto Sans Thai", "Sarabun", system-ui, sans-serif`;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#312e81');
  bg.addColorStop(0.55, '#1e1b4b');
  bg.addColorStop(1, '#0f172a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  try {
    const fox = await loadImage(mascotImg);
    ctx.save();
    roundRect(ctx, W / 2 - 150, 80, 300, 300, 60);
    ctx.clip();
    ctx.drawImage(fox, W / 2 - 150, 80, 300, 300);
    ctx.restore();
  } catch {}

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = font(68);
  ctx.fillText('สัปดาห์นี้ของฉัน', W / 2, 470);
  ctx.fillStyle = '#c7d2fe';
  ctx.font = font(36, 500);
  ctx.fillText(p.range, W / 2, 525);

  // Seven days
  const gap = 126;
  const x0 = W / 2 - gap * 3;
  p.days.forEach((d, i) => {
    const x = x0 + i * gap;
    ctx.beginPath();
    ctx.arc(x, 625, 48, 0, Math.PI * 2);
    ctx.fillStyle = d.active ? 'rgba(245,158,11,0.25)' : d.frozen ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = d.active ? '#fbbf24' : d.frozen ? '#7dd3fc' : 'rgba(255,255,255,0.15)';
    ctx.stroke();
    if (d.active || d.frozen) {
      ctx.fillStyle = '#ffffff';
      ctx.font = font(48, 400);
      ctx.fillText(d.active ? '🔥' : '🧊', x, 642);
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.font = font(30, 600);
    ctx.fillText(d.label, x, 715);
  });

  // Stats 2×2
  const stats = [
    { v: p.minutes, u: 'นาที', l: 'ดูคลิปญี่ปุ่น' },
    { v: p.reviews, u: 'ใบ', l: 'ทบทวนแฟลชการ์ด' },
    { v: p.newWords, u: 'คำ', l: 'คำศัพท์ใหม่' },
    { v: p.clips, u: 'คลิป', l: 'ดูจนจบ' },
  ];
  stats.forEach((s, i) => {
    const bx = 90 + (i % 2) * 465;
    const by = 780 + Math.floor(i / 2) * 210;
    roundRect(ctx, bx, by, 435, 180, 36);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = font(84);
    ctx.fillText(String(s.v), bx + 36, by + 100);
    const vw = ctx.measureText(String(s.v)).width;
    ctx.fillStyle = '#a5b4fc';
    ctx.font = font(36, 600);
    ctx.fillText(s.u, bx + 48 + vw, by + 100);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = font(34, 500);
    ctx.fillText(s.l, bx + 36, by + 150);
    ctx.textAlign = 'center';
  });

  ctx.fillStyle = '#fde68a';
  ctx.font = font(48);
  ctx.fillText(p.streak > 0 ? `🔥 เรียนต่อเนื่อง ${p.streak} วัน` : 'เริ่มนับวันต่อเนื่องใหม่ได้เลย!', W / 2, 1255 - 40);
  ctx.fillStyle = '#94a3b8';
  ctx.font = font(32, 500);
  ctx.fillText('うまみ · เรียนญี่ปุ่นจากคลิปจริง', W / 2, 1290);
  return c;
};

const shareCanvas = async (canvas: HTMLCanvasElement) => {
  const name = `umami-week-${Date.now()}.png`;
  const dataUrl = canvas.toDataURL('image/png');
  if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Share') && Capacitor.isPluginAvailable('Filesystem')) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const { uri } = await Filesystem.writeFile({ path: name, data: dataUrl.split(',')[1], directory: Directory.Cache });
    await Share.share({ title: 'สรุปสัปดาห์ うまみ', files: [uri], dialogTitle: 'แชร์สรุปสัปดาห์' });
    return;
  }
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name;
  a.click();
};

/** Profile card: the last 7 days in four numbers, shareable as an image. */
export const WeeklyRecap: React.FC<Props> = (props) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = async () => {
    setBusy(true);
    setError(null);
    try {
      await shareCanvas(await drawRecap(props));
    } catch (e) {
      // Closing the share sheet without picking an app is not an error.
      const msg = String((e as Error)?.message ?? e);
      if (!/cancel/i.test(msg)) setError('แชร์ไม่สำเร็จ ลองใหม่อีกครั้ง');
    } finally {
      setBusy(false);
    }
  };

  const cells = [
    { v: props.minutes, l: 'นาทีดูคลิป' },
    { v: props.reviews, l: 'ทบทวน' },
    { v: props.newWords, l: 'คำใหม่' },
    { v: props.clips, l: 'คลิปที่ดูจบ' },
  ];

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-white">สรุป 7 วันล่าสุด</h2>
        <button
          onClick={share}
          disabled={busy}
          className="min-h-10 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-1.5"
        >
          <Share2 className="w-4 h-4" />
          {busy ? 'กำลังสร้างรูป…' : 'แชร์เป็นรูป'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {cells.map((c) => (
          <div key={c.l} className="rounded-2xl bg-slate-950 border border-slate-800 py-2.5">
            <p className="text-xl font-bold text-white">{c.v}</p>
            <p className="text-[11px] text-slate-400">{c.l}</p>
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </section>
  );
};
