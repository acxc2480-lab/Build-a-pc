import { useState, useMemo, useCallback } from 'react'
import { componentCategories, allComponents, presetBuilds } from './data/components'
import { checkCompatibility, getSmartSuggestions, formatPrice, calculateTotalPrice } from './utils/compatibilityEngine'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PresetBuilds from './components/PresetBuilds'
import ComponentRow from './components/ComponentRow'
import CompatibilityPanel from './components/CompatibilityPanel'
import ComponentModal from './components/ComponentModal'
import Footer from './components/Footer'
import './index.css'

function App() {
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null, vga: null, mainboard: null, ram: null,
    ssd: null, hdd: null, psu: null, cooling: null, case: null,
  })
  const [modalCategory, setModalCategory] = useState(null)

  const compatibility = useMemo(() => checkCompatibility(selectedComponents), [selectedComponents])
  const suggestions = useMemo(() => getSmartSuggestions(selectedComponents, allComponents), [selectedComponents])
  const totalPrice = useMemo(() => calculateTotalPrice(selectedComponents), [selectedComponents])

  // Determine hero glow state based on compatibility
  const heroGlowState = useMemo(() => {
    if (compatibility.selectedCount < 2) return 'neutral'
    if (compatibility.issues.length > 0) return 'red'
    if (compatibility.score >= 70) return 'green'
    return 'neutral'
  }, [compatibility])

  const handleSelectComponent = useCallback((category, component) => {
    setSelectedComponents(prev => ({ ...prev, [category]: component }))
    setModalCategory(null)
  }, [])

  const handleRemoveComponent = useCallback((category) => {
    setSelectedComponents(prev => ({ ...prev, [category]: null }))
  }, [])

  const handleOpenModal = useCallback((category) => { setModalCategory(category) }, [])
  const handleCloseModal = useCallback(() => { setModalCategory(null) }, [])

  const handleApplyPreset = useCallback((preset) => {
    const newComponents = {}
    for (const [category, componentId] of Object.entries(preset.components)) {
      const componentList = allComponents[category]
      newComponents[category] = componentList?.find(c => c.id === componentId) || null
    }
    for (const cat of componentCategories) {
      if (!(cat.id in newComponents)) newComponents[cat.id] = null
    }
    setSelectedComponents(newComponents)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedComponents({
      cpu: null, vga: null, mainboard: null, ram: null,
      ssd: null, hdd: null, psu: null, cooling: null, case: null,
    })
  }, [])

  const getComponentStatus = useCallback((categoryId) => {
    const hasIssue = compatibility.issues.some(i => i.components?.includes(categoryId))
    const hasWarning = compatibility.warnings.some(w => w.components?.includes(categoryId))
    return { hasIssue, hasWarning }
  }, [compatibility])

  return (
    <>
      <Navbar />
      <Hero glowState={heroGlowState} />
      <PresetBuilds presets={presetBuilds} onApplyPreset={handleApplyPreset} />

      <div className="builder-layout">
        <div className="selector-panel">
          <div className="selector-panel-header">
            <h2>Technical Specs</h2>
          </div>
          {componentCategories.map((cat) => {
            const status = getComponentStatus(cat.id)
            return (
              <ComponentRow
                key={cat.id}
                category={cat}
                selected={selectedComponents[cat.id]}
                onSelect={() => handleOpenModal(cat.id)}
                onRemove={() => handleRemoveComponent(cat.id)}
                hasIssue={status.hasIssue}
                hasWarning={status.hasWarning}
              />
            )
          })}
        </div>

        <CompatibilityPanel
          compatibility={compatibility}
          totalPrice={totalPrice}
          suggestions={suggestions}
          selectedComponents={selectedComponents}
          onSelectSuggestion={handleSelectComponent}
          onReset={handleReset}
        />
      </div>

      {modalCategory && (
        <ComponentModal
          category={modalCategory}
          components={allComponents[modalCategory] || []}
          selectedComponents={selectedComponents}
          onSelect={(component) => handleSelectComponent(modalCategory, component)}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </>
  )
}

export default App
