import React from 'react';
import { useCallContext, ToastMessage } from '../../context/CallContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCallContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-500/60',
          bg: 'bg-emerald-950/90 text-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
      case 'warning':
        return {
          border: 'border-amber-500/60',
          bg: 'bg-amber-950/90 text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      case 'critical':
        return {
          border: 'border-rose-500/60',
          bg: 'bg-rose-950/90 text-rose-200',
          icon: <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />,
        };
      default:
        return {
          border: 'border-cyan-500/60',
          bg: 'bg-console-900/95 text-cyan-200',
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-xl border ${style.border} ${style.bg} backdrop-blur-md shadow-2xl flex items-start justify-between gap-3 transition-all duration-300 animate-slide-in`}
    >
      <div className="flex items-start gap-2.5">
        {style.icon}
        <div>
          <div className="font-semibold text-xs leading-tight text-white flex items-center gap-2">
            <span>{toast.title}</span>
            <span className="text-[10px] opacity-60 font-mono">{toast.timestamp}</span>
          </div>
          <p className="text-[11px] mt-1 text-slate-300 leading-snug">{toast.description}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
