import "./Card.css";

/**
 * Generic glass card container.
 *
 * variant: "default" | "elevated" | "accent"
 * as: element type to render ("div" | "article" | ...)
 */
export default function Card({
  children,
  variant = "default",
  hoverable = true,
  className = "",
  as: Component = "div",
  ...rest
}) {
  return (
    <Component
      className={`card card-${variant} ${hoverable ? "card-hoverable" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}

Card.Header = function CardHeader({ children, className = "" }) {
  return <div className={`card-header ${className}`}>{children}</div>;
};

Card.Body = function CardBody({ children, className = "" }) {
  return <div className={`card-body ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = "" }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
};