import React from "react";
import { CATEGORIES } from "../common/constants";
import { Movie } from "../models/Movie";

import SubCategorized from "./subcategorized/SubCategorized";

const WEEK_MAP: any = {
  "Week 1": "80s Slashers",
  "Week 2": "Action Thriller",
  "Week 3": "Random Sequels",
  "Week 4": "Sci-Fi Cheese",
  "Week 5": "Horror Docs",
  "Week 6": "Westerns",
  "Week 7": "Samurai",
  "Week 8": "Drama",
};

interface Props {
  movies: Movie[];
  openDetail: (selectedMovie: Movie) => void;
}

const DaysOfListmas = (props: Props) => {
  return (
    <SubCategorized
      category={CATEGORIES.DAYS_OF_LISTMAS}
      subCategoryMap={WEEK_MAP}
      customWeekCounts={{
        [WEEK_MAP["Week 1"]]: 8,
        [WEEK_MAP["Week 2"]]: 7,
        [WEEK_MAP["Week 3"]]: 6,
        [WEEK_MAP["Week 4"]]: 5,
        [WEEK_MAP["Week 5"]]: 4,
        [WEEK_MAP["Week 6"]]: 3,
        [WEEK_MAP["Week 7"]]: 2,
        [WEEK_MAP["Week 8"]]: 1,
      }}
      {...props}
    />
  );
};

export default DaysOfListmas;
