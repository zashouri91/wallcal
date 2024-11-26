import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: number;
    condition: string;
    icon: string;
    minTemp: number;
    maxTemp: number;
  }>;
}

const mockWeatherData: WeatherData = {
  current: {
    temp: 72,
    condition: 'Partly Cloudy',
    icon: 'cloud',
  },
  forecast: [
    { date: '2024-03-21', temp: 74, minTemp: 65, maxTemp: 78, condition: 'Sunny', icon: 'sun' },
    { date: '2024-03-22', temp: 68, minTemp: 60, maxTemp: 72, condition: 'Rain', icon: 'cloud-rain' },
    { date: '2024-03-23', temp: 65, minTemp: 58, maxTemp: 69, condition: 'Cloudy', icon: 'cloud' },
    { date: '2024-03-24', temp: 70, minTemp: 62, maxTemp: 75, condition: 'Partly Cloudy', icon: 'cloud' },
    { date: '2024-03-25', temp: 73, minTemp: 64, maxTemp: 77, condition: 'Sunny', icon: 'sun' },
    { date: '2024-03-26', temp: 71, minTemp: 63, maxTemp: 76, condition: 'Partly Cloudy', icon: 'cloud' },
    { date: '2024-03-27', temp: 69, minTemp: 61, maxTemp: 74, condition: 'Rain', icon: 'cloud-rain' },
  ],
};

const getWeatherIcon = (icon: string) => {
  const icons = {
    sun: <Sun className="h-6 w-6" />,
    cloud: <Cloud className="h-6 w-6" />,
    'cloud-rain': <CloudRain className="h-6 w-6" />,
    'cloud-snow': <CloudSnow className="h-6 w-6" />,
    'cloud-lightning': <CloudLightning className="h-6 w-6" />,
    'cloud-drizzle': <CloudDrizzle className="h-6 w-6" />,
    'cloud-fog': <CloudFog className="h-6 w-6" />,
  };
  return icons[icon as keyof typeof icons] || icons.cloud;
};

export function WeatherWidget() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/80 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {getWeatherIcon(mockWeatherData.current.icon)}
            <span className="text-2xl font-semibold">
              {mockWeatherData.current.temp}°F
            </span>
          </div>
          <span className="text-sm text-blue-900/70">
            {mockWeatherData.current.condition}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {mockWeatherData.forecast.map((day) => (
            <div key={day.date} className="text-center">
              <div className="text-xs text-blue-900/70">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="my-1">{getWeatherIcon(day.icon)}</div>
              <div className="text-xs font-medium space-y-1">
                <div className="text-blue-900">{day.maxTemp}°</div>
                <div className="text-blue-900/60">{day.minTemp}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}