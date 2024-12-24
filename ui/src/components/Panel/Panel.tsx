import "./Panel.scss"

interface PanelProps {
  children: React.ReactNode;
  compact?: boolean;
}

const Panel = ({
  children,
  compact,
}: PanelProps) => {
  return (
    <section
      className={compact ? "panel panel--compact" : "panel"}
    >
      {children}
    </section>
  );
};

export default Panel;