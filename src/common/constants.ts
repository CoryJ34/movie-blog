export const CATEGORIES = {
  HALLOWEEN_2020: "Halloween 2020",
  NOV_DEC_2020: "Nov/Dec 2020",
  GAMERA: "Gamera",
  RANDOMIZER: "Randomizer",
  MARCH_MADNESS: "March Madness",
  GENRES: "Genres",
  FINISH_THE_SERIES_HORROR: "[Horror] Finish the Series",
  FINISH_THE_SERIES_NON_HORROR: "[Non-Horror] Finish the Series",
  DECADES_OF_HORROR: "Decades of Horror",
};

export interface SimpleMap {
  [key: string]: string;
}

export const CATEGORY_CLS_MAP: SimpleMap = {
  [CATEGORIES.HALLOWEEN_2020]: 'halloween_2020',
  [CATEGORIES.NOV_DEC_2020]: 'nov_dec_2020',
  [CATEGORIES.GAMERA]: "gamera",
  [CATEGORIES.RANDOMIZER]: "randomizer",
  [CATEGORIES.MARCH_MADNESS]: "march_madness",
  [CATEGORIES.GENRES]: "genres",
  [CATEGORIES.FINISH_THE_SERIES_HORROR]: "finish_the_series_horror",
  [CATEGORIES.FINISH_THE_SERIES_NON_HORROR]: 'finish_the_series_non_horror',
  [CATEGORIES.DECADES_OF_HORROR]: "decades_of_horror",
}

export const LABELS = {
  ARROW: "Arrow",
  CRITERION: "Criterion",
  BLUE_UNDERGROUND: "Blue Underground",
  SYNAPSE: "Synapse",
  SCREAM_FACTORY_COLLECTORS: "Scream Factory",
  SCREAM_FACTORY_OTHER: "Scream Factory (Other)",
  VINEGAR_SYNDROME: "Vinegar Syndrome",
  SEVERIN: "Severin",
  KL: "Kino Lorber",
  MVD: "MVD",
  VESTRON: "Vestron",
  CODE_RED: "Code Red",
  OTHER: "Other"
};

export const FORMATS = {
  BLU_RAY: "Blu Ray",
  DVD: "DVD",
  VHS: "VHS"
}