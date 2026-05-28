import { useEffect, useRef } from "react";

export function LuminousSilk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const orbs: { x: number; y: number; r: number; phase: number; speed: number; hue: number }[] = [];
    for (let i = 0; i < 6; i++) {
      orbs.push({
        x: 0.15 + Math.random() * 0.7,
        y: 0.1 + Math.random() * 0.8,
        r: 180 + Math.random() * 200,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
        hue: Math.random() < 0.5 ? 340 : 38,
      });
    }

    const sparkles: { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number }[] = [];
    const spawnSparkle = (w: number, h: number) => {
      sparkles.push({
        x: Math.random() * w,
        y: h + 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.4 + 0.6),
        size: Math.random() * 2.5 + 0.5,
        life: 0,
        maxLife: 120 + Math.random() * 80,
      });
    };

    let frame = 0;
    const draw = () => {
      time += 0.006;
      frame++;
      const w = W();
      const h = H();

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w * 0.6, h);
      bg.addColorStop(0, "#fffbf5");
      bg.addColorStop(0.35, "#fff0e8");
      bg.addColorStop(0.7, "#fde8f0");
      bg.addColorStop(1, "#fff5f8");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (const orb of orbs) {
        const ox = w * orb.x + Math.sin(time * orb.speed * 100 + orb.phase) * 80;
        const oy = h * orb.y + Math.cos(time * orb.speed * 80 + orb.phase) * 50;
        const pulse = orb.r * (0.9 + 0.1 * Math.sin(time + orb.phase));
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, pulse);
        if (orb.hue === 340) {
          grad.addColorStop(0, "rgba(255,180,210,0.25)");
          grad.addColorStop(0.5, "rgba(255,160,200,0.12)");
          grad.addColorStop(1, "rgba(255,180,210,0)");
        } else {
          grad.addColorStop(0, "rgba(255,210,150,0.28)");
          grad.addColorStop(0.5, "rgba(255,200,140,0.12)");
          grad.addColorStop(1, "rgba(255,210,150,0)");
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < 4; i++) {
        const wave = ctx.createLinearGradient(0, h * (0.2 + i * 0.18), w, h * (0.3 + i * 0.2));
        const alpha = (0.06 - i * 0.01) * (0.8 + 0.2 * Math.sin(time * 1.5 + i));
        wave.addColorStop(0, `rgba(255,180,200,0)`);
        wave.addColorStop(0.3 + 0.1 * Math.sin(time * 0.7 + i), `rgba(255,200,180,${alpha})`);
        wave.addColorStop(1, `rgba(255,200,160,0)`);
        ctx.fillStyle = wave;
        ctx.beginPath();
        const sy = h * (0.15 + i * 0.18) + Math.sin(time * 0.5 + i) * 30;
        ctx.moveTo(0, sy);
        for (let x = 0; x <= w; x += 20) {
          const y = sy + Math.sin((x / w) * Math.PI * 2 + time * 0.8 + i) * 18;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
      }

      if (frame % 4 === 0 && sparkles.length < 60) spawnSparkle(w, h);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > s.maxLife) { sparkles.splice(i, 1); continue; }
        const progress = s.life / s.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        ctx.globalAlpha = alpha * 0.85;
        const isGold = s.x / w > 0.5;
        ctx.fillStyle = isGold ? "#ffc87a" : "#ffb0cc";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const shimmer = ctx.createLinearGradient(0, 0, w, h);
      const shimAlpha = 0.03 + 0.015 * Math.sin(time * 2.5);
      shimmer.addColorStop(0, "rgba(255,220,200,0)");
      shimmer.addColorStop(0.45 + 0.05 * Math.sin(time), `rgba(255,230,210,${shimAlpha})`);
      shimmer.addColorStop(1, "rgba(255,220,200,0)");
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#fffbf5" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em] mb-5"
          style={{ color: "#c08060", fontFamily: "Montserrat, sans-serif" }}
        >
          BellaDerma · Berlin Charlottenburg
        </p>
        <h1
          className="text-6xl font-bold leading-tight mb-6"
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#3d1f10",
            textShadow: "0 2px 30px rgba(255,180,140,0.3)",
          }}
        >
          Laser Hair
          <br />
          <span style={{ color: "#c05a30" }}>Removal Berlin</span>
        </h1>
        <p
          className="text-lg max-w-md mb-8"
          style={{ color: "#7a4a38", fontFamily: "Montserrat, sans-serif", lineHeight: 1.7 }}
        >
          Permanent smoothness. Radiant confidence.
          <br />
          Since 2006 — over 19 years of expertise.
        </p>
        <button
          className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, #d4704a, #e89060)",
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            boxShadow: "0 4px 28px rgba(212,112,74,0.45)",
            border: "none",
          }}
        >
          Book Appointment
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(to top, rgba(255,251,245,0.9), transparent)",
        }}
      />
    </div>
  );
}
