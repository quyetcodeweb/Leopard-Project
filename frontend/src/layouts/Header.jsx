import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <h2>Leopard Project 🐆</h2>
      <nav>
        <Link to="/" style={{ color: "#fff", marginRight: "10px" }}>Home</Link>
      </nav>
    </header>
  );
}
