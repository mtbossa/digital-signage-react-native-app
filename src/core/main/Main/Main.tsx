import React, { useContext, useState } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { Login } from "intus-core/auth/components/Login";
import { Loading } from "intus-core/shared/components/Loading";
import { colors } from "intus-styles/Colors";
import { downloadHandler, DOWNLOAD_PATH, FILENAME } from "./services/DownloadService";

function Main() {
	const { isLoading, isAuth } = useContext(AppContext);

	const [showVideo, setShowVideo] = useState(false);
	const [mediaDownloaded, setMediaDownloaded] = useState(false);

	const downloadVideo = async () => {
		try {
			const download = await downloadHandler(FILENAME);
			console.log("Donwload sucesseful: ", download);
			setMediaDownloaded(true);
		} catch (e) {
			console.log("Errer inside downloadVideo: ", e);
		}
	};

	const showVideoCallback = async () => {
		setShowVideo(showVideo => !showVideo);
	};

	const deleteVideo = async () => {
		try {
			await FileSystem.deleteAsync(DOWNLOAD_PATH);
			console.log("Media deleted");
			setMediaDownloaded(false);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<View style={style.container}>
			{isLoading ? (
				<Loading />
			) : (
				<View>
					{isAuth ? (
						<View>
							<Text style={{ color: "white" }}>Already authenticated</Text>
							<Button onPress={downloadVideo} title="Download video" />
							<Button onPress={showVideoCallback} title="Show video" />
							<Button onPress={deleteVideo} title="Delete video" />

							<Text style={{ color: "white" }}>Showing video: {showVideo ? "true" : "false"}</Text>
							<Text style={{ color: "white" }}>
								Media downloaded: {mediaDownloaded ? "true" : "false"}
							</Text>
							{showVideo && (
								<>
									<Video
										source={{
											uri: DOWNLOAD_PATH,
										}}
										style={{
											width: 500,
											height: 500,
										}}
										isLooping
										shouldPlay
									/>
								</>
							)}
						</View>
					) : (
						<Login />
					)}
				</View>
			)}
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		backgroundColor: colors.backgroundColor,
	},
});

export default Main;
