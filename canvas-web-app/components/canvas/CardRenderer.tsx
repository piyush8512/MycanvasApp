/**
 * Card Renderer Component
 * Renders the appropriate card component based on item type
 */

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CanvasItem } from "@/types/canvas";
import YoutubeCard from "./Cards/YoutubeCard";
import LinkPreviewCard from "./Cards/LinkPreviewCard";
import NoteEditorModal from "./Cards/NoteEditorModal";

interface CardRendererProps {
  item: CanvasItem;
  isSelected?: boolean;
  interactiveEnabled?: boolean;
  onDeleteItem?: (itemId: string) => void;
  onRenameItem?: (itemId: string, name: string) => void;
  onDuplicateItem?: (itemId: string) => void;
  onUpdateItemContent?: (itemId: string, content: any) => void;
}

/**
 * Renders different card types based on item.type
 */
export default function CardRenderer({
  item,
  isSelected = false,
  interactiveEnabled = true,
  onDeleteItem,
  onRenameItem,
  onDuplicateItem,
  onUpdateItemContent,
}: CardRendererProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [isNoteMenuOpen, setIsNoteMenuOpen] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [noteDraftText, setNoteDraftText] = useState(
    typeof item.content?.text === "string" ? item.content.text : "",
  );

  const noteText = useMemo(
    () => (typeof item.content?.text === "string" ? item.content.text : ""),
    [item.content],
  );

  useEffect(() => {
    setNoteDraftText(noteText);
  }, [noteText, item.id]);

  const imageUrl =
    typeof item.content?.url === "string" && item.content.url.trim().length > 0
      ? item.content.url
      : "";

  const imageFileName =
    typeof item.name === "string" && item.name.trim().length > 0
      ? item.name
      : "image";

  const handleDownloadImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!imageUrl) return;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = imageFileName;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleSaveNoteText = () => {
    const nextText = noteDraftText.trim();
    const currentText = noteText.trim();
    if (nextText === currentText) {
      setIsNoteEditorOpen(false);
      return;
    }

    onUpdateItemContent?.(item.id, {
      ...(item.content || {}),
      text: noteDraftText,
    });
    setIsNoteEditorOpen(false);
  };

  switch (item.type) {
    case "youtube":
      return (
        <div className={interactiveEnabled ? "" : "pointer-events-none"}>
          <YoutubeCard
            item={item as any}
            isSelected={isSelected}
            interactiveEnabled={interactiveEnabled}
            onDelete={() => onDeleteItem?.(item.id)}
            onRename={(name) => onRenameItem?.(item.id, name)}
            onDuplicate={() => onDuplicateItem?.(item.id)}
          />
        </div>
      );

    case "link":
      return (
        <div className={interactiveEnabled ? "" : "pointer-events-none"}>
          <LinkPreviewCard item={item as any} isSelected={isSelected} />
        </div>
      );

    case "text":
    case "note":
      return (
        <>
          <div
            className="relative w-full h-full rounded-lg shadow-md p-3 overflow-hidden"
            style={{ backgroundColor: item.color || "#fef08a" }}
          >
            <p className="text-gray-800 text-sm whitespace-pre-wrap">
              {noteText}
            </p>

            {interactiveEnabled && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div
                  className="relative"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsNoteMenuOpen((prev) => !prev);
                    }}
                    className="rounded-lg p-1.5 text-gray-700 bg-white/92 border border-black/15 shadow-md backdrop-blur hover:bg-white"
                    title="Note options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isNoteMenuOpen && (
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-40 w-36 rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          setNoteDraftText(noteText);
                          setIsNoteEditorOpen(true);
                          setIsNoteMenuOpen(false);
                        }}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteItem?.(item.id);
                          setIsNoteMenuOpen(false);
                        }}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <NoteEditorModal
            open={isNoteEditorOpen}
            title={item.name || "Note"}
            value={noteDraftText}
            onChange={setNoteDraftText}
            onCancel={() => {
              setNoteDraftText(noteText);
              setIsNoteEditorOpen(false);
            }}
            onSave={handleSaveNoteText}
          />
        </>
      );

    case "shape":
      return (
        <div className="w-full h-full flex items-center justify-center">
          {item.content?.shape === "rectangle" ? (
            <div
              className="w-full h-full rounded-lg border-2"
              style={{
                backgroundColor: `${item.color}40`,
                borderColor: item.color,
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full border-2"
              style={{
                backgroundColor: `${item.color}40`,
                borderColor: item.color,
              }}
            />
          )}
        </div>
      );

    case "image":
      return (
        <>
          <div className="group relative w-full h-full ">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-contain block"
            />

            {interactiveEnabled && (
              <div className="absolute top-2 right-0 -translate-x-1/2">
                <div
                  className="relative"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsImageMenuOpen((prev) => !prev);
                    }}
                    className="rounded-lg p-1.5 text-gray-700 bg-white/92 border border-black/15 shadow-md backdrop-blur hover:bg-white"
                    title="Image options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isImageMenuOpen && (
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 z-40 w-36 rounded-xl border border-gray-200 bg-white py-1 shadow-xl ">
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsImagePreviewOpen(true);
                          setIsImageMenuOpen(false);
                        }}
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(event) => {
                          handleDownloadImage(event);
                          setIsImageMenuOpen(false);
                        }}
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <div className="my-1 border-t border-gray-200" />
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteItem?.(item.id);
                          setIsImageMenuOpen(false);
                        }}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isImagePreviewOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-6"
                onClick={() => setIsImagePreviewOpen(false)}
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-md text-sm bg-white text-black hover:bg-gray-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsImagePreviewOpen(false);
                  }}
                >
                  Close
                </button>
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="max-w-[95vw] max-h-[90vh] object-contain"
                  onClick={(event) => event.stopPropagation()}
                />
              </div>,
              document.body,
            )}
        </>
      );

    case "instagram":
      return (
        <div className={interactiveEnabled ? "" : "pointer-events-none"}>
          <LinkPreviewCard item={item as any} isSelected={isSelected} />
        </div>
      );

    default:
      return (
        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-black">
          <p className="text-gray-400 text-xs text-center">{item.name}</p>
        </div>
      );
  }
}
