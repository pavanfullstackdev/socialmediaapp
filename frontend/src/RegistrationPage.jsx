import React, { useState } from "react";
import axios from "axios";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Destructure formData to access the individual fields
    const { fullName, email, username, password, avatar, coverImage } = formData;
  
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", fullName);
    formDataToSend.append("email", email);
    formDataToSend.append("username", username);
    formDataToSend.append("password", password);
    formDataToSend.append("avatar", avatar); // Ensure avatar is selected
    if (coverImage) {
      formDataToSend.append("coverImage", coverImage);
    }
  
    try {
      const response = await axios.post("http://localhost:8080/api/v1/users/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("User registered:", response.data);
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);
    }
  };
  
  

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Registration Page</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Avatar (JPG/PNG):</label>
          <input
            type="file"
            name="avatar"
            accept="image/jpeg, image/png"
            onChange={handleChange}
            style={{ width: "100%", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Cover Image (Optional, JPG/PNG):</label>
          <input
            type="file"
            name="coverImage"
            accept="image/jpeg, image/png"
            onChange={handleChange}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
