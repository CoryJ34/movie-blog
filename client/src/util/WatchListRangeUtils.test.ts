import { modeledList } from "../testing/sampleMovies";
import makeWatchListRanges from "./WatchListRangeUtils";

test("test makeWatchListRanges", () => {
  const ranges = makeWatchListRanges(modeledList);

  expect(ranges).toEqual([
    {
      firstDate: "August 30, 2020",
      firstID: 0,
      lastDate: "August 30, 2020",
      lastID: 1,
      title: "Halloween 2020",
    },
    {
      firstDate: "August 31, 2020",
      firstID: 1,
      lastDate: "August 31, 2020",
      lastID: 2,
      title: "Halloween 2020A",
    },
    {
      firstDate: "August 31, 2020",
      firstID: 2,
      lastDate: "September 1, 2020",
      lastID: 3,
      title: "Halloween 2020",
    },
  ]);
});
