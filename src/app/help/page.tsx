'use client';

import React, { useState } from 'react';
import PageShell from '@/components/landing/PageShell';
import { SectionHeader } from '@/components/landing/common';
import { 
  ShieldCheck, 
  Stethoscope, 
  MessageSquare, 
  Video, 
  FileText, 
  Search, 
  Activity, 
  Lock, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Mic,
  Camera,
  Volume2,
  Radio,
  FileCheck
} from 'lucide-react';

export default function UserDocumentationPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'assessment' | 'chat' | 'telehealth' | 'privacy'>('overview');

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: Activity, tag: 'Welcome' },
    { id: 'assessment', label: 'Clinical Assessment & AI', icon: Stethoscope, tag: 'Doctor Studio' },
    { id: 'chat', label: 'Specialist Chat & Handles', icon: MessageSquare, tag: 'Instant Search' },
    { id: 'telehealth', label: 'Audio & Video Calls (WebRTC)', icon: Video, tag: 'WhatsApp Grade' },
    { id: 'privacy', label: 'Document Privacy & Consent', icon: Lock, tag: 'HIPAA Safe' },
  ];

  return (
    <PageShell>
      <div className="space-y-10 animate-in fade-in-50 duration-500">
        
        {/* Top Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Sparkles size={14} className="animate-spin" />
            <span>Interactive User Manual & Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary-light">
            How to Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-400 to-cyan-400">Aivion Care</span>
          </h1>
          <p className="text-sm sm:text-base text-primary-light/70 leading-relaxed">
            Simple, toddler-easy step-by-step instructions for patients, doctors, and hospitals to consult, review laboratory biomarker curves, talk in HD video, and protect medical records.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 p-1.5 rounded-2xl border border-tonal-20/80 bg-surface-20/50 backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]' 
                    : 'text-primary-light/75 hover:bg-tonal-20/60 hover:text-primary-light'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.tag && (
                  <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-tonal-20 text-primary-light/60'
                  }`}>
                    {tab.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Content Panels with Animated Transitions */}
        <div className="relative rounded-2xl border border-tonal-20/90 bg-surface-10/80 p-6 sm:p-10 shadow-xl backdrop-blur-xl transition-all duration-500 min-h-[420px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="flex items-center gap-3 border-b border-tonal-20 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-primary-light">What is Aivion Care?</h2>
                  <p className="text-xs sm:text-sm text-primary-light/65">Think of it as having your favorite, trustworthy doctor right in your pocket.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="group rounded-2xl border border-tonal-20/80 bg-surface-20/50 p-5 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500 font-black mb-3">1</div>
                  <h3 className="font-bold text-base text-primary-light mb-1">Say Hello (Chat)</h3>
                  <p className="text-xs text-primary-light/70 leading-relaxed">
                    Search for any specialist by their Telegram-style handle (like <code className="text-cyan-600 dark:text-cyan-400 font-bold">@dr_smith</code>) or name, and chat safely with end-to-end encryption.
                  </p>
                </div>

                <div className="group rounded-2xl border border-tonal-20/80 bg-surface-20/50 p-5 transition-all duration-300 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-500 font-black mb-3">2</div>
                  <h3 className="font-bold text-base text-primary-light mb-1">Face-to-Face Video</h3>
                  <p className="text-xs text-primary-light/70 leading-relaxed">
                    Tap the green Call or Video button to talk directly. Full-duplex audio means you both talk and listen without awkward walkie-talkie delays!
                  </p>
                </div>

                <div className="group rounded-2xl border border-tonal-20/80 bg-surface-20/50 p-5 transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 font-black mb-3">3</div>
                  <h3 className="font-bold text-base text-primary-light mb-1">Smart Health Vault</h3>
                  <p className="text-xs text-primary-light/70 leading-relaxed">
                    All lab tests, Blood Pressure curves, and blood sugar readings are organized neatly. Nobody can see them without your explicit permission.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-cyan-600 dark:text-cyan-300 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-cyan-500" />
                <span><strong>No technical skills required:</strong> Designed with high-contrast buttons and readable fonts so anyone aged 4 to 80 can use it comfortably.</span>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL ASSESSMENT */}
          {activeSection === 'assessment' && (
            <div className="space-y-8 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="flex items-center gap-3 border-b border-tonal-20 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-primary-light">Clinical Assessment Studio & AI Assistant</h2>
                  <p className="text-xs sm:text-sm text-primary-light/65">How doctors review patient history, blood tests, and disease prediction trends in seconds.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-tonal-20 bg-surface-20/40">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs">A</div>
                  <div>
                    <h4 className="font-bold text-sm text-primary-light">Automatic Lab Document Ingestion</h4>
                    <p className="text-xs text-primary-light/70 mt-1">
                      Upload lab reports (CBC, Liver, Kidney, Lipid) as PDF files or smartphone camera photos. The intelligent Sentinel agent automatically extracts numerical values and converts units so doctors do not have to type manually.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-tonal-20 bg-surface-20/40">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold text-xs">B</div>
                  <div>
                    <h4 className="font-bold text-sm text-primary-light">Interactive Biomarker Curves (fl_chart)</h4>
                    <p className="text-xs text-primary-light/70 mt-1">
                      Instead of reading boring paper tables, doctors see dynamic time-series curves of Blood Pressure (Systolic & Diastolic) and Blood Glucose with green, yellow, and red safety warning zones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-tonal-20 bg-surface-20/40">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">C</div>
                  <div>
                    <h4 className="font-bold text-sm text-primary-light">High-Volume Patient Carousel</h4>
                    <p className="text-xs text-primary-light/70 mt-1">
                      Busy hospital doctors managing hundreds of consultations can tap any patient chip in the horizontal top carousel to instantly load their complete chart without typing IDs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs flex gap-3 items-center">
                <AlertTriangle size={18} className="shrink-0 text-amber-500" />
                <span><strong>Statutory Medical Notice:</strong> AI predictions serve as clinical decision support only. All diagnoses and prescriptions must be confirmed by a licensed physician before treatment.</span>
              </div>
            </div>
          )}

          {/* TAB 3: CHAT & SPECIALIST SEARCH */}
          {activeSection === 'chat' && (
            <div className="space-y-8 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="flex items-center gap-3 border-b border-tonal-20 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-primary-light">Telegram-Style Search & Encrypted Chat</h2>
                  <p className="text-xs sm:text-sm text-primary-light/65">Find doctors like finding friends on social media—fast, private, and convenient.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-tonal-20 bg-surface-20/40 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Step 1: Real-Time Wildcard Search</span>
                  <p className="text-xs text-primary-light/70">
                    Open the chat search bar and type anything: a doctor&apos;s name (e.g. &apos;Dr. Fatima&apos;), their specialty (&apos;Cardiology&apos;, &apos;Pediatrics&apos;), hospital name, or their Telegram handle (e.g. <span className="font-mono text-cyan-500">@dr_smith</span>).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-tonal-20 bg-surface-20/40 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Step 2: Instant Chat & Request</span>
                  <p className="text-xs text-primary-light/70">
                    Tapping a doctor creates a private conversation immediately. Doctors can tap the &apos;Request Assessment&apos; button directly on the patient card to ask for document viewing permission.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-20/70 border border-tonal-20 text-xs text-primary-light/75 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-teal-500 shrink-0" />
                <span>Solid, non-transparent themed sheets guarantee clear text readability in both bright daylight and dark hospital night shifts.</span>
              </div>
            </div>
          )}

          {/* TAB 4: TELEHEALTH & WEBRTC */}
          {activeSection === 'telehealth' && (
            <div className="space-y-8 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="flex items-center gap-3 border-b border-tonal-20 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Video size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-primary-light">Pure WebRTC Audio & Video Calls (WhatsApp Quality)</h2>
                  <p className="text-xs sm:text-sm text-primary-light/65">Direct, crystal-clear 1-to-1 teleconsultations without third-party vendor data collection.</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-primary-light/70 leading-relaxed">
                During consultations, audio and video stream <strong>directly peer-to-peer (P2P)</strong> between the doctor&apos;s phone and patient&apos;s phone using military-grade AES-256 encryption. The call stream never goes to any third-party server, guaranteeing absolute confidentiality.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-tonal-20 bg-surface-20/40 text-center space-y-1">
                  <Mic size={20} className="mx-auto text-cyan-500" />
                  <div className="text-xs font-bold text-primary-light">Full-Duplex Mute</div>
                  <div className="text-[10px] text-primary-light/60">Hardware echo cancellation</div>
                </div>

                <div className="p-3.5 rounded-xl border border-tonal-20 bg-surface-20/40 text-center space-y-1">
                  <Camera size={20} className="mx-auto text-teal-500" />
                  <div className="text-xs font-bold text-primary-light">Video On / Off</div>
                  <div className="text-[10px] text-primary-light/60">Preserves audio on low data</div>
                </div>

                <div className="p-3.5 rounded-xl border border-tonal-20 bg-surface-20/40 text-center space-y-1">
                  <Volume2 size={20} className="mx-auto text-sky-500" />
                  <div className="text-xs font-bold text-primary-light">Speakerphone</div>
                  <div className="text-[10px] text-primary-light/60">1-tap loud speaker toggle</div>
                </div>

                <div className="p-3.5 rounded-xl border border-tonal-20 bg-surface-20/40 text-center space-y-1">
                  <Radio size={20} className="mx-auto text-amber-500" />
                  <div className="text-xs font-bold text-primary-light">Camera Flip</div>
                  <div className="text-[10px] text-primary-light/60">Inspect wounds with rear camera</div>
                </div>

                <div className="p-3.5 rounded-xl border border-tonal-20 bg-surface-20/40 text-center space-y-1">
                  <FileCheck size={20} className="mx-auto text-emerald-500" />
                  <div className="text-xs font-bold text-primary-light">Local Recording</div>
                  <div className="text-[10px] text-primary-light/60">Encrypted on device only</div>
                </div>

                <div className="p-3.5 rounded-xl border border-tonal-20 bg-surface-20/40 text-center space-y-1">
                  <PhoneCall size={20} className="mx-auto text-red-500" />
                  <div className="text-xs font-bold text-primary-light">End & Summarize</div>
                  <div className="text-[10px] text-primary-light/60">Auto-generates SBAR report</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRIVACY & EXPLICIT CONSENT */}
          {activeSection === 'privacy' && (
            <div className="space-y-8 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="flex items-center gap-3 border-b border-tonal-20 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-primary-light">Your Medical Lockbox (Consent & Privacy)</h2>
                  <p className="text-xs sm:text-sm text-primary-light/65">You own your data. Nobody sees your health files without your explicit permission.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-tonal-20 bg-surface-20/50">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-black text-xs">1</div>
                  <div className="text-xs text-primary-light/80">
                    <strong>Doctor asks for access:</strong> When you connect with a doctor, they tap <code className="text-cyan-500 font-bold">&quot;Request Clinical Assessment&quot;</code>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-tonal-20 bg-surface-20/50">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-black text-xs">2</div>
                  <div className="text-xs text-primary-light/80">
                    <strong>You see a friendly popup:</strong> Your phone or screen shows a checklist of what the doctor wants to see (e.g. Previous Lab Tests, Vital History, Medication List).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-tonal-20 bg-surface-20/50">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-black text-xs">3</div>
                  <div className="text-xs text-primary-light/80">
                    <strong>You choose [ Accept ] or [ Decline ]:</strong> Only after you tap <strong className="text-emerald-500">Accept & Authorize</strong> can the doctor view those records.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-tonal-20 bg-surface-20/50">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-black text-xs">4</div>
                  <div className="text-xs text-primary-light/80">
                    <strong>Revoke anytime:</strong> You can take back permission with a single click whenever you wish.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                <span>Strictly compliant with <strong>HIPAA Security Rule (45 CFR § 164.312)</strong>, <strong>CDSCO SaMD</strong>, and <strong>ABDM (Ayushman Bharat Digital Mission)</strong> standards.</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </PageShell>
  );
}
