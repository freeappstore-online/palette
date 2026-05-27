import type { Toast } from "../hooks/useToast";

export default function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast rounded-lg px-4 py-2 text-sm font-medium shadow-lg"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
