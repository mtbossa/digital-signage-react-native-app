import React, { useEffect, useContext } from "react";
import { Button, Text } from "react-native";
import { Q } from "@nozbe/watermelondb";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
import { database } from "intus-database/WatermelonDB";
import { Media } from "intus-database/WatermelonDB/models/Media";
function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync } = useSync();
	const { connect } = usePusherConnector();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();
			setIsLoading(false);
		})();
	}, []);

	const createPost = async () => {
		await database.write(async () => {
			const newMedia = await database.get<Media>("medias").create(media => {
				media.mediaId = 1;
				media.filename = "a";
				media.type = "image";
				media.path = "b";
			});
			console.log(newMedia);
			console.log(await database.get("posts").query().fetch()
			
			
			);
		});
	};

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
			<Button title="create" onPress={createPost} />
		</>
	);
}

export default Carousel;
