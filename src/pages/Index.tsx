import { useState } from 'react';
import Map from '@/components/Map';
import TaxiTierSelector, { taxiTiers } from '@/components/TaxiTierSelector';
import FareDisplay from '@/components/FareDisplay';
import BookingConfirmation from '@/components/BookingConfirmation';
import BookingStatus from '@/components/BookingStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Plane } from 'lucide-react';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lng: number;
}

interface Booking {
  id: string;
  tierName: string;
  fare: number;
  eta: number;
  distance: number;
}

const Index = () => {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectingType, setSelectingType] = useState<'pickup' | 'destination'>('pickup');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  const BASE_FARE = 100;
  const PER_KM_RATE = 50;

  // Calculate distance using Haversine formula
  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = pickup && destination ? calculateDistance(pickup, destination) : null;
  
  const calculateFare = (): number | null => {
    if (!distance || !selectedTier) return null;
    const tier = taxiTiers.find(t => t.id === selectedTier);
    if (!tier) return null;
    return (BASE_FARE + (distance * PER_KM_RATE)) * tier.multiplier;
  };

  const fare = calculateFare();

  const handleBooking = () => {
    if (!pickup || !destination || !selectedTier || !fare || !distance) {
      toast.error('Please select pickup, destination, and taxi tier');
      return;
    }

    const tier = taxiTiers.find(t => t.id === selectedTier);
    if (!tier) return;

    // Calculate ETA based on distance and tier speed
    const speedKmPerHour = parseInt(tier.speed);
    const etaMinutes = Math.ceil((distance / speedKmPerHour) * 60) + 5; // +5 for dispatch

    const bookingId = `FT${Date.now().toString().slice(-8)}`;
    
    const booking: Booking = {
      id: bookingId,
      tierName: tier.name,
      fare,
      eta: etaMinutes,
      distance
    };

    setCurrentBooking(booking);
    setShowConfirmation(true);
    toast.success('Booking confirmed!');
  };

  const handleViewStatus = () => {
    setShowConfirmation(false);
    setShowStatus(true);
  };

  const handleCloseBooking = () => {
    setShowConfirmation(false);
    setShowStatus(false);
    setCurrentBooking(null);
    setPickup(null);
    setDestination(null);
    setSelectedTier(null);
  };

  const canBook = pickup && destination && selectedTier && fare;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Plane className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">SkyTaxi</h1>
            <p className="text-sm text-muted-foreground">Flying Taxis in Bengaluru</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Select Locations
              </h2>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant={selectingType === 'pickup' ? 'default' : 'secondary'}
                  onClick={() => setSelectingType('pickup')}
                  className={selectingType === 'pickup' ? 'bg-gradient-primary' : ''}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Pickup
                </Button>
                <Button
                  size="sm"
                  variant={selectingType === 'destination' ? 'default' : 'secondary'}
                  onClick={() => setSelectingType('destination')}
                  className={selectingType === 'destination' ? 'bg-gradient-primary' : ''}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Destination
                </Button>
              </div>
            </div>
            
            <div className="h-[500px]">
              <Map
                pickup={pickup}
                destination={destination}
                onPickupSelect={setPickup}
                onDestinationSelect={setDestination}
                selectingType={selectingType}
              />
            </div>
          </Card>

          {showStatus && currentBooking && (
            <BookingStatus
              bookingId={currentBooking.id}
              tierName={currentBooking.tierName}
              eta={currentBooking.eta}
              onClose={() => setShowStatus(false)}
            />
          )}
        </div>

        {/* Booking Panel - Takes 1 column */}
        <div className="space-y-4">
          <TaxiTierSelector
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
          />

          <FareDisplay
            distance={distance}
            fare={fare}
            baseFare={BASE_FARE}
            perKmRate={PER_KM_RATE}
          />

          <Button
            onClick={handleBooking}
            disabled={!canBook}
            className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow disabled:opacity-50 disabled:shadow-none"
          >
            Book Flying Taxi
          </Button>

          {!pickup && (
            <p className="text-xs text-center text-muted-foreground">
              Click "Pickup" and tap the map to set your location
            </p>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && currentBooking && (
        <BookingConfirmation
          bookingId={currentBooking.id}
          fare={currentBooking.fare}
          eta={currentBooking.eta}
          tierName={currentBooking.tierName}
          distance={currentBooking.distance}
          onClose={handleCloseBooking}
          onViewStatus={handleViewStatus}
        />
      )}
    </div>
  );
};

export default Index;
