import type { Story } from "@ladle/react";
import Footer from "../components/common/Footer/Footer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../reducers/rootReducer";
import Sort from "../components/list/Sort";

export const BasicSort: Story = () => {
  const store = createStore(rootReducer);

  store.dispatch({ type: "movies/sort", sortField: "Rating", sortDir: "DESC" });

  return (
    <Provider store={store}>
      <Sort />
    </Provider>
  );
};
