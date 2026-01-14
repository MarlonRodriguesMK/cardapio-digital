import { useState } from 'react'

// ======================
// PRODUTOS PREMIUM AVANÇADO
// Substitua links e preços pelos reais
// ======================
const PRODUTOS = [
  {
    id: 1,
    nome: 'X-Burger',
    preco: 15,
    categoria: 'Hambúrguer',
    img: 'https://via.placeholder.com/80',
    badge: 'Mais pedido',
    extras: ['Sem cebola', 'Com queijo extra', 'Molho especial']
  },
  {
    id: 2,
    nome: 'X-Bacon',
    preco: 18,
    categoria: 'Hambúrguer',
    img: 'https://via.placeholder.com/80',
    badge: '',
    extras: ['Sem bacon', 'Com queijo extra']
  },
  {
    id: 3,
    nome: 'Refrigerante',
    preco: 6,
    categoria: 'Bebida',
    img: 'https://via.placeholder.com/80',
    badge: '',
    extras: ['Gelo extra', 'Sem gás']
  },
  {
    id: 4,
    nome: 'Milkshake',
    preco: 12,
    categoria: 'Bebida',
    img: 'https://via.placeholder.com/80',
    badge: 'Promoção',
    extras: ['Chocolate extra', 'Morango extra']
  },
  {
    id: 5,
    nome: 'Brownie',
    preco: 8,
    categoria: 'Sobremesa',
    img: 'https://via.placeholder.com/80',
    badge: '',
    extras: ['Sorvete adicional']
  }
]

// ======================
// COMBOS DINÂMICOS
// ======================
const COMBOS = [
  {
    id: 'combo1',
    nome: 'Combo X-Burger + Refrigerante',
    preco: 18,
    produtos: ['X-Burger', 'Refrigerante']
  },
  {
    id: 'combo2',
    nome: 'Milkshake + Brownie',
    preco: 18,
    produtos: ['Milkshake', 'Brownie']
  }
]

