import { modeledList } from "../testing/sampleMovies";
import sort from "./SortUtils";

test("test sort by year", () => {
  let sorted = sort(modeledList, "Year", null);

  expect((sorted || []).map((m) => m.title)).toEqual([
    "War of the Worlds ",
    "It Came From Beneath the Sea ",
    "Galaxy of Terror ",
    "Forbidden World ",
  ]);

  sorted = sort(modeledList, "Year", "DESC");
  expect((sorted || []).map((m) => m.title)).toEqual([
    "Forbidden World ",
    "Galaxy of Terror ",
    "It Came From Beneath the Sea ",
    "War of the Worlds ",
  ]);
});

test("test sort by watchedDate", () => {
  let sorted = sort(modeledList, "WatchedDate", null);

  expect((sorted || []).map((m) => m.title)).toEqual([
    "War of the Worlds ",
    "It Came From Beneath the Sea ",
    "Galaxy of Terror ",
    "Forbidden World ",
  ]);

  sorted = sort(modeledList, "WatchedDate", "DESC");
  expect((sorted || []).map((m) => m.title)).toEqual([
    "Forbidden World ",
    "Galaxy of Terror ",
    "It Came From Beneath the Sea ",
    "War of the Worlds ",
  ]);
});

test("test sort by rating", () => {
  let sorted = sort(modeledList, "Rating", null);

  expect((sorted || []).map((m) => m.title)).toEqual([
    "It Came From Beneath the Sea ",
    "Galaxy of Terror ",
    "Forbidden World ",
    "War of the Worlds ",
  ]);

  sorted = sort(modeledList, "Rating", "DESC");
  expect((sorted || []).map((m) => m.title)).toEqual([
    "War of the Worlds ",
    "Forbidden World ",
    "Galaxy of Terror ",
    "It Came From Beneath the Sea ",
  ]);
});
