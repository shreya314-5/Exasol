import React from 'react';
import { RiskBand } from '../../types';
import { getBandColor } from '../../services/riskEngine';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  band: RiskBand;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  band,
  score,
  showIcon = true,
  size = 'md',
}) => {
  const colors = getBandColor(band);

  const getIcon = () => {
    switch (band) {
      case 'LOW':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'HIGH':
        return <AlertOctagon className="w-3.5 h-3.5" />;
      case 'CRITICAL':
        return <Flame className="w-3.5 h-3.5 animate-pulse" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-medium border ${colors.bg} ${colors.text} ${colors.border} ${colors.glow} ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      <span>{band}</span>
      {score !== undefined && (
        <span className="opacity-90 font-bold ml-0.5">({score})</span>
      )}
    </span>
  );
};
