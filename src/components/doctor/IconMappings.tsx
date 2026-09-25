'use client';

import {
  User,
  Stethoscope,
  Building2,
  MapPin,
  UserPlus,
  HeartPulse,
  Video,
  BadgeCheck,
  Weight,
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Wind,
  Droplets,
  Shield,
  Calendar,
  User as UserIcon,
  Building,
  MapPin as MapPinIcon,
  Send,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const FIELD_ICONS: Record<string, LucideIcon> = {
  Age: Calendar,
  Sex: UserIcon,
  Department: Building,
  Location: MapPinIcon,
  'Referred By': UserPlus,
  Speciality: HeartPulse,
  'Call Type': Video,
};

const VITAL_ICONS: Record<string, LucideIcon> = {
  Weight: Weight,
  BMI: Activity,
  'B.P.': Heart,
  Pulse: Heart,
  SpO2: Droplet,
  Temp: Thermometer,
  'Respiration Rate': Wind,
  'Blood Glucose': Droplets,
};

const TRACKING_ICONS: Record<string, LucideIcon> = {
  Sent: Send,
  Viewed: Eye,
  Downloaded: Download,
};

export function getFieldIcon(label: string): LucideIcon {
  return FIELD_ICONS[label] || BadgeCheck;
}

export function getVitalIcon(label: string): LucideIcon {
  return VITAL_ICONS[label] || Shield;
}

export function getTrackingIcon(label: string): LucideIcon {
  return TRACKING_ICONS[label] || AlertCircle;
}

export function getFieldIconComponent(label: string) {
  const Icon = getFieldIcon(label);
  return <Icon className="h-4 w-4" />;
}

export function getVitalIconComponent(label: string) {
  const Icon = getVitalIcon(label);
  return <Icon className="h-4 w-4" />;
}

export function getTrackingIconComponent(label: string) {
  const Icon = getTrackingIcon(label);
  return <Icon className="h-3.5 w-3.5" />;
}

export const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'High', color: 'red' },
  { value: 'NORMAL', label: 'Normal', color: 'blue' },
  { value: 'LOW', label: 'Low', color: 'green' },
] as const;

export const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Thrice daily',
  'Four times daily',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Weekly',
] as const;

export const TIMING_OPTIONS = [
  'Before breakfast',
  'After breakfast',
  'Before lunch',
  'After lunch',
  'Before dinner',
  'After dinner',
  'At bedtime',
  'With food',
  'Empty stomach',
] as const;

export const ROUTE_OPTIONS = [
  'Oral',
  'Sublingual',
  'Topical',
  'Inhalation',
  'Injection',
  'Rectal',
  'Ophthalmic',
  'Otic',
  'Nasal',
] as const;

export const SEX_OPTIONS = ['Male', 'Female', 'Other'] as const;