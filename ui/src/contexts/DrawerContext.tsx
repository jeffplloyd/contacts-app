import { createContext, useState } from "react";
import Drawer from "../components/Drawer/Drawer";

interface DrawerContextValue {
  isOpen: boolean;
  config: {
    headerText: string;
    actions: React.ReactNode;
    children: React.ReactNode;
    position?: "left" | "right";
  };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setConfig: React.Dispatch<
    React.SetStateAction<{
      headerText: string;
      actions: React.ReactNode;
      children: React.ReactNode;
      position?: "left" | "right";
    }>
  >;
}

const DrawerContext = createContext({} as DrawerContextValue);

interface DrawerProviderProps {
  children: React.ReactNode;
}

const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    headerText: string;
    position?: "left" | "right";
    actions: React.ReactNode | null;
    children: React.ReactNode | null;
  }>({
    headerText: "",
    actions: null,
    children: null,
  });

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen, config, setConfig }}>
      {children}

      {isOpen ? (
        <Drawer
          isOpen={isOpen}
          children={config.children}
          headerText={config.headerText}
          actions={config.actions}
          position={config.position}
        />
      ) : null}
    </DrawerContext.Provider>
  );
};

export { DrawerContext, DrawerProvider };
