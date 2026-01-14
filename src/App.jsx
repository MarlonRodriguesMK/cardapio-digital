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
  const [enviando, setEnviando] = useState(false)

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
    if (carrinho.length === 0) return alert('Seu carrinho está vazio')
    if (tipo === 'Entrega' && endereco.trim() === '') return alert('Digite o endereço para entrega')

    const pedido = {
      itens: carrinho.map(i => `${i.qtd}x ${i.nome}`).join('\n'),
      total,
      pagamento,
      tipo,
      endereco: tipo === 'Entrega' ? endereco : ''
    }

    setEnviando(true)

    try {
      const response = await fetch('https://bot-whatsapp-fastapi.onrender.com/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      })
      if (!response.ok) throw new Error('Erro no envio do pedido')
    } catch (err) {
      console.error('Erro ao enviar pedido:', err)
      setEnviando(false)
      return alert('Erro ao enviar pedido. Tente novamente.')
    }

    // Redireciona para WhatsApp
    const mensagemWhats = encodeURIComponent(`
🧾 *NOVO PEDIDO*
${pedido.itens}
💰 Total: R$ ${pedido.total},00
💳 Pagamento: ${pedido.pagamento}
🚚 Tipo: ${pedido.tipo}
${pedido.tipo === 'Entrega' ? `📍 Endereço: ${pedido.endereco}` : ''}
    `)
    setTimeout(() => {
      window.location.href = `https://wa.me/5516993883427?text=${mensagemWhats}`
    }, 500)
  }

  return (
    <div style={styles.container}>
      <h1>🍔 Cardápio Digital Premium</h1>

      {/* Menu de categorias */}
      <div style={styles.categorias}>
        {CATEGORIAS.map(c => (
          <button
            key={c}
            style={{ ...styles.categoria, background: categoriaAtiva === c ? '#25D366' : '#eee', color: categoriaAtiva === c ? '#fff' : '#000' }}
            onClick={() => setCategoriaAtiva(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista de produtos */}
      <div style={styles.produtos}>
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
      </div>

      {/* Carrinho flutuante */}
      <div style={styles.carrinho}>
        <h3>🛒 Resumo do pedido</h3>
        {carrinho.length === 0 ? <p>Nenhum item adicionado</p> :
          carrinho.map(i => (
            <p key={i.id}>{i.nome} ({i.qtd}x) – R$ {i.preco * i.qtd},00</p>
          ))
        }
        <strong>Total: R$ {total},00</strong>

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

        <button style={{ ...styles.finalizar, opacity: enviando ? 0.6 : 1 }} onClick={finalizarPedido} disabled={enviando}>
          {enviando ? 'Enviando...' : 'Finalizar pedido'}
        </button>
      </div>
    </div>
  )
}

// Estilos premium SaaS
const styles = {
  container: {
    maxWidth: 500,
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    padding: 15,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  categorias: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  categoria: {
    padding: '6px 14px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  produtos: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#fafafa'
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
    objectFit: 'cover'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  carrinho: {
    position: 'sticky',
    bottom: 10,
    background: '#fff',
    padding: 15,
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    marginTop: 20
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
    marginTop: 12,
    padding: 15,
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer'
  }
}
