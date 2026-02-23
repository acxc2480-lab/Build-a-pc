import { formatPrice } from '../utils/compatibilityEngine'

export default function ComponentRow({ category, selected, onSelect, onRemove, hasIssue, hasWarning }) {
    let rowClass = 'component-row'
    if (hasIssue) rowClass += ' has-issue'
    else if (hasWarning) rowClass += ' has-warning'
    else if (selected) rowClass += ' selected'

    return (
        <div className={rowClass}>
            <div className="component-number">{category.order}</div>
            <div className="component-info">
                <span className="component-icon">{category.icon}</span>
                <div className="component-label">
                    <div className="category-name">{category.name}</div>
                    {selected ? (
                        <>
                            <div className="selected-name">
                                {selected.name}
                                {hasIssue && <span title="Có lỗi tương thích">🔴</span>}
                                {hasWarning && !hasIssue && <span title="Cảnh báo">⚠️</span>}
                            </div>
                            <div className="selected-price">{formatPrice(selected.price)}</div>
                        </>
                    ) : (
                        <div className="placeholder">Chưa chọn — Nhấn SELECT để chọn</div>
                    )}
                </div>
            </div>
            <div className="component-actions">
                {selected && (
                    <button className="btn-remove" onClick={onRemove} title="Xóa">
                        ✕
                    </button>
                )}
                <button className="btn-select" onClick={onSelect}>
                    SELECT
                </button>
            </div>
        </div>
    )
}
