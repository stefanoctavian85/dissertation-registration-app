import { Link } from "react-router-dom";
import "./NavLink.css";

export default function NavLink({ href, children }) {
  const path = window.location.pathname;
  return (
    <Link to={href} className={path.startsWith(href) ? `link active` : `link`}>
      {children}
    </Link>
  );
}
