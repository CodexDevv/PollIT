require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { hash, compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const bodyParser = require("body-parser");

const db = require("./database.js");
const userCollection = require("./model/Users");
const pollCollection = require("./model/Poll");

const app = express();
const port = process.env.PORT || 5000;

const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("./tokens.js");

const isAuth = require("./isAuth.js");
let ObjectId = require("mongodb").ObjectId;

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
    // if (user) res.status(409).send("User Already Exists. Please Login!");

    const hashedPassword = await hash(password, 10);
    await userCollection.create({
      email: email,
      password: hashedPassword,
      refreshtoken: "",
    });
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

    await userCollection.findOneAndUpdate(
      { email: email },
      { refreshtoken: refreshtoken }
    );

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

app.post("/refresh_token", async (req, res) => {
  const token = req.cookies.refreshtoken;
  try {
    if (!token) return res.send({ accesstoken: "" });

    let payload = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.send({ accesstoken: "" });
    }

    const user = await userCollection.findOne({ _id: payload.userId });

    if (!user) return res.send({ accesstoken: "" });

    if (user.refreshtoken !== token) return res.send({ accesstoken: "" });

    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    await userCollection.findOneAndUpdate(
      { email: user.email },
      { refreshtoken: refreshtoken }
    );

    sendRefreshToken(res, refreshtoken);
    return res.send({ accesstoken: accesstoken, email: user.email });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// CRUD FOR POSTS

// example for post:
// question: "Question",
// pollType: "Single" / "Multiple",
// options: ["Option 1", "Option 2", "Option 3", "Option 4"],
// votes: [{email: "email@domain", option: 0}, {email: "email@domain", option: 1}],
// creator: "email@domain.com"

app.post("/create_poll", async (req, res) => {
  const { question, options, pollType, email } = req.body;

  try {
    const userId = isAuth(req);
    if (userId !== null) {
      await pollCollection.create({
        question: question,
        pollType: pollType,
        options: options,
        votes: [],
        creator: email,
      });
      res.status(201).send({ message: "Post created" });
    }
  } catch (err) {
    res.status(500).send({
      error: `${err.message}`,
    });
  }
});

app.get("/get_polls", async (req, res) => {
  try {
    const posts = await pollCollection.find();
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/vote_poll", async (req, res) => {
  const { id, option, email } = req.body;

  let o_id = new ObjectId(id);

  try {
    const userId = isAuth(req);
    if (userId !== null) {
      const selectedPoll = await pollCollection.findOne({ _id: o_id });
      if (!selectedPoll) throw new Error("Poll does not exist");

      const optionIndex = selectedPoll.options.indexOf(option);

      if (selectedPoll.votes.some((vote) => vote.email === email))
        throw new Error("You already voted");

      const arr = { email: email, option: optionIndex };

      try {
        await pollCollection.findOneAndUpdate(
          { _id: o_id },
          { $push: { votes: arr } }
        );
        res.send({ message: "Voted" });
      } catch (err) {
        res.send({
          error: `${err.message}`,
        });
      }
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

app.post("/delete_poll", async (req, res) => {
  const { id } = req.body;

  var o_id = new ObjectId(id);

  try {
    const userId = isAuth(req);
    if (userId !== null) {
      try {
        const selectedPoll = await pollCollection.findOne({ _id: o_id });
        if (!selectedPoll) throw new Error("Poll does not exist");
        const user = await userCollection.findOne({ _id: userId });
        if (selectedPoll.creator !== user.email)
          throw new Error("You are not the creator");

        await pollCollection.findOneAndDelete({ _id: o_id });
        res.send({ message: "Deleted" });
      } catch (err) {
        res.send({
          error: `${err.message}`,
        });
      }
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
