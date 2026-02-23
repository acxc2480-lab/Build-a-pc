import { useState, useMemo, useEffect, useRef } from 'react'
import { formatPrice } from '../utils/compatibilityEngine'
import { componentCategories } from '../data/components'

// Helper to get component specs for display
function getSpecs(category, component) {
    switch (category) {
        case 'cpu':
            return [
                component.socket,
                `${component.cores}C/${component.threads}T`,
                `${component.boostClock}GHz`,
                `${component.tdp}W TDP`,
                component.ramType.join('/'),
            ]
        case 'vga':
            return [
                `${component.vram}GB VRAM`,
                `${component.tdp}W`,
                `${component.length}mm`,
                `PSU ≥${component.recommendedPSU}W`,
            ]
        case 'mainboard':
            return [
                component.socket,
                component.chipset,
                component.formFactor,
                component.ramType,
                `${component.ramSlots} slots`,
                `${component.m2Slots} M.2`,
            ]
        case 'ram':
            return [
                component.type,
                `${component.capacity}GB`,
                `${component.speed}MHz`,
                `${component.sticks} thanh`,
                component.latency,
            ]
        case 'ssd':
            return [
                component.type,
                `${component.capacity}GB`,
                `Read ${component.readSpeed}MB/s`,
            ]
        case 'hdd':
            return [
                `${component.capacity}GB`,
                `${component.rpm}RPM`,
                `${component.cache}MB Cache`,
            ]
        case 'psu':
            return [
                `${component.wattage}W`,
                component.efficiency,
                component.modular,
            ]
        case 'cooling':
            return [
                component.type,
                `TDP ≤${component.tdpSupport}W`,
                component.radiatorSize ? `${component.radiatorSize}mm` : `${component.height}mm cao`,
            ]
        case 'case':
            return [
                component.formFactor.join(', '),
                `GPU ≤${component.maxGPULength}mm`,
                `Cooler ≤${component.maxCoolerHeight}mm`,
            ]
        default:
            return []
    }
}

// Check if a component is compatible with current selections
function isComponentCompatible(category, component, selectedComponents) {
    const { cpu, mainboard, ram } = selectedComponents

    switch (category) {
        case 'mainboard':
            if (cpu && component.socket !== cpu.socket) return false
            if (cpu && !cpu.ramType.includes(component.ramType)) return false
            if (ram && ram.type !== component.ramType) return false
            return true
        case 'cpu':
            if (mainboard && component.socket !== mainboard.socket) return false
            if (mainboard && !component.ramType.includes(mainboard.ramType)) return false
            if (ram && !component.ramType.includes(ram.type)) return false
            return true
        case 'ram':
            if (mainboard && component.type !== mainboard.ramType) return false
            if (cpu && !cpu.ramType.includes(component.type)) return false
            return true
        case 'case':
            if (mainboard && !component.formFactor.includes(mainboard.formFactor)) return false
            return true
        case 'cooling':
            if (cpu && component.sockets && !component.sockets.includes(cpu.socket)) return false
            return true
        default:
            return true
    }
}

export default function ComponentModal({ category, components, selectedComponents, onSelect, onClose }) {
    const [search, setSearch] = useState('')
    const inputRef = useRef(null)
    const categoryInfo = componentCategories.find(c => c.id === category)

    useEffect(() => {
        inputRef.current?.focus()
        const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    const filteredComponents = useMemo(() => {
        let items = components
        if (search.trim()) {
            const q = search.toLowerCase()
            items = items.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.brand?.toLowerCase().includes(q)
            )
        }

        // Sort: compatible first, then by price
        return items
            .map(c => ({
                ...c,
                compatible: isComponentCompatible(category, c, selectedComponents),
            }))
            .sort((a, b) => {
                if (a.compatible !== b.compatible) return a.compatible ? -1 : 1
                return a.price - b.price
            })
    }, [components, search, category, selectedComponents])

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{categoryInfo?.icon} Chọn {categoryInfo?.name || category}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-search">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={`Tìm kiếm ${categoryInfo?.name || category}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="modal-body">
                    {filteredComponents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <p>Không tìm thấy linh kiện phù hợp</p>
                        </div>
                    ) : (
                        filteredComponents.map((component) => (
                            <div
                                key={component.id}
                                className={`component-option ${component.compatible ? '' : 'incompatible'}`}
                                onClick={() => onSelect(component)}
                            >
                                <div className="co-icon">
                                    {categoryInfo?.icon}
                                </div>
                                <div className="co-details">
                                    <div className="co-name">{component.name}</div>
                                    <div className="co-specs">
                                        {getSpecs(category, component).map((spec, i) => (
                                            <span key={i}>{spec}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="co-price">{formatPrice(component.price)}</div>
                                    <div
                                        className={`co-compat-badge ${component.compatible ? 'compatible' : 'incompatible'}`}
                                    >
                                        {component.compatible ? '✓ Tương thích' : '✗ Không tương thích'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
