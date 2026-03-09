import React from "react";
import { LinkItem } from "@/types/canvas";
import SmartLinkCard from "./SmartLinkCard";

interface LinkPreviewCardProps {
  item: LinkItem;
  isSelected?: boolean;
}

export default function LinkPreviewCard({ item }: LinkPreviewCardProps) {
  return <SmartLinkCard item={item} />;
}
