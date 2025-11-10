export default function LayeredCard({
  children,
  className,
  style,
  innerCardStyle,
  innerCardClassName,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  innerCardStyle?: React.CSSProperties;
  innerCardClassName?: string;
}) {
  return (
    <div
      className={`layered-card-middle ${className || ""} ${innerCardClassName || ""}`}
      style={{ ...style, ...innerCardStyle }}
    >
      {children}
    </div>
  );
}
