import { Dialog } from "@material-ui/core";
import React from "react";
import { RATING_REGEX } from "../common/constants";
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
      maxWidth="lg"
      fullWidth={true}
      onClose={closeDetail}
    >
      <div className="img-container backsplash">
        <img src={selectedMovie?.img} />
      </div>
      <div className="detail-dialog-content backsplash">
        <div className={`category ${selectedMovie?.categoryCls}`}>
          {selectedMovie?.category}
        </div>
        <div className="rating">
          {parseFloat(selectedMovie?.rating).toFixed(1)}
        </div>
        <div className="detail-header">
          <div className="title">{selectedMovie?.title}</div>
          <div className="year">{selectedMovie?.year}</div>
          {selectedMovie?.subCategory && (
            <div className="sub-category">{selectedMovie?.subCategory}</div>
          )}
          {/* {selectedMovie?.order && <div className="order">{selectedMovie?.order}</div>} */}
        </div>
        <div className="watched">{`Watched: ${selectedMovie?.date}`}</div>
        <div className="detail-body">
          {selectedMovie?.content.map((content: string, index: number) =>
            makeContentElement(content, index)
          )}
        </div>
        <div className="cast">
          <div className="crew-title">Director</div>
          <div className="members">
            {selectedMovie?.directors?.map((cm) => (
              <span className="individual">{cm}</span>
            ))}
          </div>
          <div className="crew-title">Cast</div>
          <div className="members">
            {selectedMovie?.cast?.map((cm) => (
              <span className="individual">{cm}</span>
            ))}
          </div>
          <div className="crew-title">Genres</div>
          <div className="members">
            {selectedMovie?.genres?.map((cm) => (
              <span className="individual">{cm}</span>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DetailDialog;
