import express, { response } from "express";

const app = express();

app.get("/cool-proxy-service", (req, res) => {
  console.log("hit the cool proxy service");
  res.json({ cool: "proxy" });
});

app.get("/cool-api-service", () => {
  console.log("hit the cool api service");
  response.json({ cool: "api-service" });
});

app.listen(3000);
