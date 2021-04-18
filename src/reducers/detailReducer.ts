const initialState: any = {};

export default function detailReducer(state = initialState, action: any) {
  switch (action.type) {
    case "detail/open": {
      return {
        ...state,
        selectedMovie: action.selectedMovie,
        detailOpen: true,
      };
    }
    case "detail/close": {
      return {
        ...state,
        selectedMovie: null,
        detailOpen: false,
      };
    }
    default:
      return state;
  }
}
