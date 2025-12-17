import React, { useState, useMemo } from 'react';
import { Logo } from './components/Logo';
import { FlourInputGroup } from './components/FlourInputGroup';
import { PizzaCalculator } from './components/PizzaCalculator';
import { FlourInput, FlourMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mix' | 'pizza'>('pizza');
  const [showShareMenu, setShowShareMenu] = useState(false);

  // --- MIX CALCULATOR STATE ---
  const [mode, setMode] = useState<FlourMode>(2);
  const [flours, setFlours] = useState<FlourInput[]>([
    { id: 1, w: '', grams: '' },
    { id: 2, w: '', grams: '' },
    { id: 3, w: '', grams: '' },
  ]);

  const handleInputChange = (index: number, field: 'w' | 'grams', value: string) => {
    const newFlours = [...flours];
    newFlours[index] = { ...newFlours[index], [field]: value };
    setFlours(newFlours);
  };

  const handleReset = () => {
    if (activeTab === 'mix') {
      setFlours([
        { id: 1, w: '', grams: '' },
        { id: 2, w: '', grams: '' },
        { id: 3, w: '', grams: '' },
      ]);
    } else {
      // Triggering a page reload or a custom event could be cleaner, 
      // but for this simple app, we'll let the PizzaCalculator handle its own state or just reload.
      window.location.reload();
    }
  };

  const { resultW, totalGrams } = useMemo(() => {
    let totalW = 0, totGrams = 0;
    for (let i = 0; i < mode; i++) {
      const w = parseFloat(flours[i].w), g = parseFloat(flours[i].grams);
      if (!isNaN(w) && !isNaN(g)) { totalW += w * g; totGrams += g; }
    }
    return { resultW: totGrams === 0 ? 0 : Math.round(totalW / totGrams), totalGrams: totGrams };
  }, [flours, mode]);

  const analysis = useMemo(() => {
    if (resultW === 0) return null;
    let fermentation = "", category = "", colorClass = "", hydrationMin = 0, hydrationMax = 0;
    if (resultW < 180) { category = "Farina Debole"; colorClass = "bg-green-500"; fermentation = "Breve (2-4h)"; hydrationMin = 50; hydrationMax = 55; }
    else if (resultW < 240) { category = "Farina Media"; colorClass = "bg-yellow-500"; fermentation = "Medio-Breve (4-8h)"; hydrationMin = 55; hydrationMax = 60; }
    else if (resultW < 300) { category = "Farina Forte"; colorClass = "bg-orange-500"; fermentation = "Media (8-24h)"; hydrationMin = 60; hydrationMax = 70; }
    else if (resultW < 350) { category = "Farina Molto Forte"; colorClass = "bg-red-500"; fermentation = "Lunga (24-48h)"; hydrationMin = 70; hydrationMax = 80; }
    else { category = "Manitoba / Speciale"; colorClass = "bg-purple-600"; fermentation = "Molto Lunga (48h+)"; hydrationMin = 80; hydrationMax = 90; }
    return { fermentation, category, colorClass, hydrationMin, hydrationMax };
  }, [resultW]);

  const handlePdf = () => {
    const element = document.getElementById('main-card');
    const opt = {
      margin: 10,
      filename: `Laboratorio_Pizza_${activeTab === 'mix' ? 'Mix' : 'Ricetta'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().from(element).set(opt).save();
  };

  const shareWhatsApp = () => {
    const text = activeTab === 'mix' 
      ? `🍕 *Calcolo Mix Farine*\nRisultato: W ${resultW}\nPeso Totale: ${totalGrams}g\nCreato con Laboratorio Pizza`
      : `🍕 *Ricetta Pizza*\nGenerata con Laboratorio Pizza`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center py-6 px-4 bg-stone-100">
      <div id="main-card" className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 border border-stone-200">
        <Logo />

        <div className="flex p-1 bg-stone-100 rounded-xl mb-8 no-print" data-html2canvas-ignore="true">
          <button 
            onClick={() => setActiveTab('mix')} 
            className={`flex-1 py-3 text-[11px] font-extrabold uppercase rounded-lg transition-all ${activeTab === 'mix' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-400'}`}
          >
            Miscela & Forza (W)
          </button>
          <button 
            onClick={() => setActiveTab('pizza')} 
            className={`flex-1 py-3 text-[11px] font-extrabold uppercase rounded-lg transition-all ${activeTab === 'pizza' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-400'}`}
          >
            Ricetta Impasto
          </button>
        </div>

        <div className="flex justify-between items-center mb-8 no-print" data-html2canvas-ignore="true">
          <div className="flex flex-col">
            <h2 className="text-stone-700 text-[10px] font-black uppercase tracking-tighter">Laboratorio</h2>
            <h2 className="text-stone-700 text-[10px] font-black uppercase tracking-tighter">Impasti</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePdf} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-500 text-[10px] font-black rounded-lg border border-stone-200 hover:bg-stone-50 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.363 2c4.155 0 2.637 6 2.637 6s6-1.518 6 2.638v11.362c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1V3c0-.552.448-1 1-1h6.363zM14 8h5.363L14 2.637V8z"/></svg>
              PDF
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-600 text-[10px] font-black rounded-lg border border-stone-200 hover:bg-stone-50 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Stampa
            </button>
            <div className="relative">
              <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-500 text-[10px] font-black rounded-lg border border-stone-200 hover:bg-stone-50 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                Condividi
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-stone-100 z-50 overflow-hidden">
                  <button onClick={shareWhatsApp} className="w-full px-4 py-3 text-left text-xs font-bold text-green-600 hover:bg-green-50 border-b border-stone-50">WhatsApp</button>
                  <button onClick={() => window.open(`https://t.me/share/url?url=https://laboratoriopizza.it&text=${encodeURIComponent('Laboratorio Pizza')}`, '_blank')} className="w-full px-4 py-3 text-left text-xs font-bold text-sky-600 hover:bg-sky-50 border-b border-stone-50">Telegram</button>
                  <button onClick={() => navigator.share?.({title:'Laboratorio Pizza', text:'Ricetta calcolata'})} className="w-full px-4 py-3 text-left text-xs font-bold text-stone-500 hover:bg-stone-50">Altri...</button>
                </div>
              )}
            </div>
            <button onClick={handleReset} className="p-1.5 bg-white text-stone-400 rounded-lg border border-stone-200 hover:text-red-500 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>
        </div>

        {activeTab === 'mix' ? (
          <div className="space-y-4">
            <div className="no-print bg-stone-50 p-2 rounded-xl border border-stone-200 flex justify-between items-center" data-html2canvas-ignore="true">
              <span className="text-stone-700 font-bold text-xs pl-2">Numero Farine:</span>
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                {[2,3].map(m => <button key={m} onClick={() => setMode(m as any)} className={`px-4 py-1 rounded-md text-xs font-bold ${mode === m ? 'bg-amber-500 text-white' : 'text-stone-400'}`}>{m}</button>)}
              </div>
            </div>
            {flours.slice(0, mode).map((f, i) => <FlourInputGroup key={f.id} index={i} data={f} onChange={handleInputChange} />)}
            <div className="mt-6 text-center border-t border-stone-100 pt-6">
              <h2 className="text-[10px] uppercase font-bold text-stone-400 mb-2">Risultato del Mix</h2>
              <div className="bg-amber-600 text-white py-4 px-10 rounded-2xl inline-block shadow-lg">
                <span className="text-4xl font-black font-mono tracking-tighter">{resultW > 0 ? `W ${resultW}` : '---'}</span>
              </div>
              {analysis && (
                <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-2">
                  <div className="flex justify-between text-[11px] font-bold"><span>Categoria:</span> <span className={`px-2 rounded text-white ${analysis.colorClass}`}>{analysis.category}</span></div>
                  <div className="flex justify-between text-[11px]"><span>Idratazione Consigliata:</span> <span className="font-bold text-amber-700">{analysis.hydrationMin}% - {analysis.hydrationMax}%</span></div>
                  <div className="flex justify-between text-[11px]"><span>Maturazione Suggerita:</span> <span className="font-bold text-stone-800">{analysis.fermentation}</span></div>
                  <div className="flex justify-between text-[11px]"><span>Peso Totale:</span> <span className="font-bold">{totalGrams} g</span></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <PizzaCalculator />
        )}
        
        <footer className="mt-12 pt-6 border-t border-stone-100 text-center no-print">
          <div className="text-[9px] text-stone-300 font-black uppercase tracking-[0.2em] mb-1">POWERED BY</div>
          <div className="text-[11px] text-stone-600 font-black tracking-tight">LA CONFRATERNITA DELLA PIZZA</div>
        </footer>
        <div className="hidden print:block text-center mt-4">
          <div className="text-[9px] text-stone-300 font-black uppercase tracking-[0.2em] mb-1">POWERED BY</div>
          <div className="text-[11px] text-stone-600 font-black tracking-tight">LA CONFRATERNITA DELLA PIZZA</div>
        </div>
      </div>
    </div>
  );
};

export default App;