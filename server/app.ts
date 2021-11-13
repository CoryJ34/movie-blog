import path from "path";
import express from "express";
const app = express();
import movieData from "./src/data/test-data";
import categoryData from "./src/data/category-meta";
import lboxData from "./src/data/lbox-data";
import marchMadnessData from "./src/data/march-madness-data";
import milestoneData from "./src/data/milestones";

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (_, res: any) => {
  res.json({ message: "NOW IN TS" });
});

app.get("/getalldata", (_, res: any) => {
  res.json({
    movieData,
    categoryData,
    lboxData,
    marchMadnessData,
    milestoneData,
  });
});

app.get("/bracketdata", (_, res: any) => {
  res.json({
    marchMadnessData,
  });
});

app.get("*", (_, res: any) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const a = 1;

export default a;
