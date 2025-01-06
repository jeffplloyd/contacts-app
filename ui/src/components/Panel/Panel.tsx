import "./Panel.scss";

interface PanelProps {
  children: React.ReactNode;
  transparent?: boolean;
  borderRadius?: "full" | "top" | "bottom";
  overflowHidden?: boolean;
}

const Panel = ({ children, overflowHidden = false, transparent = false, borderRadius = "full" }: PanelProps) => {
  return (
    <section
      className={`panel ${transparent ? "panel--transparent" : ""} ${overflowHidden ? "panel--overflow-hidden" : ""} ${
        borderRadius ? `panel--border-radius-${borderRadius}` : ""
      }`}
    >
      {children}
    </section>
  );
};

export default Panel;
