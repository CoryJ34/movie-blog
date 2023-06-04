import { modeledList } from "../testing/sampleMovies";
import findMovieReferences from "./ReferenceUtils";

test("test findMovieReferences", () => {
  const refs = findMovieReferences(modeledList);

  expect(Object.keys(refs)).toEqual([
    "20 Million Miles to Earth (1957)",
    "Galaxy of Terror (1981)",
  ]);
});
