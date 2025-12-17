import React, { useState, useMemo } from 'react';
import { Logo } from './components/Logo';
import { FlourInputGroup } from './components/FlourInputGroup';
import { PizzaCalculator } from './components/PizzaCalculator';
import { FlourInput, FlourMode } from './types';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'mix' | 'pizza'>('mix');

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

  // Mix Calculation
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

    const calculatedW = totGrams === 0 ? 0 : Math.round(totalW / totGrams);
    return { resultW: calculatedW, totalGrams: totGrams };
  }, [flours, mode]);

  // Expert Analysis Logic (Mix)
  const analysis = useMemo(() => {
    if (resultW === 0) return null;
    let fermentation = "";
    let usage = "";
    let characteristics = "";
    let hydrationMin = 0;
    let hydrationMax = 0;
    let category = "";
    let colorClass = "";

    if (resultW < 180) {
      category = "Farina Debole";
      colorClass = "bg-green-500";
      fermentation = "Breve (2 - 4 ore)";
      usage = "Biscotti, Cialde, Grissini, Pasta Frolla";
      characteristics = "Basso assorbimento. Non adatta a lunghe lievitazioni.";
      hydrationMin = 50;
      hydrationMax = 55;
    } else if (resultW < 240) {
      category = "Farina Media";
      colorClass = "bg-yellow-500";
      fermentation = "Medio-Breve (4 - 8 ore)";
      usage = "Pizza in teglia veloce, Pane comune, Focacce dirette";
      characteristics = "Ideale per impasti diretti e lavorazioni in giornata.";
      hydrationMin = 55;
      hydrationMax = 60;
    } else if (resultW < 300) {
      category = "Farina Forte";
      colorClass = "bg-orange-500";
      fermentation = "Media (8 - 24 ore)";
      usage = "Pizza Napoletana, Pizza alla pala, Pane francese, Ciabatta";
      characteristics = "Ottima tenuta della maglia glutinica. Regge il frigo.";
      hydrationMin = 60;
      hydrationMax = 70;
    } else if (resultW < 350) {
      category = "Farina Molto Forte";
      colorClass = "bg-red-500";
      fermentation = "Lunga (24 - 48 ore)";
      usage = "Pizza alta idratazione, Pane strutturato, Brioche, Biga";
      characteristics = "Alta capacità di assorbimento e spinta in cottura.";
      hydrationMin = 70;
      hydrationMax = 80;
    } else {
      category = "Farina Speciale / Manitoba";
      colorClass = "bg-purple-600";
      fermentation = "Molto Lunga (48+ ore)";
      usage = "Grandi Lievitati (Panettone, Colomba), Rinforzo farine deboli";
      characteristics = "Forza estrema. Richiede tecnica e lunghe maturazioni.";
      hydrationMin = 80;
      hydrationMax = 90; 
    }
    const wPercentage = Math.min((resultW / 450) * 100, 100);

    return { fermentation, usage, characteristics, hydrationMin, hydrationMax, category, colorClass, wPercentage };
  }, [resultW]);

  // --- ACTIONS ---

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Laboratorio_Pizza_Mix_Stampa`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  const handlePdf = () => {
    const originalTitle = document.title;
    const dateStr = new Date().toISOString().slice(0, 10);
    document.title = `Mix_Farine_${dateStr}`; // Clean filename for PDF save
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  const handleShare = async () => {
    if (resultW === 0) {
        alert("Inserisci prima i dati delle farine.");
        return;
    }

    let text = `🍕 *Calcolo Mix Farine* 🍕\n\n`;
    flours.slice(0, mode).forEach((f, i) => {
        if(f.w && f.grams) text += `Farina ${i+1}: W${f.w} (${f.grams}g)\n`;
    });
    text += `\n📊 *Risultato Mix:* W ${resultW}`;
    text += `\n⚖️ *Peso Totale:* ${totalGrams}g`;
    if (analysis) {
        text += `\n🏷️ *Categoria:* ${analysis.category}`;
        text += `\n💧 *Idratazione:* ${analysis.hydrationMin}-${analysis.hydrationMax}%`;
    }
    text += `\n\n_Calcolato con Laboratorio Pizza_`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mix Farine - Laboratorio Pizza',
          text: text,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Risultati copiati negli appunti! Puoi incollarli su WhatsApp.");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 fixed no-print">
        <img 
            src="https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=2069&auto=format&fit=crop" 
            alt="Pizza Dough Background" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-amber-100/50 ring-1 ring-black/5 min-h-[600px]">
          
          <Logo />

          {/* Tab Navigation */}
          <div className="flex p-1 bg-stone-100 rounded-xl mb-8 border border-stone-200 shadow-inner no-print">
            <button
              onClick={() => setActiveTab('mix')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                activeTab === 'mix'
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Miscela & Forza (W)
            </button>
            <button
              onClick={() => setActiveTab('pizza')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                activeTab === 'pizza'
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Ricetta Impasto
            </button>
          </div>

          {/* CONTENT SWITCHER */}
          {activeTab === 'mix' ? (
            /* --- MIX CALCULATOR VIEW --- */
            <div className="animate-fade-in space-y-6">
              
              {/* Header with Tools */}
              <div className="flex flex-col sm:flex-row justify-between items-center px-1 gap-2">
                  <h2 className="text-stone-500 text-xs font-bold uppercase tracking-widest self-start sm:self-center">Configurazione Mix</h2>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    
                    {/* PDF Button */}
                    <button 
                      onClick={handlePdf}
                      className="text-[10px] sm:text-xs flex items-center gap-1 text-red-600 hover:text-red-800 font-bold transition-colors bg-white px-2 py-1.5 rounded-lg shadow-sm border border-red-100 no-print hover:bg-red-50"
                      title="Salva come PDF"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      PDF
                    </button>

                    {/* Print Button */}
                    <button 
                      onClick={handlePrint}
                      className="text-[10px] sm:text-xs flex items-center gap-1 text-stone-600 hover:text-stone-800 font-bold transition-colors bg-white px-2 py-1.5 rounded-lg shadow-sm border border-stone-200 no-print hover:bg-stone-50"
                      title="Stampa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                      </svg>
                      Stampa
                    </button>

                     {/* Share Button */}
                    <button 
                      onClick={handleShare}
                      className="text-[10px] sm:text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold transition-colors bg-white px-2 py-1.5 rounded-lg shadow-sm border border-blue-100 no-print hover:bg-blue-50"
                      title="Condividi"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.287 1.093 0 .397-.107.769-.287 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      Condividi
                    </button>

                    {/* Reset Button */}
                    <button 
                      onClick={handleReset}
                      className="text-[10px] sm:text-xs flex items-center gap-1 text-stone-400 hover:text-red-500 font-bold transition-colors bg-white px-2 py-1.5 rounded-lg shadow-sm border border-stone-100 no-print"
                      title="Reset"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      
                    </button>
                  </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center bg-stone-50 p-2 rounded-xl border border-stone-200 shadow-inner no-print">
                <span className="text-stone-700 font-semibold pl-2 text-sm">Numero Farine:</span>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-stone-100">
                  <button onClick={() => setMode(2)} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${mode === 2 ? 'bg-amber-500 text-white' : 'text-stone-400'}`}>2</button>
                  <button onClick={() => setMode(3)} className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${mode === 3 ? 'bg-amber-500 text-white' : 'text-stone-400'}`}>3</button>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <FlourInputGroup index={0} data={flours[0]} onChange={handleInputChange} />
                <FlourInputGroup index={1} data={flours[1]} onChange={handleInputChange} />
                <div className={`transition-all duration-500 overflow-hidden ${mode === 3 ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <FlourInputGroup index={2} data={flours[2]} onChange={handleInputChange} />
                </div>
              </div>

              {/* Results */}
              <div className="mt-8 pt-8 border-t border-stone-200">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <h2 className="text-lg uppercase tracking-widest text-stone-500 font-semibold">W della miscela</h2>
                  <div className="relative group cursor-default w-full">
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 to-orange-200 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                      <div className="relative bg-white px-10 py-5 rounded-xl border border-amber-100 shadow-lg flex flex-col items-center justify-center">
                         <span className="text-5xl font-bold text-amber-600 font-serif tabular-nums">{resultW > 0 ? resultW : '---'}</span>
                         {analysis && <span className={`text-xs font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded text-white ${analysis.colorClass}`}>{analysis.category}</span>}
                      </div>
                  </div>
                  {/* W Meter */}
                  {analysis && (
                    <div className="w-full mt-4 px-1">
                      <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase mb-1">
                        <span>Debole</span><span>Media</span><span>Forte</span><span>Manitoba</span>
                      </div>
                      <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-500 to-purple-600 opacity-80"></div>
                        <div className="absolute top-0 bottom-0 w-1 bg-white border-x border-black/20 shadow-lg transition-all duration-700 ease-out z-10" style={{ left: `${analysis.wPercentage}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Card */}
                {analysis && (
                  <div className="mt-8 bg-stone-50 rounded-xl p-5 border border-stone-200 shadow-sm animate-fade-in">
                    <h3 className="text-stone-800 font-serif font-bold text-lg mb-4 flex items-center border-b border-stone-200 pb-2"><span className="text-2xl mr-2">👨‍🍳</span> L'Esperto consiglia:</h3>
                    <div className="space-y-5">
                       <div className="flex items-start">
                         <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.663-.658v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 00-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .646.428 1.13.877 1.181 1.055.12 2.112.181 3.169.181 2.946 0 5.86-1.613 7.636-4.227a1.436 1.436 0 00-.775-2.235A49.117 49.117 0 0015 8.169c-.198-1.47-.367-2.925-.505-4.364a.64.64 0 00-.245-.458z" /></svg></div>
                         <div className="flex-1"><p className="text-xs font-bold text-stone-500 uppercase">Idratazione Consigliata</p><div className="flex items-baseline space-x-2"><p className="text-stone-800 font-bold text-lg">{analysis.hydrationMin}% - {analysis.hydrationMax}%</p></div></div>
                       </div>
                       <div className="flex items-start">
                         <div className="bg-amber-100 p-2 rounded-lg mr-3 text-amber-700"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                         <div><p className="text-xs font-bold text-stone-500 uppercase">Maturazione Suggerita</p><p className="text-stone-800 font-medium">{analysis.fermentation}</p></div>
                       </div>
                       <div className="flex items-start pt-3 mt-3 border-t border-stone-200/60">
                         <div className="w-full flex justify-between items-center px-1"><span className="text-xs font-bold text-stone-500 uppercase">Peso Totale Mix</span><span className="text-amber-700 font-bold font-mono text-lg">{totalGrams} g</span></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* --- PIZZA CALCULATOR VIEW --- */
            <PizzaCalculator />
          )}

          {/* Footer */}
          <div className="mt-8 text-center space-y-1">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Powered by</div>
              <div className="text-sm text-stone-600 font-serif font-bold tracking-wide">LA CONFRATERNITA DELLA PIZZA</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;