import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

interface FareDisplayProps {
  distance: number | null;
  fare: number | null;
  baseFare: number;
  perKmRate: number;
}

const FareDisplay = ({ distance, fare, baseFare, perKmRate }: FareDisplayProps) => {
  return (
    <Card className="p-4 bg-gradient-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Fare Estimate</h3>
      
      {distance && fare ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Navigation className="w-4 h-4" />
              <span>Distance</span>
            </div>
            <span className="font-semibold text-foreground">
              {distance.toFixed(2)} km
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Base Fare</span>
            <span className="font-semibold text-foreground">₹{baseFare}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Per km</span>
            <span className="font-semibold text-foreground">₹{perKmRate}/km</span>
          </div>
          
          <div className="flex items-center justify-between pt-3">
            <span className="text-lg font-bold text-foreground">Total Fare</span>
            <span className="text-2xl font-bold text-primary">
              ₹{fare.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-sm">
            Select pickup and destination to see fare
          </p>
        </div>
      )}
    </Card>
  );
};

export default FareDisplay;
