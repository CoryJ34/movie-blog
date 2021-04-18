import TitleBreakout from "./TitleBreakout";

export interface Movie {
  id: string,
  title: string;
  img: string;
  date: string;
  content: string[];
  rating: string;
  titleBreakout: TitleBreakout;
}
