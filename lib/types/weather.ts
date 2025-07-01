export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    last_updated: string;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_degree: number;
    wind_direction: string;
    pressure_in: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feels_like_f: number;
    visibility_miles: number;
    uv_index: number;
    gust_mph: number;
    water_temp_f?: number;
  };
} 