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

// AWS.config.update({
//   region: "us-east-2",
// });

let dynamodb = new DynamoDB({ region: "us-east-2" });

let schema = buildSchema(`
  type Query {
    hello(testVar: String!): String
  }
`);

let root = {
  hello: (args: any) => {
    return "Hey, the value is " + args.testVar;
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
  let listReq = new Promise((resolve, rej) => {
    dynamodb.listTables({}, (err, data) => {
      if (err) {
        resolve(err);
      }
      resolve(data);
    });
  });

  const scanData: any = await list();

  res.json({
    content: {
      bottomNav,
    },
    categoryData,
    marchMadnessData,
    milestoneData,
    remoteMovieData: scanData,
  });
});

app.get("/bracketdata", (_, res: any) => {
  res.json({
    marchMadnessData,
  });
});

app.post("/migrate", async (req, res: any) => {
  const testResp = {
    test: req.body,
  };

  await migrateFromJson(JSON.parse(req.body.content));

  res.json({
    test: testResp,
  });
});

app.get("*", (_, res: any) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const a = 1;

export default a;
