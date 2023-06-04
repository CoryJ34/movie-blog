import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const FreeTextFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    const val = filterValues[0]; //.toLowerCase();
    const parts = val.split(":");

    if (val.trim() !== "") {
      if (parts[0] === "title") {
        if (m.title.toLowerCase().indexOf(parts[1]) < 0) {
          return false;
        }
      } else if (parts[0] === "desc") {
        const hasAny =
          m.content.filter((c) => c.toLowerCase().indexOf(parts[1]) >= 0)
            .length > 0;

        return hasAny;
      } else if (parts[0] === "director") {
        const hasAny =
          m.directors.filter(
            (c) => c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
          ).length > 0;

        return hasAny;
      } else if (parts[0] === "actor" || parts[0] === "cast") {
        const hasAny =
          m.cast.filter(
            (c) => c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
          ).length > 0;

        return hasAny;
      } else if (parts[0] === "genre") {
        const hasAny =
          m.genres.filter(
            (c) => c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
          ).length > 0;

        return hasAny;
      } else if (parts.length > 1) {
        // @ts-ignore
        const textToSearch = m[parts[0]];

        if (
          (textToSearch || "")
            .toLowerCase()
            .indexOf((parts[1] || "").toLowerCase()) < 0
        ) {
          return false;
        }
      } else {
        let match = false;

        if (m.title.toLowerCase().indexOf(val) >= 0) {
          match = true;
        }

        const hasAny =
          m.content.filter((c) => c.toLowerCase().indexOf(val) >= 0).length > 0;

        if (hasAny) {
          match = true;
        }

        return match;
      }
    }

    return true;
  },
};

export default FreeTextFilter;
