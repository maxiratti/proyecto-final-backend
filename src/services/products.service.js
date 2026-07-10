import productsModel from "../models/products.model.js";

const findAll = async () => {
  return await productsModel.getAllProducts();
};

const findById = async (id) => {
  return await productsModel.getProductById(id);
};

const create = async (productData) => {
  // Validación básica de los datos del producto
  if (!productData.name || productData.price === undefined) {
    const error = new Error("El producto debe tener al menos 'name' y 'price'");
    error.statusCode = 400;
    throw error;
  }

  return await productsModel.createProduct(productData);
};

const update = async (id, productData) => {
  const updated = await productsModel.updateProduct(id, productData);

  if (!updated) {
    const error = new Error(`No se encontró el producto con id ${id}`);
    error.statusCode = 404;
    throw error;
  }

  return updated;
};

const remove = async (id) => {
  const deleted = await productsModel.deleteProduct(id);

  if (!deleted) {
    const error = new Error(`No se encontró el producto con id ${id}`);
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

export default { findAll, findById, create, update, remove };
