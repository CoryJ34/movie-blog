import {
  collectMovieData,
  convertToViewModel,
  collectSummaryInfo,
} from "./DataUtils";
import { modeledList, rawList } from "../testing/sampleMovies";

test("test convertToViewModel", () => {
  const converted = convertToViewModel(rawList);

  // one item filtered out due to not having myRating
  expect(converted.length).toBe(rawList.length - 1);

  expect(converted[0].title).toBe(rawList[0].title);
  expect(converted[1].title).toBe(rawList[1].title);
  expect(converted[2].title).toBe(rawList[2].title);

  expect(converted[0].ratingDiff).toBe("0.70");
  expect(converted[1].ratingDiff).toBe("-0.14");
  expect(converted[2].ratingDiff).toBe("0.78");

  expect(converted[0].rating).toBe(rawList[0].myRating);
  expect(converted[0].runtimeMins).toBe(rawList[0].runtime);
});

test("test collectMovieData", () => {
  const res = collectMovieData(modeledList);

  // test top cast/director/genres
  expect(res.topCast[0].name).toBe("Some Popular Actress");
  expect(res.topCast[0].count).toBe(3);
  expect(res.topCast[1].name).toBe("Some Popular Actor");
  expect(res.topCast[1].count).toBe(2);

  expect(res.topDirectors[0].name).toBe("Another Director");
  expect(res.topDirectors[0].count).toBe(2);

  expect(res.topGenres[0].name).toBe("science-fiction");
  expect(res.topGenres[0].count).toBe(4);
  expect(res.topGenres[1].name).toBe("horror");
  expect(res.topGenres[1].count).toBe(3);

  // test cast/director/genre sets
  expect(res.castSet.has("Some Popular Actress")).toBeTruthy();
  expect(res.castSet.has("Not an actor")).toBeFalsy();

  expect(res.directorSet.has("Another Director")).toBeTruthy();
  expect(res.directorSet.has("Not a director")).toBeFalsy();

  expect(res.genreSet.has("science-fiction")).toBeTruthy();
  expect(res.genreSet.has("not a genre")).toBeFalsy();

  // test years
  expect(res.earliestMovieYear).toBe(1953);
  expect(res.latestMovieYear).toBe(1982);

  // test word counts
  expect(res.wordCountMap["1"]).toBe(129);
  expect(res.wordCountMap["4"]).toBe(111);
});

test("test collectSummaryInfo", () => {
  const summaryInfo = collectSummaryInfo(modeledList);

  expect(summaryInfo.allCategories["halloween_2020"]).toBe("Halloween 2020");
  expect(summaryInfo.allCategories["halloween_2020A"]).toBe("Halloween 2020A");
  expect(Object.keys(summaryInfo.allCategories).length).toBe(2);

  expect(summaryInfo.allTags).toEqual(["Sci-Fi Horror", "Sci-Fi Horror B"]);
  expect(summaryInfo.averageRating).toBe(6.375);
  expect(summaryInfo.minsPerMovie).toBe(81);
  expect(summaryInfo.totalRuntimeMins).toBe(322);
});
