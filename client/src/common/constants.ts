export const CATEGORIES = {
  HALLOWEEN_2020: "Halloween 2020",
  NOV_DEC_2020: "Nov/Dec 2020",
  GAMERA: "Gamera",
  RANDOMIZER: "Randomizer",
  MARCH_MADNESS: "March Madness",
  MARCH_MADNESS_2: "March Madness 2",
  GENRES: "Genres",
  FINISH_THE_SERIES_HORROR: "[Horror] Finish the Series",
  FINISH_THE_SERIES_NON_HORROR: "[Non-Horror] Finish the Series",
  DECADES_OF_HORROR: "Decades of Horror",
  GENRE_SAMPLER: "Genre Sampler",
  HALLOWEEN_2021: "Halloween 2021",
  DAYS_OF_LISTMAS: "Days of Listmas",
  BLOOD: "Blood!",
};

export interface SimpleMap {
  [key: string]: string;
}

export const TAGS: any = {
  SLASH80S: "80s Slasher",
  GIALLO: "Giallo",
  UNIVERSAL: "Universal",
  JAPANESE: "Japanese",
  WESTERN: "Western",
  HAMMER: "Hammer",
  VINCENT_PRICE: "Vincent Price",
  SCI_FI: "Sci-Fi",
  SCI_FI_HORROR: "Sci-Fi Horror",
  ACTION: "Action",
  DRAMA: "Drama",
  COMEDY_HORROR: "Comedy Horror",
  DOCUMENTARY: "Documentary",
  FOLK_HORROR: "Folk Horror",
};

export const LABELS: any = {
  ARROW: "Arrow",
  CRITERION: "Criterion",
  BLUE_UNDERGROUND: "Blue Underground",
  SYNAPSE: "Synapse",
  SCREAM_FACTORY_COLLECTORS: "Scream Factory (Collector's Edition)",
  SCREAM_FACTORY_OTHER: "Scream Factory (Other)",
  VINEGAR_SYNDROME: "Vinegar Syndrome",
  SEVERIN: "Severin",
  KL: "Kino Lorber",
  MVD: "MVD",
  VESTRON: "Vestron",
  CODE_RED: "Code Red",
  OTHER: "Other",
};

export const FORMATS: any = {
  BLU_RAY: "Blu Ray",
  DVD: "DVD",
  VHS: "VHS",
};

export const RATING_REGEX = /^[0-9]*\.*[0-9]*\/[0-9]+$/;
