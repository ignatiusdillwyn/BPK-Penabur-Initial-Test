const { tokenVerifier } = require("../helpers/jwt");

const authentication = (req, res, next) => {
  const { access_token } = req.headers;
  if (access_token) {
    const decoded = tokenVerifier(access_token);
    req.userData = decoded;
    next();
  } else {
    res.status(401).json({
      message: "Token not found",
  });
  }
};

module.exports = {
  authentication,
};
