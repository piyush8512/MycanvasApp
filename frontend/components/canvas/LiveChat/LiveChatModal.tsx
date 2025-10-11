// import React, { useState } from "react";
// import {
//   Alert,
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { Send, X } from "lucide-react-native";
// import ShowLiveChat from "./ShowLiveChat";

// // 1. Define the type for a single chat message
// type ChatMessage = {
//   id: string;
//   user: string;
//   avatar: string;
//   message: string;
//   time: string;
//   color: string;
//   isOnline: boolean;
// };

// // 2. Define the props for the component
// type ShowLiveChatProps = {
//   onClose: () => void; // Function to close the chat window
// };

// // Sample data (can be passed as a prop in a real app)
// const initialMessages: ChatMessage[] = [
//   {
//     id: "1",
//     user: "Maya",
//     avatar: "MY",
//     message: "Hey team, moving the PDF closer to the video.",
//     time: "1m ago",
//     color: "#10B981", // Emerald green
//     isOnline: true,
//   },
//   {
//     id: "2",
//     user: "Jamie",
//     avatar: "JM",
//     message: "Perfect! Great I'll add the Tweet reference too.",
//     time: "30s ago",
//     color: "#3B82F6", // Blue
//     isOnline: true,
//   },
//   {
//     id: "3",
//     user: "Sam",
//     avatar: "SM",
//     message: "Can someone check the grid alignment?",
//     time: "10s ago",
//     color: "#F59E0B", // Amber
//     isOnline: false,
//   },
// ];

// // 3. Correct the component implementation
// const ShowLiveChat = ({ onClose }: ShowLiveChatProps) => {
//   const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
//   const [newMessage, setNewMessage] = useState("");

//   const handleSendMessage = () => {
//     if (newMessage.trim() === "") return;

//     const messageToSend: ChatMessage = {
//       id: Date.now().toString(),
//       user: "You", // Assuming the current user is "You"
//       avatar: "U",
//       message: newMessage,
//       time: "Just now",
//       color: "#8B5CF6", // Purple
//       isOnline: true,
//     };

//     setMessages([...messages, messageToSend]);
//     setNewMessage(""); // Clear the input field
//   };

//   return (
//     <View style={styles.overlay}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Live Chat</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <X size={24} color="#6B7280" />
//           </TouchableOpacity>
//         </View>

//         {/* Message List */}
//         <ScrollView style={styles.messageList}>
//           {messages.map((chat) => (
//             <View key={chat.id} style={styles.messageContainer}>
//               <View style={[styles.avatar, { backgroundColor: chat.color }]}>
//                 <Text style={styles.avatarText}>{chat.avatar}</Text>
//                 {chat.isOnline && <View style={styles.onlineIndicator} />}
//               </View>
//               <View style={styles.messageContent}>
//                 <View style={styles.messageHeader}>
//                   <Text style={styles.userName}>{chat.user}</Text>
//                   <Text style={styles.messageTime}>{chat.time}</Text>
//                 </View>
//                 <Text style={styles.messageText}>{chat.message}</Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>

//         {/* Input Area */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Type your message..."
//             value={newMessage}
//             onChangeText={setNewMessage}
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
//             <Send size={20} color="#FFFFFF" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     top: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     justifyContent: "flex-end",
//   },
//   container: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: "75%",
//     paddingTop: 8,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   closeButton: {
//     padding: 4,
//   },
//   messageList: {
//     flex: 1,
//     padding: 16,
//   },
//   messageContainer: {
//     flexDirection: "row",
//     marginBottom: 16,
//     alignItems: "flex-start",
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   avatarText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   onlineIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#10B981",
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   messageContent: {
//     flex: 1,
//   },
//   messageHeader: {
//     flexDirection: "row",
//     alignItems: "baseline",
//     marginBottom: 4,
//   },
//   userName: {
//     fontWeight: "bold",
//     marginRight: 8,
//   },
//   messageTime: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   messageText: {
//     fontSize: 14,
//     color: "#374151",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//     alignItems: "center",
//   },
//   textInput: {
//     flex: 1,
//     height: 44,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 22,
//     paddingHorizontal: 16,
//     marginRight: 12,
//   },
//   sendButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "#00BCD4",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default ShowLiveChat;

// src/components/canvas/LiveChat/LiveChatModal.js

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MessageSquare } from "lucide-react-native";
import LiveChatUI, { ChatMessage } from "./ShowLiveChat";

// Props for the Modal component
type LiveChatModalProps = {
  onClose: () => void;
};

// Sample data lives here, in the state-managing component
const initialMessages: ChatMessage[] = [
  // ... (same initialMessages array as before)
];

const LiveChatModal = ({ onClose }: LiveChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const handleSendMessage = (messageText: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "U",
      message: messageText,
      color: "#8B5CF6", // Purple
      isOnline: true,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <View style={styles.chatModal}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <View style={styles.liveChatTitle}>
          <MessageSquare size={16} color="#10B981" />
          <Text style={styles.chatTitle}>Live chat</Text>
          <View style={styles.onlineBadge}>
            <Text style={styles.onlineCount}>4 online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.hideButton}>Hide</Text>
        </TouchableOpacity>
      </View>

      {/* The Reusable UI Component */}
      <LiveChatUI messages={messages} onSendMessage={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Add modal-specific styles here
  chatModal: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    display: "flex", // Use flexbox for layout
    flexDirection: "column",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  liveChatTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  onlineBadge: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  onlineCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  hideButton: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default LiveChatModal;
