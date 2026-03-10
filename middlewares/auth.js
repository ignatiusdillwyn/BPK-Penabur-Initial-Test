const { Product } = require("../models/");
const { tokenVerifier } = require("../helpers/jwt");

const authentication = (req, res, next) => {
  console.log("Authentication");
  const { access_token } = req.headers;
  if (access_token) {
    const decoded = tokenVerifier(access_token);
    console.log("Decoded Token:", decoded); 
    req.userData = decoded;
    // console.log("Access token >, ", decoded);
    next();
  } else {
    res.status(401).json({
      message: "Token not found",
  });
  }
};

const authorization = async (req, res, next) => {
  console.log("Authorization");
  try {
    const id = +req.params.id;
    const UserId = req.userData.id;
    const product = await Product.findOne({
      where: { id },
    });
    if (product) {
      if (product.UserId === UserId) {
        next();
      } else {
        throw {
          message: "You are not allowed.",
        };
      }
    } else {
      throw {
        message: "Item not found",
      };
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  authentication,
  authorization,
};
