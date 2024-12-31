import { createContext, useReducer } from "react";
import { ToastContainer } from "../components/Toast/Toast";

export interface Toast {
  id?: string;
  message: string;
  type: "success" | "info" | "error";
}

const ToastContext = createContext({} as ToastContextValue);

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextValue {
  state: Toast[];
  success: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [state, dispatch] = useReducer(toastReducer, [] as Toast[]);

  const addToast = (toast: Toast) => {
    toast.id = Math.floor(Math.random() * 10000000).toString();
    dispatch({ type: "ADD_TOAST", payload: toast });
  };

  const success = (message: string) => {
    addToast({ message, type: "success" });
  };

  const info = (message: string) => {
    addToast({ message, type: "info" });
  };

  const error = (message: string) => {
    addToast({ message, type: "error" });
  };

  const removeToast = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  const value: ToastContextValue = {
    state,
    success,
    info,
    error,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer toasts={state} />
      {children}
    </ToastContext.Provider>
  );
};

const toastReducer = (state: Toast[], action: { type: string; payload: Toast | string }) => {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.payload as Toast];
    case "REMOVE_TOAST":
      return state.filter((toast) => toast.id !== action.payload);
    default:
      return state;
  }
};

export { ToastContext, ToastProvider };
