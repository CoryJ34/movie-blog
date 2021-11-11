import React from "react";
import { CATEGORIES } from "../common/constants";
import { Movie } from "../models/Movie";

import SubCategorized from "./subcategorized/SubCategorized";

const WEEK_MAP: any = {
  "Week 1": "Sci-Fi",
  "Week 2": "90s",
  "Week 3": "Japanese Horror",
  "Week 4": "Al Adamson",
  "Week 5": "Universal Horror",
  "Week 6": "Supernatural",
  "Week 7": "80s Slashers",
  "Week 8": "Italian/Giallo",
  "Week 9": "Vincent Price",
};

interface Props {
  movies: Movie[];
  openDetail: (selectedMovie: Movie) => void;
}

const Halloween2020 = (props: Props) => {
  const { movies, openDetail } = props;
  
  return <SubCategorized category={CATEGORIES.HALLOWEEN_2020} subCategoryMap={WEEK_MAP} {...props} />;
};

export default Halloween2020;
