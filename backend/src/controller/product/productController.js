import { Product } from '../../models/index.js';
import { sequelize } from '../../database/index.js';

const getAll = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let whereClause = { isActive: true };

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Search by name
    if (search) {
      whereClause.name = {
        [sequelize.Sequelize.Op.iLike]: `%${search}%`
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[sequelize.Sequelize.Op.gte] = minPrice;
      if (maxPrice) whereClause.price[sequelize.Sequelize.Op.lte] = maxPrice;
    }

    const products = await Product.findAll({ where: whereClause });
    res.status(200).send({ data: products, message: "Products fetched successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id, isActive: true } });
    
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    
    res.status(200).send({ data: product, message: "Product fetched successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, price, category, stock, size, color } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Product image is required" });
    }

    // Store the file path relative to uploads folder
    const imagePath = req.file.filename;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image: imagePath,
      stock: parseInt(stock) || 0,
      size,
      color,
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    });

    res.status(201).send({ data: product, message: "Product created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findOne({ where: { id } });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    await product.update(updateData);
    res.status(200).send({ data: product, message: "Product updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    await product.update({ isActive: false });
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const productController = {
  getAll,
  getById,
  create,
  update,
  deleteById
}; 