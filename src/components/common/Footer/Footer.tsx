import { Drawer, Icon, List, ListItem } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Footer.scss";
import Home from "@material-ui/icons/Home";
import { MoreVert } from "@material-ui/icons";

const Footer = () => {
  const divider = () => {
    return <div className="divider" />;
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const link = (path: string, label: string) => {
    return (
      <div className="link">
        <Link to={path}>{label}</Link>
      </div>
    );
  };

  return (
    <div className="footer">
      <div className="links">
        <div className="full">
          {link("/", "Home")}
          {divider()}
          {link("/movies", "All Movies")}
          {divider()}
          {link("/references", "Movie References")}
          {divider()}
          {link("/milestones", "Milestones")}
          {divider()}
          {link("/ratings", "Ratings")}
          {divider()}
          {link("/shelf", "Shelf")}
        </div>
        <div className="condensed">
          <Link to={"/"}>
            <Home />
          </Link>
          {divider()}
          <MoreVert onClick={() => setDrawerOpen(true)} />
          <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <List>
              <ListItem onClick={() => setDrawerOpen(false)}>{link("/movies", "All Movies")}</ListItem>
              <ListItem onClick={() => setDrawerOpen(false)}>{link("/references", "References")}</ListItem>
              <ListItem onClick={() => setDrawerOpen(false)}>{link("/milestones", "Milestones")}</ListItem>
              <ListItem onClick={() => setDrawerOpen(false)}>{link("/ratings", "Ratings")}</ListItem>
            </List>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Footer;
