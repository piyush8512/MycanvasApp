import React from "react";
import {
  ExternalLink,
  Link as LinkIcon,
  Instagram,
  MessageCircle,
  Facebook,
  Linkedin,
  Github,
  Palette,
  Newspaper,
  FileText,
  MapPin,
  Youtube,
} from "lucide-react";
import { LinkItem } from "@/types/canvas";
import { classifyLink, type LinkCardKind } from "./linkClassifier";

interface SmartLinkCardProps {
  item: LinkItem;
  isSelected?: boolean;
}

const CARD_STYLES: Record<
  LinkCardKind,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeClass: string;
    bannerClass: string;
  }
> = {
  youtube: {
    label: "YouTube",
    icon: Youtube,
    badgeClass: "bg-red-100 text-red-700",
    bannerClass: "from-red-500/20 to-orange-500/20",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    badgeClass: "bg-pink-100 text-pink-700",
    bannerClass: "from-pink-500/20 to-purple-500/20",
  },
  twitter_x: {
    label: "X",
    icon: MessageCircle,
    badgeClass: "bg-slate-100 text-slate-700",
    bannerClass: "from-slate-700/20 to-slate-500/20",
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    badgeClass: "bg-blue-100 text-blue-700",
    bannerClass: "from-blue-500/20 to-indigo-500/20",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    badgeClass: "bg-cyan-100 text-cyan-700",
    bannerClass: "from-cyan-500/20 to-blue-500/20",
  },
  github: {
    label: "GitHub",
    icon: Github,
    badgeClass: "bg-zinc-100 text-zinc-700",
    bannerClass: "from-zinc-600/20 to-zinc-400/20",
  },
  dribbble_behance: {
    label: "Design",
    icon: Palette,
    badgeClass: "bg-fuchsia-100 text-fuchsia-700",
    bannerClass: "from-fuchsia-500/20 to-violet-500/20",
  },
  news_article: {
    label: "News",
    icon: Newspaper,
    badgeClass: "bg-amber-100 text-amber-700",
    bannerClass: "from-amber-500/20 to-orange-500/20",
  },
  notion_docs: {
    label: "Notion",
    icon: FileText,
    badgeClass: "bg-stone-100 text-stone-700",
    bannerClass: "from-stone-500/20 to-gray-500/20",
  },
  maps_location: {
    label: "Maps",
    icon: MapPin,
    badgeClass: "bg-emerald-100 text-emerald-700",
    bannerClass: "from-emerald-500/20 to-teal-500/20",
  },
  generic: {
    label: "Link",
    icon: LinkIcon,
    badgeClass: "bg-gray-100 text-gray-700",
    bannerClass: "from-gray-500/20 to-slate-500/20",
  },
};

const computeReadTime = (text?: string) => {
  if (!text) return undefined;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return undefined;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

export default function SmartLinkCard({ item }: SmartLinkCardProps) {
  const { url, title, description, thumbnail, domain } = item.content || {};
  const classification = classifyLink(url, domain);
  const style = CARD_STYLES[classification.kind];
  const Icon = style.icon;

  const displayTitle = title || item.name || classification.source || "Link";
  const readTime =
    classification.kind === "news_article"
      ? computeReadTime(description || displayTitle)
      : undefined;

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {thumbnail ? (
        <div className="h-[44%] w-full overflow-hidden bg-gray-100">
          <img
            src={thumbnail}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div
          className={`h-[44%] w-full bg-linear-to-br ${style.bannerClass} flex items-center justify-center`}
        >
          <Icon className="h-10 w-10 text-gray-700/70" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.badgeClass}`}>
            <Icon className="h-3 w-3" />
            {style.label}
          </span>
          {classification.subtype && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              {classification.subtype}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm font-semibold text-gray-900">{displayTitle}</p>

        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-600">{description}</p>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between border-t border-gray-200 pt-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-gray-500">
                {classification.source}
              </p>
              {readTime && <p className="text-[11px] text-gray-400">{readTime}</p>}
            </div>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                title="Open link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
