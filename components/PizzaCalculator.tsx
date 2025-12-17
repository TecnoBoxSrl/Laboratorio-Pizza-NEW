import React, { useState, useMemo, useEffect } from 'react';

const InputField = ({ label, value, setter, unit, min, max, step = 1 }: any) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-bold text-stone-500 uppercase">{label}</label>
    <div className="relative">
      <input type="number" value={value} onChange={e => setter(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full rounded-lg border-stone-300 py-2 pl-3 pr-8 text-sm font-bold focus:ring-amber-500" />
      <span className="absolute right-2 top-2 text-[10px] text-stone-400 font-bold">{unit}</span>
    </div>
  </div>
);

const ResultRow = ({ label, value, unit, color, highlight, subValue, subLabel }: any) => (
  <div className={`${color} p-3 rounded-xl border border-stone-100 flex justify-between items-center`}>
    <div className="flex flex-col"><span className="text-stone-600 font-bold text-[10px] uppercase">{label}</span>{subLabel && <span className="text-[8px] text-stone-400 font-medium">{subLabel}</span>}</div>
    <div className="text-right"><span className={`font-mono font-bold text-stone-800 ${highlight ? 'text-amber-600' : ''} text-lg`}>{value} <span className="text-[10px] text-stone-400">{unit}</span></span>{subValue && <div className="text-[9px] text-stone-500 font-mono">o {subValue}g secco</div>}</div>
  </div>
);

export const PizzaCalculator: React.FC = () => {
  const [numBalls, setNumBalls] = useState<number | string>(1);
  const [ballWeight, setBallWeight] = useState<number | string>(260);
  const [hydration, setHydration] = useState<number | string>(65);
  const [saltPerLiter, setSaltPerLiter] = useState<number | string>(50);
  const [hoursTotal, setHoursTotal] = useState<number | string>(24);
  const [hoursFridge, setHoursFridge] = useState<number | string>(0);
  const [tempRoom, setTempRoom] = useState<number | string>(20);
  const [fatPerLiter, setFatPerLiter] = useState<number | string>(0);
  const [pdrPercent, setPdrPercent] = useState<number | string>(0);
  const [isTeglia, setIsTeglia] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const results = useMemo(() => {
    const _num = Number(numBalls) || 0;
    const _weight = Number(ballWeight) || 0;
    const _hyd = Number(hydration) || 0;
    const total = _num * _weight;
    const hFactor = _hyd / 100;
    const sFactor = (Number(saltPerLiter) / 1000) * hFactor;
    const fFactor = (Number(fatPerLiter) / 1000) * hFactor;
    const flour = total / (1 + hFactor + sFactor + fFactor);
    const water = flour * hFactor;
    const salt = (water / 1000) * Number(saltPerLiter);
    const fat = (water / 1000) * Number(fatPerLiter);
    const yeast = (flour * 2250) / (Math.pow(1.096, Number(tempRoom)) * (Number(hoursTotal) - Number(hoursFridge)/12) * 1000);
    
    let wRange = "W 260-300";
    if (Number(hoursTotal) < 12) wRange = "W 180-220";
    else if (Number(hoursTotal) > 48) wRange = "W 350+";

    return { flour: Math.round(flour), water: Math.round(water), salt: Math.round(salt * 10) / 10, fat: Math.round(fat), yeast: Math.round(yeast * 100) / 100, dryYeast: Math.round((yeast/3)*100)/100, wRange };
  }, [numBalls, ballWeight, hydration, saltPerLiter, hoursTotal, hoursFridge, tempRoom, fatPerLiter]);

  const handlePdf = () => {
    const element = document.getElementById('main-card');
    // @ts-ignore
    html2pdf().from(element).set({ margin: 10, filename: 'Ricetta_Pizza.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).save();
  };

  const shareWhatsApp = () => {
    const text = `🍕 *Ricetta Pizza*\n🌾 Farina: ${results.flour}g\n🚰 Acqua: ${results.water}g\n🦠 Lievito: ${results.yeast}g\n🧂 Sale: ${results.salt}g\n💪 Forza: ${results.wRange}\n_Creato con Laboratorio Pizza_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTelegram = () => {
    const text = `🍕 *Ricetta Pizza*\n🌾 Farina: ${results.flour}g\n🚰 Acqua: ${results.water}g\n🦠 Lievito: ${results.yeast}g\n🧂 Sale: ${results.salt}g\n💪 Forza: ${results.wRange}`;
    window.open(`https://t.me/share/url?url=https://laboratoriopizza.it&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Strumenti Ricetta</h2>
        <div className="flex gap-2">
          <button onClick={handlePdf} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100" title="Salva PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-100"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg></button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-stone-100 z-50 overflow-hidden">
                <button onClick={shareWhatsApp} className="w-full px-4 py-3 text-left text-sm font-bold text-green-600 hover:bg-green-50 flex items-center gap-3 border-b border-stone-50"><span>WhatsApp</span></button>
                <button onClick={shareTelegram} className="w-full px-4 py-3 text-left text-sm font-bold text-sky-600 hover:bg-sky-50 flex items-center gap-3 border-b border-stone-50"><span>Telegram</span></button>
              </div>
            )}
          </div>
          <button onClick={() => window.print()} className="p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 no-print">
        <InputField label="Num. Panielli" value={numBalls} setter={setNumBalls} unit="pz" />
        <InputField label="Peso Paniello" value={ballWeight} setter={setBallWeight} unit="g" />
        <InputField label="Idratazione" value={hydration} setter={setHydration} unit="%" />
        <InputField label="Sale" value={saltPerLiter} setter={setSaltPerLiter} unit="g/L" />
        <InputField label="Tempo Totale" value={hoursTotal} setter={setHoursTotal} unit="h" />
        <InputField label="Temp. Ambiente" value={tempRoom} setter={setTempRoom} unit="°C" />
      </div>

      <div className="pt-4 border-t border-stone-100 space-y-2">
        <div className="bg-stone-800 text-white p-3 rounded-xl flex justify-between items-center shadow-md">
          <span className="text-[10px] font-bold uppercase text-stone-400">Farina Suggerita</span>
          <span className="text-sm font-black text-amber-400 font-mono">{results.wRange}</span>
        </div>
        <ResultRow label="Farina" value={results.flour} unit="g" color="bg-white" />
        <ResultRow label="Acqua" value={results.water} unit="g" color="bg-blue-50" />
        <div className="grid grid-cols-2 gap-2">
          <ResultRow label="Sale" value={results.salt} unit="g" color="bg-white" />
          <ResultRow label="Lievito" value={results.yeast} subValue={results.dryYeast} unit="g" color="bg-amber-50" highlight />
        </div>
      </div>
    </div>
  );
};