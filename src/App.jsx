function App() {
  return (
    <div style={{ fontFamily: "Arial", padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>🍔 Cardápio Digital</h1>
      <p>Faça seu pedido pelo WhatsApp</p>

      <hr />

      <h3>🍔 Lanches</h3>
      <p>X-Burger — <strong>R$ 15,00</strong></p>
      <p>X-Salada — <strong>R$ 18,00</strong></p>

      <h3>🍕 Pizzas</h3>
      <p>Calabresa — <strong>R$ 30,00</strong></p>
      <p>Frango com Catupiry — <strong>R$ 35,00</strong></p>

      <h3>🥤 Bebidas</h3>
      <p>Refrigerante — <strong>R$ 5,00</strong></p>

      <a
        href="https://wa.me/5599999999999"
        target="_blank"
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

export default App;
