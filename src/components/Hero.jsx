export default function Hero({ glowState }) {
    // glowState: 'neutral' | 'green' | 'red'
    const glowClass = glowState === 'green' ? 'glow-green' : glowState === 'red' ? 'glow-red' : ''

    return (
        <section className="hero">
            <div className={`hero-bg ${glowClass}`} />
            <div className={`hero-glow-overlay ${glowState === 'green' ? 'glow-green' : glowState === 'red' ? 'glow-red' : 'glow-neutral'}`} />
            <div className="hero-pc-image" />
            <div className="hero-content">
                <span className="hero-badge">PC Builder Tool</span>
                <h1>
                    Build & Score <span className="accent">PC</span>
                </h1>
                <p>
                    Kiểm tra độ tương thích linh kiện, xây dựng cấu hình PC hoàn hảo
                    với gợi ý thông minh từ hệ thống
                </p>
            </div>
        </section>
    )
}
