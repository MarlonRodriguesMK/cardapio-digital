import { useState } from 'react'

// Produtos e categorias
const PRODUTOS = [
  { id: 1, nome: 'X-Burger', preco: 15, categoria: 'Lanches', imagem: '/imgs/xb.png' },
  { id: 2, nome: 'X-Bacon', preco: 18, categoria: 'Lanches', imagem: '/imgs/xbacon.png' },
  { id: 3, nome: 'Pizza Calabresa', preco: 30, categoria: 'Pizzas', imagem: '/imgs/pizza.png' },
  { id: 4, nome: 'Refrigerante', preco: 6, categoria: 'Bebidas', imagem: '/imgs/refri.png' }
]

const CATEGORIAS = ['Todos', 'Lanches', 'Pizzas', 'Bebidas']

export default function App() {
  const [carrinho, setCarrinho] = useState([])
  const [pagamento, setPagamento] = useState('Pix')
  const [tipo, setTipo] = useState('Retirada')
  const [endereco, setEndereco] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

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

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0)

  // Finalizar pedido
  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio')
      return
    }

    if (tipo === 'Entrega' && endereco.trim() === '') {
      alert('Digite o endereço para entrega')
      return
    }

    const pedido = {
      itens: carrinho.map(i => `${i.qtd}x ${i.nome}`).join('\n'),
      total,
      pagamento,
      tipo,
      endereco: tipo === 'Entrega' ? endereco : ''
    }

    // Envia pedido para FastAPI
    try {
      const response = await fetch('https://bot-whatsapp-fastapi.onrender.com/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      })

      if (!response.ok) {
        alert('Erro ao enviar pedido. Tente novamente.')
        return
      }
    } catch (err) {
      console.error('Erro ao enviar pedido:', err)
      alert('Erro ao enviar pedido. Tente novamente.')
      return
    }

    // Redireciona para WhatsApp
    setTimeout(() => {
      const mensagemWhats = encodeURIComponent(`
🧾 *NOVO PEDIDO*
${pedido.itens}
💰 Total: R$ ${pedido.total},00
💳 Pagamento: ${pedido.pagamento}
🚚 Tipo: ${pedido.tipo}
${pedido.tipo === 'Entrega' ? `📍 Endereço: ${pedido.endereco}` : ''}
      `)
      window.location.href = `https://wa.me/5516993883427?text=${mensagemWhats}`
    }, 500) // atraso de 500ms garante envio ao backend
  }

  return (
    <div style={styles.container}>
      <h1>🍔 Cardápio Digital Premium</h1>

      {/* Menu de categorias */}
      <div style={styles.categorias}>
        {CATEGORIAS.map(c => (
          <button
            key={c}
            style={{ ...styles.categoria, background: categoriaAtiva === c ? '#25D366' : '#eee' }}
            onClick={() => setCategoriaAtiva(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista de produtos */}
      {PRODUTOS.filter(p => categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva)
        .map(p => (
          <div key={p.id} style={styles.card}>
            <img src={p.imagem} alt={p.nome} style={styles.img} />
            <div style={{ flex: 1 }}>
              <h3>{p.nome}</h3>
              <p>R$ {p.preco},00</p>
            </div>
            <div style={styles.controls}>
              <button onClick={() => remover(p)}>-</button>
              <span>{carrinho.find(i => i.id === p.id)?.qtd || 0}</span>
              <button onClick={() => adicionar(p)}>+</button>
            </div>
          </div>
        ))}

      <hr />

      {/* Resumo do pedido */}
      <div style={styles.resumo}>
        <h3>🧾 Resumo do pedido</h3>
        {carrinho.length === 0 && <p>Nenhum item adicionado</p>}
        {carrinho.map(i => (
          <p key={i.id}>{i.nome} ({i.qtd}x) – R$ {i.preco * i.qtd},00</p>
        ))}
        <strong>Total: R$ {total},00</strong>
      </div>

      <hr />

      {/* Pagamento e entrega */}
      <div style={styles.opcoes}>
        <h3>💳 Pagamento</h3>
        <select value={pagamento} onChange={e => setPagamento(e.target.value)}>
          <option>Pix</option>
          <option>Dinheiro</option>
          <option>Cartão</option>
        </select>

        <h3>🚚 Entrega</h3>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
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

// Estilos inline premium
const styles = {
  container: {
    maxWidth: 450,
    margin: '30px auto',
    fontFamily: 'Arial, sans-serif',
    padding: 15,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  },
  categorias: {
    display: 'flex',
    gap: 10,
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  categoria: {
    padding: '5px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer'
  },
  card: {
    border: '1px solid #ddd',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: 'cover'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  resumo: {
    background: '#f9f9f9',
    padding: 10,
    borderRadius: 8
  },
  opcoes: {
    marginTop: 15
  },
  input: {
    width: '100%',
    padding: 8,
    marginTop: 5,
    borderRadius: 6,
    border: '1px solid #ccc'
  },
  finalizar: {
    width: '100%',
    marginTop: 15,
    padding: 15,
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer'
  }
}
// Forçando redeploy Vercel
