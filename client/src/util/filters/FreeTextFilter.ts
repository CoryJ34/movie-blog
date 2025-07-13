import FilterHandler from "../../models/FilterHandler";
import { Movie } from "../../models/Movie";

const FreeTextFilter: FilterHandler = {
  matches: (m: Movie, filterValues: string[]): boolean => {
    const val = filterValues[0]; //.toLowerCase();
    const parts = val.split(":");

    if (val.trim() !== "") {
      let isNegation = false;
      let facet = parts[0];

      if (val.charAt(0) == "-") {
        isNegation = true;
        facet = parts[0].substring(1);
      }

      if (facet === "title") {
        if (m.title.toLowerCase().indexOf(parts[1]) < 0) {
          return isNegation;
        } else if (isNegation) {
          return false;
        }
      } else if (facet === "desc") {
        const hasAny =
          m.content.filter((c) => c.toLowerCase().indexOf(parts[1]) >= 0)
            .length > 0;

        return isNegation ? !hasAny : hasAny;
      } else if (facet === "director") {
        const hasAny =
          m.directors.filter(
            (c) => c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
          ).length > 0;

        return isNegation ? !hasAny : hasAny;
      } else if (facet === "actor" || facet === "cast") {
        const hasAny =
          m.cast.filter(
            (c) => c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
          ).length > 0;

        return isNegation ? !hasAny : hasAny;
      } else if (facet === "genre") {
        const hasAny =
          m.genres.filter(
            (c) => c.toLowerCase().indexOf((parts[1] || "").toLowerCase()) >= 0
          ).length > 0;

        return isNegation ? !hasAny : hasAny;
      } else if (parts.length > 1) {
        // @ts-ignore
        const textToSearch = m[facet];

        if (
          (textToSearch || "")
            .toLowerCase()
            .indexOf((parts[1] || "").toLowerCase()) < 0
        ) {
          return isNegation;
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

        return isNegation ? !match : match;
      }
    }

    return true;
  },
};

export default FreeTextFilter;
