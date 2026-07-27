import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Settings, Sliders, Shield, Sun, CloudRain, CloudLightning, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { weatherSim, setWeatherSim } = useSalon();
  const [leadTimeWeight, setLeadTimeWeight] = useState(20);
  const [noShowWeight, setNoShowWeight] = useState(45);
  const [channelWeight, setChannelWeight] = useState(16);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="obsidian-card">
        <h2 className="text-xl font-extrabold flex items-center gap-2 mb-1">
          <Settings className="text-electric" size={20} /> Salon & Heuristic Model Settings
        </h2>
        <p className="text-xs text-secondary">
          Configure single-tenant business parameters, weather forecast signal integration, and scoring heuristic weights.
        </p>
      </div>

      <div className="obsidian-card space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 border-b border-subtle pb-2">
          <Sliders size={16} className="text-electric" /> Signal Weight Calibration (Explainable ML Engine)
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-secondary flex justify-between">
              <span>Historical No-Show Rate Impact Weight</span>
              <span className="text-electric">{noShowWeight} pts max</span>
            </label>
            <input
              type="range"
              min="20"
              max="60"
              value={noShowWeight}
              onChange={e => setNoShowWeight(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label className="font-bold text-secondary flex justify-between">
              <span>Lead Time (&gt; 14 Days) Impact Weight</span>
              <span className="text-electric">{leadTimeWeight} pts max</span>
            </label>
            <input
              type="range"
              min="5"
              max="35"
              value={leadTimeWeight}
              onChange={e => setLeadTimeWeight(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label className="font-bold text-secondary flex justify-between">
              <span>3rd-Party Channel Penalty Weight</span>
              <span className="text-electric">{channelWeight} pts max</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={channelWeight}
              onChange={e => setChannelWeight(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>

        <div className="pt-2">
          <button className="btn-electric" onClick={handleSave}>
            {savedSuccess ? <Check size={14} /> : null}
            {savedSuccess ? 'Weights Saved!' : 'Save Calibration Weights'}
          </button>
        </div>
      </div>

      <div className="obsidian-card space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2 border-b border-subtle pb-2">
          <Shield size={16} className="text-electric" /> Active Weather Signal Integration
        </h3>

        <p className="text-xs text-secondary">
          Simulate live API weather forecasts to test dynamic risk adjustments across all appointment bookings.
        </p>

        <div className="flex gap-3">
          <button
            className={`btn-obsidian ${weatherSim === 'Clear' ? 'border-accent text-electric' : ''}`}
            onClick={() => setWeatherSim('Clear')}
          >
            <Sun size={15} /> Clear Sky (Baseline)
          </button>
          <button
            className={`btn-obsidian ${weatherSim === 'Rain' ? 'border-accent text-electric' : ''}`}
            onClick={() => setWeatherSim('Rain')}
          >
            <CloudRain size={15} /> Rain (+10 Pts)
          </button>
          <button
            className={`btn-obsidian ${weatherSim === 'Thunderstorm' ? 'border-accent text-electric' : ''}`}
            onClick={() => setWeatherSim('Thunderstorm')}
          >
            <CloudLightning size={15} /> Thunderstorm (+20 Pts)
          </button>
        </div>
      </div>
    </div>
  );
};
