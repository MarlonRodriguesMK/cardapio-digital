import { useState } from 'react'

// Produtos com categorias e imagens (adicione URLs reais se quiser)
const PRODUTOS = [
  { id: 1, nome: 'X-Burger', preco: 15, categoria: 'Hambúrguer', img: 'https://via.placeholder.com/80' },
  { id: 2, nome: 'X-Bacon', preco: 18, categoria: 'Hambúrguer', img: 'https://via.placeholder.com/80' },
  { id: 3, nome: 'Refrigerante', preco: 6, categoria: 'Bebida', img: 'https://via.placeholder.com/80' }
]

export default function App() {
  const [carrinho, setCarrinho] = useState([])
  const [pagamento, setPagamento] = useState('Pix')
  const [tipo, setTipo] = useState('Retirada')
  const [endereco, setEndereco] = useState('')

  // Adicionar produto
  const adicionar = (produto) => {
    const existe = carrinho.find(i => i.id === produto.id)
    if (existe) {
      setCarrinho(carrinho.map(i => i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i))
    } else {
      setCarrinho([...carrinho, { ...produto, qtd: 1 }])
    }
  }

  // Remover produto
  const remover = (produto) => {
    const existe = carrinho.find(i => i.id === produto.id)
    if (!existe) return
    if (existe.qtd === 1) {
      setCarrinho(carrinho.filter(i => i.id !== produto.id))
    } else {
      setCarrinho(carrinho.map(i => i.id === produto.id ? { ...i, qtd: i.qtd - 1 } : i))
    }
  }

  // Total
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0)

  // Finalizar pedido WhatsApp
  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio')
      return
    }
    if (tipo === 'Entrega' && endereco.trim() === '') {
      alert('Digite o endereço para entrega')
      return
    }

    const mensagem = `
🧾 *NOVO PEDIDO*

${carrinho.map(i => `• ${i.nome} (${i.qtd}x)`).join('\n')}

💰 Total: R$ ${total},00
💳 Pagamento: ${pagamento}
🚚 Tipo: ${tipo}
${tipo === 'Entrega' ? `📍 Endereço: ${endereco}` : ''}
    `
    const texto = encodeURIComponent(mensagem)
    window.location.href = `https://wa.me/5516993883427?text=${texto}`
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>🍔 Cardápio Digital Premium</h1>

      {/* Badge de quantidade */}
      {carrinho.length > 0 && (
        <div style={styles.badge}>
          🛒 {carrinho.reduce((a, i) => a + i.qtd, 0)}
        </div>
      )}

      {/* Produtos */}
      {['Hambúrguer', 'Bebida'].map(cat => (
        <div key={cat}>
          <h2 style={styles.categoria}>{cat}</h2>
          {PRODUTOS.filter(p => p.categoria === cat).map(p => (
            <div
              key={p.id}
              style={styles.card}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={p.img} alt={p.nome} style={styles.img} />
              <div style={{ flex: 1 }}>
                <h3>{p.nome}</h3>
                <p>R$ {p.preco},00</p>
              </div>
              <div style={styles.controls}>
                <button style={styles.btnRemover} onClick={() => remover(p)}>-</button>
                <span>{carrinho.find(i => i.id === p.id)?.qtd || 0}</span>
                <button style={styles.btnAdicionar} onClick={() => adicionar(p)}>+</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Resumo pedido fixo */}
      <div style={styles.resumo}>
        <h3>🧾 Resumo do pedido</h3>
        {carrinho.length === 0 && <p>Nenhum item adicionado</p>}
        {carrinho.map(i => (
          <p key={i.id}>• {i.nome} ({i.qtd}x) – R$ {i.preco * i.qtd},00</p>
        ))}
        <strong>Total: R$ {total},00</strong>

        <h3>💳 Pagamento</h3>
        <select value={pagamento} onChange={e => setPagamento(e.target.value)} style={styles.select}>
          <option>Pix</option>
          <option>Dinheiro</option>
          <option>Cartão</option>
        </select>

        <h3>🚚 Tipo de entrega</h3>
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={styles.select}>
          <option>Retirada</option>
          <option>Entrega</option>
        </select>

        {tipo === 'Entrega' && (
          <input
            style={styles.input}
            placeholder="Digite seu endereço completo"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
          />
        )}

        <button style={styles.finalizar} onClick={finalizarPedido}>
          Finalizar pedido no WhatsApp
        </button>
      </div>
    </div>
  )
}

// ======================
// ESTILOS PREMIUM
// ======================
const styles = {
  container: {
    maxWidth: 500,
    margin: '30px auto',
    fontFamily: "'Poppins', sans-serif",
    padding: 20,
    background: '#fefefe',
    borderRadius: 15,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
    position: 'relative'
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  categoria: {
    marginTop: 20,
    marginBottom: 10,
    color: '#555'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    border: '1px solid #ddd',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    background: '#fff'
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  btnAdicionar: {
    background: '#25D366',
    color: '#fff',
    border: 'none',
    padding: 5,
    borderRadius: 5,
    cursor: 'pointer'
  },
  btnRemover: {
    background: '#f44336',
    color: '#fff',
    border: 'none',
    padding: 5,
    borderRadius: 5,
    cursor: 'pointer'
  },
  resumo: {
    position: 'sticky',
    bottom: 0,
    background: '#fafafa',
    padding: 15,
    borderTop: '1px solid #ddd',
    borderRadius: '12px 12px 0 0'
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
    border: '1px solid #ccc'
  },
  select: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    marginBottom: 10
  },
  finalizar: {
    width: '100%',
    marginTop: 10,
    padding: 15,
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 'bold',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  badge: {
    position: 'absolute',
    top: 15,
    right: 20,
    background: '#25D366',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: 20,
    fontWeight: 'bold',
    fontSize: 14
  }
}
"// redeploy premium" 
