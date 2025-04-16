import React, { useState, useEffect } from 'react'
import upgradesData from '../data/upgrades.json'
import '@fontsource/press-start-2p'

const UpgradeChecker = () => {
  const [buildings, setBuildings] = useState(() => {
    const saved = localStorage.getItem('upgradeBuildings')
    return saved ? JSON.parse(saved) : {
      cursor: 0, grandma: 0, farm: 0, mine: 0, factory: 0, bank: 0, temple: 0,
      wizardTower: 0, shipment: 0, alchemyLab: 0, portal: 0, timeMachine: 0,
      antimatterCondenser: 0, prism: 0, chancemaker: 0, fractalEngine: 0,
      javascriptConsole: 0, idleverse: 0, cortexBaker: 0, you: 0
    }
  })

  const [cps, setCps] = useState(() => localStorage.getItem('upgradeCps') || '')
  const [milk, setMilk] = useState(() => localStorage.getItem('upgradeMilk') || '1.0')
  const [hidePurchased, setHidePurchased] = useState(() => localStorage.getItem('hidePurchased') === 'true')

  useEffect(() => {
    localStorage.setItem('upgradeBuildings', JSON.stringify(buildings))
  }, [buildings])

  useEffect(() => {
    localStorage.setItem('upgradeCps', cps.toString())
  }, [cps])

  useEffect(() => {
    localStorage.setItem('upgradeMilk', milk.toString())
  }, [milk])

  useEffect(() => {
    localStorage.setItem('hidePurchased', hidePurchased.toString())
  }, [hidePurchased])

  const handleChange = (e, building) => {
    setBuildings({ ...buildings, [building]: parseInt(e.target.value) || 0 })
  }

  const calculateCpsGain = (upgrade, buildings, totalCps = 0, totalCookies = 0, milkPercent = 1.0) => {
    const getCount = (name) => buildings[name.toLowerCase()] || 0

    switch (upgrade.type) {
      case 'flat':
        return upgrade.cpsGain

      case 'synergy': {
        const base = getCount(upgrade.base)
        if (upgrade.related === 'all') {
          const totalOther = Object.entries(buildings).filter(([key]) => key !== upgrade.base).reduce((sum, [, count]) => sum + count, 0)
          return base * totalOther * 0.02
        }
        const related = getCount(upgrade.related)
        return base * related * 0.01
      }

      case 'kitten':
        return totalCps * (upgrade.milkFactor * milkPercent)

      case 'pair': {
        const [a, b] = upgrade.buildings
        return getCount(a) * getCount(b) * upgrade.multiplier
      }

      case 'percentBoost': {
        const count = getCount(upgrade.target)
        const totalBuildings = Object.values(buildings).reduce((a, b) => a + b, 1)
        const buildingCps = totalBuildings > 0 ? totalCps / totalBuildings : 0
        return count * buildingCps * upgrade.multiplier
      }

      case 'cursorFinger': {
        const cursorCount = getCount('cursor')
        const otherBuildings = Object.entries(buildings).filter(([b]) => b !== 'cursor').reduce((sum, [, count]) => sum + count, 0)
        return cursorCount * otherBuildings * upgrade.multiplier
      }

      case 'grandmaCombo': {
        const grandmaCount = getCount('grandma')
        const targetCount = getCount(upgrade.related)
        const factor = 1 / (upgrade.perXGrandmas || 1)
        return targetCount * (factor * grandmaCount * 0.01) * totalCps / (Object.values(buildings).reduce((a, b) => a + b, 1) || 1)
      }

      case 'clickPercent':
      case 'goldenCpsBoost':
      case 'seasonalCpsBoost':
      case 'dragonCpsBoost':
        return totalCps * upgrade.multiplier

      default:
        return 0
    }
  }

  const renderIcon = (iconIndex) => {
    const iconSize = 48
    const iconsPerRow = 16
    const row = Math.floor(iconIndex / iconsPerRow)
    const col = iconIndex % iconsPerRow
    const x = -col * iconSize
    const y = -row * iconSize

    return (
      <span
        className="inline-block mr-2"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          backgroundImage: 'url(/icons.png)',
          backgroundSize: 'auto',
          backgroundPosition: `${x}px ${y}px`,
          imageRendering: 'pixelated'
        }}
      />
    )
  }

  const upgrades = upgradesData.map((u) => {
    const totalCps = parseFloat(cps) || 0
    const totalCookies = 10000000000
    const milkPercent = parseFloat(milk) || 1.0
    const cpsGain = calculateCpsGain(u, buildings, totalCps, totalCookies, milkPercent)
    const purchased = localStorage.getItem(`upgrade_${u.id}`) === 'true'
    return {
      ...u,
      purchased,
      cpsGainCalculated: cpsGain,
      efficiency: cpsGain / u.cost
    }
  }).sort((a, b) => b.efficiency - a.efficiency)

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans">
      <div className="py-4 px-6 mb-6 shadow bg-purple-600 text-white">
      <h1 className="text-3xl font-['Press_Start_2P'] mb-1 animate-bounce">🔧 Upgrade Efficiency Checker</h1>
        <p className="text-sm font-mono">Check which upgrade gives the most bang for your cookies.</p>
      </div>

      <div className="px-6 max-w-6xl mx-auto">
      <div className="mb-6 flex gap-4">
  <a
    href="/"
    className={`px-4 py-2 rounded font-semibold ${
      window.location.pathname === '/' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
    }`}
  >
    🍪 CPS Checker
  </a>
  <a
    href="/upgrade-checker"
    className={`px-4 py-2 rounded font-semibold ${
      window.location.pathname === '/upgrade-checker' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
    }`}
  >
    🔧 Upgrade Checker
  </a>
