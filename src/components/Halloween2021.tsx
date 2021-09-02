import React from "react";
import { CATEGORIES } from "../common/constants";
import { Movie } from "../models/Movie";

import SubCategorized from "./subcategorized/SubCategorized";

const WEEK_MAP: any = {
  "Week 1": "Godzilla",
  "Week 2": "Exploitation",
  "Week 3": "Univeral Horror",
  "Week 4": "Horror Pack",
  "Week 5": "80s Slashers",
  "Week 6": "Paul Naschy",
  "Week 7": "Giallo",
  "Week 8": "Vincent Price",
};

interface Props {
  movies: Movie[];
  openDetail: (selectedMovie: Movie) => void;
}

const Halloween2021 = (props: Props) => {
  const { movies, openDetail } = props;

  return (
    <SubCategorized
      category={CATEGORIES.HALLOWEEN_2021}
      subCategoryMap={WEEK_MAP}
      customWeekCounts={{
        [WEEK_MAP["Week 1"]]: 10,
        [WEEK_MAP["Week 5"]]: 10,
      }}
      {...props}
    />
  );
};

export default Halloween2021;
