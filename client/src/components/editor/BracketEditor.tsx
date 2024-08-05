import { useState } from "react";

interface Props {
  nextIndex: number;
}

const dynamofy = (obj: any) => {
  let res: any = {};

  Object.keys(obj).forEach((key: string) => {
    const val = obj[key];

    if (typeof val === "number") {
      res[key] = {
        N: val.toString(),
      };
    } else if (typeof val === "object") {
      if (val.length) {
        res[key] = {
          L: val.map((v: any) => {
            return {
              M: dynamofy(v),
            };
          }),
        };
      } else {
        res[key] = {
          M: dynamofy(val),
        };
      }
    } else {
      res[key] = {
        S: val,
      };
    }
  });

  return res;
};

const classify = (title: string) => {
  const words = title.split(" ").map((w) => w.toLowerCase());
  return words.join("_");
};

const routify = (title: string) => {
  const words = title.split(" ").map((w) => w.toLowerCase());
  return "/" + words.join("");
};

const BracketEditor = (props: Props) => {
  const { nextIndex } = props;
  const [categories, setCategories] = useState<object>({});
  const [movieList, setMovieList] = useState<string>("");
  // const [openingRemarks, setOpeningRemarks] = useState<string>("");
  const [watchlistColor, setWatchlistColor] = useState<string>("");
  const [watchlistTitle, setWatchlistTitle] = useState<string>("");

  const renderCategories = (numCategories: number) => {
    let inputNames = [];

    for (let i = 0; i < numCategories; i++) {
      inputNames.push(`category${i}`);
    }

    return (
      <div className="bracket-categories">
        {inputNames.map((inputName) => (
          <input
            type="text"
            onChange={(e) => {
              setCategories({ ...categories, [inputName]: e.target.value });
            }}
          />
        ))}
      </div>
    );
  };

  /**
   * Step 1: Get watchlist name
   * Step 2: Get watchlist color
   * Step 3: Get input list of Letterboxd movies
   * Step 4: Save those to DB (new /saveList endpoint) - similar to JSON migration
   * Step 5: Return save status (ensure all movies were saved correctly)
   * Step 6: Load the newly saved movies from the DB (/load?)
   * Step 7: Save those to a bracket-formatted new watchlist (rounds/matches + normal watchlist data)
   */
  return (
    <div className="bracket-editor-container">
      <div className="bracket-list-input">
        <div className="label">Watchlist Name</div>
        <input
          type="text"
          onChange={(e) => {
            setWatchlistTitle(e.target.value);
          }}
        ></input>
      </div>
      <div className="bracket-list-input">
        <div className="label">Watchlist Color</div>
        <input
          type="color"
          onChange={(e) => {
            setWatchlistColor(e.target.value);
          }}
        ></input>
      </div>
      <div className="bracket-list-input">
        <div className="label">Input JSON list from Letterboxd</div>
        <div className="movie-list-container">
          <textarea
            onChange={(e) => {
              setMovieList(e.target.value);
            }}
          ></textarea>
        </div>
        {/* <div className="label">Opening Remarks</div>
        <div className="movie-list-container">
          <textarea
            onChange={(e) => {
              setOpeningRemarks(e.target.value);
            }}
          ></textarea>
        </div> */}
        <div
          className="watchlist-option"
          onClick={async () => {
            // start loading indicator
            // save to DB (/saveList)
            // if failed, hide loading indicator and alert status
            // if successful, load movies and create new watchlist in bracket format
            // if successful, hide loading indicator and alert success
            // if failed, ?

            // console.log(movieList);
            // console.log(JSON.parse(movieList));

            // const resp = await fetch("/saveMovies", {
            //   method: "POST",
            //   body: JSON.stringify({
            //     content: movieList,
            //   }),
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            // });

            // const json = await resp.json();

            // const hasAnyFailure =
            //   json.filter((resData: any) => resData.status === "error")
            //     .length !== 0;

            // // what to do if there is a failure?  Retry?
            // console.log(hasAnyFailure);

            const moviesAsJson = JSON.parse(movieList);

            let watchlistData: any = {
              Order: nextIndex,
              Type: "Bracket",
              Name: watchlistTitle,
              HexColor: watchlistColor,
              Cls: classify(watchlistTitle),
              Route: routify(watchlistTitle),
              Remarks: {
                Opening: "",
                Closing: "",
              },
            };
            watchlistData.Rounds = [];
            watchlistData.Rounds.push({
              Round: 1,
              Matchups: [],
            });
            watchlistData.Rounds.push({
              Round: 2,
              Matchups: [],
            });

            watchlistData.Rounds.push({
              Round: 3,
              Matchups: [],
            });

            watchlistData.Rounds.push({
              Round: 4,
              Matchups: [],
            });

            watchlistData.Rounds.push({
              Round: 5,
              Matchups: [],
            });

            for (let i = 0; i < moviesAsJson.length; i += 2) {
              watchlistData.Rounds[0].Matchups.push({
                A: moviesAsJson[i].id,
                B: moviesAsJson[i + 1].id,
                Blurb: "",
                Winner: moviesAsJson[i].id, // temporarily place a winner
              });
            }

            for (let i = 0; i < moviesAsJson.length; i += 4) {
              watchlistData.Rounds[1].Matchups.push({
                A: moviesAsJson[i].id,
                B: moviesAsJson[i + 3].id,
                Blurb: "",
                Winner: moviesAsJson[i].id, // temporarily place a winner
              });
            }

            for (let i = 0; i < moviesAsJson.length; i += 8) {
              watchlistData.Rounds[2].Matchups.push({
                A: moviesAsJson[i].id,
                B: moviesAsJson[i + 7].id,
                Blurb: "",
                Winner: moviesAsJson[i].id, // temporarily place a winner
              });
            }

            for (let i = 0; i < moviesAsJson.length; i += 16) {
              watchlistData.Rounds[3].Matchups.push({
                A: moviesAsJson[i].id,
                B: moviesAsJson[i + 15].id,
                Blurb: "",
                Winner: moviesAsJson[i].id, // temporarily place a winner
              });
            }

            for (let i = 0; i < moviesAsJson.length; i += 32) {
              watchlistData.Rounds[4].Matchups.push({
                A: moviesAsJson[i].id,
                B: moviesAsJson[i + 31].id,
                Blurb: "",
                Winner: moviesAsJson[i].id, // temporarily place a winner
              });
            }

            console.log(watchlistData);
            console.log(dynamofy(watchlistData));

            const resp = await fetch("/saveWatchlist", {
              method: "POST",
              body: JSON.stringify({
                content: dynamofy(watchlistData),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const json = await resp.json();
            console.log(json);
          }}
        >
          Save movies
        </div>
      </div>
      {/* {renderCategories(8)}
      <div onClick={() => console.log(categories)}>Test</div> */}
    </div>
  );
};

export default BracketEditor;
