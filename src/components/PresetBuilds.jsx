import { LightningIcon } from './Icons'

export default function PresetBuilds({ presets, onApplyPreset }) {
    return (
        <section className="presets-section">
            <div className="presets-header">
                <LightningIcon size={14} />
                <h3>Quick Configurations</h3>
            </div>
            <div className="preset-grid">
                {presets.map((preset) => (
                    <div
                        key={preset.id}
                        className="preset-card"
                        onClick={() => onApplyPreset(preset)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onApplyPreset(preset)}
                    >
                        <h4>{preset.name}</h4>
                        <p>{preset.description}</p>
                        <div className="budget">{preset.budget}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}
