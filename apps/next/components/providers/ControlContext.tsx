"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context's value
interface ControlContextType {
	isAIControlling: boolean;
	setIsAIControlling: (value: boolean) => void;
	modelObject: any;
	setModelObject: (value: any) => void;
}

// Create the context
const ControlContext = createContext<ControlContextType | undefined>(undefined);

// Create the provider component
export const ControlProvider = ({ children }: { children: ReactNode }) => {
	const [isAIControlling, setIsAIControlling] = useState<boolean>(false);
	const [modelObject, setModelObject] = useState<any>({provider: "openai", model: "gpt-4o-mini"});

	return (
		<ControlContext.Provider value={{ isAIControlling, setIsAIControlling, modelObject, setModelObject }}>
			{children}
		</ControlContext.Provider>
	);
};

// Custom hook for accessing the context
export const useControlContext = (): ControlContextType => {
	const context = useContext(ControlContext);
	if (!context) {
		throw new Error("useControlContext must be used within a ControlProvider");
	}
	return context;
};
