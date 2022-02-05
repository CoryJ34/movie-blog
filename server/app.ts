import path from "path";
import express from "express";
const app = express();
import categoryData from "./src/data/category-meta";
import marchMadnessData from "./src/data/march-madness-data";
import milestoneData from "./src/data/milestones";
import bottomNav from "./src/data/bottom-nav";
import { graphqlHTTP } from "express-graphql";
import { list, migrateFromJson } from "./src/repository/MovieRepository";
import Cache, { clearMovieCache } from "./src/repository/Cache";
import { filterMovies } from "./src/utils/FilterUtils";
import schema from "./src/graphql/Schema";
import { listCategories } from "./src/repository/CategoryRepository";

/*
 * TODO
 * 1) CategoryMeta - categoryName: String, title: String (opening, closing, misc), content: String[], date: String
 * 2) Category - categoryName: String, type: SubCategorized, Bracket, etc, color: String (rgba or hex), subcategories?
 * 3) Milestones - title: String, content: String[], date: String
 * 4) BottomNav - order: Int, label: String, route: String
 * 5) bracket config..?
 */

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
  // let listReq = new Promise((resolve, rej) => {
  //   dynamodb.listTables({}, (err, data) => {
  //     if (err) {
  //       resolve(err);
  //     }
  //     resolve(data);
  //   });
  // });

  // const scanData: any = await list();

  res.json({
    content: {
      bottomNav,
    },
    categoryData,
    marchMadnessData,
    milestoneData,
    // remoteMovieData: scanData,
  });
});

app.get("/bracketdata", (_, res: any) => {
  res.json({
    marchMadnessData,
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

  await migrateFromJson(finalJson);

  res.json(finalJson);
});

app.get("*", (_, res: any) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const a = 1;

export default a;
