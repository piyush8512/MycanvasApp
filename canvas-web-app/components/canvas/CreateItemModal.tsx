"use client";

import React, { useState, useCallback } from "react";
import { X, Folder, File } from "lucide-react";
import type { Position } from "@/types/canvas";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: "folder" | "canvas", name: string) => void;
  position: Position;
  folderId?: string;
}

export default function CreateItemModal({
  isOpen,
  onClose,
  onCreate,
  position,
  folderId,
}: CreateItemModalProps) {
  const [step, setStep] = useState<"type" | "name">("type");
  const [selectedType, setSelectedType] = useState<"folder" | "canvas" | null>(
    null,
  );
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleTypeSelect = (type: "folder" | "canvas") => {
    setSelectedType(type);
    setStep("name");
  };

  const handleCreate = () => {
    if (selectedType && name.trim()) {
      onCreate(selectedType, name.trim());
      setStep("type");
      setSelectedType(null);
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    setStep("type");
    setSelectedType(null);
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {step === "type"
              ? "Create New"
              : `New ${selectedType === "folder" ? "Folder" : "Canvas"}`}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === "type" ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Only show folder option if not creating inside a folder */}
              {!folderId && (
                <button
                  onClick={() => handleTypeSelect("folder")}
                  className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-500/10 transition-all group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-lg bg-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform">
                      <Folder className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Folder
                      </h3>
                      <p className="text-xs text-gray-500">Organize canvases</p>
                    </div>
                  </div>
                </button>
              )}
              <button
                onClick={() => handleTypeSelect("canvas")}
                className={`p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all group ${folderId ? "col-span-2" : ""}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                    <File className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Canvas
                    </h3>
                    <p className="text-xs text-gray-500">
                      Create & collaborate
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  {selectedType === "folder" ? "Folder" : "Canvas"} Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${selectedType} name...`}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") handleClose();
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("type")}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
