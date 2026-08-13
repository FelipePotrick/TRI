export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="tri-footer">
      © {year} TRI. Todos os direitos reservados.
    </footer>
  )
}
