const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");

const db = require("./database");
const userCollection = require("./model/Users");

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email: email });
    if (user) throw new Error("User already exists");
    await userCollection.create({ email, password });

    // const hasedPassword = await bcrypt.hash(password, 10);

    //database.push({ email, password: hashedPassword });
    res.status(201).send({ message: "User created" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userCollection.findOne({ email: email });

    if (user.password !== password) throw new Error("Wrong password");
    res.status(200).send({ message: "Login successful" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
