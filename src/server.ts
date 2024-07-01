import express from "express";
import routes from "./routes";

const app = express();
const port = 3333;

app.use(express.json());
app.use("/", routes);
app.use("/users", routes);

app.get("/", (req, res) => {
  res.send("Pagina inicial");
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
