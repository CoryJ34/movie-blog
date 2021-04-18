import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import React from "react";
import { RATING_REGEX } from "../actions/TransferUtils";
import { Movie } from "../models/Movie";

import "./styles/DetailDialog.scss";

interface Props {
  detailOpen: boolean;
  closeDetail: () => void;
  selectedMovie: Movie;
}

const makeContentElement = (content: string, index: number) => {
  if (content.trim().match(RATING_REGEX)) {
    return null;
  }

  let cls = "content-block";
  if (content.indexOf("<") === 0) {
    cls += " complex";
  }

  return (
    <div
      className={cls}
      key={index}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const DetailDialog = (props: Props) => {
  const { detailOpen, closeDetail, selectedMovie } = props;

  return (
    <Dialog
      open={detailOpen}
      maxWidth="md"
      fullWidth={true}
      onClose={closeDetail}
    >
        <div className="img-container backsplash">
          <img src={selectedMovie?.img} />
        </div>
      <div className="detail-dialog-content backsplash">
        <div className={`category ${selectedMovie?.titleBreakout.categoryCls}`}>{selectedMovie?.titleBreakout.category}</div>
        <div className="rating">{parseFloat(selectedMovie?.rating).toFixed(1)}</div>
        <div className="detail-header">
          <div className="title">{selectedMovie?.titleBreakout.title}</div>
          <div className="year">{selectedMovie?.titleBreakout.year}</div>
          {selectedMovie?.titleBreakout.subCategory && <div className="sub-category">{selectedMovie?.titleBreakout.subCategory}</div>}
          {/* {selectedMovie?.titleBreakout.order && <div className="order">{selectedMovie?.titleBreakout.order}</div>} */}
        </div>
        <div className="watched">{`Watched: ${selectedMovie?.date}`}</div>
        <div className="detail-body">
          {selectedMovie?.content.map((content: string, index: number) =>
            makeContentElement(content, index)
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default DetailDialog;
