import NextLink from "next/link";

export function Link({ href, children, ...props }) {
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href || ""} {...props}>
      {children}
    </NextLink>
  );
}
