'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Heart, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Download
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function PatientEcgPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [heartStatus, setHeartStatus] = useState<'NORMAL' | 'ELEVATED' | 'IRREGULAR'>('NORMAL');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulated live ECG wave generator
  useEffect(() => {
    let animationFrameId: number;
    let step = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = '#07141d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(34, 211, 197, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG Wave Calculation
      ctx.strokeStyle = '#22d3c5';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const midY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const offset = (x + step) % 120;
        let y = midY;

        // P wave
        if (offset > 20 && offset < 35) {
          y -= Math.sin(((offset - 20) / 15) * Math.PI) * 12;
        }
        // Q wave
        else if (offset >= 35 && offset < 42) {
          y += Math.sin(((offset - 35) / 7) * Math.PI) * 8;
        }
        // R wave peak
        else if (offset >= 42 && offset < 50) {
          y -= Math.sin(((offset - 42) / 8) * Math.PI) * 55;
        }
        // S wave dip
        else if (offset >= 50 && offset < 58) {
          y += Math.sin(((offset - 50) / 8) * Math.PI) * 18;
        }
        // T wave
        else if (offset >= 68 && offset < 90) {
          y -= Math.sin(((offset - 68) / 22) * Math.PI) * 16;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      if (isRecording) {
        step = (step + 3) % 120;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Live biometric sensor streaming connected');
    } else {
      toast('ECG recording paused');
    }
  };

  const resetTelemetry = () => {
    setIsRecording(false);
    setBpm(72);
    setSpo2(98);
    setHeartStatus('NORMAL');
    toast('Telemetry session reset');
  };

  return (
    <AppLayout role="PATIENT" title="ECG & Vitals Telemetry" subtitle="Continuous cardiac waveform surveillance">
      <div className="space-y-6">
        
        {/* TOP STATUS CARD */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border border-tonal-20/80 bg-surface-20/80 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-primary-light/60">
              <span>HEART RATE</span>
              <Heart size={16} className="text-rose-500 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary-light">{bpm}</span>
              <span className="text-xs text-primary-light/60">BPM</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 size={12} /> Normal Sinus Rhythm
            </div>
          </Card>

          <Card className="border border-tonal-20/80 bg-surface-20/80 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-primary-light/60">
              <span>SPO2 OXYGEN</span>
              <Activity size={16} className="text-cyan-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary-light">{spo2}%</span>
              <span className="text-xs text-primary-light/60">Pulse Ox</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 size={12} /> Optimal Saturation
            </div>
          </Card>

          <Card className="border border-tonal-20/80 bg-surface-20/80 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-primary-light/60">
              <span>STATUS</span>
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-500">STABLE</span>
            </div>
            <div className="mt-2 text-[11px] text-primary-light/60">
              No Arrhythmias Flagged
            </div>
          </Card>

          <Card className="border border-tonal-20/80 bg-surface-20/80 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-primary-light/60">
              <span>SENSOR</span>
              <Zap size={16} className="text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-400">LEAD-I</span>
            </div>
            <div className="mt-2 text-[11px] text-primary-light/60">
              IoMT Bio-Patch Connected
            </div>
          </Card>
        </div>

        {/* REAL-TIME CANVAS CHART */}
        <Card className="overflow-hidden border border-tonal-20/90 bg-surface-10 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-primary-light flex items-center gap-2">
                <Activity size={18} className="text-cyan-400" /> Real-Time Lead-I Electrocardiogram
              </h2>
              <p className="text-xs text-primary-light/60 mt-0.5">
                Sampling rate: 250 Hz · Filter: 0.5 - 40 Hz Bandpass · Standard calibration 10mm/mV
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isRecording ? 'danger' : 'primary'}
                onClick={toggleRecording}
                className="gap-2 text-xs font-bold"
              >
                {isRecording ? <><Pause size={14} /> Pause Stream</> : <><Play size={14} /> Start Live Stream</>}
              </Button>
              <Button variant="outline" onClick={resetTelemetry} className="gap-2 text-xs">
                <RotateCcw size={14} /> Reset
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-[#07141d] p-3 shadow-inner">
            <canvas
              ref={canvasRef}
              width={900}
              height={260}
              className="w-full h-[260px] rounded-xl block"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-primary-light/65 pt-3 border-t border-tonal-20/60">
            <div className="flex items-center gap-4">
              <span>Sweep Speed: <strong>25 mm/s</strong></span>
              <span>Gain: <strong>10 mm/mV</strong></span>
              <span>QRS Interval: <strong>88 ms</strong></span>
              <span>QTc: <strong>412 ms</strong></span>
            </div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold cursor-pointer hover:underline">
              <Download size={14} /> Export Telemetry PDF
            </div>
          </div>
        </Card>

        {/* CLINICAL NOTE */}
        <div className="rounded-2xl border border-tonal-20/70 bg-surface-20/60 p-5 text-xs leading-relaxed text-primary-light/70">
          <strong className="text-primary-light font-semibold">Physician Advisory:</strong> Live ECG streaming is intended for remote cardiovascular trend surveillance and clinical decision support during virtual consultations. If you experience acute chest pain, shortness of breath, or palpitations, please use the emergency SOS hotline or visit the nearest emergency department immediately.
        </div>
      </div>
    </AppLayout>
  );
}
