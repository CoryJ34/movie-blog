import React from "react";
import { CATEGORIES } from "../common/constants";
import { Movie } from "../models/Movie";

import SubCategorized from "./subcategorized/SubCategorized";

const WEEK_MAP: any = {
  "Week 1": "90s VHS",
  "Week 2": "80s Slashers",
  "Week 3": "DVD Horror",
  "Week 4": "Exploitation",
  "Week 5": "Non-Horror",
  "Week 6": "Phillippines ",
  "Week 7": "...And the Rest",
};

interface Props {
  movies: Movie[];
  openDetail: (selectedMovie: Movie) => void;
}

const Blood = (props: Props) => {
  return (
    <SubCategorized
      category={CATEGORIES.BLOOD}
      subCategoryMap={WEEK_MAP}
      customWeekCounts={{
        [WEEK_MAP["Week 1"]]: 4,
        [WEEK_MAP["Week 2"]]: 4,
        [WEEK_MAP["Week 3"]]: 4,
        [WEEK_MAP["Week 4"]]: 4,
        [WEEK_MAP["Week 5"]]: 4,
        [WEEK_MAP["Week 6"]]: 4,
        [WEEK_MAP["Week 7"]]: 4,
      }}
      {...props}
    />
  );
};

export default Blood;
