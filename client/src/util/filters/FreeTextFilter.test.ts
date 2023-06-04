import { modeledList } from "../../testing/sampleMovies";
import FreeTextFilter from "./FreeTextFilter";

test("test free text search", () => {
  const movie = modeledList[0];
  const handler = FreeTextFilter;

  expect(handler.matches(movie, ["clayton"])).toBe(true);
  expect(handler.matches(movie, ["jupiter"])).toBe(false);
});

test("test free text search with title qualifier", () => {
  const movie = modeledList[0];
  const handler = FreeTextFilter;

  expect(handler.matches(movie, ["title:the worlds"])).toBe(true);
  expect(handler.matches(movie, ["title:planet"])).toBe(false);
  expect(handler.matches(movie, ["title:clayton"])).toBe(false);
});

test("test free text search with description qualifier", () => {
  const movie = modeledList[0];
  const handler = FreeTextFilter;

  expect(handler.matches(movie, ["desc:clayton forrester"])).toBe(true);
  expect(handler.matches(movie, ["desc:jupiter"])).toBe(false);
});

test("test free text search with actor qualifier", () => {
  const movie = modeledList[0];
  const handler = FreeTextFilter;

  expect(handler.matches(movie, ["actor:gene barry"])).toBe(true);
  expect(handler.matches(movie, ["actor:no name"])).toBe(false);

  // support both "actor:" or "cast:"
  expect(handler.matches(movie, ["cast:gene barry"])).toBe(true);
  expect(handler.matches(movie, ["cast:no name"])).toBe(false);
});

test("test free text search with director qualifier", () => {
  const movie = modeledList[0];
  const handler = FreeTextFilter;

  expect(handler.matches(movie, ["director:ron hask"])).toBe(true);
  expect(handler.matches(movie, ["director:haskings"])).toBe(false);
});

test("test free text search with genre qualifier", () => {
  const movie = modeledList[0];
  const handler = FreeTextFilter;

  expect(handler.matches(movie, ["genre:fiction"])).toBe(true);
  expect(handler.matches(movie, ["genre:action"])).toBe(true);
  expect(handler.matches(movie, ["genre:ction"])).toBe(true);
  expect(handler.matches(movie, ["genre:comedy"])).toBe(false);
});
