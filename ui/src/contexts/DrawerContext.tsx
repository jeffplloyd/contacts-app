import { createContext, useEffect, useState } from "react";
import Drawer from "../components/Drawer/Drawer";

interface DrawerContextValue {
  isOpen: boolean;
  config: DrawerConfig;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setConfig: React.Dispatch<React.SetStateAction<DrawerConfig>>;
  setDismiss: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DrawerConfig {
  headerText?: string;
  actions: React.ReactNode;
  children: React.ReactNode;
  position?: "left" | "right";
  transition?: "fade" | "slide";
}

const DrawerContext = createContext({} as DrawerContextValue);

interface DrawerProviderProps {
  children: React.ReactNode;
}

const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DrawerConfig>({
    headerText: "",
    actions: null,
    children: null,
  });
  const [dismiss, setDismiss] = useState(false);

  useEffect(() => {
    setDismiss(false);
  }, [isOpen]);

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen, config, setConfig, setDismiss }}>
      {children}

      {isOpen ? (
        <Drawer
          isOpen={isOpen}
          children={config.children}
          headerText={config.headerText}
          actions={config.actions}
          position={config.position}
          transition={config.transition}
          dismiss={dismiss}
        />
      ) : null}
    </DrawerContext.Provider>
  );
};

export { DrawerContext, DrawerProvider };
