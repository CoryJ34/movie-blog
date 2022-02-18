import { combineReducers } from "redux";
import detailReducer from "./detailReducer";
import movieListReducer from "./movieListReducer";

const rootReducer = combineReducers({
  movieStore: movieListReducer,
  detailStore: detailReducer,
});

export default rootReducer;
