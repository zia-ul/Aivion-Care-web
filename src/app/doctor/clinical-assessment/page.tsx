'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, Stethoscope, Brain, ChevronDown, ChevronUp, FileText, Sparkles } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { FL, DarkCard, InnerCard, Pill, ActionButton, SectionTitle, Field, Shield } from '@/components/ui/FlutterTheme';
import StandaloneDocumentStudio from '@/components/doctor/StandaloneDocumentStudio';

interface Patient {
  id: number;
  name: string;
  age?: number;
  sex?: string;
  bloodGroup?: string;
  chronicConditions?: string;
  patientCode?: string;
  lastConsultation?: string;
}

export default function ClinicalAssessmentPatientList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'patients' | 'docStudio'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const loadPatients = useCallback(async () => {
    if (!user?.doctorId) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data } = await doctorApi.getMyPatients();
      const patientList = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name || p.fullName || `Patient #${p.id}`,
        age: p.age,
        sex: p.gender,
        bloodGroup: p.bloodGroup,
        chronicConditions: p.chronicConditions,
        patientCode: p.patientCode,
        lastConsultation: p.lastConsultation,
      }));
      setPatients(patientList);
      setFilteredPatients(patientList);
    } catch (e) {
      console.error('Failed to load patients:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.doctorId]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    const filtered = patients.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chronicConditions?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const displayedPatients = showAll ? filteredPatients : filteredPatients.slice(0, 10);

  return (
    <AppLayout role="DOCTOR" title="Clinical Assessment" subtitle="Select a patient or analyze medical documents">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 bg-doctor-surface/40 border border-doctor-border-soft rounded-2xl w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'patients'
                ? 'bg-doctor-lavender text-white shadow-md'
                : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/60'
            }`}
          >
            <User size={15} />
            <span>Patient Clinical Assessment</span>
          </button>
          <button
            onClick={() => setActiveTab('docStudio')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'docStudio'
                ? 'bg-doctor-lavender text-white shadow-md'
                : 'text-doctor-muted hover:text-primary-light hover:bg-doctor-surface/60'
            }`}
          >
            <Sparkles size={15} />
            <span>Document Studio (3-Agent)</span>
          </button>
        </div>

        {activeTab === 'docStudio' ? (
          <StandaloneDocumentStudio />
        ) : (
          <>
            {/* Header with search */}
            <DarkCard className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-primary-light font-semibold text-lg">AI-Assisted Patient Assessment</h3>
                  <p className="text-sm text-doctor-muted">
                    Select a patient to run an AI-powered disease risk/matching assessment
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="text-doctor-lavender" size={20} />
                  <span className="text-primary-light font-medium">Powered by Clinical Decision Support</span>
                </div>
              </div>

              <Field label="Search Patients">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-doctor-muted" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or condition..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-doctor-surface/50 border border-doctor-border-soft/50 rounded-2xl text-primary-light placeholder-doctor-muted focus:outline-none focus:ring-2 focus:ring-doctor-lavender/50"
                  />
                </div>
              </Field>
            </DarkCard>

        {/* Patient List */}
        <div>
          <SectionTitle action={
            <ActionButton variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showAll ? 'Show Less' : filteredPatients.length > 10 ? `Show All (${filteredPatients.length})` : ''}
            </ActionButton>
          }>
            My Patients ({filteredPatients.length})
          </SectionTitle>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <DarkCard key={i} className="animate-pulse">
                  <div className="h-16 bg-doctor-surface/30 rounded-xl" />
                </DarkCard>
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <DarkCard className="text-center py-12">
              <User className="mx-auto text-doctor-dim" size={48} />
              <p className="mt-3 text-primary-light font-medium">No patients found</p>
              <p className="text-sm text-doctor-muted mt-1">
                {searchQuery ? 'Try adjusting your search' : 'You don\'t have any patients assigned yet'}
              </p>
            </DarkCard>
          ) : (
            <div className="space-y-3">
              {displayedPatients.map((patient, index) => (
                <DarkCard key={patient.id ? `pat-${patient.id}` : `pat-idx-${index}`} className="hover:border-doctor-lavender/30 transition-colors cursor-pointer p-0 overflow-hidden">
                  <div
                    onClick={() => router.push(`/doctor/clinical-assessment/${patient.id}`)}
                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 text-left cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        router.push(`/doctor/clinical-assessment/${patient.id}`);
                      }
                    }}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-doctor-lavender/15 flex items-center justify-center shrink-0">
                        <User className="text-doctor-lavender" size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-primary-light font-semibold text-sm sm:text-base break-words">{patient.name}</p>
                          {patient.patientCode && (
                            <Pill color={FL.gray} size="xs">{patient.patientCode}</Pill>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-doctor-muted mt-1">
                          {patient.age !== undefined && <span>Age: {patient.age}</span>}
                          {patient.sex && <span>Sex: {patient.sex}</span>}
                          {patient.bloodGroup && <span>Blood: {patient.bloodGroup}</span>}
                          {patient.chronicConditions && (
                            <span className="truncate max-w-[180px] sm:max-w-[280px]">
                              {patient.chronicConditions}
                            </span>
                          )}
                        </div>
                        {patient.lastConsultation && (
                          <p className="text-[11px] text-doctor-dim mt-1">
                            Last consultation: {new Date(patient.lastConsultation).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-doctor-border-soft/30">
                      <span className="inline-flex items-center px-2.5 py-1.5 text-xs rounded-2xl font-semibold bg-accent-fill text-white shadow-sm">
                        <Brain size={14} className="mr-1" />
                        Assess
                      </span>
                      <Stethoscope className="text-doctor-muted hidden sm:inline" size={18} />
                    </div>
                  </div>
                </DarkCard>
              ))}
            </div>
          )}

          {!showAll && filteredPatients.length > 10 && (
            <div className="text-center pt-4">
              <ActionButton variant="outline" onClick={() => setShowAll(true)}>
                Show all {filteredPatients.length} patients
                <ChevronDown size={16} className="ml-1" />
              </ActionButton>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InnerCard className="text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-doctor-lavender/15 flex items-center justify-center mx-auto mb-3">
              <Brain className="text-doctor-lavender" size={24} />
            </div>
            <p className="text-primary-light font-semibold">AI-Powered Matching</p>
            <p className="text-xs text-doctor-muted mt-1">Rule-based + LLM clinical reasoning</p>
          </InnerCard>
          <InnerCard className="text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-doctor-mint/15 flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="text-doctor-mint" size={24} />
            </div>
            <p className="text-primary-light font-semibold">Auto-loaded Context</p>
            <p className="text-xs text-doctor-muted mt-1">History, meds, vitals, allergies</p>
          </InnerCard>
          <InnerCard className="text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-doctor-gold/15 flex items-center justify-center mx-auto mb-3">
              <Shield className="text-doctor-gold" size={24} />
            </div>
            <p className="text-primary-light font-semibold">Safety First</p>
            <p className="text-xs text-doctor-muted mt-1">Red flag detection & disclaimers</p>
          </InnerCard>
        </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
