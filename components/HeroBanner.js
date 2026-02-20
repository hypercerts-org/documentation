import { DotPattern } from "./DotPattern";

export function HeroBanner({ title, children, ctaHref, ctaText }) {
  return (
    <div className="hero-banner">
      <DotPattern />
      <div className="hero-banner-content">
        {title && <h1 className="hero-title">{title}</h1>}
        {children && <div className="hero-subtitle">{children}</div>}
        {ctaHref && (
          <a href={ctaHref} className="hero-cta">
            {ctaText || "Get Started"} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}
