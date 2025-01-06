import { useEffect, useRef, useState } from "react";
import "./Drawer.scss";
import Panel from "../Panel/Panel";
import { useDrawer } from "../../hooks/useDrawer";

interface DrawerProps {
  children: React.ReactNode;
  headerText?: string;
  actions?: React.ReactNode;
  isOpen?: boolean;
  position?: "left" | "right";
}
const Drawer = ({ children, headerText, actions, position = "right" }: DrawerProps) => {
  const actionsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDrawer();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (contentRef?.current) {
      contentRef.current.addEventListener("animationend", (event) => {
        const { animationName } = event;
        if (animationName.includes("slide-out")) {
          setIsOpen(false);
        }
      });
    }
  }, []);

  return (
    <div
      role="presentation"
      className={`drawer drawer--${position} ${isOpen ? "drawer--open" : ""} ${dismissed ? "drawer--dismissed" : ""}`}
    >
      <div
        aria-hidden="true"
        className="drawer__overlay"
        onClick={() => setDismissed(true)}
      />
      <div
        ref={contentRef}
        className="drawer__content"
      >
        <Panel
          borderRadius={window.innerWidth >= 768 ? "full" : "top"}
          overflowHidden={true}
        >
          <div className="drawer__header">
            {headerText ? <h2>{headerText}</h2> : null}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setDismissed(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7812 4.28125L9.03125 8.03125L12.75 11.75C13.0625 12.0312 13.0625 12.5 12.75 12.7812C12.4688 13.0938 12 13.0938 11.7188 12.7812L7.96875 9.0625L4.25 12.7812C3.96875 13.0938 3.5 13.0938 3.21875 12.7812C2.90625 12.5 2.90625 12.0312 3.21875 11.7188L6.9375 8L3.21875 4.28125C2.90625 4 2.90625 3.53125 3.21875 3.21875C3.5 2.9375 3.96875 2.9375 4.28125 3.21875L8 6.96875L11.7188 3.25C12 2.9375 12.4688 2.9375 12.7812 3.25C13.0625 3.53125 13.0625 4 12.7812 4.28125Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div
            ref={bodyRef}
            className="drawer__body"
          >
            {children}
          </div>

          {actions ? (
            <div
              ref={actionsRef}
              className="drawer__actions"
            >
              {actions}
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  );
};

export default Drawer;
