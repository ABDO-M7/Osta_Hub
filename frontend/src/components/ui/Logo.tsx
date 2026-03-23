import React from 'react';

interface LogoProps {
  className?: string;
  glow?: boolean;
  tronColor?: string;
}

export function Logo({ className = "", glow = false, tronColor = "#390ced" }: LogoProps) {
  return (
    <span className={className}>
      <span className="font-neo uppercase">N</span>
      <span className="font-beh lowercase">eur</span>
      <span className="font-neo lowercase">o</span>
      <span
        className="font-dro uppercase"
        style={glow ? { color: tronColor, textShadow: `0 0 40px ${tronColor}` } : {}}
      >
        TRON
      </span>
    </span>
  );
}
