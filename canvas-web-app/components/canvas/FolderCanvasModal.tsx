"use client";

import { useMemo, useState } from "react";
import { X, Plus, Pencil, Trash2, ExternalLink, Check, Folder } from "lucide-react";
import type { Folder as FolderType } from "@/types/canvas";

interface FolderCanvasModalProps {
  isOpen: boolean;
  folder: FolderType | null;
  onClose: () => void;
  onOpenCanvas: (canvasId: string) => void;
  onCreateCanvas: (name: string) => Promise<void>;
  onRenameCanvas: (canvasId: string, name: string) => Promise<void>;
  onDeleteCanvas: (canvasId: string) => Promise<void>;
  isBusy?: boolean;
}

export default function FolderCanvasModal({
  isOpen,
  folder,
  onClose,
  onOpenCanvas,
  onCreateCanvas,
  onRenameCanvas,
  onDeleteCanvas,
  isBusy = false,
}: FolderCanvasModalProps) {
  const [newCanvasName, setNewCanvasName] = useState("");
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const canvases = useMemo(() => folder?.canvasFiles || [], [folder]);

  if (!isOpen || !folder) {
    return null;
  }

  const handleCreate = async () => {
    const name = newCanvasName.trim();
    if (!name) return;
    await onCreateCanvas(name);
    setNewCanvasName("");
  };

  const handleRename = async (canvasId: string) => {
    const name = editingName.trim();
    if (!name) return;
    await onRenameCanvas(canvasId, name);
    setEditingCanvasId(null);
    setEditingName("");
  };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
      <div className="w-[min(420px,92vw)] max-h-[84vh] overflow-hidden rounded-2xl border border-[#f9f9f9] bg-black ">
        <div className="flex items-center justify-between border-b border-[#7b8399] px-5 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Folder className="h-4 w-4 text-[#ffffff]" />
            <span className="font-medium text-[#98a8c8]">Workspace</span>
            <span className="text-[#6f7b94]">/</span>
            <span className="font-semibold text-white">{folder.name}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#7f8ca8] transition-colors hover:bg-[#111a2d] hover:text-[#b4c2df]"
            aria-label="Close folder modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[#182337] px-5 py-3">
          <div className="flex items-center gap-2">
            <input
              value={newCanvasName}
              onChange={(e) => setNewCanvasName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleCreate();
                }
              }}
              placeholder="New canvas name"
              className="h-10 w-full rounded-xl border border-[#263754] bg-[#0d1628] px-3 text-sm text-[#d9e4ff] placeholder:text-[#7383a3] outline-none focus:border-[#4378ff]"
            />
            <button
              onClick={() => void handleCreate()}
              disabled={isBusy || !newCanvasName.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2f6fff] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d7dff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>
        </div>

        <div className="max-h-[58vh] overflow-auto p-5">
          {canvases.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#2a3957] bg-[#0f182b] px-4 py-8 text-center text-sm text-[#93a2c1]">
              No canvases in this folder yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {canvases.map((canvas) => {
                const isEditing = editingCanvasId === canvas.id;

                return (
                  <div
                    key={canvas.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#25354f] bg-[#0f182b] px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              void handleRename(canvas.id);
                            }
                          }}
                          className="h-9 w-full rounded-lg border border-[#355185] bg-[#0b1424] px-2 text-sm text-[#d9e4ff] outline-none"
                        />
                      ) : (
                        <p className="truncate text-sm font-medium text-white">{canvas.name}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <button
                          onClick={() => void handleRename(canvas.id)}
                          disabled={isBusy || !editingName.trim()}
                          className="rounded-lg p-2 text-[#7ea7ff] transition-colors hover:bg-[#111f38] disabled:opacity-60"
                          title="Save"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCanvasId(canvas.id);
                            setEditingName(canvas.name);
                          }}
                          className="rounded-lg p-2 text-[#8ea0c3] transition-colors hover:bg-[#111f38] hover:text-[#b8c8e8]"
                          title="Rename"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onOpenCanvas(canvas.id)}
                        className="rounded-lg p-2 text-[#8ea0c3] transition-colors hover:bg-[#111f38] hover:text-[#b8c8e8]"
                        title="Open"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => void onDeleteCanvas(canvas.id)}
                        disabled={isBusy}
                        className="rounded-lg p-2 text-[#c08aa2] transition-colors hover:bg-[#2a1320] hover:text-[#f2b1c8] disabled:opacity-60"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
