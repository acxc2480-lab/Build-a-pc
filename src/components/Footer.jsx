export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div>
                    <div className="footer-brand">
                        <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
                            <rect width="40" height="40" rx="8" fill="#e94560" fillOpacity="0.15" />
                            <path d="M12 28V20L20 12L28 20V28" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 28V22H24V28" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="20" cy="17" r="2" fill="#e94560" />
                        </svg>
                        SEMCOMPUTER
                    </div>
                    <p className="footer-desc">
                        Build & Score PC — Công cụ kiểm tra tương thích linh kiện PC thông minh từ Semcomputer.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Product</h4>
                    <ul>
                        <li><a href="https://semcomputer.com/danh-muc-san-pham/cpu/" target="_blank" rel="noreferrer">CPU</a></li>
                        <li><a href="https://semcomputer.com/danh-muc-san-pham/vga/" target="_blank" rel="noreferrer">VGA</a></li>
                        <li><a href="https://semcomputer.com/danh-muc-san-pham/mainboard/" target="_blank" rel="noreferrer">Mainboard</a></li>
                        <li><a href="https://semcomputer.com/danh-muc-san-pham/ram/" target="_blank" rel="noreferrer">RAM</a></li>
                        <li><a href="https://semcomputer.com/danh-muc-san-pham/ssd/" target="_blank" rel="noreferrer">SSD</a></li>
                        <li><a href="https://semcomputer.com/danh-muc-san-pham/psu/" target="_blank" rel="noreferrer">PSU</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Service</h4>
                    <ul>
                        <li><a href="https://semcomputer.com/customize-pc/" target="_blank" rel="noreferrer">Custom Case</a></li>
                        <li><a href="https://semcomputer.com/prebuilt-pc/" target="_blank" rel="noreferrer">Build PC</a></li>
                        <li><a href="#">Build & Score</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="https://semcomputer.com/terms-of-use/" target="_blank" rel="noreferrer">Terms of use</a></li>
                        <li><a href="https://semcomputer.com/terms-of-use/" target="_blank" rel="noreferrer">Privacy policy</a></li>
                        <li><a href="https://semcomputer.com/terms-of-use/" target="_blank" rel="noreferrer">Warranty policy</a></li>
                        <li><a href="https://semcomputer.com/about/" target="_blank" rel="noreferrer">About</a></li>
                        <li><a href="https://semcomputer.com/contact/" target="_blank" rel="noreferrer">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                Copyright © 2025 Semcomputer. All rights reserved.
            </div>
        </footer>
    )
}
