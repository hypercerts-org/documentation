export function CardGrid({ children, columns }) {
  return (
    <div className="card-grid" style={columns === 1 ? { gridTemplateColumns: "1fr" } : undefined}>
      {children}
    </div>
  );
}
