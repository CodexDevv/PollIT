const { sign } = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const sendAccessToken = (res, req, accesstoken) => {
  res.send({
    accesstoken,
    email: req.body.email,
  });
};

const sendRefreshToken = (res, refreshtoken) => {
  let oneWeek = 7 * 24 * 3600 * 1000;
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    path: "/refresh_token",
    expires: new Date(Date.now() + oneWeek),
    maxAge: oneWeek,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};
