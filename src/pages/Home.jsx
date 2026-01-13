import { menu } from "../data/menu";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial", padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>🍔 Cardápio Digital</h1>
      <p>Faça seu pedido pelo WhatsApp</p>

      <hr />

      {menu.map((category, index) => (
        <div key={index}>
          <h3>{category.icon} {category.category}</h3>

          {category.items.map((item, idx) => (
            <p key={idx}>
              {item.name} — <strong>R$ {item.price.toFixed(2)}</strong>
            </p>
          ))}
        </div>
      ))}

      <a
        href="https://wa.me/5599999999999"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "block",
          marginTop: 20,
          padding: 15,
          background: "#25D366",
          color: "#fff",
          textAlign: "center",
          textDecoration: "none",
          borderRadius: 8,
          fontWeight: "bold"
        }}
      >
        📲 Fazer pedido no WhatsApp
      </a>
    </div>
  );
}
