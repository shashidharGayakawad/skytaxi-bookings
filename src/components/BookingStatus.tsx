import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BookingStatusProps {
  bookingId: string;
  tierName: string;
  eta: number;
  onClose: () => void;
}

const BookingStatus = ({ bookingId, tierName, eta, onClose }: BookingStatusProps) => {
  const [status, setStatus] = useState<'dispatched' | 'en-route' | 'arriving'>('dispatched');
  const [timeRemaining, setTimeRemaining] = useState(eta);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setStatus('arriving');
          return 0;
        }
        if (prev <= eta / 2) {
          setStatus('en-route');
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [eta]);

  const getStatusText = () => {
    switch (status) {
      case 'dispatched':
        return 'Taxi Dispatched';
      case 'en-route':
        return 'En Route';
      case 'arriving':
        return 'Arriving Now';
      default:
        return 'Dispatched';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'dispatched':
        return 'text-yellow-400';
      case 'en-route':
        return 'text-primary';
      case 'arriving':
        return 'text-green-400';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Active Booking</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative p-3 rounded-full bg-primary/30">
              <Plane className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div>
            <p className={`font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-muted-foreground">
              Booking ID: {bookingId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Time Remaining</span>
            </div>
            <p className="text-lg font-bold text-primary">
              {timeRemaining} min
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">Taxi Type</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {tierName}
            </p>
          </div>
        </div>

        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-primary transition-all duration-1000"
            style={{ 
              width: `${((eta - timeRemaining) / eta) * 100}%` 
            }}
          />
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Your taxi will arrive at your pickup location shortly
        </p>
      </div>
    </Card>
  );
};

export default BookingStatus;
