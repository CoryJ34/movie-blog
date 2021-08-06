import React from "react";
import { Link } from "react-router-dom";
import "./styles/Footer.scss";

const Footer = () => {
  const divider = () => {
    return <div className="divider" />;
  };

  const link = (path: string, label: string) => {
    return (
      <div className="link">
        <a>
          <Link to={path}>{label}</Link>
        </a>
      </div>
    );
  };

  return (
    <div className="footer">
      <div className="links">
        {link("/", "Home")}
        {divider()}
        {link("/movies", "See All Movies")}
        {divider()}
        {link("/references", "See References to Other Movies")}
        {divider()}
        {link("/milestones", "Milestones")}
      </div>
    </div>
  );
};

export default Footer;
