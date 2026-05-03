import { useState } from "react";

function AddFoodModal({ isOpen, onClose, onAdd }) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = value.trim();
    if (!normalized) return;
    onAdd(normalized);
    setValue("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <div className="glass w-full max-w-md rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-slate-100">添加午餐选项</h2>
        <p className="mt-1 text-sm text-slate-400">输入一个你想吃的美食。</p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="例如：寿司 / 麻辣烫 / 汉堡"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setValue("");
                onClose();
              }}
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="modal-add-btn rounded-xl border border-cyan-300/70 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFoodModal;
