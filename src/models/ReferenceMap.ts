import { Movie } from "./Movie";

export default interface ReferenceMap {
  [key: string]: Movie[];
}
