const { Product } = require("../models");
const { Op } = require("sequelize");

class ProductController {
    static async getAllProduct(req, res) {
        try {
            console.log('get all product')
            let userId = req.userData.id;
            const data = await Product.findAll({
                where: { UserId: userId }
            });
            res.status(201).json({
                message: "Product created successfully",
                data: data
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createProduct(req, res) {
        try {
            console.log('create product ', req.body)
            let userId = req.userData.id;

            const data = await Product.create({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                qty: req.body.qty,
                UserId: userId,
                image: ""
            });
            res.status(201).json({
                message: "Product created successfully",
                data: data
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getProductById(req, res) {
        try {
            let userId = req.userData.id;
            // const data = await Employee.findByPk(req.params.id);
            // if (!data) return res.status(404).json({ message: "Employee not found" });
            // res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            let userId = req.userData.id;
            const data = await Product.findByPk(req.params.id);
            if (!data) return res.status(404).json({ message: "Product not found" });
            await data.update(req.body);
            res.json(data);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteProduct(req, res) {
        try {
            let userId = req.userData.id;
            const data = await Product.findByPk(req.params.id);
            if (!data) return res.status(404).json({ message: "Product not found" });
            await data.destroy();
            res.json({ message: "Product deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async searchProduct(req, res) {
        try {
            let userId = req.userData.id;
            const { name } = req.params;
            console.log('search product ', name)
            console.log('userId ', userId)
            const data = await Product.findAll({
                where: {
                    UserId: userId,
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${name}%` } },
                        // { email: { [Op.iLike]: `%${name}%` } },
                    ],
                },
            });
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateProductImage(req, res) {
        try {
            console.log('Update Product Image Endpoint');
            console.log('File received:', req.file);

            let userId = req.userData.id;
            let productId = req.params.id;

            // Validasi img must jpeg/jpg/png
            const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    message: 'Tidak ada file yang diupload',
                    data: null
                });
            }

            if (!allowedMimes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Format Image tidak sesuai. Hanya JPEG, JPG, PNG yang diperbolehkan',
                    data: null
                });
            }

            // Validasi ukuran file (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (req.file.size > maxSize) {
                return res.status(400).json({
                    status: 400,
                    message: 'Ukuran file terlalu besar. Maksimal 5MB',
                    data: null
                });
            }

            // Cari product berdasarkan ID dan UserId
            const product = await Product.findOne({
                where: {
                    id: productId,
                    UserId: userId
                }
            });

            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Produk tidak ditemukan atau Anda tidak memiliki akses',
                    data: null
                });
            }

            // Hapus gambar lama jika ada
            if (product.image && product.image !== "") {
                try {
                    const oldImagePath = path.join(__dirname, '..', product.image);
                    await fs.unlink(oldImagePath);
                    console.log('Gambar lama berhasil dihapus:', oldImagePath);
                } catch (err) {
                    console.log('Gambar lama tidak ditemukan atau gagal dihapus:', err.message);
                    // Lanjutkan proses meskipun gagal hapus gambar lama
                }
            }

            // Simpan path gambar baru (relative path dari root)
            const imagePath = `uploads/${req.file.filename}`;

            // Update product dengan gambar baru
            await product.update({
                image: imagePath,
                updatedAt: new Date()
            });

            // Reload data product setelah update
            await product.reload();

            res.status(200).json({
                status: 200,
                message: 'Gambar produk berhasil diupdate',
                data: {
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    imageUrl: `${req.protocol}://${req.get('host')}/${product.image}`,
                    updatedAt: product.updatedAt
                }
            });

        } catch (error) {
            console.error('Error updating product image:', error);
            res.status(500).json({
                status: 500,
                message: 'Terjadi kesalahan saat mengupdate gambar produk',
                error: error.message
            });
        }
    }
}

module.exports = ProductController