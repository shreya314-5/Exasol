import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Download, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';

export const PrivacyComplianceView: React.FC = () => {
  const { auditLogs, enrollments, addToast } = useCallContext();

  const [edgeInference, setEdgeInference] = useState(true);
  const [featureOnlyLogging, setFeatureOnlyLogging] = useState(true);
  const [zeroKnowledgeHashing, setZeroKnowledgeHashing] = useState(true);
  const [ephemeralMemory, setEphemeralMemory] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [searchLog, setSearchLog] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.callId.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.details.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchLog.toLowerCase())
  );

  const exportAuditCSV = () => {
    const headers = ['ID', 'Timestamp', 'Call ID', 'Event Type', 'Severity', 'Actor', 'Details', 'Evidence Hash'];
    const rows = auditLogs.map((l) => [
      l.id,
      l.timestamp,
      l.callId,
      l.eventType,
      l.severity,
      `"${l.actor}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.evidenceHash,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VoiceShield_DPDP_AuditLog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Log Exported',
      description: `Downloaded ${auditLogs.length} immutable records for regulatory compliance.`,
      type: 'success',
    });
  };

  const checklistItems = [
    {
      section: 'Section 6: Notice & Informed Consent',
      desc: 'Users receive explicit biometric consent notices prior to feature embedding computation. Raw audio streams are never archived.',
      status: 'VERIFIED & ACTIVE',
    },
    {
      section: 'Section 8: Purpose Limitation & Processing Obligations',
      desc: 'Embeddings are strictly utilized for real-time fraud mitigation during live transactions and excluded from general generative models.',
      status: 'VERIFIED & ACTIVE',
    },
    {
      section: 'Section 9: Processing of Sensitive Minor / Special Category Data',
      desc: 'Automatic biometric filter prevents unauthorized registration of minors under 18 years of age without legal guardian signoff.',
      status: 'VERIFIED & ACTIVE',
    },
    {
      section: 'Section 12: Right to Correction & Erasure (One-Click Purge)',
      desc: 'Data principals possess instantaneous right to revoke consent; voice vectors are cryptographically overwritten with certified receipt.',
      status: 'VERIFIED & ACTIVE',
    },
    {
      section: 'Section 13: Grievance Redressal & Data Protection Officer',
      desc: 'Nominated DPO (dpo@voiceshield.enterprise) with automated SLA resolution within 72 hours for subject access requests.',
      status: 'VERIFIED & ACTIVE',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800">
              REGULATORY COMPLIANCE
            </span>
            <h2 className="text-base font-bold text-white">Privacy & DPDP Act 2023 Compliance Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure privacy boundaries, cryptographic hashing, data retention policies, and inspect the immutable DPDP audit trail.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-console-950 hover:bg-console-800 border border-cyan-800/80 text-cyan-300 text-xs font-semibold font-mono transition-all"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Privacy Toggles & Retention Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Toggle 1: Edge Inference */}
        <div className="bg-console-900 p-4 rounded-2xl border border-console-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono">Edge / On-Device</span>
            <input
              type="checkbox"
              checked={edgeInference}
              onChange={(e) => setEdgeInference(e.target.checked)}
              className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Execute model inference directly at customer telephony edge SBC. Zero audio leaves private bank perimeter.
          </p>
          <span className="text-[10px] font-mono text-cyan-400 block pt-1">
            Status: {edgeInference ? 'Edge Intercept Active' : 'Cloud Fallback'}
          </span>
        </div>

        {/* Toggle 2: Feature-Only Logging */}
        <div className="bg-console-900 p-4 rounded-2xl border border-console-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono">Feature-Only Logging</span>
            <input
              type="checkbox"
              checked={featureOnlyLogging}
              onChange={(e) => setFeatureOnlyLogging(e.target.checked)}
              className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Store acoustic features (MFCCs / centroid statistics) only. Raw PCM audio packets are wiped instantly.
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block pt-1">
            Status: Audio Scrubbing Enforced
          </span>
        </div>

        {/* Toggle 3: Zero-Knowledge Biometric Hashing */}
        <div className="bg-console-900 p-4 rounded-2xl border border-console-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono">ZK Biometric Hash</span>
            <input
              type="checkbox"
              checked={zeroKnowledgeHashing}
              onChange={(e) => setZeroKnowledgeHashing(e.target.checked)}
              className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Salted irreversible SHA-256 / BLAKE3 commitments over acoustic embeddings to resist rainbow attacks.
          </p>
          <span className="text-[10px] font-mono text-cyan-400 block pt-1">
            Status: Non-reconstructible
          </span>
        </div>

        {/* Retention Slider */}
        <div className="bg-console-900 p-4 rounded-2xl border border-console-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono">Retention Period</span>
            <span className="text-xs font-mono font-bold text-cyan-300">{retentionDays} Days</span>
          </div>
          <input
            type="range"
            min="0"
            max="365"
            step="7"
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <p className="text-[10px] text-slate-400">
            {retentionDays === 0 ? 'Ephemeral 0-day instant purge' : `Automated purge schedule after ${retentionDays} days.`}
          </p>
        </div>

      </div>

      {/* Aligned with DPDP Act 2023 Checklist */}
      <div className="bg-console-900 p-5 rounded-2xl border border-console-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              Digital Personal Data Protection (DPDP) Act 2023 Compliance Checklist
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
            100% AUDIT ALIGNED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-console-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 font-mono">{item.section}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable DPDP Audit Trail Table */}
      <div className="bg-console-900 p-5 rounded-2xl border border-console-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Immutable DPDP Audit Trail ({auditLogs.length} Records)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically signed events for model evaluations, policy triggers, and biometric deletions.
            </p>
          </div>

          <input
            type="text"
            value={searchLog}
            onChange={(e) => setSearchLog(e.target.value)}
            placeholder="Search audit trail by actor, call ID, event..."
            className="bg-console-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-console-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Call / Subject ID</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Forensic Evidence Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-console-900/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-console-800/50 transition-colors">
                  <td className="py-2 px-3 text-cyan-400 font-bold">{log.id}</td>
                  <td className="py-2 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2 px-3 text-white font-bold">{log.callId}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-console-950 border border-slate-800 text-slate-200">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : log.severity === 'ALERT' || log.severity === 'WARNING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-300 truncate max-w-[140px]">{log.actor}</td>
                  <td className="py-2 px-3 text-slate-500 truncate max-w-[160px]" title={log.evidenceHash}>
                    {log.evidenceHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
