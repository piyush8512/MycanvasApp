
// import React, { useState } from "react";
// import {
//      Alert,
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import {
//   ArrowLeft,
//   File,
//   Folder,
//   Image as ImageIcon,
//   Link,
//   MessageSquare,
//   Minus,
//   MoveHorizontal as MoreHorizontal,
//   Plus,
//   Send,
//   Share,
//   StickyNote,
// } from "lucide-react-native";


// const ShowLiveChat = ( ) => {
//     const [showLiveChat, setShowLiveChat] = useState(true);
//     const [message, setMessage] = useState(""); 

//       const handleSendMessage = () => {
//         if (message.trim()) {
//           Alert.alert("Message Sent", message);
//           setMessage("");
//         }
//       };
//       const liveChat = [
//     {
//       id: "1",
//       user: "Maya",
//       avatar: "MY",
//       message: "Hey team, moving the PDF closer to the video.",
//       time: "1m ago",
//       color: "#10B981",
//       isOnline: true,
//     },
//     {
//       id: "2",
//       user: "Jamie",
//       avatar: "JM",
//       message: "Perfect! Great I'll add the Tweet reference too.",
//       time: "30s ago",
//       color: "#3B82F6",
//       isOnline: true,
//     },
//     {
//       id: "3",
//       user: "Sam",
//       avatar: "SM",
//       message: "Can someone check the grid alignment?",
//       time: "10s ago",
//       color: "#F59E0B",
//       isOnline: false,
//     },
//   ];
//   return (
  
//      <View style={styles.chatModal}>
//               <View style={styles.chatHeader}>
//                 <View style={styles.liveChatTitle}>
//                   <MessageSquare size={16} color="#10B981" />
//                   <Text style={styles.chatTitle}>Live chat</Text>
//                   <View style={styles.onlineBadge}>
//                     <Text style={styles.onlineCount}>4 online</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={() => setShowLiveChat(false)}>
//                   <Text style={styles.hideButton}>Hide</Text>
//                 </TouchableOpacity>
//               </View>
    
//               <ScrollView
//                 style={styles.chatMessages}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {liveChat.map((chat) => (
//                   <View key={chat.id} style={styles.chatItem}>
//                     <View style={styles.chatItemHeader}>
//                       <View
//                         style={[styles.chatAvatar, { backgroundColor: chat.color }]}
//                       >
//                         <Text style={styles.chatAvatarText}>{chat.avatar}</Text>
//                       </View>
//                       <Text style={styles.chatUser}>{chat.user}</Text>
//                       {chat.isOnline && <View style={styles.onlineIndicator} />}
//                     </View>
//                     <View style={styles.chatBubble}>
//                       <Text style={styles.chatText}>{chat.message}</Text>
//                     </View>
//                   </View>
//                 ))}
//               </ScrollView>
    
//               <View style={styles.messageInput}>
//                 <TextInput
//                   style={styles.messageTextInput}
//                   placeholder="Message..."
//                   value={message}
//                   onChangeText={setMessage}
//                   placeholderTextColor="#9CA3AF"
//                 />
//                 <TouchableOpacity
//                   style={styles.sendButton}
//                   onPress={handleSendMessage}
//                 >
//                   <Send size={16} color="#FFFFFF" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//     );
// };

// export default ShowLiveChat;

// const styles = StyleSheet.create({
//       hideButton: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   chatMessages: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   chatItem: {
//     paddingVertical: 8,
//   },
//   chatItemHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//     gap: 8,
//   },
//   chatAvatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   chatAvatarText: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
//   chatUser: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#1F2937",
//   },
//   onlineIndicator: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#10B981",
//   },
//   chatBubble: {
//     backgroundColor: "#00BCD4",
//     borderRadius: 16,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     alignSelf: "flex-start",
//     maxWidth: "80%",
//   },
//   chatText: {
//     fontSize: 14,
//     color: "#FFFFFF",
//   },
//   messageInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//     gap: 8,
//   },
//   messageTextInput: {
//     flex: 1,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     fontSize: 14,
//     color: "#1F2937",
//   },
//   sendButton: {
//     backgroundColor: "#00BCD4",
//     borderRadius: 20,
//     padding: 8,
//   },
  
//   chatModal: {
//     position: "absolute",
//     bottom: 100,
//     right: 20,
//     width: 300,
//     height: 400,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 16,
//   },
//   chatHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   liveChatTitle: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   chatTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1F2937",
//   },
//   onlineBadge: {
//     backgroundColor: "#10B981",
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//   },
//   onlineCount: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#FFFFFF",
//   },  
// });


// src/components/canvas/LiveChat/LiveChatUI.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Send } from "lucide-react-native";

// Type definition for a single chat message
export type ChatMessage = {
  id: string;
  user: string;
  avatar: string;
  message: string;
  color: string;
  isOnline: boolean;
};

// Props for the UI component
type LiveChatUIProps = {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
};

const ShowLiveChat = ({ messages, onSendMessage }: LiveChatUIProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <>
      <ScrollView
        style={styles.chatMessages}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((chat) => (
          <View key={chat.id} style={styles.chatItem}>
            <View style={styles.chatItemHeader}>
              <View style={[styles.chatAvatar, { backgroundColor: chat.color }]}>
                <Text style={styles.chatAvatarText}>{chat.avatar}</Text>
              </View>
              <Text style={styles.chatUser}>{chat.user}</Text>
              {chat.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>{chat.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.messageInput}>
        <TextInput
          style={styles.messageTextInput}
          placeholder="Message..."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Add styles from your second example here
  chatMessages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    paddingVertical: 8,
  },
  chatItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chatUser: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  chatBubble: {
    backgroundColor: "#F3F4F6", // Lighter bubble for contrast
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
    maxWidth: "80%",
    marginLeft: 32, // Indent the bubble
  },
  chatText: {
    fontSize: 14,
    color: "#1F2937", // Darker text
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
  },
  messageTextInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1F2937",
  },
  sendButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 20,
    padding: 8,
  },
});

export default ShowLiveChat;