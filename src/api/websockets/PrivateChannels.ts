export enum PrivateChannels {
	CurrentDisplay = "private-App.Models.Raspberry.",
}

export const getCurrentDisplayChannelName = () => {
	return PrivateChannels.CurrentDisplay + 1;
};
