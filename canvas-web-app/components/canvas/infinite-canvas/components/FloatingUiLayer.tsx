"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Grid3X3,
  Users,
  Share2,
  MoreHorizontal,
  Search,
  Image,
  StickyNote,
  Link,
  Paperclip,
  Home,
  Pencil,
} from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import FolderSidebar from "@/components/canvas/FolderSidebar";
import MiniMap from "@/components/canvas/MiniMap";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_PRESETS } from "@/types/canvas";
import type { DashboardItem, Position, ViewMode } from "@/types/canvas";

interface FriendUser {
  id: string;
  username?: string;
  email?: string;
  friendCode?: string;
}

interface FriendItem {
  id: string;
  friendId?: string;
  user?: FriendUser;
  friend?: FriendUser;
}

interface FriendRequestItem {
  id: string;
  message?: string;
  sender?: FriendUser;
  receiver?: FriendUser;
  createdAt?: string;
}

interface FriendSearchResult {
  id: string;
  name?: string;
  email?: string;
  friendCode?: string;
}

interface SelfFriendCodeResponse {
  success?: boolean;
  user?: {
    id?: string;
    name?: string;
    database?: {
      friendCode?: string;
    };
    email?: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function friendApiRequest<T>(
  path: string,
  getToken: () => Promise<string | null>,
  init?: RequestInit,
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const raw = await res.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!res.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

interface FloatingUiLayerProps {
  items: DashboardItem[];
  pan: Position;
  zoom: number;
  containerSize: { width: number; height: number };
  isPublic: boolean;
  viewMode: ViewMode;
  onSearch: () => void;
  onFolderToggle: (folderId: string) => void;
  onCanvasOpen: (canvasId: string) => void;
  onNavigateToItem: (item: DashboardItem) => void;
  onMiniMapNavigate: (newPan: Position) => void;
  onSetIsPublic: (isPublic: boolean) => void;
  onSetViewMode: (mode: ViewMode) => void;
  onZoomChange: (newZoom: number) => void;
  onResetView: () => void;
  onToggleGrid: () => void;
  onCreateCanvas: () => void;
}

export default function FloatingUiLayer({
  items,
  pan,
  zoom,
  containerSize,
  isPublic,
  viewMode,
  onSearch,
  onFolderToggle,
  onCanvasOpen,
  onNavigateToItem,
  onMiniMapNavigate,
  onSetIsPublic,
  onSetViewMode,
  onZoomChange,
  onResetView,
  onToggleGrid,
  onCreateCanvas,
}: FloatingUiLayerProps) {
  const { getToken } = useAuth();
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequestItem[]>(
    [],
  );
  const [friendCode, setFriendCode] = useState("");
  const [myFriendCode, setMyFriendCode] = useState("");
  const [searchResult, setSearchResult] = useState<FriendSearchResult | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [friendsError, setFriendsError] = useState<string>("");
  const [requestsError, setRequestsError] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const [actionMessage, setActionMessage] = useState<string>("");

  const pendingCount = useMemo(() => pendingRequests.length, [pendingRequests]);

  const loadFriends = async () => {
    setIsLoadingFriends(true);
    setFriendsError("");
    try {
      const response = await friendApiRequest<{
        data?: { friends?: FriendItem[] };
        friends?: FriendItem[];
      }>("/api/friends", getToken);

      setFriends(response?.data?.friends ?? response?.friends ?? []);
    } catch (error) {
      setFriendsError(
        error instanceof Error ? error.message : "Failed to load friends",
      );
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const loadMyFriendCode = async () => {
    try {
      const response = await friendApiRequest<SelfFriendCodeResponse>(
        "/api/users/me",
        getToken,
      );
      setMyFriendCode(response?.user?.database?.friendCode ?? "");
    } catch {
      setMyFriendCode("");
    }
  };

  const loadPendingRequests = async () => {
    setIsLoadingRequests(true);
    setRequestsError("");
    try {
      const response = await friendApiRequest<{
        data?: { requests?: FriendRequestItem[] };
        requests?: FriendRequestItem[];
      }>("/api/friends/requests/pending", getToken);
      setPendingRequests(response?.data?.requests ?? response?.requests ?? []);
    } catch (error) {
      setRequestsError(
        error instanceof Error
          ? error.message
          : "Failed to load pending requests",
      );
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (!isFriendsModalOpen) return;
    void loadMyFriendCode();
    void loadFriends();
    void loadPendingRequests();
  }, [isFriendsModalOpen]);

  const handleSearchFriend = async () => {
    if (!friendCode.trim()) {
      setSearchError("Enter a friend code.");
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setActionMessage("");
    try {
      const response = await friendApiRequest<{
        data?: { user?: FriendSearchResult };
        user?: FriendSearchResult;
      }>(
        `/api/friends/search?code=${encodeURIComponent(friendCode.trim())}`,
        getToken,
      );
      const found = response?.data?.user ?? response?.user ?? null;
      setSearchResult(found);
      if (!found) {
        setSearchError("No user found for that friend code.");
      }
    } catch (error) {
      setSearchResult(null);
      setSearchError(
        error instanceof Error ? error.message : "Failed to search friend code",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!friendCode.trim()) {
      setSearchError("Enter a friend code.");
      return;
    }

    setIsSubmittingRequest(true);
    setActionMessage("");
    try {
      await friendApiRequest("/api/friends/request", getToken, {
        method: "POST",
        body: JSON.stringify({
          friendCode: friendCode.trim(),
        }),
      });
      setActionMessage("Friend request sent.");
      void loadPendingRequests();
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Could not send request",
      );
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "accept" | "reject",
  ) => {
    setActionBusyId(requestId);
    setActionMessage("");
    try {
      await friendApiRequest(
        `/api/friends/request/${requestId}/${action}`,
        getToken,
        {
          method: "POST",
        },
      );
      setActionMessage(
        action === "accept" ? "Request accepted." : "Request rejected.",
      );
      await loadPendingRequests();
      if (action === "accept") {
        await loadFriends();
      }
    } catch (error) {
      setRequestsError(
        error instanceof Error ? error.message : `Failed to ${action} request`,
      );
    } finally {
      setActionBusyId(null);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    setActionBusyId(friendId);
    setActionMessage("");
    try {
      await friendApiRequest(`/api/friends/${friendId}`, getToken, {
        method: "DELETE",
      });
      setActionMessage("Friend removed.");
      await loadFriends();
    } catch (error) {
      setFriendsError(
        error instanceof Error ? error.message : "Failed to remove friend",
      );
    } finally {
      setActionBusyId(null);
    }
  };

  return (
    <>
      <FolderSidebar
        items={items}
        onFolderClick={onFolderToggle}
        onCanvasClick={onCanvasOpen}
        onNavigateToItem={onNavigateToItem}
      />

      <div className="floating-ui absolute top-4 left-26 z-0">
        <div className="flex items-center gap-2 rounded-2xl border border-[#1f2a3f] bg-[#0b1220]/95 px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <span className="text-sm font-medium text-[#9aa6bd]">Workspace</span>
          <span className="text-sm text-[#6f7b94]">/</span>
          <span className="text-sm font-semibold text-white">
            Project Phoenix
          </span>
        </div>
      </div>

      <div className="floating-ui absolute top-16 left-1/2 -translate-x-1/2 sm:top-4 z-50 max-w-[calc(100vw-1rem)] sm:max-w-none">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center p-1 gap-1">
          <button
            onClick={onToggleGrid}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFriendsModalOpen(true)}
            className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            title="Open friends"
          >
            <Users className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="floating-ui absolute top-4 right-4 z-50 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onSearch}
          title="Search (Ctrl+K)"
          className="p-2.5 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="floating-ui absolute bottom-4 left-4 z-50 flex items-center gap-3">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
          <button
            onClick={() => onSetIsPublic(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !isPublic
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => onSetIsPublic(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isPublic
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Private
          </button>
        </div>

        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1">
          <button
            onClick={() => onSetViewMode("home")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "home"
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Home className="w-4 h-4" />
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <button
            onClick={() => onSetViewMode("edit")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "edit"
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* <div className="floating-ui absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center p-1 gap-1">
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Image className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <StickyNote className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Link className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
      </div> */}

      <MiniMap
        items={items}
        pan={pan}
        zoom={zoom}
        containerWidth={containerSize.width}
        containerHeight={containerSize.height}
        onNavigate={onMiniMapNavigate}
      />

      <div className="floating-ui absolute bottom-2 right-5 z-50 flex items-center gap-3">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => onZoomChange(preset)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  Math.abs(zoom - preset) < 0.05
                    ? "text-blue-600 font-medium"
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {preset}x
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.1}
              value={zoom}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="w-40 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{Math.round(zoom * 100)}%</span>
            <button
              onClick={onResetView}
              className="text-blue-500 hover:text-blue-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {isFriendsModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <button
            aria-label="Close friends modal"
            onClick={() => setIsFriendsModalOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#11131a] shadow-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Friends
              </h2>
              <button
                onClick={() => setIsFriendsModalOpen(false)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 mb-2">
              <input
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Enter friend code"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171923] px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSearchFriend}
                disabled={isSearching}
                className="rounded-xl px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>

            <div className="mb-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#171923] px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your friend code
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {myFriendCode || "Unavailable"}
              </p>
            </div>

            <button
              onClick={handleSendRequest}
              disabled={isSubmittingRequest}
              className="rounded-xl px-4 py-2 text-sm font-medium border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 disabled:opacity-60"
            >
              {isSubmittingRequest ? "Sending..." : "Send Request"}
            </button>

            {searchResult && (
              <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm">
                <p className="font-medium text-gray-900 dark:text-white">
                  {searchResult.name ?? "Unknown user"}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchResult.email ?? "No email"}
                </p>
                <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                  Code: {searchResult.friendCode ?? "-"}
                </p>
              </div>
            )}

            {(searchError ||
              friendsError ||
              requestsError ||
              actionMessage) && (
              <div className="mt-3 text-sm space-y-1">
                {searchError && <p className="text-rose-500">{searchError}</p>}
                {friendsError && (
                  <p className="text-rose-500">{friendsError}</p>
                )}
                {requestsError && (
                  <p className="text-rose-500">{requestsError}</p>
                )}
                {actionMessage && (
                  <p className="text-emerald-600">{actionMessage}</p>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <button
                onClick={() => setActiveTab("friends")}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  activeTab === "friends"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Friends ({friends.length})
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  activeTab === "requests"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Pending ({pendingRequests.length})
              </button>
            </div>

            {activeTab === "friends" ? (
              <div className="mt-3 space-y-2">
                {isLoadingFriends && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading friends...
                  </p>
                )}
                {!isLoadingFriends && friends.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No friends yet.
                  </p>
                )}
                {friends.map((entry) => {
                  const user = entry.friend ?? entry.user;
                  const removableId = entry.friendId ?? user?.id ?? entry.id;
                  return (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.username ?? "Unknown user"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email ?? "No email"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(removableId)}
                        disabled={actionBusyId === removableId}
                        className="px-3 py-1.5 text-xs rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-60"
                      >
                        {actionBusyId === removableId
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {isLoadingRequests && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading pending requests...
                  </p>
                )}
                {!isLoadingRequests && pendingRequests.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No pending requests.
                  </p>
                )}
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 p-3"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.sender?.username ?? "Unknown sender"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {request.sender?.email ?? "No email"}
                    </p>
                    {request.message && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                        {request.message}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleRequestAction(request.id, "accept")
                        }
                        disabled={actionBusyId === request.id}
                        className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRequestAction(request.id, "reject")
                        }
                        disabled={actionBusyId === request.id}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
