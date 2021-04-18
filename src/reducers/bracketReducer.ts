import mmData from "../march-madness-data";

const initialState: any = {};

export default function bracketReducer(state = initialState, action: any) {
  switch (action.type) {
    case "bracket/load": {
      return {
        ...state,
        bracketData: mmData,
      };
    }
    default:
      return state;
  }
}
