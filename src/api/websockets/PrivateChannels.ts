export enum PrivateChannels {
	CurrentDisplay = "private-App.Models.Display.",
}

export const getCurrentDisplayChannelName = async (displayId: string) => {
	return PrivateChannels.CurrentDisplay + displayId;
};
