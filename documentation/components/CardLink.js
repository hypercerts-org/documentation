import Link from "next/link";

export function CardLink({ title, href, children }) {
  return (
    <Link href={href} className="card-link">
      <span className="card-link-title">{title}</span>
      {children && <span className="card-link-desc">{children}</span>}
      <span className="card-link-arrow">→</span>
    </Link>
  );
}
