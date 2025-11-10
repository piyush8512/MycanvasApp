import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Check, X } from "lucide-react-native";

interface Request {
  id: string;
  name: string;
  email: string;
  avatar: string;
  requestedAt?: string;
  sentAt?: string;
}

interface PendingRequestsProps {
  requests: Request[];
  type: "incoming" | "outgoing";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export default function PendingRequests({
  requests,
  type,
  onAccept,
  onReject,
  onCancel,
}: PendingRequestsProps) {
  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {type === "incoming" ? "No pending requests" : "No sent requests"}
        </Text>
        <Text style={styles.emptySubtext}>
          {type === "incoming"
            ? "Friend requests will appear here"
            : "Your sent requests will appear here"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {requests.map((request) => (
        <View key={request.id} style={styles.requestCard}>
          <View style={styles.requestInfo}>
            <Image source={{ uri: request.avatar }} style={styles.avatar} />

            <View style={styles.requestDetails}>
              <Text style={styles.requestName}>{request.name}</Text>
              <Text style={styles.requestEmail}>{request.email}</Text>
              <Text style={styles.requestTime}>
                {type === "incoming"
                  ? `Requested ${request.requestedAt}`
                  : `Sent ${request.sentAt}`}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            {type === "incoming" ? (
              <>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => onAccept?.(request.id)}
                >
                  <Check size={20} color="#FFFFFF" />
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => onReject?.(request.id)}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => onCancel?.(request.id)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  requestEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  acceptText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectButton: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
