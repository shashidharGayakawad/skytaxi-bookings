import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Navigation, Clock, Hash } from 'lucide-react';

interface BookingConfirmationProps {
  bookingId: string;
  fare: number;
  eta: number;
  tierName: string;
  distance: number;
  onClose: () => void;
  onViewStatus: () => void;
}

const BookingConfirmation = ({
  bookingId,
  fare,
  eta,
  tierName,
  distance,
  onClose,
  onViewStatus
}: BookingConfirmationProps) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 bg-gradient-card border-primary/50 shadow-glow">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground">
            Your flying taxi is on the way
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="w-4 h-4" />
              <span>Booking ID</span>
            </div>
            <span className="font-mono font-semibold text-foreground">
              {bookingId}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>ETA</span>
            </div>
            <span className="font-semibold text-primary">
              {eta} minutes
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <span className="text-muted-foreground">Taxi Type</span>
            <span className="font-semibold text-foreground">
              {tierName}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Navigation className="w-4 h-4" />
              <span>Distance</span>
            </div>
            <span className="font-semibold text-foreground">
              {distance.toFixed(2)} km
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
            <span className="text-lg font-bold text-foreground">Total Fare</span>
            <span className="text-2xl font-bold text-primary">
              ₹{fare.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onViewStatus}
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow"
          >
            View Status
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
