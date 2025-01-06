import "./Toast.scss";
import { Toast as ToastInterface } from "../../contexts/ToastContext";
import { useToast } from "../../hooks/useToast";
import { useEffect, useRef, useState } from "react";

interface ToastProps {
  id?: string;
  message: string;
  type: "success" | "info" | "error";
  timeOut?: number | null;
  action?: {
    text: string;
    onClick?: (id?: string) => void;
  };
}

interface ToastContainerProps {
  toasts: ToastInterface[];
}

const Toast = ({ id, message, type, action, timeOut }: ToastProps) => {
  const { removeToast } = useToast();
  const timerID = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const toastRefElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && timeOut) {
      timerID.current = setTimeout(() => {
        setDismissed(true);
      }, timeOut);
    }

    toastRefElement.current?.addEventListener("animationend", (event) => {
      const { animationName } = event;
      if (animationName === "pop-out") {
        dismissToast();
      }
    });
  }, []);

  const dismissToast = () => {
    console.log("Removing toast", id);
    if (id) removeToast(id);
  };

  const handleClick = () => {
    if (action?.onClick) action.onClick(id);
    setDismissed(true);
  };

  return (
    <div
      ref={toastRefElement}
      className={`toast toast--${type} ${dismissed ? "toast--dismissed" : ""}`}
      data-id={id}
    >
      {message}
      {action ? <button onClick={handleClick}>{action.text}</button> : null}
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
          timeOut={toast.timeOut}
          action={toast.action}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
