import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { TrendingUp, Clock } from 'lucide-react';
import { getRiskBand } from '../../services/riskEngine';

export const RiskTimelineChart: React.FC = () => {
  const { selectedCall } = useCallContext();
  const [hoveredPoint, setHoveredPoint] = useState<{ time: number; score: number } | null>(null);

  const history = selectedCall.history.slice(-24); // Show last 24 checkpoints
  const width = 640;
  const height = 130;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scale functions
  const getY = (score: number) => {
    return padding.top + plotHeight - (score / 100) * plotHeight;
  };

  const getX = (index: number, total: number) => {
    if (total <= 1) return padding.left;
    return padding.left + (index / (total - 1)) * plotWidth;
  };

  // Build SVG path
  let pathD = '';
  let areaD = '';

  if (history.length > 0) {
    history.forEach((point, i) => {
      const x = getX(i, history.length);
      const y = getY(point.score);
      if (i === 0) {
        pathD += `M ${x} ${y}`;
        areaD += `M ${x} ${getY(0)} L ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      }
    });

    const lastX = getX(history.length - 1, history.length);
    areaD += ` L ${lastX} ${getY(0)} Z`;
  }

  const isCritical = selectedCall.currentRiskScore >= 80;
  const strokeColor = isCritical ? '#EF4444' : selectedCall.currentRiskScore >= 60 ? '#F97316' : selectedCall.currentRiskScore >= 30 ? '#F59E0B' : '#10B981';

  return (
    <div className="bg-console-900 rounded-2xl border border-console-800 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Call Risk Timeline (Rolling Trajectory)
          </h4>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          {hoveredPoint ? (
            <span className="text-cyan-300 font-bold">
              t={hoveredPoint.time}s: Risk {hoveredPoint.score}/100 ({getRiskBand(hoveredPoint.score)})
            </span>
          ) : (
            <span>Current: <strong className="text-white">{selectedCall.currentRiskScore}</strong>/100</span>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[120px] overflow-visible select-none"
        >
          <defs>
            <linearGradient id="riskAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Threshold Lines */}
          {[
            { score: 30, color: '#10B981', label: '30 Low' },
            { score: 60, color: '#F59E0B', label: '60 Med' },
            { score: 80, color: '#EF4444', label: '80 Crit' },
          ].map((t) => {
            const y = getY(t.score);
            return (
              <g key={t.score}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={t.color}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-slate-500"
                >
                  {t.score}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaD && (
            <path d={areaD} fill="url(#riskAreaGrad)" className="transition-all duration-300" />
          )}

          {/* Main Trajectory Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 filter drop-shadow(0 0 4px rgba(255,255,255,0.2))"
            />
          )}

          {/* Data Points */}
          {history.map((pt, i) => {
            const cx = getX(i, history.length);
            const cy = getY(pt.score);
            const isLast = i === history.length - 1;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isLast ? 4.5 : 2.5}
                  fill={isLast ? '#FFFFFF' : strokeColor}
                  stroke={strokeColor}
                  strokeWidth={isLast ? 2 : 1}
                  className="cursor-pointer transition-all hover:r-5"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {isLast && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={1.5}
                    className="animate-ping opacity-75"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
