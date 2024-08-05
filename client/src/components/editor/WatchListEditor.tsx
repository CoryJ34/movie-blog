import { useMemo, useState } from "react";
import BracketEditor from "./BracketEditor";
import "./styles/WatchListEditor.scss";
import { connect } from "react-redux";
import { Category } from "../../models/Category";

interface Props {
  existingWatchlists: Category[];
}

const TYPES = {
  SIMPLE: "Simple",
  SUBCATEGORY: "SubCategory",
  BRACKET: "Bracket",
};

const WatchListEditor = (props: Props) => {
  const [type, setType] = useState<string | null>(null);
  const { existingWatchlists } = props;

  const nextIndex = useMemo(() => {
    if (existingWatchlists) {
      return existingWatchlists[existingWatchlists.length - 1].order + 1;
    }
  }, [existingWatchlists]);

  const renderOption = (label: string, type: string) => {
    return (
      <div
        className="watchlist-option"
        onClick={() => {
          setType(type);
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="watchlist-editor-container">
      <div className="watchlist-editor-prompt">
        What kind of watchlist will this be?
      </div>
      <div className="watchlist-option-controls">
        {renderOption("Simple", TYPES.SIMPLE)}
        {renderOption("SubCategorized", TYPES.SUBCATEGORY)}
        {renderOption("Bracket", TYPES.BRACKET)}
      </div>
      {type === TYPES.SIMPLE && <div>TODO: Add Simple editor</div>}
      {type === TYPES.SUBCATEGORY && <div>TODO: Add SubCategorized editor</div>}
      {type === TYPES.BRACKET && <BracketEditor nextIndex={nextIndex || 0} />}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    existingWatchlists: state.movieStore?.categories,
  };
};

export default connect(mapStateToProps)(WatchListEditor);
