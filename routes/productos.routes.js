const express = require("express");
const router = express.Router();
const storageManager = require("../helpers/StorageManager");

const storage = new storageManager("productos.txt");

router.get("/", (req, res) => {
  res.render("home");
});

//obtener todos los productos:
router.get("/productos", async (req, res) => {
  const PRODUCTOS_LISTA = await storage.getAll();
  res.render("productos", { productos: PRODUCTOS_LISTA });
});

//Agregar un producto:
router.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;
  const PRODUCTOS_LISTA = await storage.getAll();

  const productoCheck = PRODUCTOS_LISTA.filter((item) => item.title === title);
  if (productoCheck.length !== 0) {
    return res
      .status(400)
      .json({ error: "El producto ya se encuentra en la base de datos" });
  }

  if (!title.trim() || !price.trim() || !thumbnail.trim()) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  await storage.save({ title, price, thumbnail });
  res.redirect("/");
});

module.exports = router;
