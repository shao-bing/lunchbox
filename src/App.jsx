import { useEffect, useMemo, useRef, useState } from "react";
import AddFoodModal from "./components/AddFoodModal";
import ResultModal from "./components/ResultModal";
import Wheel from "./components/Wheel";

const STORAGE_KEY = "lunch-decider-items";
const SPIN_DURATION_MS = 3000;
const POINTER_ANGLE = 270; // 顶部指针在“右侧为0°”坐标中的角度
const DEFAULT_ITEMS = ["汉堡", "水饺", "生煎", "快餐", "嗦粉"];

function App() {
  const [items, setItems] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [result, setResult] = useState("");
  const [isWheelFlash, setIsWheelFlash] = useState(false);
  const spinTimersRef = useRef([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setItems(DEFAULT_ITEMS);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((item) => typeof item === "string" && item.trim());
        setItems(cleaned.length ? cleaned : DEFAULT_ITEMS);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setItems(DEFAULT_ITEMS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(
    () => () => {
      spinTimersRef.current.forEach(clearTimeout);
      spinTimersRef.current = [];
    },
    [],
  );

  const normalizedItems = useMemo(
    () => items.map((item) => item.trim()).filter(Boolean),
    [items],
  );

  const addFood = (food) => {
    if (isSpinning) return;
    setItems((prev) => [...prev, food]);
    setIsAddOpen(false);
  };

  const removeFood = (indexToRemove) => {
    if (isSpinning) return;
    setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const startSpin = () => {
    if (isSpinning || normalizedItems.length < 2) return;
    const snapshot = [...normalizedItems];

    // 公平随机：先等概率抽中扇区，再在该扇区内加入轻微抖动，视觉更自然。
    const selectedIndex = Math.floor(Math.random() * snapshot.length);
    const sector = 360 / snapshot.length;
    const jitter = (Math.random() - 0.5) * sector * 0.6;
    const selectedCenter = selectedIndex * sector + sector / 2;
    const targetAngle = (POINTER_ANGLE - (selectedCenter + jitter) + 360) % 360;
    const currentAngle = ((rotation % 360) + 360) % 360;
    const delta = (targetAngle - currentAngle + 360) % 360;
    const fullSpins = 360 * 8;
    const finalRotation = rotation + fullSpins + delta;

    spinTimersRef.current.forEach(clearTimeout);
    spinTimersRef.current = [];

    setIsSpinning(true);
    setIsResultOpen(false);
    setIsAddOpen(false);
    setRotation(finalRotation);

    const t1 = window.setTimeout(() => {
      // 结果以本次抽中的索引为准；角度已按同坐标系对齐到该扇区
      setResult(snapshot[selectedIndex]);
      setIsSpinning(false);
      setIsWheelFlash(true);
      setIsResultOpen(true);
      const t2 = window.setTimeout(() => setIsWheelFlash(false), 550);
      spinTimersRef.current.push(t2);
    }, SPIN_DURATION_MS);
    spinTimersRef.current.push(t1);
  };

  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8">
      <div className="starfield" />
      <header className="relative z-10 mb-8 text-center">
        <p className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-200">
          午餐决策器
        </p>
        <h1 className="neon-text mt-4 text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">
          今天中午吃什么
        </h1>
        <p className="mt-3 text-slate-300">
          加入你想吃的选项，转动命运之轮，一键决定午餐。
        </p>
      </header>

      <section className="relative z-10 grid flex-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className={`glass rounded-3xl p-6 ${isWheelFlash ? "wheel-stop-flash" : ""}`}>
          <Wheel
            items={normalizedItems}
            rotation={rotation}
            isSpinning={isSpinning}
            onStart={startSpin}
          />
        </div>

        <aside className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">午餐选项</h2>
            <button
              onClick={() => !isSpinning && setIsAddOpen(true)}
              disabled={isSpinning}
              className="rounded-xl border border-cyan-400/70 bg-cyan-400/10 px-3 py-1.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700/40 disabled:text-slate-400"
            >
              + 添加
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {normalizedItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-950/75 px-3 py-2"
              >
                <span className="truncate text-slate-200">{item}</span>
                <button
                  onClick={() => removeFood(index)}
                  className="ml-3 text-xs text-slate-400 transition hover:text-rose-300"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
          {!normalizedItems.length && (
            <p className="mt-4 text-sm text-slate-400">还没有选项，先添加几种想吃的吧。</p>
          )}
        </aside>
      </section>

      <AddFoodModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addFood}
      />
      <ResultModal
        isOpen={isResultOpen}
        result={result}
        onClose={() => setIsResultOpen(false)}
      />
    </main>
  );
}

export default App;
