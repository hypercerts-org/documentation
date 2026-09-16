import Link from "next/link";

export function CardLink({ title, href, icon, badge, children }) {
  return (
    <Link href={href} className="card-link">
      {icon && (
        <span className="card-link-icon-box">
          <span className="card-link-icon" dangerouslySetInnerHTML={{ __html: icon }} />
        </span>
      )}
      <span className="card-link-text">
        <span className="card-link-title">{title}</span>
        {badge && <span className="release-badge">{badge}</span>}
        {children && <span className="card-link-desc">{children}</span>}
      </span>
    </Link>
  );
}
