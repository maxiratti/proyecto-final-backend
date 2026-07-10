import productsService from "../services/products.service.js";

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productsService.findAll();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.findById(id);

    if (!product) {
      return res.status(404).json({ message: `Producto con id ${id} no encontrado` });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productsService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productsService.update(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productsService.remove(id);
    res.status(200).json({ message: `Producto con id ${id} eliminado correctamente` });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
