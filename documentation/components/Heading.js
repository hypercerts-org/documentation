import React from "react";

function generateId(children) {
  const text = React.Children.toArray(children)
    .filter((child) => typeof child === "string")
    .join("");
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Heading({ level = 2, children, id }) {
  const Tag = `h${level}`;
  const headingId = id || generateId(children);

  return (
    <Tag id={headingId} className="heading-anchor-target">
      {children}
      {(level === 2 || level === 3) && (
        <a
          href={`#${headingId}`}
          className="heading-anchor"
          aria-label={`Link to this section`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(headingId);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              history.pushState(null, "", `#${headingId}`);
            }
          }}
        >
          #
        </a>
      )}
    </Tag>
  );
}
