import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="tri-page">
      <Header />
      <main className="tri-main">{children}</main>
      <Footer />
    </div>
  )
}
