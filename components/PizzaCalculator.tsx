import React, { useState, useMemo, useEffect } from 'react';

// --- COMPONENTS MOVED OUTSIDE TO PREVENT RE-RENDER FOCUS LOSS ---

const InputField = ({ label, value, setter, unit, min, max, step = 1, disabled = false }: any) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setter(''); 
      return;
    }
    setter(parseFloat(val));
  };

  return (
    <div className={`space-y-1 ${disabled ? 'opacity-50' : ''}`}>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide truncate">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={(e) => {
             let val = parseFloat(e.target.value);
             if (!isNaN(val) && min !== undefined && val < min) setter(min);
             if (!isNaN(val) && max !== undefined && val > max) setter(max);
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="block w-full rounded-lg border-stone-300 py-2.5 pl-3 pr-10 text-stone-800 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white font-semibold placeholder-stone-300 transition-colors"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-stone-400 text-xs font-bold">{unit}</span>
        </div>
      </div>
      {(min !== undefined || max !== undefined) && (
        <div className="text-[10px] text-stone-400 text-right h-3">
           {min !== undefined && max !== undefined ? `${min} - ${max}` : ''}
        </div>
      )}
    </div>
  );
};

const ResultRow = ({ label, value, unit, color, small, highlight, subValue, subLabel }: any) => (
  <div className={`${color} ${small ? 'p-3' : 'p-4'} rounded-xl border border-stone-200/60 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.01]`}>
    <div className="flex flex-col">
        <span className={`text-stone-600 font-bold ${small ? 'text-xs' : 'text-sm'} uppercase`}>{label}</span>
        {subLabel && <span className="text-[10px] text-stone-400 font-medium">{subLabel}</span>}
    </div>
    <div className="text-right">
        <span className={`font-mono font-bold text-stone-800 ${highlight ? 'text-amber-600' : ''} ${small ? 'text-lg' : 'text-xl'}`}>
        {value} <span className="text-sm font-sans font-normal text-stone-400">{unit}</span>
        </span>
        {subValue && (
            <div className="text-xs text-stone-500 font-mono">
                o {subValue} <span className="text-[10px] font-sans">secco</span>
            </div>
        )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const PizzaCalculator: React.FC = () => {
  // Inputs
  const [numBalls, setNumBalls] = useState<number | string>(1);
  const [ballWeight, setBallWeight] = useState<number | string>(260);
  const [hydration, setHydration] = useState<number | string>(65); 
  const [saltPerLiter, setSaltPerLiter] = useState<number | string>(50);
  const [hoursTotal, setHoursTotal] = useState<number | string>(24);
  const [hoursFridge, setHoursFridge] = useState<number | string>(0);
  const [tempRoom, setTempRoom] = useState<number | string>(20);
  const [fatPerLiter, setFatPerLiter] = useState<number | string>(0); 
  const [pdrPercent, setPdrPercent] = useState<number | string>(0); 
  const [pdrType, setPdrType] = useState<'stanca' | 'normale' | 'vivace'>('normale');
  const [isTeglia, setIsTeglia] = useState(false);

  // Teglia Dimensions State
  const [panWidth, setPanWidth] = useState<number | string>(30);
  const [panLength, setPanLength] = useState<number | string>(40);

  // Calculate Teglia Weight
  useEffect(() => {
    if (isTeglia && typeof panWidth === 'number' && typeof panLength === 'number') {
        // Coefficiente 0.55/0.6 è ideale per teglia romana casalinga
        const area = panWidth * panLength;
        const idealWeight = Math.round(area * 0.55);
        setBallWeight(idealWeight);
    }
  }, [panWidth, panLength, isTeglia]);

  // RESET FUNCTION
  const handleReset = () => {
    setNumBalls(1);
    setBallWeight(250);
    setHydration(65);
    setSaltPerLiter(50);
    setHoursTotal(24);
    setHoursFridge(0);
    setTempRoom(20);
    setFatPerLiter(0);
    setPdrPercent(0);
    setPdrType('normale');
    setIsTeglia(false);
    setPanWidth(30);
    setPanLength(40);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Laboratorio_Pizza_Ricetta_Stampa`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  const handlePdf = () => {
    const originalTitle = document.title;
    const dateStr = new Date().toISOString().slice(0, 10);
    document.title = `Ricetta_Pizza_${dateStr}`; // Clean filename for PDF
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  // Calculation Logic
  const results = useMemo(() => {
    const _numBalls = typeof numBalls === 'string' ? 0 : numBalls;
    const _ballWeight = typeof ballWeight === 'string' ? 0 : ballWeight;
    const _hydration = typeof hydration === 'string' ? 50 : Math.max(50, Math.min(100, hydration));
    const _saltPerLiter = typeof saltPerLiter === 'string' ? 0 : Math.min(70, saltPerLiter);
    const _hoursTotal = typeof hoursTotal === 'string' ? 8 : Math.max(3, Math.min(96, hoursTotal));
    const _tempRoom = typeof tempRoom === 'string' ? 20 : Math.max(15, Math.min(35, tempRoom));
    const _fatPerLiter = typeof fatPerLiter === 'string' ? 0 : Math.min(150, fatPerLiter);
    const _pdrPercent = typeof pdrPercent === 'string' ? 0 : Math.min(83.06, pdrPercent);
    const _hoursFridge = typeof hoursFridge === 'string' ? 0 : hoursFridge;

    const totalDoughTarget = _numBalls * _ballWeight;
    const pdrWeight = (totalDoughTarget * _pdrPercent) / 100;
    const freshDoughNeeded = totalDoughTarget - pdrWeight;

    const hFactor = _hydration / 100;
    const sFactor = (_saltPerLiter / 1000) * hFactor;
    const fFactor = (_fatPerLiter / 1000) * hFactor;

    const flour = freshDoughNeeded / (1 + hFactor + sFactor + fFactor);
    const water = flour * hFactor;
    const salt = (water / 1000) * _saltPerLiter;
    const fat = (water / 1000) * _fatPerLiter;

    const validHoursFridge = Math.min(_hoursFridge, _hoursTotal);
    const hoursRoom = Math.max(0, _hoursTotal - validHoursFridge);
    
    let baseConst = 2250; 
    if (isTeglia) baseConst = 2600; 

    const tempFactor = Math.pow(1.096, _tempRoom);
    const effectiveTime = hoursRoom + (validHoursFridge / 12); 
    
    let yeast = 0;
    if (effectiveTime > 0) {
      yeast = (flour * baseConst) / (tempFactor * effectiveTime * 1000); 
    }
    
    if (_pdrPercent > 0) {
       let typeFactor = 1.0;
       if (pdrType === 'stanca') typeFactor = 0.6; 
       if (pdrType === 'vivace') typeFactor = 1.4; 
       const reduction = (_pdrPercent / 100) * typeFactor;
       yeast = yeast * (1 - Math.min(0.95, reduction));
    }

    if (yeast < 0.01 && yeast > 0) yeast = 0.01;

    // Expert Advice: Recommended W based on fermentation time
    let suggestedW = "";
    let wRange = "";
    if (_hoursTotal < 8) {
        suggestedW = "Debole/Media";
        wRange = "W 170 - 220";
    } else if (_hoursTotal < 16) {
        suggestedW = "Media";
        wRange = "W 220 - 260";
    } else if (_hoursTotal < 24) {
        suggestedW = "Forte";
        wRange = "W 260 - 300";
    } else if (_hoursTotal < 48) {
        suggestedW = "Molto Forte";
        wRange = "W 300 - 340";
    } else {
        suggestedW = "Manitoba";
        wRange = "W 350+";
    }

    // Ready At calculation
    const readyDate = new Date();
    readyDate.setHours(readyDate.getHours() + (_hoursTotal as number));
    const readyTimeStr = readyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const readyDayStr = readyDate.toLocaleDateString([], { weekday: 'short', day: 'numeric' });

    return {
      flour: Math.round(flour),
      water: Math.round(water),
      salt: Math.round(salt * 10) / 10, 
      fat: Math.round(fat),
      yeast: Math.round(yeast * 100) / 100,
      dryYeast: Math.round((yeast / 3) * 100) / 100,
      pdr: Math.round(pdrWeight),
      suggestedW,
      wRange,
      readyAt: `${readyDayStr}, ${readyTimeStr}`
    };
  }, [numBalls, ballWeight, hydration, saltPerLiter, hoursTotal, hoursFridge, tempRoom, fatPerLiter, pdrPercent, isTeglia, pdrType]);


  const handleShare = async () => {
    const isTegliaMode = isTeglia;
    let header = isTegliaMode 
        ? `🍕 *Ricetta Pizza in Teglia* (${panWidth}x${panLength}cm)`
        : `🍕 *Ricetta Pizza* (${numBalls} pan. da ${ballWeight}g)`;

    let text = `${header}\n\n`;
    text += `💧 Idratazione: ${hydration}%\n`;
    text += `🌡️ Temp. Ambiente: ${tempRoom}°C\n`;
    text += `⏳ Lievitazione: ${hoursTotal}h (${hoursFridge}h frigo)\n`;
    text += `──────────────────\n`;
    text += `🌾 Farina: ${results.flour}g\n`;
    text += `🚰 Acqua: ${results.water}g\n`;
    text += `🦠 Lievito Fresco: ${results.yeast}g (Secco: ${results.dryYeast}g)\n`;
    text += `🧂 Sale: ${results.salt}g\n`;
    if(results.fat > 0) text += `🫒 Grassi/Olio: ${results.fat}g\n`;
    if(results.pdr > 0) text += `👴 PDR: ${results.pdr}g\n`;
    text += `──────────────────\n`;
    text += `✅ Pronto per: ${results.readyAt}`;
    text += `\n\n_Calcolato con Laboratorio Pizza_`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ricetta Pizza - Laboratorio Pizza',
          text: text,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Ricetta copiata negli appunti! Puoi incollarla su WhatsApp.");
    }
  };


  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Header with Tools */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-1 gap-2">
          <h2 className="text-stone-500 text-xs font-bold uppercase tracking-widest self-start sm:self-center">Laboratorio Impasti</h2>
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

      {/* Settings Container */}
      <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        
        {/* Row 1: Production Target */}
        <div className="space-y-3">
             {/* Checkbox Teglia */}
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-stone-200 shadow-sm no-print">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-700">Calcolatore Teglia</span>
                    {isTeglia && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">ATTIVO</span>}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isTeglia} onChange={(e) => setIsTeglia(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
            </div>

            {/* Teglia Inputs OR Ball Inputs */}
            {isTeglia ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 animate-fade-in grid grid-cols-2 gap-4">
                     <div className="col-span-2 text-[10px] text-amber-600 font-bold uppercase tracking-wide text-center">Inserisci misure teglia (cm)</div>
                     <InputField label="Larghezza" value={panWidth} setter={setPanWidth} unit="cm" min={10} />
                     <InputField label="Lunghezza" value={panLength} setter={setPanLength} unit="cm" min={10} />
                     <div className="col-span-2 flex justify-between items-center border-t border-amber-200/50 pt-2 mt-1">
                        <span className="text-xs text-amber-700 font-semibold">Impasto Calcolato:</span>
                        <span className="text-sm font-bold text-amber-800">{ballWeight} g</span>
                     </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Numero Panielli" value={numBalls} setter={setNumBalls} unit="pz" min={1} />
                    <InputField label="Peso Paniello" value={ballWeight} setter={setBallWeight} unit="g" min={1} />
                </div>
            )}
        </div>

        {/* Row 2: Recipe Balance */}
        <div className="grid grid-cols-2 gap-4">
           <InputField label="Idratazione" value={hydration} setter={setHydration} unit="%" min={50} max={100} />
           <InputField label="Sale (su Litro)" value={saltPerLiter} setter={setSaltPerLiter} unit="g/L" min={0} max={70} />
        </div>

        {/* Row 3: Fat & PDR */}
        <div className="grid grid-cols-2 gap-4">
           <InputField label="Olio/Grassi (su Litro)" value={fatPerLiter} setter={setFatPerLiter} unit="g/L" min={0} max={150} />
           <InputField label="Pasta di Riporto" value={pdrPercent} setter={setPdrPercent} unit="%" min={0} max={83.06} step={0.1} />
        </div>

        {/* Row 4: Environment & Time */}
        <div className="border-t border-stone-200 pt-4">
             <div className="grid grid-cols-2 gap-4 mb-2">
                <InputField label="Lievitazione Totale" value={hoursTotal} setter={setHoursTotal} unit="h" min={3} max={96} step={0.5} />
                <InputField label="...di cui Frigo" value={hoursFridge} setter={setHoursFridge} unit="h" min={0} max={typeof hoursTotal === 'number' ? hoursTotal : 96} step={0.5} />
             </div>
             <div className="mt-2">
                <InputField label="Temperatura Ambiente" value={tempRoom} setter={setTempRoom} unit="°C" min={15} max={35} step={0.5} />
             </div>
        </div>

        {/* PDR TYPE SELECTOR (Always Visible now) */}
        <div className="pt-2 no-print">
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
             <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Tipologia Pasta di Riporto</label>
             <div className="flex bg-stone-100 rounded-lg p-1">
                {['stanca', 'normale', 'vivace'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setPdrType(t as any)}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${
                      pdrType === t 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="space-y-3">
        <div className="flex justify-between items-end mb-4 px-1">
           <h2 className="text-stone-500 text-xs font-bold uppercase tracking-widest">Ricetta Calcolata</h2>
           <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
             Pronto per: {results.readyAt}
           </span>
        </div>
        
        {/* Recommended Flour */}
        <div className="bg-stone-800 text-white p-4 rounded-xl shadow-lg border border-stone-700 mb-4 flex justify-between items-center">
             <div>
                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">Farina Consigliata</span>
                <span className="text-lg font-bold text-amber-400">{results.suggestedW}</span>
             </div>
             <div className="text-right">
                <span className="block text-2xl font-serif font-bold">{results.wRange}</span>
             </div>
        </div>

        <ResultRow label="Farina" value={results.flour} unit="g" color="bg-white" />
        <ResultRow label="Acqua" value={results.water} unit="g" color="bg-blue-50" />
        <div className="grid grid-cols-2 gap-3">
            <ResultRow label="Sale" value={results.salt} unit="g" color="bg-white" small />
            {/* Added Dry Yeast conversion display */}
            <ResultRow 
                label="Lievito Fresco" 
                subLabel="(o secco)"
                value={results.yeast} 
                subValue={results.dryYeast}
                unit="g" 
                color="bg-amber-50" 
                small 
                highlight 
            />
        </div>
        
        {results.fat > 0 && (
           <ResultRow label="Grassi" value={results.fat} unit="g" color="bg-yellow-50" />
        )}
        {results.pdr > 0 && (
           <ResultRow label="Pasta di Riporto" value={results.pdr} unit="g" color="bg-stone-100" />
        )}
      </div>

    </div>
  );
};