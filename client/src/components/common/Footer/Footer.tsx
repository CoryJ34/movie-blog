import { Drawer, Icon, List, ListItem } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SimpleMap } from "../../../common/constants";
import "./styles/Footer.scss";
import Home from "@material-ui/icons/Home";
import { MoreVert } from "@material-ui/icons";
import { connect } from "react-redux";

interface Props {
  content: SimpleMap;
}

const Footer = (props: Props) => {
  const { content } = props;
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
          {Object.keys(content).map((k) => (
            <>
              {link(content[k], k)}
              {divider()}
            </>
          ))}
        </div>
        <div className="condensed">
          <Link to={"/"}>
            <Home />
          </Link>
          {divider()}
          <MoreVert onClick={() => setDrawerOpen(true)} />
          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <List>
              {Object.keys(content).map((k) => (
                <>
                  <ListItem key={k} onClick={() => setDrawerOpen(false)}>
                    {link(content[k], k)}
                  </ListItem>
                </>
              ))}
            </List>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (props: any) => {
  return {
    content: props.movieStore?.bottomNav || {},
  };
};

export default connect(mapStateToProps)(Footer);
