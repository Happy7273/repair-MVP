import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      photo: file,
    }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // 1. Schritt: Foto optional in Supabase Storage hochladen
    let photo_url = null;
    if (form.photo) {
      const fileExt = form.photo.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `tickets/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("photos") // Der Bucket muss "photos" heißen!
        .upload(filePath, form.photo);

      if (uploadError) {
        setLoading(false);
        alert("Fehler beim Hochladen des Fotos: " + uploadError.message);
        return;
      } else {
        // Erzeuge die öffentliche URL
        const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
        photo_url = data.publicUrl;
      }
    }

    // 2. Schritt: Ticket in die Datenbank eintragen
    const { name, email, phone, device } = form;
    const { error } = await supabase
      .from("tickets")
      .insert([{ name, email, phone, device, photo_url }]);

    setLoading(false);

    if (error) {
      alert("Fehler beim Speichern: " + error.message);
    } else {
      alert("Ticket erfolgreich angelegt!");
      setForm({
        name: "",
        email: "",
        phone: "",
        device: "",
        photo: null,
      });
      setPreview(null);
    }
  };

  return (
    <div className="container">
      <form className="repair-form" onSubmit={handleSubmit}>
        <h2>Reparatur-Anfrage</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            className="input"
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-Mail:</label>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefonnummer:</label>
          <input
            className="input"
            type="tel"
            name="phone"
            id="phone"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
        </div>
        <div className="form-group">
          <label htmlFor="device">Gerät:</label>
          <select
            className="input"
            name="device"
            id="device"
            value={form.device}
            onChange={handleChange}
            required
          >
            <option value="">Bitte wählen…</option>
            <option value="Handy">Handy</option>
            <option value="Tablet">Tablet</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop PC">Desktop PC</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="photo">Foto hochladen:</label>
          <input
            className="input"
            type="file"
            name="photo"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        {preview && (
          <div className="preview">
            <img
              src={preview}
              alt="Vorschau"
              className="preview-img"
            />
          </div>
        )}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Wird gesendet..." : "Absenden"}
        </button>
      </form>
    </div>
  );
}

export default App;