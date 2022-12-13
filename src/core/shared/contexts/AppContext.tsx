import React, { createContext, ReactNode, useState } from "react";

type AppContextValue = {
	isLoading: boolean;
	isAuth: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = createContext({} as AppContextValue);

const AppProvider = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isAuth, setIsAuth] = useState(false);

	return (
		<AppContext.Provider value={{ isLoading, setIsLoading, isAuth, setIsAuth }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
