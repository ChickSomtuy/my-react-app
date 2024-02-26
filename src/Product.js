import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Product() {
  const [product, setProduct] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    console.log("request to api");
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://127.0.0.1:5000/products")
      .then((response) => setProduct(response.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/products/${id}`)
      .then(() => {
        setProduct(product.filter((p) => p._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const handleAddProduct = () => {
    axios
      .post("http://127.0.0.1:5000/products", { name, price, img })
      .then(() => {
        fetchProducts();
        setName("");
        setPrice("");
        setImg("");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImg(product.img);
  };

  const handleSaveEdit = () => {
    axios
      .put(`http://127.0.0.1:5000/products/${editingProduct._id}`, {
        name,
        price,
        img,
      })
      .then(() => {
        fetchProducts();
        setEditingProduct(null);
        setName("");
        setPrice("");
        setImg("");
      })
      .catch((error) => {
        console.error("Error editing product:", error);
      });
  };

  const productList = product.map((p) => (
    <li key={p._id}>
      {p._id} {p.name}{" "}
      <img src={p.img} alt={p.name} style={{ width: "300px", height: "300px" }} /> {p.price}{" "}
      <button onClick={() => handleDelete(p._id)}>Delete</button>{" "}
      <button onClick={() => handleEdit(p)}>Edit</button>
    </li>
  ));

  return (
    <>
      <h2>Product List</h2>
      <ul>{productList}</ul>
      {editingProduct && (
        <div>
          <h2>Edit Product</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
        </div>
      )}
      {!editingProduct && (
        <div>
          <h2>Add Product</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
          <button onClick={handleAddProduct}>Add</button>
        </div>
      )}
    </>
  );
}
