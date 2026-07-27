import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Sliders, Sun, CloudRain, CloudLightning, Check } from 'lucide-react';

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
    <div style={{ maxWidth: '800px' }}>
      <div className="clean-card">
        <div className="card-title">Salon Operations Settings</div>
        <div className="card-sub">Configure weather integration and scoring parameters.</div>
      </div>

      <div className="clean-card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
          <Sliders size={15} className="text-blue" /> Signal Weight Calibration
        </div>

        <div className="form-field">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Historical No-Show Impact Weight</span>
            <span className="text-blue">{noShowWeight} pts max</span>
          </label>
          <input
            type="range"
            min="20"
            max="60"
            value={noShowWeight}
            onChange={e => setNoShowWeight(Number(e.target.value))}
          />
        </div>

        <div className="form-field">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Lead Time (&gt; 14 Days) Weight</span>
            <span className="text-blue">{leadTimeWeight} pts max</span>
          </label>
          <input
            type="range"
            min="5"
            max="35"
            value={leadTimeWeight}
            onChange={e => setLeadTimeWeight(Number(e.target.value))}
          />
        </div>

        <div className="form-field">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>3rd-Party Channel Penalty</span>
            <span className="text-blue">{channelWeight} pts max</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={channelWeight}
            onChange={e => setChannelWeight(Number(e.target.value))}
          />
        </div>

        <button className="btn-blue" style={{ marginTop: '0.5rem' }} onClick={handleSave}>
          {savedSuccess ? <Check size={13} /> : null}
          {savedSuccess ? 'Saved Calibration!' : 'Save Calibration'}
        </button>
      </div>

      <div className="clean-card">
        <div className="card-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
          Weather Forecast Signal Simulation
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn-ghost ${weatherSim === 'Clear' ? 'border-accent text-blue' : ''}`}
            onClick={() => setWeatherSim('Clear')}
          >
            <Sun size={14} /> Clear (Baseline)
          </button>
          <button
            className={`btn-ghost ${weatherSim === 'Rain' ? 'border-accent text-blue' : ''}`}
            onClick={() => setWeatherSim('Rain')}
          >
            <CloudRain size={14} /> Rain (+10 Pts)
          </button>
          <button
            className={`btn-ghost ${weatherSim === 'Thunderstorm' ? 'border-accent text-blue' : ''}`}
            onClick={() => setWeatherSim('Thunderstorm')}
          >
            <CloudLightning size={14} /> Storm (+20 Pts)
          </button>
        </div>
      </div>
    </div>
  );
};
