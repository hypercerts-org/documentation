export function DotPattern({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={`dot-pattern ${className || ""}`}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="dot-grid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          x="0"
          y="0"
        >
          <rect width="2" height="2" fill="current" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill="url(#dot-grid)" />
    </svg>
  );
}
