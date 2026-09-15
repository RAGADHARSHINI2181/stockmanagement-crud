import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/items/";

const emptyForm = { name: "", quantity: "", price: "", category: "" };

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch {
      setError("Cannot connect to the backend. Start Django first.");
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.category.trim() ||
        form.quantity === "" || form.price === "") {
      setError("Please fill all required fields.");
      return;
    }
    if (Number(form.quantity) < 0 || Number(form.price) < 0) {
      setError("Quantity and price cannot be negative.");
      return;
    }

    const data = {
      name: form.name.trim(),
      quantity: Number(form.quantity),
      price: Number(form.price),
      category: form.category.trim(),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, data);
        setMessage("Item updated successfully.");
      } else {
        await axios.post(API_URL, data);
        setMessage("Item added successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadItems();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed.");
    }
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
    });
    setMessage("");
    setError("");
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      setMessage("Item deleted successfully.");
      loadItems();
    } catch {
      setError("Delete failed.");
    }
  };

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Stock Management System</h1>
      <p className="subtitle">CRUD Web Application</p>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={submitForm} className="card">
        <h2>{editingId ? "Update Item" : "Add Item"}</h2>

        <input name="name" placeholder="Item name" value={form.name} onChange={handleChange} />
        <input name="quantity" type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />

        <button type="submit">{editingId ? "Update" : "Add Item"}</button>
        {editingId && (
          <button type="button" className="cancel" onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
          }}>Cancel</button>
        )}
      </form>

      <div className="card">
        <div className="list-header">
          <h2>Items</h2>
          <input className="search" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Quantity</th><th>Price</th><th>Category</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>{item.category}</td>
                    <td>
                      <button onClick={() => editItem(item)}>Edit</button>
                      <button className="delete" onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
