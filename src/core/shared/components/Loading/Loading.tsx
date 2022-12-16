import React from "react";
import { ActivityIndicator, View } from "react-native";

function Loading() {
	return (
		<View style={{ height: "100%", width: "100%", justifyContent: "center" }}>
			<ActivityIndicator size="large" color="#fff" />
		</View>
	);
}

export default Loading;
