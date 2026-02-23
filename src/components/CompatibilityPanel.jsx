import { useMemo, useState, useEffect, useRef } from 'react'
import { formatPrice } from '../utils/compatibilityEngine'

export default function CompatibilityPanel({
    compatibility,
    totalPrice,
    suggestions,
    selectedComponents,
    onSelectSuggestion,
    onReset,
}) {
    const { score, issues, warnings, strengths, selectedCount } = compatibility
    const [animateScore, setAnimateScore] = useState(false)
    const prevScore = useRef(score)

    useEffect(() => {
        if (prevScore.current !== score) {
            setAnimateScore(true)
            const t = setTimeout(() => setAnimateScore(false), 400)
            prevScore.current = score
            return () => clearTimeout(t)
        }
    }, [score])

    // Gauge arc calculation
    const gaugeRadius = 80
    const gaugeCircumference = Math.PI * gaugeRadius // half-circle
    const gaugeFill = (score / 100) * gaugeCircumference

    // Color based on score
    const scoreColor = useMemo(() => {
        if (score >= 80) return '#22c55e'
        if (score >= 60) return '#eab308'
        if (score >= 40) return '#f97316'
        return '#ef4444'
    }, [score])

    const perfLevel = useMemo(() => {
        if (score >= 90) return 'Xuất sắc'
        if (score >= 75) return 'Tốt'
        if (score >= 50) return 'Trung bình'
        if (score >= 25) return 'Cần cải thiện'
        return 'Chưa đủ dữ liệu'
    }, [score])

    return (
        <div className="compat-panel">
            {/* Score Card */}
            <div className="score-card">
                <h3>Compatibility</h3>

                <div className={`gauge-container ${animateScore ? 'score-animate' : ''}`}>
                    <svg className="gauge-svg" viewBox="0 0 200 120">
                        {/* Background arc */}
                        <path
                            className="gauge-bg"
                            d="M 20 110 A 80 80 0 0 1 180 110"
                        />
                        {/* Filled arc */}
                        <path
                            className="gauge-fill"
                            d="M 20 110 A 80 80 0 0 1 180 110"
                            style={{
                                stroke: scoreColor,
                                strokeDasharray: `${gaugeCircumference}`,
                                strokeDashoffset: `${gaugeCircumference - gaugeFill}`,
                            }}
                        />
                        {/* Score text */}
                        <text x="100" y="90" textAnchor="middle" className="gauge-score" style={{ fill: scoreColor }}>
                            {selectedCount >= 2 ? `${score}%` : '—'}
                        </text>
                        <text x="100" y="108" textAnchor="middle" className="gauge-label">
                            Compatibility Rating
                        </text>
                    </svg>
                </div>

                {/* Performance Bar */}
                <div className="perf-bar-section">
                    <div className="perf-bar-header">
                        <span>Performance potential</span>
                        <span className="perf-level">{perfLevel}</span>
                    </div>
                    <div className="perf-bar-track">
                        <div
                            className="perf-bar-fill"
                            style={{
                                width: `${selectedCount >= 2 ? score : 0}%`,
                                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                            }}
                        />
                    </div>
                </div>

                {/* Total Price */}
                <div className="price-total">
                    <div className="label">Estimate total</div>
                    <div className="amount">{formatPrice(totalPrice)}</div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="btn-primary" onClick={() => {
                        const buildSummary = Object.entries(selectedComponents)
                            .filter(([, v]) => v)
                            .map(([k, v]) => `${k.toUpperCase()}: ${v.name} - ${formatPrice(v.price)}`)
                            .join('\n')
                        const total = formatPrice(totalPrice)
                        const text = `🖥️ PC Build từ Semcomputer\n\n${buildSummary}\n\n💰 Tổng: ${total}\n✅ Compatibility: ${score}%`
                        navigator.clipboard?.writeText(text)
                        alert('Đã copy cấu hình vào clipboard!')
                    }}>
                        Confirm Build
                    </button>
                    <button className="btn-secondary" onClick={onReset}>
                        Reset
                    </button>
                </div>
            </div>

            {/* Issues Panel */}
            {(issues.length > 0 || warnings.length > 0 || strengths.length > 0) && (
                <div className="issues-panel">
                    {issues.length > 0 && (
                        <>
                            <h4>🔴 Lỗi không tương thích ({issues.length})</h4>
                            {issues.map((issue, i) => (
                                <div key={`issue-${i}`} className="issue-item">
                                    <span className="issue-icon">{issue.icon}</span>
                                    <div className="issue-content">
                                        <div className="issue-title">{issue.title}</div>
                                        <div className="issue-detail">{issue.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {warnings.length > 0 && (
                        <>
                            <h4 style={{ marginTop: issues.length > 0 ? '1rem' : 0 }}>
                                ⚠️ Cảnh báo ({warnings.length})
                            </h4>
                            {warnings.map((warning, i) => (
                                <div key={`warn-${i}`} className="issue-item warning">
                                    <span className="issue-icon">{warning.icon}</span>
                                    <div className="issue-content">
                                        <div className="issue-title">{warning.title}</div>
                                        <div className="issue-detail">{warning.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {strengths.length > 0 && (
                        <>
                            <h4 style={{ marginTop: (issues.length > 0 || warnings.length > 0) ? '1rem' : 0 }}>
                                ✅ Tương thích ({strengths.length})
                            </h4>
                            {strengths.map((str, i) => (
                                <div key={`str-${i}`} className="issue-item strength">
                                    <span className="issue-icon">{str.icon}</span>
                                    <div className="issue-content">
                                        <div className="issue-title">{str.title}</div>
                                        <div className="issue-detail">{str.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
                <div className="suggestions-panel">
                    <h4>💡 Gợi ý thông minh</h4>
                    {suggestions.map((sg, i) => (
                        <div key={`sg-${i}`} className="suggestion-group">
                            <div className="suggestion-group-header">
                                <span className="sg-icon">{sg.icon}</span>
                                <span className="sg-title">{sg.title}</span>
                                <span className="sg-detail">{sg.detail}</span>
                            </div>
                            {sg.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="suggestion-item"
                                    onClick={() => onSelectSuggestion(sg.category, item)}
                                >
                                    <span className="si-name">{item.name}</span>
                                    <span className="si-price">{formatPrice(item.price)}</span>
                                    <span className="si-add">+</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
