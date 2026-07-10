import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import db from "../config/firebase.config.js";

// Nombre de la colección en Firestore
const PRODUCTS_COLLECTION = "products";
const productsRef = collection(db, PRODUCTS_COLLECTION);

// Obtener todos los productos
const getAllProducts = async () => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// Obtener un producto por ID
const getProductById = async (id) => {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(productDoc);

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() };
};

// Crear un nuevo producto
const createProduct = async (productData) => {
  const newDocRef = await addDoc(productsRef, productData);
  return { id: newDocRef.id, ...productData };
};

// Actualizar un producto existente
const updateProduct = async (id, productData) => {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(productDoc);

  if (!snapshot.exists()) {
    return null;
  }

  await updateDoc(productDoc, productData);
  return { id, ...snapshot.data(), ...productData };
};

// Eliminar un producto
const deleteProduct = async (id) => {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(productDoc);

  if (!snapshot.exists()) {
    return null;
  }

  await deleteDoc(productDoc);
  return { id };
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
