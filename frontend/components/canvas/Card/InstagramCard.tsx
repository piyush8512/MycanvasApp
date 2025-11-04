import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Instagram } from "lucide-react-native";
import { canvaitems } from "@/types/space";
import { extractInstagramPostId } from "@/utils/linkDetector";

interface InstagramCardProps {
  item: canvaitems;
}

const mobileUserAgent =
  "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36";

export default function InstagramCard({ item }: InstagramCardProps) {
  const postUrl = (item.content as any)?.url;
  const postId = postUrl ? extractInstagramPostId(postUrl) : null;

  if (!postId) {
    return (
      <View style={styles.fallback}>
        <Instagram size={40} color="#C13584" />
        <Text style={styles.fallbackText}>Invalid or missing Instagram URL</Text>
      </View>
    );
  }

  const embedUrl = `https://www.instagram.com/p/${postId}/embed`;

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: embedUrl,
          headers: {
            "User-Agent": mobileUserAgent,
          },
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="small"
            color="#C13584"
          />
        )}
        onLoad={() => console.log("✅ Instagram post loaded")}
        onError={(e) => console.error("❌ WebView error", e.nativeEvent)}
        allowsInlineMediaPlayback={true}
        mixedContentMode="always"
        allowsFullscreenVideo={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  fallbackText: {
    color: "#6B7280",
    marginTop: 6,
  },
});
