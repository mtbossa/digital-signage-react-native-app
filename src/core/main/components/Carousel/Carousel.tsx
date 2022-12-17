import React, { useEffect, useContext } from "react";
import { Button, Text } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
import { usePusherConnector } from "intus-core/main/hooks/usePusherConnector";
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

	return (
		<>
			<Text style={{ color: "white" }}>Carousel</Text>
			<Button title="connect" onPress={connect} />
		</>
	);
}

export default Carousel;
