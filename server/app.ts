import path from "path";
import express from "express";
const app = express();
import milestoneData from "./src/data/milestones";
import bottomNav from "./src/data/bottom-nav";
import { graphqlHTTP } from "express-graphql";
import {
  list,
  migrateFromJson,
  saveMovieList,
  TEMPinitLBOX,
} from "./src/repository/MovieRepository";
import Cache, { clearMovieCache } from "./src/repository/Cache";
import { filterMovies } from "./src/utils/FilterUtils";
import schema from "./src/graphql/Schema";
import {
  listCategories,
  saveWatchlist,
} from "./src/repository/CategoryRepository";

let root = {
  hello: (args: any) => {
    return "Hey, the value is " + args.testVar;
  },
  refreshCache: () => {
    clearMovieCache();

    if (Cache.movies) {
      return "Failure";
    } else {
      return "Success";
    }
  },
  listMovies: async (args: any) => {
    const scanData: any = await list();

    const matches = filterMovies(scanData, args.filters);

    return {
      all: scanData,
      matches,
      count: matches.length,
    };
  },
  listCategories: async (args: any) => {
    const scanData: any = await listCategories();

    return {
      categories: scanData,
    };
  },
};

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/api", (_, res: any) => {
  res.json({ message: "NOW IN TS" });
});

app.get("/getalldata", async (_, res: any) => {
  res.json({
    content: {
      bottomNav,
    },
    milestoneData,
  });
});

app.post("/migrate", async (req, res: any) => {
  let finalJson: any = {
    ...JSON.parse(req.body.content),
    label: req.body.label,
    format: req.body.format,
  };

  if (req.body.tags) {
    finalJson.tags = [req.body.tags];
  }

  const resp = await migrateFromJson(finalJson);
  // await TEMPinitLBOX();
  // let setupRes = await setupCategories();

  console.log(resp);

  res.json(finalJson);
});

app.post("/saveWatchlist", async (req, res: any) => {
  const watchlistData = req.body.content;
  const resp = await saveWatchlist(watchlistData);

  res.json(resp);
});

app.post("/saveMovies", async (req, res: any) => {
  const movieList = JSON.parse(req.body.content);
  const resp = await saveMovieList(movieList);

  res.json(resp);
});

app.post("/convert", async (req, res: any) => {
  await TEMPinitLBOX();

  res.json({});
});

app.get("*", (_, res: any) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const a = 1;

export default a;
