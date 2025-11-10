import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { canvaitems } from "../../../types/space";

const { width } = Dimensions.get("window");
const cardWidth = 300;

interface YoutubeCardProps {
  item: canvaitems;
  
  playTriggerTimestamp?: number; // Timestamp trigger from action menu
}

export default function YoutubeCard({
  item,
  playTriggerTimestamp,
}: YoutubeCardProps) {
  const [playing, setPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef(null);

  // Extract videoId from either direct property or content object
  const videoId = item.videoId || item.content?.videoId;
  

  // Watch for playTriggerTimestamp changes from the action menu
  useEffect(() => {
    if (playTriggerTimestamp && playTriggerTimestamp > 0) {
      console.log(
        "🎬 YoutubeCard: Received play signal at:",
        playTriggerTimestamp,
        "for video:",
        videoId
      );
      console.log("🎬 YoutubeCard: Player ready:", isPlayerReady);

      // Always set playing to true - the player will handle it when ready
      setPlaying(true);

      // If not ready, keep retrying
      if (!isPlayerReady) {
        console.log("⚠️ YoutubeCard: Player not ready yet, will retry...");
        let retryCount = 0;
        const retryInterval = setInterval(() => {
          retryCount++;
          console.log(`🎬 YoutubeCard: Retry attempt ${retryCount}`);
          setPlaying(true);

          // Stop retrying after 5 attempts (2.5 seconds)
          if (retryCount >= 5) {
            console.log("⚠️ YoutubeCard: Max retries reached");
            clearInterval(retryInterval);
          }
        }, 500);

        // Cleanup
        return () => clearInterval(retryInterval);
      }
    }
  }, [playTriggerTimestamp, videoId, isPlayerReady]);

  // Add debugging for playing state changes
  useEffect(() => {
    console.log(
      "🎬 YoutubeCard: Playing state changed to:",
      playing,
      "for video:",
      videoId
    );
  }, [playing, videoId]);

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={210}
          width={cardWidth - 2}
          play={playing}
          videoId={videoId}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            allowsFullscreenVideo: true,
            mediaPlaybackRequiresUserAction: false,
            javaScriptEnabled: true,
            domStorageEnabled: true,
          }}
          initialPlayerParams={{
            controls: true,
            modestbranding: true,
            showClosedCaptions: false,
            rel: false,
            preventFullScreen: false,
          }}
          onChangeState={(state: string) => {
            console.log(
              "🎬 YouTube player state:",
              state,
              "for video:",
              videoId
            );
            setPlaying(state === "playing");
          }}
          onReady={() => {
            console.log("✅ YouTube player ready:", videoId);
            setIsPlayerReady(true);
          }}
          onError={(error: string) => {
            console.log("❌ YouTube player error:", error);
            setIsPlayerReady(false);
          }}
        />
      </View>
      {item.title && (
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.youtube}>YouTube</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    
    backgroundColor: "#FFFFFF",
  },
  playerContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
   
    overflow: "hidden",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
    lineHeight: 18,
  },
  youtube: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "500",

  },
});
