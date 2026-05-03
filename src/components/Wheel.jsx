const COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#f59e0b",
  "#60a5fa",
  "#fb7185",
  "#2dd4bf",
];

function buildWheelGradient(items) {
  if (!items.length) return "radial-gradient(circle, #1e293b 0%, #0f172a 100%)";
  const sector = 360 / items.length;
  const segments = items.map((_, index) => {
    const start = index * sector;
    const end = start + sector;
    const color = COLORS[index % COLORS.length];
    return `${color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(from 90deg, ${segments.join(", ")})`;
}

function Wheel({ items, rotation, isSpinning, onStart }) {
  const sector = items.length ? 360 / items.length : 0;
  const RADIUS_PERCENT = 35;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative h-80 w-80 select-none sm:h-96 sm:w-96">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_72%)] opacity-90"
        />
        <div
          className="absolute inset-2 rounded-full border border-fuchsia-300/35"
          style={{
            transform: `rotate(${-rotation * 0.15}deg)`,
            transition: isSpinning ? "transform 3000ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        />
        <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
        <div
          className="absolute inset-0 rounded-full border-4 border-cyan-200/30 shadow-[0_0_45px_rgba(34,211,238,0.26)]"
          style={{
            background: buildWheelGradient(items),
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 3000ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
        >
          {items.map((item, index) => {
            // 扇区中心在 conic-gradient(from 90deg) 中的 CSS 角度
            const cssAngleDeg = 90 + index * sector + sector / 2;
            const cssAngleRad = cssAngleDeg * Math.PI / 180;
            // CSS角度转数学坐标：x = sin(θ), y = -cos(θ)
            const x = 50 + RADIUS_PERCENT * Math.sin(cssAngleRad);
            const y = 50 - RADIUS_PERCENT * Math.cos(cssAngleRad);
            return (
              <div
                key={`${item}-${index}`}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <span className="block whitespace-nowrap text-sm font-extrabold text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)] sm:text-base">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
        <div className="absolute left-1/2 top-1/2 z-10 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-100/80 bg-slate-900 shadow-[0_0_14px_rgba(34,211,238,0.45)]" />
      </div>

      <button
        onClick={onStart}
        disabled={isSpinning || items.length < 2}
        className="spin-btn-glow spin-btn-safari mt-8 rounded-xl border border-cyan-300/70 bg-cyan-400 px-9 py-2.5 font-black tracking-wide text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isSpinning ? "旋转中..." : "开始抽选"}
      </button>
      {items.length < 2 && (
        <p className="mt-3 text-sm text-slate-400">至少添加 2 个选项才可以开始。</p>
      )}
    </div>
  );
}

export default Wheel;
