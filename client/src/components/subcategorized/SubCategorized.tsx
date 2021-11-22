import { Dialog, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { RATING_REGEX } from "../../util/TransferUtils";
import { Movie } from "../../models/Movie";

import "./styles/SubCategorized.scss";

const toCls = (raw: string) => {
  let fixed = raw.match(/^[0-9]+.*$/) ? `the-${raw}` : raw;
  return fixed
    .replaceAll(" ", "-")
    .replaceAll("/", "-")
    .replaceAll("&", "and")
    .toLowerCase();
};

interface NumericMap {
  [key: string]: number;
}

interface Props {
  category: string;
  subCategoryMap?: any;
  movies: Movie[];
  customWeekCounts?: NumericMap;
  openDetail: (selectedMovie: Movie) => void;
}

const SubCategorized = (props: Props) => {
  const { category, subCategoryMap, movies, customWeekCounts, openDetail } =
    props;
  const [selectedWeek, setSelectedWeek] = useState<any>(null);

  if (!movies) {
    return <div>Loading...</div>;
  }

  const filtered = movies
    .filter((m) => m.titleBreakout.category === category)
    .sort((a, b) => {
      return parseInt(a.id, 10) - parseInt(b.id, 10);
    });

  let grouped: any = {};

  filtered.forEach((m) => {
    if (!m.titleBreakout.subCategory) {
      return;
    }

    const week = m.titleBreakout.subCategory;

    if (!week) {
      return;
    }

    const count = (customWeekCounts && customWeekCounts[week]) || 5;

    if (grouped[week]) {
      if (grouped[week].official.length === count) {
        grouped[week].bonus.push(m);
      } else {
        grouped[week].official.push(m);

        if (grouped[week].official.length === count) {
          let capture = false;
          m.content.forEach((content) => {
            if (capture) {
              grouped[week].summaryBlocks.push(content);
            }

            if (content.match(RATING_REGEX)) {
              capture = true;
            }
          });
        }
      }

      grouped[week].count++;
      grouped[week].aggregateRating += parseFloat(m.rating);
    } else {
      grouped[week] = {
        title: (subCategoryMap && subCategoryMap[week]) || week,
        official: [m],
        bonus: [],
        aggregateRating: parseFloat(m.rating),
        count: 1,
        summaryBlocks: [],
      };
    }
  });

  const renderMovie = (movie: Movie) => {
    return (
      <Grid
        key={movie.title}
        item
        className="movie-card"
        onClick={() => openDetail(movie)}
      >
        <img src={movie.img} />
        <div className="movie-title">{movie.titleBreakout.title}</div>
        <div className="movie-year">
          {movie.titleBreakout.year.substr(1, 4)}
        </div>
        <div className="movie-watched">{movie.date}</div>
      </Grid>
    );
  };

  const renderWeek = (week: any) => {
    return (
      <div className={`week ${toCls(week.title)}`}>
        <div className="header">
          <div className="header-bg">
            {week.official.concat(week.bonus).map((m: Movie) => {
              return <img src={m.img} />;
            })}
          </div>
          <div className="header-content">
            <div className="title">{week.title}</div>
            <div className="week-info">
              <div>{`Count: ${week.count}`}</div>
              <div>{`Avg: ${(week.aggregateRating / week.count).toFixed(
                2
              )}`}</div>
            </div>
            <div className="summary-link">
              <a onClick={() => setSelectedWeek(week)}>Summary</a>
            </div>
          </div>
        </div>
        <div className="movies">
          <div className="movie-list official">
            <Grid container justify="center" spacing={2}>
              {week.official.map((m: Movie) => renderMovie(m))}
            </Grid>
          </div>
          <div className="movie-list bonus">
            <Grid container justify="center" spacing={2}>
              {week.bonus.map((m: Movie) => renderMovie(m))}
            </Grid>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`sub-categorized ${filtered[0].titleBreakout.categoryCls}`}>
      {Object.keys(grouped).map((k) => renderWeek(grouped[k]))}
      <Dialog open={!!selectedWeek} onClose={() => setSelectedWeek(null)}>
        <div className="week-summary">
          {selectedWeek?.summaryBlocks?.map((sb: string) => (
            <div dangerouslySetInnerHTML={{ __html: sb }} />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default SubCategorized;
