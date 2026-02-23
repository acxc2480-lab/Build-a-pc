import { MenuIcon } from './Icons'

export default function Navbar() {
    return (
        <nav className="navbar">
            <a href="https://semcomputer.com/" className="navbar-brand" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                    <rect width="32" height="32" rx="6" fill="#e94560" fillOpacity="0.12" />
                    <path d="M8 24V16L16 8L24 16V24" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 24V18H20V24" stroke="#e94560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="16" cy="13" r="1.5" fill="#e94560" />
                </svg>
                SEMCOMPUTER
            </a>

            <ul className="navbar-nav">
                <li><a href="https://semcomputer.com/" target="_blank" rel="noreferrer">Home</a></li>
                <li><a href="https://semcomputer.com/shop/" target="_blank" rel="noreferrer">Shop</a></li>
                <li><a href="https://semcomputer.com/about/" target="_blank" rel="noreferrer">About</a></li>
                <li><a href="https://semcomputer.com/contact/" target="_blank" rel="noreferrer">Contact</a></li>
                <li><a href="#" className="active">Build & Score</a></li>
            </ul>

            <div className="navbar-actions">
                <button className="menu-toggle" aria-label="Menu">
                    <MenuIcon size={18} />
                </button>
            </div>
        </nav>
    )
}
