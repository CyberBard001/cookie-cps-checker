import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fontsource/press-start-2p';
import './index.css';
import UpgradeChecker from './pages/UpgradeChecker';

const initialBuildings = [
  { name: "Cursor", cps: 0.1 },
  { name: "Grandma", cps: 1.2 },
  { name: "Farm", cps: 8 },
  { name: "Mine", cps: 47 },
  { name: "Factory", cps: 260 },
  { name: "Bank", cps: 1400 },
  { name: "Temple", cps: 7800 },
  { name: "Wizard Tower", cps: 44000 },
  { name: "Shipment", cps: 260000 },
  { name: "Alchemy Lab", cps: 1600000 },
  { name: "Portal", cps: 10000000 },
  { name: "Time Machine", cps: 65000000 },
  { name: "Antimatter Condenser", cps: 430000000 },
  { name: "Prism", cps: 2900000000 },
  { name: "Chancemaker", cps: 21000000000 },
  { name: "Fractal Engine", cps: 150000000000 },
  { name: "Javascript Console", cps: 1100000000000 },
  { name: "Idleverse", cps: 8300000000000 },
  { name: "Cortex Baker", cps: 61000000000000 },
  { name: "You", cps: 470000000000000 },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [buildings, setBuildings] = useState(() => {
    const saved = localStorage.getItem('buildings');
    return saved ? JSON.parse(saved) : initialBuildings.map(b => ({ ...b, cost: '' }));
  });

  const [prestigeLevel, setPrestigeLevel] = useState(() => {
    const saved = localStorage.getItem('prestigeLevel');
    return saved ? parseInt(saved) : 0;
  });

  const [cps, setCps] = useState(() => {
    const saved = localStorage.getItem('cps');
    return saved || '';
  });

  useEffect(() => {
    localStorage.setItem('buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('prestigeLevel', prestigeLevel.toString());
  }, [prestigeLevel]);

  useEffect(() => {
    localStorage.setItem('cps', cps.toString());
  }, [cps]);

  const handleChange = (index, value) => {
    const updated = [...buildings];
    updated[index].cost = value;
    setBuildings(updated);
  };

  const handleReset = () => {
    const reset = initialBuildings.map(b => ({ ...b, cost: '' }));
    setBuildings(reset);
    setPrestigeLevel(0);
    setCps('');
    localStorage.clear();
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const bonusMultiplier = 1 + (prestigeLevel * 0.01);

  const efficiencyData = buildings
    .filter(b => b.cost && !isNaN(b.cost))
    .map(b => {
      const cost = parseFloat(b.cost);
      const effectiveCPS = b.cps * bonusMultiplier;
      const efficiency = (1_000_000 / cost) * effectiveCPS;
      return { ...b, cost, efficiency, effectiveCPS };
    })
    .sort((a, b) => b.efficiency - a.efficiency);

  return (
    <Router>
      <Routes>
        <Route path="/upgrade-checker" element={<UpgradeChecker />} />
        <Route
          path="/"
          element={
            <div className={`${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'} min-h-screen font-sans transition-all duration-300`}>
              <div className={`py-4 px-6 mb-6 shadow ${darkMode ? 'bg-purple-800' : 'bg-purple-600'} text-white`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold font-['Press_Start_2P'] animate-bounce">🍪 Cookie Clicker CPS Checker</h1>
                    <p className="text-sm font-mono">Find your most efficient next purchase.</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Reset All</button>
                    <button onClick={toggleDarkMode} className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded">
                      {darkMode ? "🌙 Dark" : "☀️ Light"}
                    </button>
                  </div>
                </div>
              </div>
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

              <div className="px-6 max-w-6xl mx-auto">
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2">Your Current CPS</label>
                  <input
                    type="number"
                    placeholder="💡 Enter your current CPS"
                    value={cps}
                    onChange={(e) => setCps(e.target.value)}
                    className={`w-full p-3 border rounded focus:outline-none focus:ring-4 focus:ring-purple-300 
                      ${darkMode ? 'bg-slate-800 text-white placeholder:text-slate-400 border-slate-600' : 'bg-white text-black'}`}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">CPS per Minute</label>
                      <input
                        type="text"
                        readOnly
                        value={(parseFloat(cps || 0) * 60).toLocaleString()}
                        className={`w-full p-2 border rounded bg-slate-100 ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'text-slate-800'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CPS per Hour</label>
                      <input
                        type="text"
                        readOnly
                        value={(parseFloat(cps || 0) * 3600).toLocaleString()}
                        className={`w-full p-2 border rounded bg-slate-100 ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'text-slate-800'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Prestige Level</label>
                  <input
                    type="number"
                    value={prestigeLevel}
                    onChange={e => setPrestigeLevel(parseInt(e.target.value) || 0)}
                    placeholder="Enter prestige level"
                    className={`w-48 p-2 border rounded focus:outline-none focus:ring-4 focus:ring-purple-300 ${darkMode ? 'bg-slate-800 text-white placeholder:text-slate-400 border-slate-600' : 'bg-white text-black'}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {buildings.map((b, i) => (
                    <div key={b.name} className={`rounded-lg p-4 shadow-md border border-slate-200 transition-transform hover:scale-[1.01] ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                      <label className={`block font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{b.name}</label>
                      <input
                        type="number"
                        placeholder="💰 Enter cost in cookies"
                        value={b.cost}
                        onChange={e => handleChange(i, e.target.value)}
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-4 focus:ring-purple-300 ${darkMode ? 'bg-slate-700 text-white placeholder:text-slate-400 border-slate-600' : 'bg-white text-black'}`}
                      />
                    </div>
                  ))}
                </div>

                {efficiencyData.length > 0 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-3">Sorted Efficiency Table</h2>
                    <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded shadow">
                      💡 <strong>Best Buy Right Now:</strong> {efficiencyData[0].name} — {efficiencyData[0].efficiency.toFixed(6)} CPS per 1M
                    </div>
                    <div className="overflow-x-auto">
                      <table className={`min-w-full rounded shadow border text-sm ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}>
                        <thead className={darkMode ? 'bg-slate-700' : 'bg-slate-200'}>
                          <tr>
                            <th className="p-2 border">Building</th>
                            <th className="p-2 border">🍪 CPS</th>
                            <th className="p-2 border">💰 Cost</th>
                            <th className="p-2 border">⚙️ CPS per 1M</th>
                          </tr>
                        </thead>
                        <tbody>
                          {efficiencyData.map((b, idx) => (
                            <tr
                              key={b.name}
                              className={`p-2 border ${
                                idx === 0
                                  ? darkMode
                                    ? 'bg-yellow-400 text-slate-900 font-semibold'
                                    : 'bg-yellow-100 text-black font-semibold'
                                  : darkMode
                                    ? 'hover:bg-slate-700'
                                    : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="p-2 border">{b.name}</td>
                              <td className="p-2 border">{b.cps.toLocaleString()}</td>
                              <td className="p-2 border">{Number(b.cost).toLocaleString()}</td>
                              <td className="p-2 border">{b.efficiency.toFixed(6)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

<div className="px-6 max-w-6xl mx-auto mt-8">
  <h3 className="text-lg font-semibold mb-2">💡 Cookie Number Reference</h3>
  <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
    <li>1,000 = 1 Thousand</li>
    <li>1,000,000 = 1 Million</li>
    <li>1,000,000,000 = 1 Billion</li>
    <li>1,000,000,000,000 = 1 Trillion</li>
    <li>1,000,000,000,000,000 = 1 Quadrillion</li>
    <li>1,000,000,000,000,000,000 = 1 Quintillion</li>
    <li>1,000,000,000,000,000,000,000 = 1 Sextillion</li>
    <li>1,000,000,000,000,000,000,000,000 = 1 Septillion</li>
  </ul>
</div>

<footer className="mt-8 p-4 text-center text-sm text-slate-400">
  Built by Stuart Gibson Learning | <a href="https://sglearning.netlify.app" className="underline">Portfolio</a>
</footer>
</div>
}
/>
</Routes>
</Router>
);
}