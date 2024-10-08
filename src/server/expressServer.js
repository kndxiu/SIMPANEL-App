import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8055;

app.use(express.static(path.join(__dirname, "../panel/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../panel/build", "index.html"));
});

app.listen(port, () => {
  // console.log(`Express server running on http://localhost:${port}`);
});
