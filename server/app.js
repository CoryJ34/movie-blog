const path = require("path");
const express = require("express");
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.send("HeYO!");
});

// TODO: remove
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server123!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
