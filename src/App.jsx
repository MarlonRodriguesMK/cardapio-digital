import { useState } from 'react'

const PRODUTOS = [
  { id: 1, nome: 'X-Burger', preco: 15 },
  { id: 2, nome: 'X-Bacon', preco: 18 },
  { id: 3, nome: 'Refrigerante', preco: 6 }
]

export default function App() {
  const [carrinho, setCarrinho] = useState([])
  const [pagamento, setPagamento] = useState('Pix')
  const [tipo, setTipo] = useState('Retirada')
  const [endereco, setEndereco] = useState('')

  const adicionar = (produto) => {
    const existe = carrinho.find(i => i.id === produto.id)

    if (existe) {
      setCarrinho(
        carrinho.map(i =>
          i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i
        )
      )
    } else {
      setCarrinho([...carrinho, { ...produto, qtd: 1 }])
    }
  }

  const remover = (produto) => {
    const existe = carrinho.find(i => i.id === produto.id)
    if (!existe) return

    if (existe.qtd === 1) {
      setCarrinho(carrinho.filter(i => i.id !== produto.id))
    } else {
      setCarrinho(
        carrinho.map(i =>
          i.id === produto.id ? { ...i, qtd: i.qtd - 1 } : i
        )
      )
    }
  }

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.qtd,
    0
  )

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
      <h1>🍔 Cardápio Digital</h1>

      {PRODUTOS.map(p => (
        <div key={p.id} style={styles.card}>
          <h3>{p.nome}</h3>
          <p>R$ {p.preco},00</p>

          <div style={styles.controls}>
            <button onClick={() => remover(p)}>-</button>
            <span>
              {carrinho.find(i => i.id === p.id)?.qtd || 0}
            </span>
            <button onClick={() => adicionar(p)}>+</button>
          </div>
        </div>
      ))}

      <hr />

      <h3>🧾 Resumo do pedido</h3>

      {carrinho.length === 0 && <p>Nenhum item adicionado</p>}

      {carrinho.map(i => (
        <p key={i.id}>
          {i.nome} ({i.qtd}x) – R$ {i.preco * i.qtd},00
        </p>
      ))}

      <strong>Total: R$ {total},00</strong>

      <hr />

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
  )
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '30px auto',
    fontFamily: 'Arial',
    padding: 10
  },
  card: {
    border: '1px solid #ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  input: {
    width: '100%',
    padding: 8,
    marginTop: 5
  },
  finalizar: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16
  }
}
