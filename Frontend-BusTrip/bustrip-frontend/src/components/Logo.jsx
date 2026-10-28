import React from 'react';
import { BusFront } from 'lucide-react';

export default function Logo() {
  return (
    <a className="logo" href="#home" aria-label="BusTrip home">
      <span className="logo-mark"><BusFront size={22} strokeWidth={2.5} /></span>
      <span>Bus<span>Trip</span></span>
    </a>
  );
}
