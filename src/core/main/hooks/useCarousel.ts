import { useState, useEffect } from "react";
import {
	PostWithMedia,
	showablePostsWithMediaCustomQuery,
} from "intus-database/WatermelonDB/models/Post/query/showablePostsWithMediaCustomQuery";

export const useCarousel = () => {
	const [currentPlayingPost, setCurrentPlayingPost] = useState<PostWithMedia | null>(null);
	const [allShowablePosts, setAllShowablePosts] = useState<PostWithMedia | null>(null);
	const [currentPostIndex, setCurrentPostIndex] = useState(0);

	const allShowabledPosts = new Map<number, PostWithMedia>();

	const startCarousel = async () => {
		console.log("Starting carousel");
		checkForShowablePosts();
	};

	const checkForShowablePosts = async () => {
		while (true) {
			await new Promise(resolve => setTimeout(resolve, 15000));
			console.log("------------------------------");
			console.log("Checking for showable posts");

			const showablePosts = await showablePostsWithMediaCustomQuery();

			showablePosts.forEach(postWithMedia => {
				const key = postWithMedia.post_api_id;
				if (allShowabledPosts.has(key)) return;
				allShowabledPosts.set(key, postWithMedia);
			});

			if (!currentPlayingPost && allShowabledPosts.size > 0) {
				console.log("Here: ", currentPlayingPost);
				const [firstPost] = allShowabledPosts.values();
				setCurrentPlayingPost(firstPost);
			}

			console.log("Checking for showable finish");
			console.log("------------------------------");
		}
	};

	useEffect(() => {
		console.log("------------------------------");
		console.log("currentPlayingPost changed: ", { currentPlayingPost });
		console.log("------------------------------");
	}, [currentPlayingPost]);

	return {
		currentPlayingPost,
		startCarousel,
	};
};
