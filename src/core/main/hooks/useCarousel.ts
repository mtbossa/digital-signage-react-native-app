import { database } from "intus-database/WatermelonDB";
import { Q } from "@nozbe/watermelondb";

import { Media } from "intus-database/WatermelonDB/models/Media/Media";
import { Post } from "intus-database/WatermelonDB/models/Post/Post";
import { useState } from "react";
import {
	PostWithMedia,
	showablePostsWithMediaCustomQuery,
} from "intus-database/WatermelonDB/models/Post/query/showablePostsWithMediaCustomQuery";

export const useCarousel = () => {
	const [currentPlayingPost, setCurrentPlayingPost] = useState<Post | null>(null);
	const [currentPlayingMedia, setCurrentPlayingMedia] = useState<Media | null>(null);
	const [currentPostIndex, setCurrentPostIndex] = useState(0);

	const allShowabledPosts: PostWithMedia[] = [];

	const startCarousel = async () => {
    console.log("Carousel started");

		setInterval(async () => {
			const customQuery = await showablePostsWithMediaCustomQuery();
			console.log(customQuery);
		}, 10000);
	};

	return {
		currentPlayingMedia,
		startCarousel,
	};
};
