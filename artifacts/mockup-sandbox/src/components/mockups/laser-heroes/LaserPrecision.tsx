import { useEffect, useRef } from "react";

export function LaserPrecision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let time = 0;
    let cw = 0;
    let ch = 0;

    const setSize = (w: number, h: number) => {
      cw = w;
      ch = h;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const ro = new ResizeObserver((entries) => {
      const e = entries[0].contentRect;
      setSize(e.width, e.height);
    });
    ro.observe(canvas);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const COLORS = ["#a8d8ff", "#c8eaff", "#e0f4ff", "#b0ccff", "#80b8f0"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * 1400,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.6 + 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const scanLines = [
      { y: 200, speed: 0.25, alpha: 0.22 },
      { y: 500, speed: 0.18, alpha: 0.16 },
      { y: 350, speed: 0.32, alpha: 0.18 },
    ];

    const draw = () => {
      time += 0.008;
      const w = cw || window.innerWidth;
      const h = ch || window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#f8fbff");
      bg.addColorStop(0.4, "#edf6ff");
      bg.addColorStop(0.8, "#ddf0ff");
      bg.addColorStop(1, "#e8f4ff");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 5; i++) {
        const ox = w * 0.5 + Math.sin(time * 0.4 + i) * 60;
        const oy = h * 0.5 + Math.cos(time * 0.3 + i) * 40;
        const maxR = 80 + i * 90 + Math.sin(time + i) * 20;
        const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxR);
        glow.addColorStop(0, `rgba(100,180,255,${0.18 - i * 0.03})`);
        glow.addColorStop(1, "rgba(100,180,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox, oy, maxR, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let ring = 1; ring <= 5; ring++) {
        const r = 30 + ring * 60 + Math.sin(time + ring) * 10;
        const alpha = Math.max(0, 0.18 - ring * 0.025) * (0.6 + 0.4 * Math.sin(time + ring));
        ctx.strokeStyle = `rgba(80,160,240,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const sl of scanLines) {
        sl.y += sl.speed;
        if (sl.y > h + 20) sl.y = -20;
        const grad = ctx.createLinearGradient(0, sl.y - 8, 0, sl.y + 8);
        grad.addColorStop(0, "rgba(120,200,255,0)");
        grad.addColorStop(0.5, `rgba(120,200,255,${sl.alpha})`);
        grad.addColorStop(1, "rgba(120,200,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, sl.y - 8, w, 16);
      }

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(time * 2 + p.x));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.setLineDash([6, 14]);
      for (const [x1, y1, x2, y2] of [[w * 0.05, h * 0.5, w * 0.95, h * 0.5], [w * 0.5, h * 0.05, w * 0.5, h * 0.95]]) {
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        const pulse = 0.04 + 0.03 * Math.sin(time * 1.2);
        g.addColorStop(0, "rgba(80,160,240,0)");
        g.addColorStop(0.5, `rgba(80,160,240,${pulse})`);
        g.addColorStop(1, "rgba(80,160,240,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#f0f8ff" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-5" style={{ color: "#5a9fd4", fontFamily: "Montserrat, sans-serif" }}>
          BellaDerma · Berlin Charlottenburg
        </p>
        <h1 className="text-6xl font-bold leading-tight mb-6" style={{ color: "#1a3a5c", fontFamily: "Playfair Display, serif", textShadow: "0 2px 20px rgba(100,180,255,0.3)" }}>
          Laser Hair<br />
          <span style={{ color: "#3a8fd0" }}>Removal Berlin</span>
        </h1>
        <p className="text-lg max-w-md mb-8" style={{ color: "#4a6a88", fontFamily: "Montserrat, sans-serif", lineHeight: 1.7 }}>
          Permanent results. Medical precision.<br />
          Since 2006 — over 19 years of expertise.
        </p>
        <button className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase" style={{ background: "linear-gradient(135deg, #3a8fd0, #5ab4f0)", color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 4px 24px rgba(58,143,208,0.4)", border: "none" }}>
          Book Appointment
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, rgba(248,251,255,0.9), transparent)" }} />
    </div>
  );
}
