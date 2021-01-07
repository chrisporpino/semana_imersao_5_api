const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("./models/Metas");
const Meta = mongoose.model("Meta");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Authorization"
  );
  app.use(cors());
  next();
});

mongoose
  .connect("mongodb://localhost/chris", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexão com o BD MongoDB realizada com sucesso!");
  })
  .catch((err) => {
    console.log("Erro! Conexão com o BD MongoDB falhou: " + err);
  });

app.get("/metas", async (req, res) => {
  await Meta.find({})
    .then((metas) => {
      return res.json({
        error: false,
        metas,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Nenhum registro encontrado!",
      });
    });
});

app.post("/metas", async (req, res) => {
  await Meta.create(req.body, (err) => {
    if (err)
      return res.status(400).json({
        err: true,
        message: "Erro: meta não cadastrada",
      });
  });

  return res.json({
    error: false,
    metas: "Meta cadastrada com sucesso!",
  });
});

app.listen(3003, () => {
  console.log("Servidor iniciando na porta 3003: http://localhost:3003");
});
