// import React, { useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import YoutubePlayer from "react-native-youtube-iframe";
// import { canvaitems } from "../../types/space";

// interface YoutubeCardProps {
//   item: canvaitems;
// }

// const YoutubeCard = ({ item }: YoutubeCardProps) => {
//   const [playing, setPlaying] = useState(false);

//   return (
//     <View style={styles.youtubeContainer}>
//       <YoutubePlayer
//         height={item.size.height - 60}
//         width={item.size.width}
//         play={playing}
//         videoId={item.videoId || "dQw4w9WgXcQ"}
//         webViewProps={{
//           allowsInlineMediaPlayback: true,
//           allowsFullscreenVideo: true,
//           mediaPlaybackRequiresUserAction: false,
//         }}
//         initialPlayerParams={{
//           controls: true,
//           modestbranding: true,
//           showClosedCaptions: false,
//           rel: false,
//         }}
//         onChangeState={(state: string) => {
//           setPlaying(state === "playing");
//         }}
//       />
//       <View style={styles.youtubeFooter}>
//         <Text style={styles.youtubeText}>YouTube</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   youtubeContainer: {
//     flex: 1,
//   },
//   youtubeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   youtubeFooter: {
//     padding: 8,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//   },
// });
// export default YoutubeCard;

import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { canvaitems } from "../../../types/space";

const { width } = Dimensions.get("window");
const cardWidth = 200;

interface YoutubeCardProps {
  item: canvaitems;
}

export default function YoutubeCard({ item }: YoutubeCardProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={110}
          width={cardWidth - 2}
          play={playing}
          videoId={item.videoId}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            allowsFullscreenVideo: true,
            mediaPlaybackRequiresUserAction: false,
          }}
          initialPlayerParams={{
            controls: true,
            modestbranding: true,
            showClosedCaptions: false,
            rel: false,
          }}
          onChangeState={(state: string) => {
            setPlaying(state === "playing");
          }}
          onReady={() => console.log("YouTube player ready")}
          onError={(error: string) =>
            console.log("YouTube player error:", error)
          }
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
    height: 110,
    backgroundColor: "#000",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
