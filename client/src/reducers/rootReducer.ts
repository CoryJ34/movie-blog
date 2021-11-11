import { combineReducers } from "redux";
import bracketReducer from "./bracketReducer";
import detailReducer from "./detailReducer";
import movieListReducer from "./movieListReducer";

const rootReducer = combineReducers({
  movieStore: movieListReducer,
  detailStore: detailReducer,
  bracketStore: bracketReducer
});

export default rootReducer;
