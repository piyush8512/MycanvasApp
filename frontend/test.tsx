import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { ArrowLeft, Share, Users, MessageSquare, Send, FileText, Play, Image as ImageIcon, MoveHorizontal as MoreHorizontal, Eye, Download, Heart, Star } from 'lucide-react-native';
import { UserAvatarGroup } from '@/components/UserAvatarGroup';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CanvasScreen() {
  const [message, setMessage] = useState('');
  const [selectedTool, setSelectedTool] = useState('Select');
  const [showLiveChat, setShowLiveChat] = useState(false);

  // Animation values for zoom and pan
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const canvasItems = [
    {
      id: '1',
      type: 'pdf',
      name: 'PDF notes',
      position: { x: 120, y: 180 },
      size: { width: 200, height: 280 },
      collaborators: ['user1', 'user2'],
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: '2',
      type: 'youtube',
      name: 'YouTube',
      position: { x: 120, y: 320 },
      size: { width: 280, height: 160 },
      collaborators: ['user3'],
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: '3',
      type: 'instagram',
      name: 'Instagram Post',
      position: { x: 420, y: 180 },
      size: { width: 200, height: 250 },
      collaborators: ['user4'],
      url: 'https://www.instagram.com/p/example/',
    },
    {
      id: '4',
      type: 'twitter',
      name: 'Twitter/X',
      position: { x: 420, y: 450 },
      size: { width: 280, height: 200 },
      collaborators: ['user4'],
      url: 'https://twitter.com/example/status/123456789',
    },
  ];

  const liveChat = [
    {
      id: '1',
      user: 'Maya',
      avatar: 'MY',
      message: 'Hey team, moving the PDF closer to the video.',
      time: '1m ago',
      color: '#10B981',
      isOnline: true,
    },
    {
      id: '2',
      user: 'Jamie',
      avatar: 'JM',
      message: 'Perfect! Great I\'ll add the Tweet reference too.',
      time: '30s ago',
      color: '#3B82F6',
      isOnline: true,
    },
    {
      id: '3',
      user: 'Sam',
      avatar: 'SM',
      message: 'Can someone check the grid alignment?',
      time: '10s ago',
      color: '#F59E0B',
      isOnline: false,
    },
  ];

  const tools = ['Select', 'Shape', 'Text'];

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert('Message Sent', message);
      setMessage('');
    }
  };

  // Pan responder for handling gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: ( ) => {
      scale.setOffset(scale._value);
      translateX.setOffset(translateX._value );
      translateY.setOffset(translateY._value);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (evt.nativeEvent.touches.length === 2) {
        // Handle pinch gesture for zoom
        const touch1 = evt.nativeEvent.touches[0];
        const touch2 = evt.nativeEvent.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
        );
        // Simple zoom logic - you might want to improve this
        const newScale = Math.max(0.5, Math.min(3, distance / 200));
        scale.setValue(newScale);
      } else {
        // Handle pan gesture
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: () => {
      scale.flattenOffset();
      translateX.flattenOffset();
      translateY.flattenOffset();
    },
  });

  const renderMediaContent = (item: typeof canvasItems[0]) => {
    switch (item.type) {
      case 'pdf':
        return (
          <View style={styles.mediaContainer}>
            <Pdf
              source={{ uri: item.url }}
              style={styles.pdfViewer}
              onLoadComplete={(numberOfPages) => {
                console.log(`PDF loaded with ${numberOfPages} pages`);
              }}
              onError={(error) => {
                console.log('PDF Error:', error);
              }}
            />
          </View>
        );

      case 'youtube':
        const youtubeHtml = `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; background: #000; }
                iframe { width: 100%; height: 100%; border: none; }
              </style>
            </head>
            <body>
              <iframe 
                src="${item.url}?autoplay=0&controls=1&modestbranding=1"
                frameborder="0"
                allowfullscreen>
              </iframe>
            </body>
          </html>
        `;
        return (
          <WebView
            source={{ html: youtubeHtml }}
            style={styles.webViewer}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
          />
        );

      case 'instagram':
        const instagramHtml = `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 8px; background: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                .post { border: 1px solid #dbdbdb; border-radius: 8px; background: white; }
                .header { padding: 12px; display: flex; align-items: center; border-bottom: 1px solid #efefef; }
                .avatar { width: 32px; height: 32px; border-radius: 50%; background: #e1306c; margin-right: 12px; }
                .username { font-weight: 600; font-size: 14px; }
                .image { width: 100%; height: 120px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); }
                .actions { padding: 12px; }
                .likes { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
                .caption { font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="post">
                <div class="header">
                  <div class="avatar"></div>
                  <div class="username">username</div>
                </div>
                <div class="image"></div>
                <div class="actions">
                  <div class="likes">1,234 likes</div>
                  <div class="caption">Sample Instagram post content...</div>
                </div>
              </div>
            </body>
          </html>
        `;
        return (
          <WebView
            source={{ html: instagramHtml }}
            style={styles.webViewer}
            scrollEnabled={false}
          />
        );

      case 'twitter':
        const twitterHtml = `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 8px; background: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                .tweet { border: 1px solid #e1e8ed; border-radius: 12px; padding: 12px; background: white; }
                .header { display: flex; align-items: center; margin-bottom: 8px; }
                .avatar { width: 40px; height: 40px; border-radius: 50%; background: #1da1f2; margin-right: 12px; }
                .user-info { flex: 1; }
                .name { font-weight: 700; font-size: 15px; }
                .handle { color: #536471; font-size: 15px; }
                .content { font-size: 15px; line-height: 1.3; margin-bottom: 12px; }
                .actions { display: flex; justify-content: space-between; color: #536471; }
                .action { font-size: 13px; }
              </style>
            </head>
            <body>
              <div class="tweet">
                <div class="header">
                  <div class="avatar"></div>
                  <div class="user-info">
                    <div class="name">User Name</div>
                    <div class="handle">@username</div>
                  </div>
                </div>
                <div class="content">
                  This is a sample tweet content that shows how Twitter posts would appear in the canvas.
                </div>
                <div class="actions">
                  <div class="action">💬 12</div>
                  <div class="action">🔄 34</div>
                  <div class="action">❤️ 56</div>
                  <div class="action">📤</div>
                </div>
              </div>
            </body>
          </html>
        `;
        return (
          <WebView
            source={{ html: twitterHtml }}
            style={styles.webViewer}
            scrollEnabled={false}
          />
        );

      default:
        return (
          <View style={styles.defaultContent}>
            <FileText size={32} color="#6B7280" />
            <Text style={styles.defaultText}>{item.name}</Text>
          </View>
        );
    }
  };

  const renderCanvasItem = (item: typeof canvasItems[0]) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.canvasItem,
          {
            left: item.position.x,
            top: item.position.y,
            width: item.size.width,
            height: item.size.height,
          },
        ]}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity>
            <MoreHorizontal size={12} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemContent}>
          {renderMediaContent(item)}
        </View>

        <View style={styles.itemFooter}>
          <UserAvatarGroup users={item.collaborators} size={16} maxVisible={2} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.canvasTitle}>My workspace</Text>
          <Text style={styles.canvasSubtitle}>New Canvas</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Users size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsContainer}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool}
              style={[
                styles.toolButton,
                selectedTool === tool && styles.activeToolButton,
              ]}
              onPress={() => setSelectedTool(tool)}
            >
              <Text
                style={[
                  styles.toolText,
                  selectedTool === tool && styles.activeToolText,
                ]}
              >
                {tool}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.canvasInfo}>Infinite canvas • pinch to zoom • drag to pan</Text>
      </View>

      {/* Canvas Area with Zoom/Pan */}
      <View style={styles.canvasContainer}>
        <Animated.View
          style={[
            styles.canvas,
            {
              transform: [
                { translateX: translateX },
                { translateY: translateY },
                { scale: scale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.canvasContent}>
            {canvasItems.map(renderCanvasItem)}
          </View>
        </Animated.View>
      </View>

      {/* Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setShowLiveChat(!showLiveChat)}
      >
        <MessageSquare size={24} color="#FFFFFF" />
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>3</Text>
        </View>
      </TouchableOpacity>

      {/* Live Chat Modal */}
      {showLiveChat && (
        <View style={styles.chatModal}>
          <View style={styles.chatHeader}>
            <View style={styles.liveChatTitle}>
              <MessageSquare size={16} color="#10B981" />
              <Text style={styles.chatTitle}>Live chat</Text>
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineCount}>4 online</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowLiveChat(false)}>
              <Text style={styles.hideButton}>Hide</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
            {liveChat.map((chat) => (
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
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  canvasTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  canvasSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toolsContainer: {
    flexDirection: 'row',
  },
  toolButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeToolButton: {
    backgroundColor: '#00BCD4',
  },
  toolText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeToolText: {
    color: '#FFFFFF',
  },
  canvasInfo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  canvas: {
    flex: 1,
  },
  canvasContent: {
    width: screenWidth * 2,
    height: screenHeight * 2,
    position: 'relative',
  },
  canvasItem: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  mediaContainer: {
    flex: 1,
  },
  pdfViewer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  defaultContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  defaultText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatModal: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  liveChatTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  onlineBadge: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  onlineCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  hideButton: {
    fontSize: 14,
    color: '#6B7280',
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    paddingVertical: 8,
  },
  chatItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatUser: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  chatBubble: {
    backgroundColor: '#00BCD4',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  chatText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  messageTextInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  sendButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 20,
    padding: 8,
  },
});