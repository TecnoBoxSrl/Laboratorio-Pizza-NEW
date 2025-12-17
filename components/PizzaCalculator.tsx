import React, { useState, useMemo } from 'react';

const InputField = ({ label, value, setter, unit, min, max, subLabel }: any) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-black text-stone-500 uppercase tracking-tight">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        value={value} 
        onChange={e => setter(e.target.value === '' ? '' : parseFloat(e.target.value))} 
        className="w-full rounded-xl border-stone-200 py-3 pl-4 pr-10 text-[15px] font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white shadow-sm" 
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-stone-400 font-bold">{unit}</span>
    </div>
    {subLabel && <div className="text-right text-[9px] text-stone-300 font-bold tracking-tighter">{subLabel}</div>}
  </div>
);

const IngredientRow = ({ label, value, unit, subValue, subLabel, isBlack }: any) => {
  if (isBlack) {
    return (
      <div className="bg-[#1a1a1a] text-white p-5 rounded-2xl flex justify-between items-center shadow-lg my-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-stone-400 leading-none mb-1">Farina Consigliata</span>
          <span className="text-xl font-extrabold text-amber-500 leading-none">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black font-mono tracking-tighter">{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center shadow-sm mb-3">
      <span className="text-stone-700 font-black text-[11px] uppercase tracking-tight">{label}</span>
      <div className="text-right flex items-baseline gap-2">
        <span className="font-mono font-black text-stone-800 text-2xl leading-none">{value}</span>
        <span className="text-[11px] text-stone-400 font-bold uppercase">{unit}</span>
        {subValue !== undefined && (
          <div className="ml-4 pl-4 border-l border-stone-100 text-left">
            <div className="text-[16px] font-black text-stone-800 leading-none">{subValue} <span className="text-[9px] text-stone-400">g</span></div>
            <div className="text-[8px] text-stone-400 font-bold uppercase leading-none mt-1">{subLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PizzaCalculator: React.FC = () => {
  const [isTeglia, setIsTeglia] = useState(false);
  const [numBalls, setNumBalls] = useState<number | string>(1);
  const [ballWeight, setBallWeight] = useState<number | string>(260);
  const [hydration, setHydration] = useState<number | string>(65);
  const [saltLit, setSaltLit] = useState<number | string>(50);
  const [fatLit, setFatLit] = useState<number | string>(0);
  const [pdrPercent, setPdrPercent] = useState<number | string>(0);
  const [hoursTotal, setHoursTotal] = useState<number | string>(24);
  const [hoursFridge, setHoursFridge] = useState<number | string>(0);
  const [tempRoom, setTempRoom] = useState<number | string>(20);
  const [pdrType, setPdrType] = useState<'stanca' | 'normale' | 'vivace'>('normale');

  const res = useMemo(() => {
    const _n = Number(numBalls) || 0, _w = Number(ballWeight) || 0, _h = Number(hydration) || 0;
    const totalWeight = _n * _w;
    
    // Ingredients relative to water/flour
    const hFactor = _h / 100;
    const sFactor = (Number(saltLit) / 1000) * hFactor;
    const fFactor = (Number(fatLit) / 1000) * hFactor;
    const pdrFactor = (Number(pdrPercent) / 100);

    // Total = Flour + Water + Salt + Fat + PDR (pdr is % of flour usually, or % of total? Verace says % of flour)
    // Actually common formula: Total = Flour * (1 + h + s + f + pdr)
    const flour = totalWeight / (1 + hFactor + sFactor + fFactor + pdrFactor);
    const water = flour * hFactor;
    const saltG = (water / 1000) * Number(saltLit);
    const yeast = (flour * 2250) / (Math.pow(1.096, Number(tempRoom)) * Math.max(Number(hoursTotal) - (Number(hoursFridge)*0.8), 1) * 1000);
    
    const prontoPer = new Date();
    prontoPer.setHours(prontoPer.getHours() + Number(hoursTotal));
    const formatDate = prontoPer.toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    let strength = "W 300 - 340";
    let cat = "Molto Forte";
    if (Number(hoursTotal) < 12) { strength = "W 180 - 220"; cat = "Debole"; }
    else if (Number(hoursTotal) < 18) { strength = "W 230 - 270"; cat = "Media"; }
    else if (Number(hoursTotal) > 36) { strength = "W 360+"; cat = "Estrapolita"; }

    return { 
      flour: Math.round(flour), 
      water: Math.round(water), 
      salt: Math.round(saltG), 
      yeast: Math.round(yeast * 100) / 100,
      dry: Math.round((yeast/3) * 100) / 100,
      strength,
      cat,
      prontoPer: formatDate
    };
  }, [numBalls, ballWeight, hydration, saltLit, fatLit, pdrPercent, hoursTotal, hoursFridge, tempRoom]);

  return (
    <div className="space-y-6">
      {/* Teglia Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center shadow-sm no-print">
        <span className="text-[12px] font-black text-stone-700 uppercase">Calcolatore Teglia</span>
        <button 
          onClick={() => setIsTeglia(!isTeglia)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isTeglia ? 'bg-amber-500' : 'bg-stone-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTeglia ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 no-print">
        <InputField label="Numero Panielli" value={numBalls} setter={setNumBalls} unit="pz" />
        <InputField label="Peso Paniello" value={ballWeight} setter={setBallWeight} unit="g" />
        <InputField label="Idratazione" value={hydration} setter={setHydration} unit="%" subLabel="50 - 100" />
        <InputField label="Sale (Su Litro)" value={saltLit} setter={setSaltLit} unit="g/L" subLabel="0 - 70" />
        <InputField label="Olio/Grassi (Su Litro)" value={fatLit} setter={setFatLit} unit="g/L" subLabel="0 - 150" />
        <InputField label="Pasta di riporto" value={pdrPercent} setter={setPdrPercent} unit="%" subLabel="0 - 83.06" />
        <InputField label="Lievitazione Totale" value={hoursTotal} setter={setHoursTotal} unit="h" subLabel="3 - 96" />
        {/* Fixed duplicate label attribute by keeping only the descriptive one */}
        <InputField label="...di cui frigo" value={hoursFridge} setter={setHoursFridge} unit="h" subLabel="0 - 24" />
        <div className="col-span-2">
          <InputField label="Temperatura Ambiente" value={tempRoom} setter={setTempRoom} unit="°C" subLabel="15 - 35" />
        </div>
      </div>

      {/* Tipologia Pasta di Riporto */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm no-print">
        <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-tight mb-4 text-center">Tipologia Pasta di Riporto</h3>
        <div className="flex bg-stone-50 p-1.5 rounded-xl gap-1">
          {['stanca', 'normale', 'vivace'].map((type) => (
            <button
              key={type}
              onClick={() => setPdrType(type as any)}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${pdrType === type ? 'bg-amber-500 text-white shadow-md' : 'text-stone-300'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[10px] font-black text-stone-700 uppercase tracking-tighter">Ricetta Calcolata</h3>
          <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-[9px] font-black uppercase">Pronto per: {res.prontoPer}</span>
        </div>

        <IngredientRow label={res.cat} value={res.strength} isBlack />
        
        <div className="space-y-3">
          <IngredientRow label="Farina" value={res.flour} unit="g" />
          <IngredientRow label="Acqua" value={res.water} unit="g" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <IngredientRow label="Sale" value={res.salt} unit="g" />
            <IngredientRow 
              label="Lievito Fresco" 
              value={res.yeast} 
              unit="g" 
              subValue={res.dry} 
              subLabel="o secco" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
