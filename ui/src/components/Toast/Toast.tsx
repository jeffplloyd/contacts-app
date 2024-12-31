import "./Toast.scss";
import { Toast as ToastInterface } from "../../contexts/ToastContext";
import { useToast } from "../../hooks/useToast";
import { useEffect, useRef } from "react";

interface ToastProps {
  id?: string;
  message: string;
  type: "success" | "info" | "error";
}

interface ToastContainerProps {
  toasts: ToastInterface[];
}

const Toast = ({ id, message, type }: ToastProps) => {
  const { removeToast } = useToast();
  const timerID = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;
    timerID.current = setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const handleClick = () => {
    if (id) removeToast(id);
  };

  return (
    <div
      className={`toast toast--${type}`}
      onClick={handleClick}
    >
      {message}
    </div>
  );
};

const ToastContainer = ({ toasts }: ToastContainerProps) => {
  return (
    <div className="toast-container">
      {toasts?.map((toast, id) => (
        <Toast
          key={id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
