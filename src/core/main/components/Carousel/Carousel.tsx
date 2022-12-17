import React, { useEffect, useContext } from "react";
import { Button, Text } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync, connect, disconnect } = useSync();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();
			setIsLoading(false);
		})();
	}, []);

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
			<Button title="disconnect" onPress={disconnect} />
		</>
	);
}

export default Carousel;
