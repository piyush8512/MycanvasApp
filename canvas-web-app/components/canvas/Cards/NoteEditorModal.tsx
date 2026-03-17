import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface NoteEditorModalProps {
  open: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function NoteEditorModal({
  open,
  title,
  value,
  onChange,
  onCancel,
  onSave,
}: NoteEditorModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel, onSave]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/65 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-4xl h-[78vh] rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-base font-semibold text-gray-900 truncate pr-4">
            Edit note: {title}
          </h3>
          <p className="text-xs text-gray-500">
            Esc to close, Ctrl/Cmd+S to save
          </p>
        </div>

        <div className="flex-1 p-4">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-full w-full resize-none rounded-xl border border-gray-300 p-4 text-sm leading-6 text-gray-800 outline-none focus:border-blue-500 font-mono"
            placeholder="Write your note here..."
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
