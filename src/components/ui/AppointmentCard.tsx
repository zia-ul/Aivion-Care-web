import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/helpers';
import { StatusBadge } from './StatusBadge';

interface AppointmentCardProps {
  id: number;
  name: string;
  subtitle: string;
  date: string;
  time: string;
  status: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export function AppointmentCard({ id, name, subtitle, date, time, status, icon: Icon, actions, onClick }: AppointmentCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-4 bg-surface-10/50 rounded-xl border border-tonal-20/30',
        onClick && 'cursor-pointer hover:border-accent/30 transition-colors'
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={16} className="text-accent" />}
          <p className="font-semibold text-primary-light">{name}</p>
        </div>
        <p className="text-support text-primary-light/60">{subtitle}</p>
        <div className="flex items-center gap-4 mt-2 text-support text-primary-light/50">
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {actions && <div className="flex gap-2 ml-2">{actions}</div>}
      </div>
    </div>
  );
}
