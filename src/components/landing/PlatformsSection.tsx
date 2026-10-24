'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Globe2, Smartphone, Tablet, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from './common';

interface PlatformCard {
  title: string;
  description: string;
  icon: LucideIcon;
  features: readonly string[];
  color: 'sky' | 'teal';
  ctaText: string;
  ctaLink: string;
  isExternal?: boolean;
  bgImage: string;
}

const platforms: PlatformCard[] = [
  {
    title: 'Web Application',
    description: 'Access Aivion Care from any modern browser on desktop or laptop. Full feature parity with the mobile app — appointments, consultations, prescriptions, health records, monitoring, and AI-assisted workflows all work seamlessly in your browser.',
    icon: Globe2,
    features: ['Full desktop experience', 'Real-time health monitoring', 'Video consultations', 'AI clinical assistance', 'Secure cloud sync'],
    color: 'sky',
    ctaText: 'Launch Web App',
    ctaLink: '/login',
    bgImage: '/images/healthcare/doctor-consulting.jpg',
  },
  {
    title: 'Mobile Application',
    description: 'The Aivion Care mobile app puts your health in your pocket. Designed for iOS and Android, it brings continuous monitoring, appointments, teleconsultations, and smart reminders to your fingertips — wherever you are.',
    icon: Smartphone,
    features: ['iOS & Android support', 'Push notifications', 'Offline access to records', 'Biometric login', 'Background health sync'],
    color: 'teal',
    ctaText: 'Download Android APK',
    ctaLink: 'https://drive.google.com/drive/u/1/folders/1ALfyNroHMqFdpmYDJ-hpWMcndzO4eAd8',
    isExternal: true,
    bgImage: '/images/healthcare/smart-monitoring.jpg',
  },
  {
    title: 'Tablet Experience',
    description: 'A purpose-built tablet layout that scales the full dashboard experience for larger screens — ideal for family viewing, clinic kiosks, or shared health monitoring at home.',
    icon: Tablet,
    features: ['Optimised for tablets', 'Family health view', 'Clinic kiosk mode', 'Shared monitoring dashboards', 'High-resolution charts'],
    color: 'sky',
    ctaText: 'Tablet Dashboard',
    ctaLink: '/dashboard',
    bgImage: '/images/healthcare/icu-ward.jpg',
  },
] as const;

export default function PlatformsSection() {
  return (
    <section id="platforms" className="bg-surface-10 py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 relative z-10">
        <SectionHeader
          eyebrow="Available everywhere"
          title="Aivion Care on web, mobile, and tablet"
          description="Same connected care experience, available on the device you use every day. Whether you are at home, in the clinic, or on the go, your health stays connected."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {platforms.map(({ title, description, icon: Icon, features, color, ctaText, ctaLink, bgImage, isExternal }) => (
            <article
              key={title}
              className={`group relative overflow-hidden rounded-3xl border p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${
                color === 'sky'
                  ? 'border-tonal-20/80 bg-surface-20/85 hover:border-sky-400/60 shadow-lg'
                  : 'border-teal-500/25 bg-surface-20/85 hover:border-teal-400/60 shadow-lg'
              }`}
            >
              {/* Subtle clinical background image with glassmorphism overlay */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <Image
                  src={bgImage}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700 filter saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-20 via-surface-20/90 to-surface-20/60" />
              </div>

              {/* Gradient hover wash */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                style={{
                  background:
                    color === 'sky'
                      ? 'linear-gradient(135deg, rgba(14,165,233,0.12), transparent 70%)'
                      : 'linear-gradient(135deg, rgba(13,148,136,0.12), transparent 70%)',
                }}
              />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner border ${
                      color === 'sky'
                        ? 'bg-sky-500/15 border-sky-400/30 text-sky-400 dark:text-sky-300'
                        : 'bg-teal-500/15 border-teal-400/30 text-teal-500 dark:text-teal-300'
                    }`}
                  >
                    <Icon size={28} aria-hidden="true" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-primary-light">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-light/80 dark:text-primary-light/70">
                    {description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-medium text-primary-light/85 dark:text-primary-light/75">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            color === 'sky' ? 'bg-sky-400 shadow-sm shadow-sky-400/50' : 'bg-teal-400 shadow-sm shadow-teal-400/50'
                          }`}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Harmonized Radiant Button across all cards */}
                <div className="mt-8 pt-4 border-t border-tonal-20/50">
                  <a
                    href={ctaLink}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer' : undefined}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                      color === 'sky'
                        ? 'border-sky-500/50 dark:border-sky-400/50 bg-sky-500/15 dark:bg-gradient-to-r dark:from-sky-500/20 dark:via-cyan-500/25 dark:to-blue-500/20 text-sky-900 dark:text-cyan-200 hover:border-sky-500 hover:shadow-sky-500/20'
                        : 'border-teal-500/50 dark:border-teal-400/50 bg-teal-500/15 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-cyan-500/25 dark:to-emerald-500/20 text-teal-900 dark:text-teal-200 hover:border-teal-500 hover:shadow-teal-500/20'
                    }`}
                  >
                    <span>{ctaText}</span>
                    {isExternal ? (
                      <ExternalLink size={16} className="text-current" />
                    ) : (
                      <ArrowRight size={16} className="text-current" />
                    )}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