</div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Total CPS
            <span
              title="Enter the raw CPS from the top-left of the game screen. It excludes golden cookies and clicking. It's the number shown just below the big cookie."
              className="ml-2 cursor-help text-blue-600"
            >🛈</span>
          </label>
          <input
            type="number"
            value={cps}
            onChange={(e) => setCps(e.target.value)}
            placeholder="Enter your current CPS"
            className="w-64 p-2 border rounded mb-1"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Milk Level (1.0 = 100%)
            <span
              title="In Cookie Clicker, check your milk percentage by hovering over the cookie icon in the bottom left. It increases with achievements and boosts Kitten upgrades."
              className="ml-2 cursor-help text-blue-600"
            >🛈</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={milk}
            onChange={(e) => setMilk(e.target.value)}
            placeholder="e.g. 1.2 for 120% milk"
            className="w-64 p-2 border rounded mb-4"
          />
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={hidePurchased} onChange={() => setHidePurchased(!hidePurchased)} className="mr-2" />
            Hide Purchased Upgrades
          </label>
        </div>
        <div className="mb-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => {
              if (window.confirm('Reset all inputs and clear saved data?')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
          >
            🔄 Reset All
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Current Building Counts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(buildings).map(([building, value]) => (
            <div key={building}>
              <label className="block mb-1 capitalize font-semibold">{building}</label>
              <input type="number" value={value} onChange={(e) => handleChange(e, building)} className="w-full p-2 border border-slate-300 rounded shadow-sm" placeholder="Enter count" />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Available Upgrades</h2>
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="min-w-full table-auto text-sm border-collapse">
            <thead className="bg-slate-200 text-slate-800">
              <tr>
                <th className="text-left px-4 py-2 border">Upgrade</th>
                <th className="text-right px-4 py-2 border">Cost</th>
                <th className="text-right px-4 py-2 border">CPS Gain</th>
                <th className="text-right px-4 py-2 border">Efficiency</th>
                <th className="text-center px-4 py-2 border">Purchased</th>
              </tr>
            </thead>
            <tbody>
              {upgrades.filter(u => !(hidePurchased && u.purchased)).map((u) => (
                <tr
                  key={u.id}
                  className={`hover:bg-slate-50 ${
                    upgrades[0].id === u.id ? 'bg-yellow-100 font-semibold border-2 border-yellow-400' : ''
                  }`}
                >
                  <td className="px-4 py-2 border flex items-center" title={u.notes || ''}>
                    {u.iconIndex !== undefined && renderIcon(u.iconIndex)}
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-2 border text-right">{u.cost.toLocaleString()}</td>
                  <td className="px-4 py-2 border text-right">{Math.floor(u.cpsGainCalculated).toLocaleString()}</td>
                  <td className="px-4 py-2 border text-right">{u.efficiency.toFixed(8)}</td>
                  <td className="px-4 py-2 border text-center">
                    <input type="checkbox" checked={u.purchased} onChange={() => {
                      const newVal = !u.purchased
                      localStorage.setItem(`upgrade_${u.id}`, newVal.toString())
                      window.location.reload()
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-8 p-4 text-center text-sm text-slate-400">
        Built by Stuart Gibson Learning | <a href="https://sglearning.netlify.app" className="underline">Portfolio</a>
      </footer>
    </div>
  )
}

export default UpgradeChecker
