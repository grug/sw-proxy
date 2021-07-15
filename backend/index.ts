import express from "express";

const app = express();

app.get("/cool-proxy", (req, res) => {
  res.json({ cool: "proxy" });
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
