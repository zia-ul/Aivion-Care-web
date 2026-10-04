'use client';

import { Children, type ComponentType, type KeyboardEvent, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

interface SectionCardProps {
  icon?: IconComponent;
  title: string;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  icon,
  title,
  subtitle,
  trailing,
  children,
  className,
}: SectionCardProps) {
  const Icon = icon;
  return (
    <div className={cn('w-full rounded-2xl bg-doctor-raised/80 p-6', className)}>
      {(title || trailing) && (
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-doctor-blue/15 flex items-center justify-center text-doctor-blue">
              {Icon && <Icon className="h-5 w-5" />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-doctor-muted mt-1 truncate">{subtitle}</p>
            )}
          </div>
          {trailing && <div className="flex-shrink-0 ml-2">{trailing}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function InnerTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl bg-doctor-panel/80 border border-doctor-blue/10', className)}>
      {children}
    </div>
  );
}

interface StatusChipProps {
  icon: IconComponent;
  label: string;
  color: 'green' | 'amber' | 'blue' | 'red' | 'cyan' | 'purple';
  className?: string;
}

const CHIP_COLORS = {
  green: 'bg-doctor-mint/15 text-doctor-mint border-doctor-mint/40',
  amber: 'bg-doctor-gold/15 text-doctor-gold border-doctor-gold/40',
  blue: 'bg-doctor-blue/15 text-doctor-blue border-doctor-blue/40',
  red: 'bg-doctor-red/15 text-doctor-red border-doctor-red/40',
  cyan: 'bg-accent/15 text-accent border-accent/40',
  purple: 'bg-doctor-lavender/15 text-doctor-lavender border-doctor-lavender/40',
};

export function StatusChip({ icon: Icon, label, color, className }: StatusChipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold', CHIP_COLORS[color], className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{label}</span>
    </span>
  );
}

interface SubsectionPanelProps {
  icon: IconComponent;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SubsectionPanel({ icon: Icon, title, subtitle, trailing, children, className }: SubsectionPanelProps) {
  return (
    <div className={cn('w-full rounded-xl bg-doctor-panel/80 border border-doctor-blue/10 p-4', className)}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="h-5 w-5 text-doctor-blue" />}
        <span className="text-sm font-semibold text-white">
          {subtitle ? `${title} (${subtitle})` : title}
        </span>
        {trailing}
      </div>
      {children}
    </div>
  );
}

interface MetaPillProps {
  icon: IconComponent;
  label: string;
  className?: string;
}

export function MetaPill({ icon: Icon, label, className }: MetaPillProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-doctor-muted', className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{label}</span>
    </span>
  );
}

interface ActionTileButtonProps {
  icon: IconComponent;
  label: string;
  helper?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ActionTileButton({ icon: Icon, label, helper, onClick, disabled, className }: ActionTileButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn('w-full min-h-[118px] rounded-xl bg-doctor-panel/80 border border-doctor-blue/10 p-4 text-left transition-opacity disabled:opacity-50 disabled:cursor-not-allowed', className)}
    >
      <div className="w-10 h-10 rounded-xl bg-doctor-blue/15 flex items-center justify-center text-doctor-blue mb-3">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <p className="font-medium text-white mb-1 line-clamp-2">{label}</p>
      {helper && <p className="text-xs text-doctor-muted line-clamp-2">{helper}</p>}
    </button>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  minTwoColumnWidth?: number;
  className?: string;
}

export function ResponsiveGrid({ children, minTwoColumnWidth = 520, className }: ResponsiveGridProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {Children.map(children, (child, index) => (
        <div key={index} className={cn('flex-1 min-w-[250px]', className)}>
          {child}
        </div>
      ))}
    </div>
  );
}

interface ButtonWrapProps {
  children: ReactNode;
  className?: string;
}

export function ButtonWrap({ children, className }: ButtonWrapProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {Children.map(children, (child) => (
        <div key={Math.random()} className="flex-1 min-w-[160px]">
          {child}
        </div>
      ))}
    </div>
  );
}