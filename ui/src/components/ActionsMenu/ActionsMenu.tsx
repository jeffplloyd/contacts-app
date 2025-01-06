import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./ActionsMenu.scss";

interface MenuItemProps {
  text: string;
  value: string;
  disabled?: boolean;
  distructive?: boolean;
  onClick?: (value: string) => void;
}

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(({ text, value, disabled, distructive, onClick }, ref) => {
  const handleClick = () => {
    if (onClick) onClick(value);
  };

  return (
    <li
      role="menuitem"
      tabIndex={0}
      ref={ref}
      className={`menu-item ${disabled ? "menu-item--disabled" : ""} ${distructive ? "menu-item--destructive" : ""}`}
      onClick={handleClick}
    >
      <span>{text}</span>
    </li>
  );
});

interface ActionsMenuProps {
  label: string;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  text: string;
  value: string;
  disabled?: boolean;
  distructive?: boolean;
  onClick?: () => void;
}

const ActionsMenu = ({ items, label, name }: ActionsMenuProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const menuItemsRef = useRef<HTMLElement[]>([]);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      menuToggleRef.current?.focus();
      setActiveIndex(-1);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    const toggleRect = menuToggleRef.current?.getBoundingClientRect();
    const menuRect = menuRef.current?.getBoundingClientRect();
    if (menuRef.current && toggleRect && menuRect) {
      const topPos = toggleRect.top + toggleRect.height / 2;
      const leftPos = toggleRect.right - menuRect.width;
      menuRef.current.setAttribute("style", `top: ${topPos}px; left: ${leftPos}px;`);
    }
  }, [isOpen, menuToggleRef, menuRef]);

  const handleMenuBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    if (event.relatedTarget && menuItemsRef.current.includes(event.relatedTarget as HTMLElement)) return;
    setIsOpen(false);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (["Tab", "Escape"].includes(event.key)) {
      menuToggleRef.current?.focus();
      setIsOpen(false);
      return;
    }
    if (event.key === "ArrowUp") {
      const newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      setActiveIndex(newIndex);
      menuItemsRef.current[newIndex].focus();
      return;
    }
    if (event.key === "ArrowDown") {
      const newIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(newIndex);
      menuItemsRef.current[newIndex].focus();
      return;
    }
  };

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveIndex(0);
      setTimeout(() => menuItemsRef.current[0].focus());
    }
  };

  const handleToggleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (event.key !== "Tab") event.preventDefault();
    if ([" ", "Enter", "Return"].includes(event.key)) {
      setIsOpen(!isOpen);
      setActiveIndex(0);
      menuItemsRef.current[0].focus();
      return;
    }
    if (event.key === "ArrowUp") {
      setIsOpen(true);
      setActiveIndex(items.length - 1);
      menuItemsRef.current[items.length - 1].focus();
      return;
    }
    if (event.key === "ArrowDown") {
      setIsOpen(true);
      setActiveIndex(0);
      menuItemsRef.current[0].focus();
      return;
    }
  };

  const handleItemClick = (itemOnClick: () => void) => {
    if (itemOnClick) itemOnClick();
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={menuToggleRef}
        type="button"
        className="menu-toggle"
        aria-label={label}
        aria-haspopup="true"
        id={name}
        aria-controls={isOpen ? name : undefined}
        aria-expanded={isOpen ? "true" : undefined}
        onClick={handleToggleClick}
        onKeyDown={handleToggleKeyDown}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 11.5C8.53125 11.5 9 11.8125 9.28125 12.25C9.5625 12.7188 9.5625 13.3125 9.28125 13.75C9 14.2188 8.53125 14.5 8 14.5C7.4375 14.5 6.96875 14.2188 6.6875 13.75C6.40625 13.3125 6.40625 12.7188 6.6875 12.25C6.96875 11.8125 7.4375 11.5 8 11.5ZM8 6.5C8.53125 6.5 9 6.8125 9.28125 7.25C9.5625 7.71875 9.5625 8.3125 9.28125 8.75C9 9.21875 8.53125 9.5 8 9.5C7.4375 9.5 6.96875 9.21875 6.6875 8.75C6.40625 8.3125 6.40625 7.71875 6.6875 7.25C6.96875 6.8125 7.4375 6.5 8 6.5ZM9.5 3C9.5 3.5625 9.1875 4.03125 8.75 4.3125C8.28125 4.59375 7.6875 4.59375 7.25 4.3125C6.78125 4.03125 6.5 3.5625 6.5 3C6.5 2.46875 6.78125 2 7.25 1.71875C7.6875 1.4375 8.28125 1.4375 8.75 1.71875C9.1875 2 9.5 2.46875 9.5 3Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <ul
        ref={menuRef}
        role="menu"
        aria-labelledby={name}
        onKeyDown={handleMenuKeyDown}
        onBlur={handleMenuBlur}
        hidden={!isOpen}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.distructive ? <hr className="menu-separator" /> : null}
            <MenuItem
              ref={(element: HTMLLIElement) => (menuItemsRef.current[index] = element)}
              text={item.text}
              value={item.value}
              disabled={item.disabled}
              distructive={item.distructive}
              onClick={() => {
                if (item.onClick) handleItemClick(item.onClick);
              }}
            />
          </React.Fragment>
        ))}
      </ul>
    </>
  );
};

export default ActionsMenu;
