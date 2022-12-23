import React, { useEffect, useContext, useState, useRef } from "react";
import { Button, Image, Text } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
import { AVPlaybackStatus, Video, AVPlaybackStatusSuccess } from "expo-av";
import {
	PostWithMedia,
	removablePostsCustomQuery,
	showablePostsWithMediaCustomQuery,
} from "intus-database/WatermelonDB/models/Post/query/showablePostsWithMediaCustomQuery";
import { MediaWithPosts } from "intus-api/responses/DisplayPostsSyncResponse";
import CarouselService from "intus-core/main/services/CarouselService";

function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync } = useSync();

	const video = useRef<Video | null>(null);

	// Current post being showed on the screen
	const [showingPost, setShowingPost] = useState<PostWithMedia | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();

			CarouselService.startCarousel();
		})();
	}, []);

	useEffect(() => {
		if (!showingPost) {
			keepRequestingNextPost();
			return;
		}

		if (showingPost.type === "image") {
			setTimeout(() => {
				handleNextPost();
			}, showingPost.expose_time);
		}
	}, [showingPost]);

	const handleNextPost = () => {
		const nextPost = CarouselService.getNextPost();
		if (nextPost) {
			setShowingPost({ ...nextPost });
		} else {
			setShowingPost(null);
		}
	};

	const keepRequestingNextPost = () => {
		const interval = setInterval(() => {
			console.log("Asking for next media");

			const nextPost = CarouselService.getNextPost();

			if (!nextPost) return;

			clearInterval(interval);
			setShowingPost(nextPost);
			setIsLoading(false);
		}, 5000);
	};

	const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (isAVPlaybackStatusSuccess(status)) {
			if (status.didJustFinish) {
				handleNextPost();
			}
		}
	};

	function isAVPlaybackStatusSuccess(status: AVPlaybackStatus): status is AVPlaybackStatusSuccess {
		return (status as AVPlaybackStatusSuccess).didJustFinish !== undefined;
	}

	return (
		<>
			{showingPost ? (
				<>
					{showingPost?.type === "image" ? (
						<Image
							source={{ uri: showingPost.downloadedPath }}
							style={{ width: "100%", height: "100%" }}
						/>
					) : showingPost?.type === "video" ? (
						<Video
							ref={video}
							source={{ uri: showingPost.downloadedPath }}
							style={{ width: "100%", height: "100%" }}
							onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
							shouldPlay
							isMuted
							isLooping
						/>
					) : (
						<Text style={{ color: "white" }}>NULL</Text>
					)}
				</>
			) : (
				<Text>No media</Text>
			)}
		</>
	);
}

export default Carousel;
