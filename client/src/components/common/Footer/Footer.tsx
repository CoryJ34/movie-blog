import { Drawer, Icon, IconButton, List, ListItem } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SimpleMap } from "../../../common/constants";
import "./styles/Footer.scss";
import Home from "@material-ui/icons/Home";
import { MoreVert, Refresh } from "@material-ui/icons";
import { connect } from "react-redux";
import { loadMoviesFromServer } from "../../../actions/Actions";
import { Movie } from "../../../models/Movie";

interface Props {
  content: SimpleMap;
  loadMovies: (movies: Movie[]) => void;
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
          {divider()}
          <IconButton
            onClick={() => {
              loadMoviesFromServer(props.loadMovies, true);
            }}
          >
            <Refresh />
          </IconButton>
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadMovies: (allData: any) =>
      dispatch({
        type: "movies/load",
        payload: allData,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
