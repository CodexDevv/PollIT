require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { hash, compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const bodyParser = require("body-parser");

const db = require("./database");
const userCollection = require("./model/Users");

const app = express();
const port = process.env.PORT || 5000;

const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("./tokens.js");

const checkAuth = require("./checkAuth.js");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email: email });
    if (user) throw new Error("User already exists");

    const hashedPassword = await hash(password, 10);
    await userCollection.create({ email: email, password: hashedPassword });
    res.status(201).send({ message: "User created" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userCollection.findOne({ email: email });
    if (!user) throw new Error("User does not exist");

    const isValid = await compare(password, user.password);

    if (!isValid) throw new Error("Wrong password");

    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    userCollection.findOneAndUpdate(
      { email: email },
      { refreshtoken: refreshtoken }
    );

    // user.refreshtoken = refreshtoken;

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  return res.send({
    message: "Logged out",
  });
});

app.post("/refresh_token", (req, res) => {
  const token = req.cookies.refreshtoken;
  if (!token) return res.send({ accesstoken: "" });

  let payload = null;

  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ accesstoken: "" });
  }

  const user = userCollection.findOne({ id: payload.userId });
  if (!user) return res.send({ accesstoken: "" });

  if (user.refreshtoken !== token) return res.send({ accesstoken: "" });

  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);

  userCollection.findOneAndUpdate(
    { email: email },
    { refreshtoken: refreshtoken }
  );

  sendRefreshToken(res, refreshtoken);
  return res.send({ accesstoken });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
