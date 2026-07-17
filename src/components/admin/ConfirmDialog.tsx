export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-background border border-border max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">Confirmation</p>
        <h3 className="mt-3 font-display text-2xl">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] border border-border hover:border-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] bg-destructive text-destructive-foreground hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
