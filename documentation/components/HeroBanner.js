import { DotPattern } from "./DotPattern";

export function HeroBanner({ title, children }) {
  return (
    <div className="hero-banner">
      <DotPattern />
      <div className="hero-banner-content">
        {title && <h1 className="hero-title">{title}</h1>}
        {children && <p className="hero-subtitle">{children}</p>}
      </div>
    </div>
  );
}
