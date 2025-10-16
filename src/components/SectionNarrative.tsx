import { LucideIcon } from 'lucide-react';

interface SectionNarrativeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
}

export const SectionNarrative = ({ 
  icon: Icon, 
  title, 
  description, 
  highlight 
}: SectionNarrativeProps) => {
  return (
    <div className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-5 border-l-4 border-primary">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          {highlight && (
            <p className="mt-3 text-sm font-medium text-secondary bg-secondary/10 rounded px-3 py-2 inline-block">
              💡 {highlight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
