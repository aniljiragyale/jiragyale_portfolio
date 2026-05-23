import { Link, useLocation } from 'react-router-dom'

export default function PageBack({ to = '/', label = 'Back Home' }) {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  return (
    <Link to={to} className="page-back rv">
      <i className="fas fa-arrow-left" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  )
}
