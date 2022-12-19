import React, { useEffect, useContext } from "react";
import { Button, Text } from "react-native";
import { Q } from "@nozbe/watermelondb";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
import { database } from "intus-database/WatermelonDB";
import { Media } from "intus-database/WatermelonDB/models/Media/Media";
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

	const deletePost = async () => {
		await database.write(async () => {
			const [media] = await database.get<Media>("medias").query(Q.where("media_id", 10)).fetch();
			await media.destroyPermanently();
		});
	};

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
			<Button title="delete" onPress={deletePost} />
		</>
	);
}

export default Carousel;
