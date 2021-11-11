import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Movie } from "../../models/Movie";
import ReferenceMap from "../../models/ReferenceMap";

import "./styles/References.scss";

interface Props {
  references: ReferenceMap;
  sortedRefs: string[];
  openDetail: (movie: Movie) => void;
}

const References = (props: Props) => {
  const { references, sortedRefs, openDetail } = props;

  if (!references) {
    return <div>Loading references...</div>;
  }

  const renderReference = (referencer: Movie) => {
    const onClick = () => openDetail(referencer);

    return (
      <div className="referencer" onClick={onClick}>
        <img src={referencer.img} />
      </div>
    );
  };

  const renderRef = (movieRef: string) => {
    return (
      <div key={movieRef} className="movie-reference">
        <Accordion className="milestone">
          <AccordionSummary>
            <div className="reference-name">{`${movieRef} - [${references[movieRef].length}]`}</div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="referencers">
              {references[movieRef].map((referencer) =>
                renderReference(referencer)
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="references-page">
      {sortedRefs.map((movieRef) => renderRef(movieRef))}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const references = state.movieStore?.references;
  let sortedRefs: string[] = [];

  if (references) {
    sortedRefs = Object.keys(references).sort();
  }
  return {
    references: state.movieStore?.references,
    sortedRefs,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    openDetail: (movie: Movie) =>
      dispatch({ type: "detail/open", selectedMovie: movie }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(References);
