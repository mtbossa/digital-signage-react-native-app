import React, { useEffect, useContext, useState } from "react";
import { Button, Image, Text } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
import { AVPlaybackStatus, Video, AVPlaybackStatusSuccess } from "expo-av";
import {
	PostWithMedia,
	showablePostsWithMediaCustomQuery,
} from "intus-database/WatermelonDB/models/Post/query/showablePostsWithMediaCustomQuery";

function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync } = useSync();
	const { connect } = usePusherConnector();

	const video = useRef<Video | null>(null);
	const [currentShowablePosts, setCurrentShowablePosts] = useState<Map<number, PostWithMedia>>(
		new Map()
	);
	// Current post being showed on the screen
	const [showingPost, setShowingPost] = useState<PostWithMedia | null>(null);
	const [currentPostIndex, setCurrentPostIndex] = useState<number>(0);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();
			setIsLoading(false);

			startCarousel();
		})();
	}, []);

	const startCarousel = async () => {
		while (true) {
			console.log("------------------------------");
			console.log("Checking for showable posts");

			let showablePosts = await showablePostsWithMediaCustomQuery();

			showablePosts.forEach(postWithMedia => {
				const key = postWithMedia.post_api_id;
				if (currentShowablePosts.has(key)) return;
				setCurrentShowablePosts(new Map(currentShowablePosts.set(key, postWithMedia)));
			});

			console.log("Checking for showable finish");
			console.log("------------------------------");
			await new Promise(resolve => setTimeout(resolve, 15000));
		}
	};

	useEffect(() => {
		console.log("useEffect currentShowablePosts: ", { currentShowablePosts });
	}, [currentShowablePosts]);

	useEffect(() => {
		if (currentShowablePosts.size === 0 && !showingPost) return;

		if (!showingPost) {
			console.log("HERE1");
			setShowingPost({ ...getNextPost(showingPost) });
			return;
		}

		console.log({ showingPost });

		if (showingPost.type === "image") {
			setTimeout(() => {
				handleNextPost();
			}, showingPost.expose_time);
		}
	}, [showingPost, currentShowablePosts]);

	const handleNextPost = () => {
		setShowingPost({ ...getNextPost(showingPost) });
	};

	const getNextPost = (post: PostWithMedia | null): PostWithMedia => {
		if (!post) {
			console.log("HERE2; ", [...currentShowablePosts][0][1]);
			return [...currentShowablePosts][0][1];
		}

		const nextIndex = currentPostIndex + 1;

		if (nextIndex > currentShowablePosts.size - 1) {
			// We reach last post, so need to restart
			setCurrentPostIndex(0);
			return [...currentShowablePosts][0][1];
		}
		const nextPost = [...currentShowablePosts][nextIndex][1];

		if (nextPost) {
			setCurrentPostIndex(nextIndex);
			return nextPost;
		} else {
			setCurrentPostIndex(0);
			return [...currentShowablePosts][0][1];
		}
	};

	const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (isAVPlaybackStatusSuccess(status)) {
			if (status.didJustFinish) {
			handleNextPost();
			}

			if (status.isLoaded && !status.isPlaying && !status.isBuffering) {
				video.current?.playAsync();
			}
		}
	};

	function isAVPlaybackStatusSuccess(status: AVPlaybackStatus): status is AVPlaybackStatusSuccess {
		return (status as AVPlaybackStatusSuccess).didJustFinish !== undefined;
	}

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
			{showingPost && (
				<>
					{showingPost?.type === "image" ? (
						<Image
							source={{ uri: showingPost.downloadedPath }}
							style={{ width: "100%", height: "100%" }}
						/>
					) : showingPost?.type === "video" ? (
						<Video
							source={{ uri: showingPost!.downloadedPath }}
							style={{ width: "100%", height: "100%" }}
							onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
							shouldPlay
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
