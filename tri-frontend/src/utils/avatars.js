import graxaim from '../assets/avatar-graxaim.jpg'
import capivara from '../assets/avatar-capivara.jpg'
import queroQuero from '../assets/avatar-quero-quero.jpg'
import { getSession } from '../services/api'

export const AVATAR_OPTIONS = [
  { key: 'graxaim', label: 'Graxaim', src: graxaim },
  { key: 'capivara', label: 'Capivara', src: capivara },
  { key: 'quero-quero', label: 'Quero-quero', src: queroQuero },
]

const AVATAR_STORAGE_PREFIX = 'tri_avatar_'

// A foto de perfil é salva por usuário (usando o id da conta), para que trocar
// de conta ou criar uma nova não herde a foto escolhida em outra conta.
function storageKeyForCurrentUser() {
  const session = getSession()
  const userId = session?.user?.id
  return userId ? `${AVATAR_STORAGE_PREFIX}${userId}` : null
}

export function getAvatarKey() {
  const storageKey = storageKeyForCurrentUser()
  if (!storageKey) return null
  return localStorage.getItem(storageKey)
}

export function setAvatarKey(key) {
  const storageKey = storageKeyForCurrentUser()
  if (!storageKey) return
  localStorage.setItem(storageKey, key)
}

export function getAvatarSrc() {
  const key = getAvatarKey()
  const found = AVATAR_OPTIONS.find((a) => a.key === key)
  return found ? found.src : null
}
