import React, { useEffect, useContext, useState } from "react";
import { Button, Image, Text } from "react-native";
import { Q } from "@nozbe/watermelondb";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
import { database } from "intus-database/WatermelonDB";
import { Post } from "intus-database/WatermelonDB/models/Post/Post";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";
import { Video } from "expo-av";
import { useCarousel } from "intus-core/main/hooks/useCarousel";

function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync } = useSync();
	const { connect } = usePusherConnector();
	const { currentPlayingMedia, startCarousel } = useCarousel();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();
			setIsLoading(false);

			startCarousel();
		})();
	}, []);

	const test = () => console.log("test");

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
			<Button title="test" onPress={test} />
			{currentPlayingMedia && (
				<>
					{currentPlayingMedia?.type === "image" ? (
						<Image
							source={{ uri: currentPlayingMedia.downloadedPath }}
							style={{ width: "100%", height: "100%" }}
						/>
					) : currentPlayingMedia?.type === "video" ? (
						<Video
							source={{ uri: currentPlayingMedia!.downloadedPath }}
							style={{ width: "100%", height: "100%" }}
						/>
					) : (
						<Text style={{ color: "white" }}>NULL</Text>
					)}
				</>
			)}
		</>
	);
}

export default Carousel;
