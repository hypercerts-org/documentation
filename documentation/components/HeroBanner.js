import { DotPattern } from "./DotPattern";

export function HeroBanner({ title, children }) {
  return (
    <div className="hero-banner">
      <DotPattern />
      <div className="hero-banner-content">
        {title && <h1 className="hero-title">{title}</h1>}
        {children && <div className="hero-subtitle">{children}</div>}
      </div>
    </div>
  );
}
