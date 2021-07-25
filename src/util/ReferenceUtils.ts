import { Movie } from "../models/Movie";

const findMovieReferences = (movies: Movie[]) => {
  const referenceMap: any = {};

  movies.forEach((m) => {
    m.content.forEach((c) => {
      const parts = c.split("<strong>");

      parts.forEach((p) => {
        const reference = p.split("</strong>")[0].trim();

        if (reference.match(/^.* \([0-9]{4}\)$/)) {
          if (referenceMap[reference]) {
            if (
              referenceMap[reference].filter((r: Movie) => r.title === m.title)
                .length === 0
            ) {
              referenceMap[reference].push(m);
            }
          } else {
            referenceMap[reference] = [m];
          }
        }
      });
    });
  });

  return referenceMap;
};

export default findMovieReferences;
