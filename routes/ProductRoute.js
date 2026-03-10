const { ProductController } = require("../controllers");
const { authentication, authorization } = require("../middlewares/auth");
const productRouter = require("express").Router();
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Folder penyimpanan
  },
  filename: function (req, file, cb) {
    // Nama file: timestamp + original name
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
});

productRouter.get("/getAll", authentication, ProductController.getAllProduct);
productRouter.post(
  "/create",
  authentication,
  ProductController.createProduct
);
productRouter.delete(
  "/delete/:id",
  authentication,
  authorization,
  ProductController.deleteProduct
);
productRouter.put(
  "/edit/:id",
  authentication,
  authorization,
  ProductController.updateProduct
);
productRouter.get(
  "/details/:id",
  // authentication,

  ProductController.getProductById
);
productRouter.get(
  "/search/:name",
  authentication,
  // authorization,
  ProductController.searchProduct
);

productRouter.put(
  '/updateProductImage/:id',
  authentication, 
  upload.single('image'),
  ProductController.updateProductImage
);

module.exports = productRouter;