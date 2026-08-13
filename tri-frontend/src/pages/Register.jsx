import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, saveSession } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.register(form)
      saveSession(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tri-shell">
      <h1>Criar conta</h1>
      <p>Cadastre-se para começar a usar o TRI.</p>

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label htmlFor="username">Nome completo</label>
          <input
            id="username"
            required
            minLength={3}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 16 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
