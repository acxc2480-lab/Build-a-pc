export default function Navbar() {
    return (
        <nav className="navbar">
            <a href="https://semcomputer.com/" className="navbar-brand" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="8" fill="#e94560" fillOpacity="0.15" />
                    <path d="M12 28V20L20 12L28 20V28" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 28V22H24V28" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="17" r="2" fill="#e94560" />
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
                <button className="menu-toggle" aria-label="Menu">☰</button>
            </div>
        </nav>
    )
}
