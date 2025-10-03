import { Ellipsis } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DropdownOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface DropdownMenuProps {
  options: DropdownOption[];
}

export function DropdownMenu({ options }: DropdownMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleOptionPress = (option: DropdownOption) => {
    setIsVisible(false);
    option.onPress();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsVisible(true)}
      >
        <Ellipsis size={16} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
          <View style={styles.dropdown}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  index === options.length - 1 && styles.lastOption,
                ]}
                onPress={() => handleOptionPress(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.destructive && styles.destructiveText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  destructiveText: {
    color: "#EF4444",
  },
});
