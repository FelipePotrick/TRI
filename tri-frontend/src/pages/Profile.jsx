import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getSession } from '../services/api'
import { AVATAR_OPTIONS, getAvatarKey, setAvatarKey } from '../utils/avatars'

export default function Profile() {
  const navigate = useNavigate()
  const session = getSession()

  const [selectedAvatar, setSelectedAvatar] = useState(getAvatarKey())
  const [avatarSaved, setAvatarSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSelectAvatar(key) {
    setSelectedAvatar(key)
    setAvatarKey(key)
    window.dispatchEvent(new Event('tri-avatar-changed'))
    setAvatarSaved(true)
    setTimeout(() => setAvatarSaved(false), 2000)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('A nova senha e a confirmação não coincidem.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setPasswordSuccess('Senha atualizada com sucesso.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tri-shell">
      <h1>Perfil</h1>

      <div className="card">
        <p style={{ margin: 0 }}>
          <strong>Nome completo:</strong> {session?.user?.username}
        </p>
        <p>
          <strong>E-mail:</strong> {session?.user?.email}
        </p>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 28 }}>Foto de perfil</h2>
      <div className="avatar-grid">
        {AVATAR_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`avatar-option ${selectedAvatar === opt.key ? 'selected' : ''}`}
            onClick={() => handleSelectAvatar(opt.key)}
          >
            <img src={opt.src} alt={opt.label} />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      {avatarSaved && <p style={{ color: 'var(--tri-green)', fontSize: 13 }}>Foto de perfil atualizada.</p>}

      <h2 style={{ fontSize: 16, marginTop: 28 }}>Alterar senha</h2>
      <form onSubmit={handleChangePassword} className="card">
        <div className="field">
          <label htmlFor="currentPassword">Senha atual</label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="newPassword">Nova senha</label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="confirmPassword">Confirmar nova senha</label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {passwordError && <p className="error-text">{passwordError}</p>}
        {passwordSuccess && <p style={{ color: 'var(--tri-green)', fontSize: 13 }}>{passwordSuccess}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Atualizando…' : 'Atualizar senha'}
        </button>
      </form>

      <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
        Voltar ao início
      </button>
    </div>
  )
}
