import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle, 
  CloudFog,
  Wind
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  size?: number;
  color?: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, size = 24, color, className }) => {
  // WMO Weather interpretation codes (WW)
  const props = { size, color, className };
  
  if (code === 0) return <Sun {...props} />;
  if (code >= 1 && code <= 3) return <Cloud {...props} />;
  if (code >= 45 && code <= 48) return <CloudFog {...props} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle {...props} />;
  if (code >= 61 && code <= 67) return <CloudRain {...props} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  if (code >= 80 && code <= 82) return <CloudRain {...props} />;
  if (code >= 85 && code <= 86) return <CloudSnow {...props} />;
  if (code >= 95) return <CloudLightning {...props} />;
  
  return <Wind {...props} />;
};