export default function App() {
  const [carrinho, setCarrinho] = useState([])
  const [pagamento, setPagamento] = useState('Pix')
  const [tipo, setTipo] = useState('Retirada')
  const [endereco, setEndereco] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [tema, setTema] = useState({ primary: '#25D366', background: '#fafafa' })

  // ======================
  // ADICIONAR PRODUTOS
  // ======================
  const adicionar = (produto, extrasSelecionados = []) => {
    const existe = carrinho.find(i => i.id === produto.id && JSON.stringify(i.extrasSelecionados) === JSON.stringify(extrasSelecionados))
    if (existe) {
      setCarrinho(carrinho.map(i => i === existe ? { ...i, qtd: i.qtd + 1 } : i))
    } else {
      setCarrinho([...carrinho, { ...produto, qtd: 1, extrasSelecionados }])
    }
    // Feedback visual
    const badge = document.getElementById('cart-badge')
    if (badge) {
      badge.style.transform = 'scale(1.3)'
      setTimeout(() => badge.style.transform = 'scale(1)', 200)
    }
  }

  // ======================
  // REMOVER PRODUTOS
  // ======================
  const remover = (produto) => {
    const existe = carrinho.find(i => i.id === produto.id)
    if (!existe) return
    if (existe.qtd === 1) {
      setCarrinho(carrinho.filter(i => i.id !== produto.id))
    } else {
      setCarrinho(carrinho.map(i => i === existe ? { ...i, qtd: i.qtd - 1 } : i))
    }
  }

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0)

  // ======================
  // FINALIZAR PEDIDO WHATSAPP
  // ======================
  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio')
      return
    }
    if (tipo === 'Entrega' && endereco.trim() === '') {
      alert('Digite o endereço para entrega')
      return
    }

    let mensagem = `🧾 *NOVO PEDIDO*\n\n`
    carrinho.forEach(i => {
      mensagem += `• ${i.nome} (${i.qtd}x)`
      if (i.extrasSelecionados && i.extrasSelecionados.length > 0) {
        mensagem += `\n  Extras: ${i.extrasSelecionados.join(', ')}`
      }
      mensagem += '\n'
    })
    mensagem += `\n💰 Total: R$ ${total},00`
    mensagem += `\n💳 Pagamento: ${pagamento}`
    mensagem += `\n🚚 Tipo: ${tipo}`
    if (tipo === 'Entrega') mensagem += `\n📍 Endereço: ${endereco}`

    const texto = encodeURIComponent(mensagem)
    window.location.href = `https://wa.me/5516993883427?text=${texto}`
  }

  // ======================
  // FILTRAGEM DE PRODUTOS
  // ======================
  const produtosFiltrados = PRODUTOS.filter(p =>
    (filtro === 'Todos' || p.categoria === filtro) &&
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  // ======================
  // RENDER
  // ======================
  return (
    <div style={{ ...styles.container, background: tema.background }}>
      <h1 style={styles.titulo}>🍔 Cardápio Digital Premium</h1>

      {/* BUSCA E FILTRO */}
      <div style={styles.filtros}>
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={styles.inputBusca}
        />
        <select value={filtro} onChange={e => setFiltro(e.target.value)} style={styles.selectFiltro}>
          <option>Todos</option>
          <option>Hambúrguer</option>
          <option>Bebida</option>
          <option>Sobremesa</option>
        </select>
      </div>

      {/* CARRINHO BADGE */}
      {carrinho.length > 0 && (
        <div id="cart-badge" style={{ ...styles.badge, background: tema.primary }}>
          🛒 {carrinho.reduce((a, i) => a + i.qtd, 0)}
        </div>
      )}

      {/* LISTA DE PRODUTOS */}
      <div>
        {produtosFiltrados.map(p => (
          <div key={p.id} style={styles.card}>
            <img src={p.img} alt={p.nome} style={styles.img} />
            <div style={{ flex: 1 }}>
              <h3>{p.nome}</h3>
              <p>R$ {p.preco},00</p>
              {p.badge && <span style={styles.badgeProduto}>{p.badge}</span>}
              {p.extras.length > 0 && (
                <div style={styles.extras}>
                  {p.extras.map(extra => (
                    <label key={extra} style={styles.checkboxLabel}>
                      <input type="checkbox" value={extra} onChange={e => {
                        const selecionado = e.target.checked
                        const extrasSelecionados = selecionado ? [extra] : []
                        adicionar(p, extrasSelecionados)
                      }} /> {extra}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.controls}>
              <button style={styles.btnRemover} onClick={() => remover(p)}>-</button>
              <span>{carrinho.find(i => i.id === p.id)?.qtd || 0}</span>
              <button style={styles.btnAdicionar} onClick={() => adicionar(p)}>+</button>
            </div>
          </div>
        ))}

        {/* COMBOS */}
        {COMBOS.map(c => (
          <div key={c.id} style={styles.card}>
            <div style={{ flex: 1 }}>
              <h3>{c.nome}</h3>
              <p>R$ {c.preco},00</p>
            </div>
            <button style={styles.btnAdicionar} onClick={() => adicionar({ id: c.id, nome: c.nome, preco: c.preco, categoria: 'Combo', extras: [] })}>
              Adicionar Combo
            </button>
          </div>
        ))}
      </div>

      {/* RESUMO STICKY */}
      <div style={styles.resumo}>
        <h3>🧾 Resumo do pedido</h3>
        {carrinho.length === 0 && <p>Nenhum item adicionado</p>}
        {carrinho.map(i => (
          <p key={i.id}>
            • {i.nome} ({i.qtd}x)
            {i.extrasSelecionados && i.extrasSelecionados.length > 0 ? ` | Extras: ${i.extrasSelecionados.join(', ')}` : ''}
          </p>
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

        <button style={{ ...styles.finalizar, background: tema.primary }} onClick={finalizarPedido}>
          Finalizar pedido no WhatsApp
        </button>
      </div>
    </div>
  )
}

// ======================
// ESTILOS PREMIUM AVANÇADO
// ======================
const styles = {
  container: {
    maxWidth: 500,
    margin: '20px auto',
    fontFamily: "'Poppins', sans-serif",
    padding: 20,
    borderRadius: 15,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
    position: 'relative'
  },
  titulo: { textAlign: 'center', marginBottom: 20, color: '#333' },
  filtros: { display: 'flex', gap: 10, marginBottom: 15 },
  inputBusca: { flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' },
  selectFiltro: { padding: 10, borderRadius: 8, border: '1px solid #ccc' },
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
  img: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  controls: { display: 'flex', alignItems: 'center', gap: 8 },
  btnAdicionar: { background: '#25D366', color: '#fff', border: 'none', padding: 5, borderRadius: 5, cursor: 'pointer' },
  btnRemover: { background: '#f44336', color: '#fff', border: 'none', padding: 5, borderRadius: 5, cursor: 'pointer' },
  resumo: {
    position: 'sticky',
    bottom: 0,
    background: '#fff',
    padding: 15,
    borderTop: '1px solid #ddd',
    borderRadius: '12px 12px 0 0'
  },
  input: { width: '100%', padding: 10, marginTop: 5, borderRadius: 8, border: '1px solid #ccc' },
  select: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginBottom: 10 },
  finalizar: { width: '100%', marginTop: 10, padding: 15, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 'bold', fontSize: 18, cursor: 'pointer' },
  badge: { position: 'absolute', top: 15, right: 20, background: '#25D366', color: '#fff', padding: '5px 10px', borderRadius: 20, fontWeight: 'bold', fontSize: 14 },
  badgeProduto: { display: 'inline-block', background: '#FFD700', color: '#000', padding: '2px 6px', borderRadius: 5, fontSize: 12, marginTop: 5 },
  extras: { display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 5 },
  checkboxLabel: { fontSize: 12, background: '#eee', padding: '2px 6px', borderRadius: 5, display: 'flex', alignItems: 'center', gap: 3 }
}
