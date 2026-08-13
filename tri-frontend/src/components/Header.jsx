import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import userIcon from '../assets/user-icon.webp'
import { clearSession, getSession } from '../services/api'
import { getAvatarSrc } from '../utils/avatars'

export default function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [avatar, setAvatar] = useState(getAvatarSrc())
  const [session, setSession] = useState(getSession())
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    function refreshFromSession() {
      setSession(getSession())
      setAvatar(getAvatarSrc())
    }
    window.addEventListener('tri-avatar-changed', refreshFromSession)
    window.addEventListener('tri-session-changed', refreshFromSession)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('tri-avatar-changed', refreshFromSession)
      window.removeEventListener('tri-session-changed', refreshFromSession)
    }
  }, [])

  function handleLogout() {
    clearSession()
    setOpen(false)
    navigate('/login')
  }

  function goTo(path) {
    setOpen(false)
    navigate(path)
  }

  return (
    <header className="tri-header">
      <div className="tri-header-left">
        <button className="tri-header-brand" onClick={() => navigate('/')} aria-label="Voltar ao início">
          <img src={logo} alt="Logo TRI" className="tri-header-logo" />
        </button>
      </div>

      {session && (
        <div className="tri-user-menu" ref={menuRef}>
          <button className="tri-user-btn" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu do usuário">
            {avatar ? (
              <img src={avatar} alt="" className="tri-user-avatar" />
            ) : (
              <img src={userIcon} alt="" className="tri-user-icon-default" />
            )}
          </button>
          {open && (
            <div className="tri-user-dropdown">
              <button onClick={() => goTo('/perfil')}>Perfil</button>
              <button onClick={() => goTo('/historico')}>Histórico</button>
              <button onClick={() => goTo('/medicamentos')}>Medicamentos</button>
              <button onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
