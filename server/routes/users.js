var express = require("express");
var router = express.Router();
const validator = require("fastest-validator");
const v = new validator();
const { User } = require("../models");

// menampilkan semua list data
router.get("/", async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

// menampilkan list data by Id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  return res.json(user || {});
});

// menambahkan data baru
router.post("/", async (req, res) => {
  const schema = {
    name: "string",
    email: "string",
    hp: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const user = await User.create(req.body);
  res.json(user);
});

// mengedit data
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  let user = await User.findByPk(id);
  if (user === null) {
    return res.json({ message: "User not found" });
  }
  const schema = {
    name: "string|optional",
    email: "string|optional",
    hp: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  user = await user.update(req.body);
  res.send(user);
});

// menghapus data
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (user === null) {
    return res.json({ message: "User not found" });
  }
  await user.destroy();
  res.json({
    message: "User successfully deleted",
  });
});

module.exports = router;
