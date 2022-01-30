import path from "path";
import express from "express";
const app = express();
import categoryData from "./src/data/category-meta";
import marchMadnessData from "./src/data/march-madness-data";
import milestoneData from "./src/data/milestones";
import bottomNav from "./src/data/bottom-nav";
import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { list, migrateFromJson } from "./src/repository/MovieRepository";
import Cache, { clearMovieCache } from "./src/repository/Cache";

// AWS.config.update({
//   region: "us-east-2",
// });

let dynamodb = new DynamoDB({ region: "us-east-2" });

let schema = buildSchema(`
  enum Field {
    TAG,
    YEAR,
    DECADE,
    WATCHLIST,
    LABEL,
    FORMAT,
    START_DATE,
    END_DATE,
    YEAR_START,
    YEAR_END,
  }

  input MovieFilter {
    field: Field!
    values: [String!]
  }

  type Movie {
    id: Int!
    title: String!
    year: Int!
    genres: [String]
    summary: String
    backdrop: String
    cast: [String]
    poster: String
    userRating: Float
    runtime: Int
    tagline: String
    directors: [String]
    myRating: Float
    label: String
    img: String
    watchedDate: String
    content: [String]
    categoryCls: String
    subCategory: String
    order: String
    tags: [String]
    format: String
    category: String
  }

  type ListResponse {
    matches: [Movie],
    count: Int!
  }

  type Query {
    hello(testVar: String!): String
    listMovies(test: String, filters: [MovieFilter]): ListResponse
    refreshCache: String
  }
`);

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

    console.log(args);

    // const mainFilter =
    //   args.filters && args.filters.length > 0 && args.filters[0];

    // const matches = scanData.filter(
    //   (m: any) =>
    //     !mainFilter || m.title.toLowerCase().indexOf(mainFilter.values[0]) >= 0
    // );

    const matches = scanData;

    return {
      matches,
      count: matches.length,
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
