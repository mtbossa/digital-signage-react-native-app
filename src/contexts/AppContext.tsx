import React, { createContext, ReactNode, useState } from "react";

type AppContextValue = {
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = createContext({} as AppContextValue);

const AppProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);

	return <AppContext.Provider value={{ isLoading, setIsLoading }}>{children}</AppContext.Provider>;
};

export default AppProvider;
