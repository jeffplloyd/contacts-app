import "./Panel.scss"

interface PanelProps {
  children: React.ReactNode;
  overflowHidden?: boolean;
}

const Panel = ({
  children,
  overflowHidden,
}: PanelProps) => {
  return (
    <section
      className={overflowHidden ? "panel panel--overflow-hidden" : "panel"}
    >
      {children}
    </section>
  );
};

export default Panel;