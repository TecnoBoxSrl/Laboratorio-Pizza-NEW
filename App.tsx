import React, { useState, useMemo } from 'react';
import { Logo } from './components/Logo';
import { FlourInputGroup } from './components/FlourInputGroup';
import { PizzaCalculator } from './components/PizzaCalculator';
import { FlourInput, FlourMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mix' | 'pizza'>('mix');
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
    setFlours([
      { id: 1, w: '', grams: '' },
      { id: 2, w: '', grams: '' },
      { id: 3, w: '', grams: '' },
    ]);
  };

  const { resultW, totalGrams } = useMemo(() => {
    let totalW = 0;
    let totGrams = 0;
    for (let i = 0; i < mode; i++) {
      const w = parseFloat(flours[i].w);
      const g = parseFloat(flours[i].grams);
      if (!isNaN(w) && !isNaN(g)) {
        totalW += w * g;
        totGrams += g;
      }
    }
    return { resultW: totGrams === 0 ? 0 : Math.round(totalW / totGrams), totalGrams: totGrams };
  }, [flours, mode]);

  const analysis = useMemo(() => {
    if (resultW === 0) return null;
    let fermentation = "", usage = "", characteristics = "", hydrationMin = 0, hydrationMax = 0, category = "", colorClass = "";
    if (resultW < 180) { category = "Farina Debole"; colorClass = "bg-green-500"; fermentation = "Breve (2-4h)"; hydrationMin = 50; hydrationMax = 55; }
    else if (resultW < 240) { category = "Farina Media"; colorClass = "bg-yellow-500"; fermentation = "Medio-Breve (4-8h)"; hydrationMin = 55; hydrationMax = 60; }
    else if (resultW < 300) { category = "Farina Forte"; colorClass = "bg-orange-500"; fermentation = "Media (8-24h)"; hydrationMin = 60; hydrationMax = 70; }
    else if (resultW < 350) { category = "Farina Molto Forte"; colorClass = "bg-red-500"; fermentation = "Lunga (24-48h)"; hydrationMin = 70; hydrationMax = 80; }
    else { category = "Manitoba / Speciale"; colorClass = "bg-purple-600"; fermentation = "Molto Lunga (48h+)"; hydrationMin = 80; hydrationMax = 90; }
    return { fermentation, category, colorClass, hydrationMin, hydrationMax, wPercentage: Math.min((resultW / 450) * 100, 100) };
  }, [resultW]);

  const handlePrint = () => window.print();

  const handlePdf = () => {
    const element = document.getElementById('main-card');
    const opt = {
      margin: 10,
      filename: `Mix_Farine_${new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().from(element).set(opt).save();
  };

  const getShareText = () => {
    let text = `🍕 *Calcolo Mix Farine* 🍕\n\n`;
    flours.slice(0, mode).forEach((f, i) => { if(f.w && f.grams) text += `Farina ${i+1}: W${f.w} (${f.grams}g)\n`; });
    text += `\n📊 *Risultato Mix:* W ${resultW}`;
    text += `\n⚖️ *Peso Totale:* ${totalGrams}g`;
    if (analysis) text += `\n🏷️ *Categoria:* ${analysis.category}\n💧 *Idratazione:* ${analysis.hydrationMin}-${analysis.hydrationMax}%`;
    text += `\n\n_Creato con Laboratorio Pizza_`;
    return text;
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
  };

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://laboratoriopizza.it')}&text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Mix Farine', text: getShareText() }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(getShareText());
      alert("Testo copiato!");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden font-sans">
      <div className="absolute inset-0 z-0 fixed no-print">
        <img src="https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=2069&auto=format&fit=crop" alt="Bg" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-stone-900/60"></div>
      </div>

      <div id="main-card" className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-amber-100/50">
        <Logo />

        <div className="flex p-1 bg-stone-100 rounded-xl mb-6 no-print tab-nav">
          <button onClick={() => setActiveTab('mix')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'mix' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-400'}`}>Mix Farine</button>
          <button onClick={() => setActiveTab('pizza')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'pizza' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-400'}`}>Ricetta Impasto</button>
        </div>

        {activeTab === 'mix' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center no-print">
              <h2 className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Strumenti</h2>
              <div className="flex gap-2">
                <button onClick={handlePdf} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100" title="Salva PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
                <button onClick={handlePrint} className="p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200" title="Stampa"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
                <div className="relative">
                  <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-100" title="Condividi"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg></button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-stone-100 z-50 overflow-hidden">
                      <button onClick={shareWhatsApp} className="w-full px-4 py-3 text-left text-sm font-bold text-green-600 hover:bg-green-50 flex items-center gap-3 border-b border-stone-50"><span>WhatsApp</span></button>
                      <button onClick={shareTelegram} className="w-full px-4 py-3 text-left text-sm font-bold text-sky-600 hover:bg-sky-50 flex items-center gap-3 border-b border-stone-50"><span>Telegram</span></button>
                      <button onClick={shareNative} className="w-full px-4 py-3 text-left text-sm font-bold text-stone-600 hover:bg-stone-50 flex items-center gap-3"><span>Altri Social</span></button>
                    </div>
                  )}
                </div>
                <button onClick={handleReset} className="p-2 text-stone-400 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg></button>
              </div>
            </div>

            <div className="no-print bg-stone-50 p-2 rounded-xl border border-stone-200 flex justify-between items-center">
              <span className="text-stone-700 font-bold text-xs pl-2">Numero Farine:</span>
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                {[2,3].map(m => <button key={m} onClick={() => setMode(m as any)} className={`px-4 py-1 rounded-md text-xs font-bold ${mode === m ? 'bg-amber-500 text-white' : 'text-stone-400'}`}>{m}</button>)}
              </div>
            </div>

            <div className="space-y-4">
              {flours.slice(0, mode).map((f, i) => <FlourInputGroup key={f.id} index={i} data={f} onChange={handleInputChange} />)}
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200 text-center">
              <h2 className="text-xs uppercase font-bold text-stone-500 mb-2">Risultato Mix</h2>
              <div className="bg-amber-600 text-white py-4 px-8 rounded-2xl inline-block shadow-lg">
                <span className="text-4xl font-black font-mono">{resultW > 0 ? `W ${resultW}` : '---'}</span>
              </div>
              {analysis && (
                <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-3">
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-stone-400">Categoria:</span><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white ${analysis.colorClass}`}>{analysis.category}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-stone-400">Idratazione:</span><span className="text-stone-800 font-bold">{analysis.hydrationMin}% - {analysis.hydrationMax}%</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-stone-400">Maturazione:</span><span className="text-stone-800 font-bold">{analysis.fermentation}</span></div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-stone-500">Peso Totale:</span><span className="text-amber-700 font-bold">{totalGrams} g</span></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <PizzaCalculator />
        )}
        <div className="mt-8 text-center"><div className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">Powered by</div><div className="text-xs text-stone-600 font-bold">LA CONFRATERNITA DELLA PIZZA</div></div>
      </div>
    </div>
  );
};

export default App;