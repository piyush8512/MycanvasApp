import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Breadcrumb } from "@/types/folder";

interface BreadcrumbNavProps {
  items: Breadcrumb[];
  onNavigate: (id: string) => void;
}

export const BreadcrumbNav = ({ items, onNavigate }: BreadcrumbNavProps) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <TouchableOpacity
            onPress={() => onNavigate(item.id)}
            style={styles.breadcrumbItem}
          >
            <Text style={styles.breadcrumbText}>{item.name}</Text>
          </TouchableOpacity>
          {index < items.length - 1 && (
            <ChevronRight size={16} color="#6B7280" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    paddingHorizontal: 20,

    paddingVertical: 11,
  },
  breadcrumbItem: {
    paddingHorizontal: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});
