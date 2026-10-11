'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, Stethoscope, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { doctorApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/stores/auth';
import { FL, DarkCard, InnerCard, Pill, ActionButton, SectionTitle, Field, Shield } from '@/components/ui/FlutterTheme';

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
    <AppLayout role="DOCTOR" title="Clinical Assessment" subtitle="Select a patient to begin">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header with search */}
        <DarkCard className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-primary-light font-semibold text-lg">AI-Assisted Clinical Assessment</h3>
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
              {displayedPatients.map((patient) => (
                <DarkCard key={patient.id} className="hover:border-doctor-lavender/30 transition-colors cursor-pointer">
                  <button
                    onClick={() => router.push(`/doctor/clinical-assessment/${patient.id}`)}
                    className="w-full flex items-center justify-between gap-4 p-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-doctor-lavender/15 flex items-center justify-center flex-shrink-0">
                        <User className="text-doctor-lavender" size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-primary-light font-semibold truncate">{patient.name}</p>
                          {patient.patientCode && (
                            <Pill color={FL.gray} size="xs">{patient.patientCode}</Pill>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-doctor-muted mt-1">
                          {patient.age !== undefined && <span>Age: {patient.age}</span>}
                          {patient.sex && <span>Sex: {patient.sex}</span>}
                          {patient.bloodGroup && <span>Blood: {patient.bloodGroup}</span>}
                          {patient.chronicConditions && (
                            <span className="truncate max-w-[200px]">
                              Conditions: {patient.chronicConditions}
                            </span>
                          )}
                        </div>
                        {patient.lastConsultation && (
                          <p className="text-xs text-doctor-dim mt-1">
                            Last consultation: {new Date(patient.lastConsultation).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ActionButton size="sm">
                        <Brain size={14} className="mr-1" />
                        Assess
                      </ActionButton>
                      <Stethoscope className="text-doctor-muted" size={20} />
                    </div>
                  </button>
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
      </div>
    </AppLayout>
  );
}