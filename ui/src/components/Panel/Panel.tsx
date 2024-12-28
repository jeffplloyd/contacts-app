import "./Panel.scss"

interface PanelProps {
  children: React.ReactNode;
  transparent?: boolean;
  overflowHidden?: boolean;
}

const Panel = ({
  children,
  overflowHidden = false,
  transparent = false,
}: PanelProps) => {
  return (
    <section
      className={`panel ${transparent ? "panel--transparent" : ""} ${overflowHidden ? "panel--overflow-hidden" : ""}`}
    >
      {children}
    </section>
  );
};

export default Panel;