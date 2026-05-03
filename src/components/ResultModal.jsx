function ResultModal({ isOpen, result, onClose }) {
  if (!isOpen) return null;
  const particleCount = 10;
  const particles = Array.from({ length: particleCount }, (_, index) => ({
    id: index,
    angle: `${(360 / particleCount) * index}deg`,
    distance: `${84 + (index % 5) * 10}px`,
    delay: `${(index % 6) * 50}ms`,
    color: ["#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#f59e0b"][index % 5],
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <div className="glass relative w-full max-w-sm overflow-hidden rounded-3xl p-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="particle"
              style={{
                background: particle.color,
                animationDelay: particle.delay,
                "--angle": particle.angle,
                "--distance": particle.distance,
              }}
            />
          ))}
        </div>
        <p className="text-sm tracking-[0.28em] text-cyan-300">今日天选午餐</p>
        <h3 className="relative mt-3 text-3xl font-black text-slate-100 neon-text">
          {result}
        </h3>
        <button
          onClick={onClose}
          className="result-confirm-btn mt-6 rounded-xl border border-cyan-200/80 bg-cyan-300 px-6 py-2.5 text-base font-black text-slate-950 transition hover:brightness-110"
        >
          太棒了
        </button>
      </div>
    </div>
  );
}

export default ResultModal;
