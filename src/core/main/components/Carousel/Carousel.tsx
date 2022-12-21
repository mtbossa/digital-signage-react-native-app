import React, { useEffect, useContext, useState } from "react";
import { Button, Text } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
import { database } from "intus-database/WatermelonDB";
import { Post } from "intus-database/WatermelonDB/models/Post/Post";

function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync } = useSync();
	const { connect } = usePusherConnector();

	const [currentPlayingPost, setCurrentPlayingPost] = useState<Post | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();
			setIsLoading(false);
		})();
	}, []);

	const test = async () => {
		const allPosts = await database.get<Post>("posts").query().fetch();
		const allPostsIds = allPosts.map(post => `posts_ids{}=${post.post_id}`).join("&");
		console.log(allPostsIds);

		const showcase = () => {
			let index = 0;
			setInterval(() => {
				setCurrentPlayingPost(allPosts[index]);
				index = index + 1;
			}, 5000);
		};

		showcase();
	};

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
			<Button title="test" onPress={test} />
			{currentPlayingPost && <Text style={{ color: "white" }}>{currentPlayingPost.post_id}</Text>}
		</>
	);
}

export default Carousel;
