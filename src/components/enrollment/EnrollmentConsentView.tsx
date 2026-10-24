import React, { useState, useEffect } from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  Fingerprint, 
  Mic, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Cpu, 
  AlertCircle 
} from 'lucide-react';

export const EnrollmentConsentView: React.FC = () => {
  const { enrollments, addEnrollment, deleteEnrollment, addToast } = useCallContext();

  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [targetName, setTargetName] = useState('Dr. Ananya Sen');
  const [targetRole, setTargetRole] = useState('Chief Technology Officer');
  const [targetDept, setTargetDept] = useState('Executive Board');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [deletionReceiptModal, setDeletionReceiptModal] = useState<{
    id: string;
    userName: string;
    timestamp: string;
    receiptHash: string;
  } | null>(null);

  // Script text to read
  const consentScript =
    "I hereby authorize VoiceShield AI to compute an irreversible, non-reconstructible 512-dimensional acoustic biometric embedding for fraud prevention under the Digital Personal Data Protection (DPDP) Act 2023. I understand that my raw audio will be permanently destroyed immediately upon vector extraction.";

  // Recording timer simulation
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordProgress((prev) => {
          if (prev >= 100) {
            setIsRecording(false);
            // Commit new voiceprint
            const randomSample = Array.from({ length: 16 }, () => Number((Math.random() * 2 - 1).toFixed(2)));
            const randomHash = 'sha256:' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

            addEnrollment({
              userId: `USR-${Date.now().toString().slice(-4)}`,
              userName: targetName,
              userRole: targetRole,
              department: targetDept,
              enrolledAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              vectorLength: 512,
              embeddingHash: randomHash,
              sampleFeatures: randomSample,
              consentSignedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              consentId: `CONSENT-DPDP-${Math.floor(1000 + Math.random() * 9000)}`,
            });
            return 0;
          }
          return prev + 10;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isRecording, targetName, targetRole, targetDept, addEnrollment]);

  const handleStartRecording = () => {
    if (!consentAcknowledged) {
      addToast({
        title: 'Consent Signature Required',
        description: 'Please accept the DPDP biometric consent declaration before speaking.',
        type: 'warning',
      });
      return;
    }
    setRecordProgress(0);
    setIsRecording(true);
  };

  const handleDeleteWithReceipt = (id: string, userName: string) => {
    deleteEnrollment(id);
    const receiptHash = 'sha256:purge_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setDeletionReceiptModal({
      id,
      userName,
      timestamp: new Date().toISOString(),
      receiptHash,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              ZERO RAW AUDIO PERSISTENCE
            </span>
            <h2 className="text-base font-bold text-white">Biometric Enrolment & Consent Portal</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enrol verified voiceprints for CXOs and high-value signatories. Encrypted as irreversible 512-d mathematical embeddings; raw audio is wiped instantly.
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>Aligned with DPDP Act 2023 § 6 & § 12</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recording Studio & Consent Agreement (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          <div className="bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Voiceprint Acquisition Protocol</span>
            </h3>

            {/* Target details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono block mb-1">User Full Name</label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full bg-console-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-mono block mb-1">Corporate Designation</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-console-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Prominent Consent Script to Read */}
            <div className="p-4 rounded-xl bg-console-950 border border-cyan-800/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold">
                <span>Please Read Verbatim for Enrolment:</span>
                <span>~15 seconds</span>
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed border-l-2 border-cyan-500 pl-3">
                "{consentScript}"
              </p>
            </div>

            {/* Explicit DPDP Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer p-2.5 rounded-xl bg-console-950 border border-slate-800">
              <input
                type="checkbox"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="accent-cyan-400 rounded mt-0.5"
              />
              <span className="leading-snug">
                I formally confirm explicit DPDP / GDPR consent for irreversible voice embedding generation. I acknowledge zero audio recording storage.
              </span>
            </label>

            {/* Recording Action Button & Progress */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`w-full py-3 rounded-xl font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/25'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? `Extracting Features... ${recordProgress}%` : 'Record & Extract Voiceprint'}</span>
              </button>

              {isRecording && (
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${recordProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/60">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Cryptographic Guarantee: Voice cannot be synthesized back from 512-d float vectors.</span>
            </div>

          </div>

        </div>

        {/* Right: Enrolled Voiceprints & Irreversible Embeddings (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Active Enrolled Biometric Vectors ({enrollments.length})
              </h3>
              <span className="text-xs font-mono text-cyan-400">Stored as float32[512]</span>
            </div>

            <div className="space-y-3">
              {enrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="p-4 rounded-xl bg-console-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{enr.userName}</h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {enr.userRole} • {enr.department}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteWithReceipt(enr.id, enr.userName)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[10px] font-mono transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      <span>Purge Vector</span>
                    </button>
                  </div>

                  {/* Hash and dimensions */}
                  <div className="text-[10px] font-mono bg-black/60 p-2 rounded-lg text-slate-400 space-y-0.5 truncate">
                    <div>Ref ID: <span className="text-cyan-300">{enr.id}</span></div>
                    <div>Embedding Hash: <span className="text-slate-300">{enr.embeddingHash}</span></div>
                    <div>Vector: 512-dim float32 normalized • DPDP Compliant: YES</div>
                  </div>

                  {/* Sample 16-D Feature Vector Bar Heatmap */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">
                      Feature Vector Heatmap Sample (Normalized):
                    </span>
                    <div className="grid grid-cols-16 gap-1 h-4">
                      {enr.sampleFeatures.map((val, idx) => {
                        const intensity = Math.abs(val);
                        const isPos = val >= 0;
                        return (
                          <div
                            key={idx}
                            title={`Dim ${idx}: ${val}`}
                            className={`rounded-sm transition-all ${
                              isPos ? 'bg-cyan-400' : 'bg-purple-500'
                            }`}
                            style={{ opacity: Math.max(0.2, intensity) }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                    <span>Enrolled: {enr.enrolledAt}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <FileCheck className="w-3 h-3" /> {enr.consentId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* DPDP Deletion Receipt Modal */}
      {deletionReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-console-900 border-2 border-cyan-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white font-mono">
                Certified DPDP Deletion Receipt
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pursuant to Section 12 (Right to Correction and Erasure) of the Digital Personal Data Protection Act 2023, the biometric vector for <strong>{deletionReceiptModal.userName}</strong> has been irrevocably zeroed out and purged from memory.
            </p>

            <div className="p-3 bg-console-950 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
              <div>Vector ID: <strong className="text-white">{deletionReceiptModal.id}</strong></div>
              <div>Purge Timestamp: {deletionReceiptModal.timestamp}</div>
              <div>Cryptographic Receipt: <span className="text-cyan-300 truncate block">{deletionReceiptModal.receiptHash}</span></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDeletionReceiptModal(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
