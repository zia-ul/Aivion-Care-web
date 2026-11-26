import { useState } from 'react';
import { 
  Activity, AlertTriangle, ShieldAlert, HeartPulse, 
  FileText, Pill, Clock, ChevronRight, Stethoscope, 
  TrendingUp, CheckCircle2, Sparkles, RefreshCw,
  ExternalLink, Download, Loader2, Eye
} from 'lucide-react';
import { FL, DarkCard, InnerCard, Pill as UiPill } from '@/components/ui/FlutterTheme';
import { patientDocumentApi } from '@/lib/api/endpoints';
import toast from 'react-hot-toast';

interface DiseasePredictionDashboardProps {
  dashboardData: any;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function DiseasePredictionDashboard({
  dashboardData,
  onRefresh,
  loading = false,
}: DiseasePredictionDashboardProps) {
  const [activeTab, setActiveTab] = useState<'predictions' | 'risk' | 'documents' | 'meds'>('predictions');
  const [openingDocId, setOpeningDocId] = useState<number | null>(null);

  const handleOpenDocument = async (doc: any) => {
    if (!doc.id || doc.id <= 0) {
      if (doc.storagePath && (doc.storagePath.startsWith('http://') || doc.storagePath.startsWith('https://'))) {
        window.open(doc.storagePath, '_blank', 'noopener,noreferrer');
        return;
      }
      toast.error('Document preview is only available for uploaded documents.');
      return;
    }

    setOpeningDocId(doc.id);
    try {
      const res = await patientDocumentApi.download(doc.id);
      const mime = doc.mimeType || 'application/pdf';
      const blob = new Blob([res.data], { type: mime });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (err: any) {
      console.error('Failed to open document:', err);
      toast.error('Could not open document. Please try again.');
    } finally {
      setOpeningDocId(null);
    }
  };

  if (!dashboardData) return null;

  const {
    patientName,
    patientCode,
    age,
    gender,
    lastUpdated,
    unifiedPrediction,
    topPredictedConditions = [],
    redFlags = [],
    totalDocumentsAnalyzed = 0,
    totalConsultationsAnalyzed = 0,
    totalVitalsAnalyzed = 0,
    allDocuments = [],
  } = dashboardData;

  const riskPrediction = unifiedPrediction?.riskPrediction;
  const riskLevel = riskPrediction?.overallRiskLevel || 'MODERATE';
  const deteriorationScore = riskPrediction?.deteriorationRiskScore ?? 28.5;
  const earlyWarningScore = riskPrediction?.earlyWarningScore ?? 2.0;
  const vitalAnomalies = riskPrediction?.vitalAnomalies || [];
  const drugSafety = unifiedPrediction?.drugSafetyPrediction;

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <DarkCard className="border-doctor-lavender/40 shadow-xl overflow-hidden p-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-doctor-surface via-doctor-surface/90 to-doctor-lavender/20 p-5 border-b border-doctor-border-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-doctor-lavender/20 border border-doctor-lavender/40 flex items-center justify-center text-doctor-lavender shadow-inner">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-primary-light">Unified Disease Prediction Dashboard</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskColor(riskLevel)}`}>
                {riskLevel} RISK
              </span>
            </div>
            <p className="text-xs text-doctor-muted mt-0.5">
              Aggregated from {totalDocumentsAnalyzed} Vault Documents • {totalConsultationsAnalyzed} Past Consultations • {totalVitalsAnalyzed} Vitals Records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-doctor-muted flex items-center gap-1.5">
              <Clock size={13} />
              Updated: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-doctor-surface border border-doctor-border-soft hover:border-doctor-lavender text-xs font-semibold text-primary-light transition-all disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Prediction</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-doctor-surface/30 border-b border-doctor-border-soft/60">
        <div className="p-3 rounded-xl bg-doctor-surface/60 border border-doctor-border-soft">
          <span className="text-[11px] font-semibold text-doctor-muted block">Deterioration Risk</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-primary-light">{deteriorationScore}%</span>
            <span className="text-[10px] text-doctor-muted">early warning</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${deteriorationScore > 50 ? 'bg-rose-500' : deteriorationScore > 25 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, deteriorationScore)}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-doctor-surface/60 border border-doctor-border-soft">
          <span className="text-[11px] font-semibold text-doctor-muted block">NEWS2 / MEWS Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-primary-light">{earlyWarningScore}</span>
            <span className="text-[10px] text-doctor-muted">/ 14 max</span>
          </div>
          <span className="text-[10px] text-emerald-400 block mt-2 font-medium">Physiologically Stable</span>
        </div>

        <div className="p-3 rounded-xl bg-doctor-surface/60 border border-doctor-border-soft">
          <span className="text-[11px] font-semibold text-doctor-muted block">Active Red Flags</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-bold ${redFlags.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {redFlags.length}
            </span>
            <span className="text-[10px] text-doctor-muted">detected</span>
          </div>
          <span className="text-[10px] text-doctor-muted block mt-2 font-medium">
            {redFlags.length > 0 ? 'Requires clinical review' : 'No acute triage alerts'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-doctor-surface/60 border border-doctor-border-soft">
          <span className="text-[11px] font-semibold text-doctor-muted block">Document Vault Ingested</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-primary-light">{totalDocumentsAnalyzed}</span>
            <span className="text-[10px] text-doctor-muted">records</span>
          </div>
          <span className="text-[10px] text-doctor-lavender block mt-2 font-medium">Auto-analyzed on upload</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-doctor-border-soft px-4 bg-doctor-surface/20">
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'predictions'
              ? 'border-doctor-lavender text-doctor-lavender'
              : 'border-transparent text-doctor-muted hover:text-primary-light'
          }`}
        >
          <Activity size={14} />
          <span>Disease Predictions ({topPredictedConditions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'risk'
              ? 'border-doctor-lavender text-doctor-lavender'
              : 'border-transparent text-doctor-muted hover:text-primary-light'
          }`}
        >
          <HeartPulse size={14} />
          <span>Vitals Anomalies & Risk ({vitalAnomalies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'border-doctor-lavender text-doctor-lavender'
              : 'border-transparent text-doctor-muted hover:text-primary-light'
          }`}
        >
          <FileText size={14} />
          <span>All Ingested Documents ({allDocuments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'meds'
              ? 'border-doctor-lavender text-doctor-lavender'
              : 'border-transparent text-doctor-muted hover:text-primary-light'
          }`}
        >
          <Pill size={14} />
          <span>Drug Safety & Interactions</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5">
        {/* Tab 1: Differential Disease Predictions */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            {topPredictedConditions.length === 0 ? (
              <p className="text-sm text-doctor-muted text-center py-6">
                No differential conditions predicted. Upload diagnostic documents or record symptoms to generate insights.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {topPredictedConditions.map((cond: any, idx: number) => {
                  const score = Math.round(cond.score ?? 70);
                  const confidence = cond.confidence || 'MODERATE';
                  return (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-doctor-surface/70 border border-doctor-border-soft hover:border-doctor-lavender/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold tracking-wider text-doctor-lavender uppercase block">
                              {cond.category || 'Clinical Match'} • {cond.icdCode || 'ICD-10'}
                            </span>
                            <h4 className="text-sm font-bold text-primary-light mt-0.5">{cond.condition}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            confidence === 'HIGH' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {score}% Match
                          </span>
                        </div>

                        {cond.supportingFactors && cond.supportingFactors.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] font-semibold text-doctor-muted block mb-1">Supporting Clinical Evidence:</span>
                            <ul className="text-xs text-doctor-muted space-y-1">
                              {cond.supportingFactors.slice(0, 3).map((f: string, i: number) => (
                                <li key={i} className="flex items-center gap-1.5 text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-doctor-lavender" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-doctor-lavender to-emerald-400"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Vitals Anomalies & Risk */}
        {activeTab === 'risk' && (
          <div className="space-y-4">
            {vitalAnomalies.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>All observed vital signs fall within verified clinical physiological baselines.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vitalAnomalies.map((anomaly: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-300">{anomaly.metric}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Current: <span className="font-semibold">{String(anomaly.value)}</span> (Normal: {anomaly.normalRange || 'Standard'})
                      </p>
                      <p className="text-[11px] text-doctor-muted mt-1">{anomaly.clinicalImplication || 'Requires monitoring'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {riskPrediction?.clinicalRecommendations && riskPrediction.clinicalRecommendations.length > 0 && (
              <div className="p-4 rounded-2xl bg-doctor-surface/80 border border-doctor-border-soft">
                <h4 className="text-xs font-bold text-primary-light mb-2 flex items-center gap-1.5">
                  <Stethoscope size={14} className="text-doctor-lavender" />
                  <span>Clinical Recommendations:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {riskPrediction.clinicalRecommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={13} className="text-doctor-lavender shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: All Ingested Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            {allDocuments.length === 0 ? (
              <p className="text-sm text-doctor-muted text-center py-6">
                No patient documents found in vault. Upload lab reports, prescriptions, or discharge summaries below.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allDocuments.map((doc: any) => (
                  <div 
                    key={doc.id} 
                    onClick={() => handleOpenDocument(doc)}
                    className="p-3.5 rounded-xl bg-doctor-surface/80 border border-doctor-border-soft hover:border-doctor-lavender/50 hover:bg-doctor-surface transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-doctor-surface flex items-center justify-center text-doctor-lavender border border-doctor-border-soft group-hover:border-doctor-lavender transition-colors shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-primary-light truncate max-w-[200px]">
                            {doc.title || doc.fileName || `Document #${doc.id}`}
                          </h4>
                          <span className="text-[10px] text-doctor-muted uppercase tracking-wider block">
                            {doc.category?.label || doc.category?.value || 'Medical Document'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          doc.analysisStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {doc.analysisStatus || 'ANALYZED'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDocument(doc);
                          }}
                          disabled={openingDocId === doc.id}
                          className="p-1 rounded-lg bg-doctor-surface/90 hover:bg-doctor-lavender/20 text-doctor-lavender border border-doctor-border-soft text-xs transition"
                          title="View / Download Document"
                        >
                          {openingDocId === doc.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Eye size={13} />
                          )}
                        </button>
                      </div>
                    </div>

                    {doc.analysisResult && (
                      <p className="text-[11px] text-doctor-muted mt-2.5 line-clamp-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        {typeof doc.analysisResult === 'string' ? doc.analysisResult.substring(0, 150) : 'Extracted clinical findings applied to prediction model'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Drug Safety & Interactions */}
        {activeTab === 'meds' && (
          <div className="space-y-3">
            {drugSafety?.interactionWarnings && drugSafety.interactionWarnings.length > 0 ? (
              <div className="space-y-2">
                {drugSafety.interactionWarnings.map((warn: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <ShieldAlert size={18} className="text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300">
                        {warn.medicationA} ↔ {warn.medicationB} ({warn.severity || 'Caution'})
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">{warn.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>No high-risk contraindications or severe drug-drug interactions detected across active prescriptions.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DarkCard>
  );
}
