const initialState: any = {};

export default function bracketReducer(state = initialState, action: any) {
  switch (action.type) {
    case "bracket/load": {
      const { marchMadnessData } = action.payload;
      return {
        ...state,
        bracketData: marchMadnessData,
      };
    }
    default:
      return state;
  }
}
