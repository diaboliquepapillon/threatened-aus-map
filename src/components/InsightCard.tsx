import { ReactNode } from 'react';

interface InsightCardProps {
  icon: ReactNode;
  state: string;
  abbrev: string;
  description: string;
  color: string;
}

export const InsightCard = ({ icon, state, abbrev, description, color }: InsightCardProps) => {
  return (
    <div className={`rounded-xl p-6 border-2 transition-all hover:scale-105 hover:shadow-lg ${color}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">
            {state} <span className="text-sm font-normal opacity-70">({abbrev})</span>
          </h3>
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
