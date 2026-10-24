import React from 'react';
import { RiskBand } from '../../types';
import { getBandColor } from '../../services/riskEngine';

interface RiskGaugeProps {
  score: number;
  band: RiskBand;
  confidence: number;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  band,
  confidence,
  size = 220,
}) => {
  const colors = getBandColor(band);

  // SVG parameters
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  
  // 240-degree arc from 150 deg to 390 deg (-30 deg)
  const startAngle = 150;
  const totalAngle = 240;
  const currentAngle = startAngle + (Math.min(100, Math.max(0, score)) / 100) * totalAngle;

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(cx, cy, r, end);
    const endPoint = polarToCartesian(cx, cy, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return [
      'M', startPoint.x, startPoint.y,
      'A', r, r, 0, largeArcFlag, 0, endPoint.x, endPoint.y,
    ].join(' ');
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, startAngle + totalAngle);
  const activeArc = describeArc(center, center, radius, startAngle, Math.max(startAngle + 0.5, currentAngle));

  // Needle tip coordinate
  const needleRadius = radius - 8;
  const needlePoint = polarToCartesian(center, center, needleRadius, currentAngle);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <defs>
            {/* Gradients */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="30%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="#1C2E52"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* Active Gradient Arc */}
          <path
            d={activeArc}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glowEffect)"
            className="transition-all duration-700 ease-out"
          />

          {/* Needle / Value dot indicator */}
          <circle
            cx={needlePoint.x}
            cy={needlePoint.y}
            r={strokeWidth * 0.55}
            fill="#FFFFFF"
            stroke={colors.hex}
            strokeWidth={3}
            className="transition-all duration-700 ease-out filter drop-shadow(0 0 8px rgba(255,255,255,0.8))"
          />

          {/* Band threshold ticks & labels */}
          {[
            { angle: 150, label: '0' },
            { angle: 150 + totalAngle * 0.3, label: '30' },
            { angle: 150 + totalAngle * 0.6, label: '60' },
            { angle: 150 + totalAngle * 0.8, label: '80' },
            { angle: 150 + totalAngle, label: '100' },
          ].map((tick, i) => {
            const inner = polarToCartesian(center, center, radius - 16, tick.angle);
            return (
              <text
                key={i}
                x={inner.x}
                y={inner.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-mono fill-slate-400 font-semibold"
              >
                {tick.label}
              </text>
            );
          })}
        </svg>

        {/* Center Digital Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 pointer-events-none">
          <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-0.5">
            Voice Risk Index
          </div>
          <div
            className="text-5xl font-black font-mono tracking-tight transition-colors duration-500"
            style={{ color: colors.hex, textShadow: `0 0 20px ${colors.hex}50` }}
          >
            {score}
            <span className="text-xl font-normal text-slate-400">/100</span>
          </div>

          <div
            className={`mt-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {band} RISK
          </div>

          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Confidence: <span className="text-cyan-400 font-semibold">{(confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Legend below gauge */}
      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-1">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          &lt;30 Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          30-60 Med
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
          60-80 High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
          &gt;80 Crit
        </span>
      </div>
    </div>
  );
};
