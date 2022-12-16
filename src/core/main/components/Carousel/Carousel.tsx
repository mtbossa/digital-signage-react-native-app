import React, { useEffect, useContext } from "react";
import { Text } from "react-native";

import { AppContext } from "intus-core/shared/contexts/AppContext";
import { useSync } from "intus-core/main/hooks/useSync";
function Carousel() {
	const { setIsLoading } = useContext(AppContext);
	const { sync } = useSync();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await sync();
			setIsLoading(false);
		})();
	}, []);

	return <Text style={{ color: "white" }}>Carousel</Text>;
}

export default Carousel;
