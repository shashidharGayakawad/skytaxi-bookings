import { Card } from '@/components/ui/card';
import { Plane, Zap, Crown } from 'lucide-react';

export interface TaxiTier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  icon: typeof Plane;
  capacity: number;
  speed: string;
}

export const taxiTiers: TaxiTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Comfortable ride for everyday travel',
    multiplier: 1.0,
    icon: Plane,
    capacity: 2,
    speed: '150 km/h'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Extra comfort with priority boarding',
    multiplier: 1.5,
    icon: Crown,
    capacity: 4,
    speed: '200 km/h'
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Fastest ride with luxury amenities',
    multiplier: 2.0,
    icon: Zap,
    capacity: 2,
    speed: '250 km/h'
  }
];

interface TaxiTierSelectorProps {
  selectedTier: string | null;
  onSelectTier: (tierId: string) => void;
}

const TaxiTierSelector = ({ selectedTier, onSelectTier }: TaxiTierSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Select Your Taxi</h3>
      <div className="grid gap-3">
        {taxiTiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          
          return (
            <Card
              key={tier.id}
              className={`p-4 cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? 'border-primary bg-gradient-card shadow-glow'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-lg'
              }`}
              onClick={() => onSelectTier(tier.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-primary/20' : 'bg-secondary'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {tier.name}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {tier.multiplier}x
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tier.description}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>👥 {tier.capacity} passengers</span>
                    <span>⚡ {tier.speed}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TaxiTierSelector;
