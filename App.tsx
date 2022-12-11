import * as React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { Video, AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode } from "expo-av";

export default function App() {
	const video: React.LegacyRef<Video> = React.useRef(null);
	const [status, setStatus] = React.useState<AVPlaybackStatusSuccess | null>(null);
	return (
		<View style={styles.videoContainer}>
			<Video
				style={styles.video}
				ref={video}
				source={require("./assets/videos/cod_short_2.mp4")}
				shouldPlay
				resizeMode={ResizeMode.CONTAIN}
				isLooping
				onPlaybackStatusUpdate={status => setStatus(status as AVPlaybackStatusSuccess)}
			/>
			<View
				style={{
					position: "absolute",
					top: 100,
					left: 0,
				}}
			>
				<Button
					title={status?.isPlaying ? "Pause" : "Play"}
					onPress={() =>
						status?.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
					}
				/>
			</View>
		</View>
	);
}

var styles = StyleSheet.create({
	videoContainer: {
		flex: 1,
		backgroundColor: "red",
	},
	video: {
		backgroundColor: "blue",
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
});
