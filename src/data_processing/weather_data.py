"""
Weather data collection and processing module
"""

import pandas as pd
import numpy as np
import requests
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
import json

logger = logging.getLogger(__name__)

class WeatherDataCollector:
    """
    Collect and process weather data from various sources including IMD
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize weather data collector
        
        Args:
            config: Configuration containing API keys and data source settings
        """
        self.config = config
        self.api_keys = config.get('api_keys', {})
        self.data_sources = config.get('data_sources', {})
    
    def collect_imd_data(self, start_date: str, end_date: str, 
                        location: Optional[Dict[str, float]] = None) -> pd.DataFrame:
        """
        Collect historical weather data from India Meteorological Department
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            location: Optional location dict with latitude and longitude
            
        Returns:
            DataFrame with historical weather data
        """
        try:
            logger.info(f"Collecting IMD data from {start_date} to {end_date}")
            
            # TODO: Implement actual IMD API integration
            # For now, generate mock historical data
            
            date_range = pd.date_range(start=start_date, end=end_date, freq='D')
            
            # Generate realistic mock weather data
            np.random.seed(42)  # For reproducible results
            
            data = []
            for date in date_range:
                # Seasonal patterns for India
                day_of_year = date.timetuple().tm_yday
                
                # Temperature patterns (Celsius)
                temp_base = 25 + 10 * np.sin(2 * np.pi * (day_of_year - 80) / 365)
                temperature = temp_base + np.random.normal(0, 3)
                
                # Rainfall patterns (mm) - monsoon season
                if 150 <= day_of_year <= 270:  # Monsoon season
                    rainfall_base = 8.0
                else:
                    rainfall_base = 1.0
                
                rainfall = max(0, np.random.exponential(rainfall_base))
                
                # Humidity patterns (%)
                humidity = 60 + 20 * np.sin(2 * np.pi * (day_of_year - 80) / 365) + np.random.normal(0, 5)
                humidity = np.clip(humidity, 30, 95)
                
                # Wind speed (km/h)
                wind_speed = 8 + np.random.exponential(3)
                
                # Pressure (hPa)
                pressure = 1013 + np.random.normal(0, 10)
                
                data.append({
                    'date': date,
                    'temperature_celsius': round(temperature, 1),
                    'rainfall_mm': round(rainfall, 2),
                    'humidity_percent': round(humidity, 1),
                    'wind_speed_kmh': round(wind_speed, 1),
                    'pressure_hpa': round(pressure, 1),
                    'latitude': location['latitude'] if location else 28.6139,
                    'longitude': location['longitude'] if location else 77.2090
                })
            
            df = pd.DataFrame(data)
            logger.info(f"Generated {len(df)} records of mock IMD data")
            
            return df
            
        except Exception as e:
            logger.error(f"Error collecting IMD data: {e}")
            raise
    
    def collect_current_weather(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Collect current weather conditions for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Current weather conditions
        """
        try:
            logger.info(f"Collecting current weather for {latitude}, {longitude}")
            
            # TODO: Implement actual weather API integration (OpenWeatherMap, etc.)
            # For now, return mock current weather data
            
            # Generate realistic current weather
            current_time = datetime.now()
            day_of_year = current_time.timetuple().tm_yday
            
            # Seasonal temperature
            temp_base = 25 + 10 * np.sin(2 * np.pi * (day_of_year - 80) / 365)
            temperature = temp_base + np.random.normal(0, 2)
            
            # Current conditions
            current_weather = {
                'timestamp': current_time.isoformat(),
                'location': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'temperature_celsius': round(temperature, 1),
                'feels_like_celsius': round(temperature + np.random.normal(0, 1), 1),
                'humidity_percent': round(60 + np.random.normal(0, 10), 1),
                'pressure_hpa': round(1013 + np.random.normal(0, 5), 1),
                'wind_speed_kmh': round(8 + np.random.exponential(2), 1),
                'wind_direction_degrees': np.random.randint(0, 360),
                'visibility_km': round(10 + np.random.normal(0, 2), 1),
                'uv_index': max(0, round(6 + np.random.normal(0, 2))),
                'cloud_cover_percent': np.random.randint(0, 100),
                'weather_condition': np.random.choice(['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain']),
                'rainfall_today_mm': max(0, round(np.random.exponential(2), 2))
            }
            
            return current_weather
            
        except Exception as e:
            logger.error(f"Error collecting current weather: {e}")
            raise
    
    def process_weather_data(self, raw_data: pd.DataFrame) -> pd.DataFrame:
        """
        Process and clean raw weather data
        
        Args:
            raw_data: Raw weather data DataFrame
            
        Returns:
            Processed and cleaned weather data
        """
        try:
            logger.info("Processing weather data...")
            
            df = raw_data.copy()
            
            # Ensure date column is datetime
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'])
            
            # Handle missing values
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            
            for col in numeric_columns:
                if col in df.columns:
                    # Fill missing values with interpolation
                    df[col] = df[col].interpolate(method='linear')
                    
                    # Fill remaining NaN values with median
                    df[col] = df[col].fillna(df[col].median())
            
            # Remove outliers using IQR method
            for col in ['temperature_celsius', 'humidity_percent', 'wind_speed_kmh']:
                if col in df.columns:
                    Q1 = df[col].quantile(0.25)
                    Q3 = df[col].quantile(0.75)
                    IQR = Q3 - Q1
                    
                    lower_bound = Q1 - 1.5 * IQR
                    upper_bound = Q3 + 1.5 * IQR
                    
                    # Cap outliers instead of removing them
                    df[col] = df[col].clip(lower=lower_bound, upper=upper_bound)
            
            # Add derived features
            if 'temperature_celsius' in df.columns and 'humidity_percent' in df.columns:
                # Heat index calculation (simplified)
                df['heat_index'] = df['temperature_celsius'] + 0.5 * (df['humidity_percent'] - 50) / 10
            
            # Add seasonal indicators
            if 'date' in df.columns:
                df['month'] = df['date'].dt.month
                df['day_of_year'] = df['date'].dt.dayofyear
                df['season'] = df['month'].map({
                    12: 'Winter', 1: 'Winter', 2: 'Winter',
                    3: 'Spring', 4: 'Spring', 5: 'Spring',
                    6: 'Summer', 7: 'Summer', 8: 'Summer',
                    9: 'Monsoon', 10: 'Monsoon', 11: 'Post-Monsoon'
                })
            
            # Add rolling averages
            window_sizes = [7, 30]
            for window in window_sizes:
                if 'rainfall_mm' in df.columns:
                    df[f'rainfall_rolling_{window}d'] = df['rainfall_mm'].rolling(window=window, min_periods=1).mean()
                if 'temperature_celsius' in df.columns:
                    df[f'temperature_rolling_{window}d'] = df['temperature_celsius'].rolling(window=window, min_periods=1).mean()
            
            logger.info(f"Weather data processing completed. Shape: {df.shape}")
            
            return df
            
        except Exception as e:
            logger.error(f"Error processing weather data: {e}")
            raise
    
    def calculate_weather_indices(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate various weather indices and indicators
        
        Args:
            data: Processed weather data
            
        Returns:
            Data with additional weather indices
        """
        try:
            logger.info("Calculating weather indices...")
            
            df = data.copy()
            
            # Drought index (simplified Palmer Drought Severity Index)
            if 'rainfall_mm' in df.columns:
                # Calculate 30-day cumulative rainfall
                df['rainfall_30d'] = df['rainfall_mm'].rolling(window=30, min_periods=1).sum()
                
                # Simple drought index based on rainfall deficit
                normal_rainfall_30d = df['rainfall_30d'].median()
                df['drought_index'] = (df['rainfall_30d'] - normal_rainfall_30d) / normal_rainfall_30d
                
                # Categorize drought severity
                df['drought_category'] = pd.cut(
                    df['drought_index'],
                    bins=[-np.inf, -0.5, -0.3, -0.1, 0.1, np.inf],
                    labels=['Severe Drought', 'Moderate Drought', 'Mild Drought', 'Normal', 'Wet']
                )
            
            # Heat stress index
            if 'temperature_celsius' in df.columns and 'humidity_percent' in df.columns:
                # Simplified heat stress calculation
                df['heat_stress_index'] = (df['temperature_celsius'] - 25) + (df['humidity_percent'] - 50) / 10
                df['heat_stress_category'] = pd.cut(
                    df['heat_stress_index'],
                    bins=[-np.inf, 0, 5, 10, np.inf],
                    labels=['Low', 'Moderate', 'High', 'Extreme']
                )
            
            # Growing degree days (base temperature 10°C)
            if 'temperature_celsius' in df.columns:
                df['growing_degree_days'] = np.maximum(0, df['temperature_celsius'] - 10)
                df['gdd_cumulative'] = df['growing_degree_days'].cumsum()
            
            # Rainfall intensity classification
            if 'rainfall_mm' in df.columns:
                df['rainfall_intensity'] = pd.cut(
                    df['rainfall_mm'],
                    bins=[0, 2.5, 10, 35, 65, np.inf],
                    labels=['No Rain', 'Light', 'Moderate', 'Heavy', 'Very Heavy']
                )
            
            logger.info("Weather indices calculation completed")
            
            return df
            
        except Exception as e:
            logger.error(f"Error calculating weather indices: {e}")
            raise
    
    def get_climate_normals(self, latitude: float, longitude: float, 
                           period_years: int = 30) -> Dict[str, Any]:
        """
        Get climate normals (long-term averages) for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            period_years: Number of years for climate normal calculation
            
        Returns:
            Climate normals data
        """
        try:
            logger.info(f"Calculating climate normals for {latitude}, {longitude}")
            
            # TODO: Implement actual climate normals calculation from historical data
            # For now, return mock climate normals
            
            # Generate mock climate normals based on location
            # Adjust for latitude (temperature decreases with latitude)
            temp_adjustment = (28.6 - latitude) * 0.5  # Rough adjustment
            
            climate_normals = {
                'location': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'period': f"{datetime.now().year - period_years}-{datetime.now().year}",
                'annual_averages': {
                    'temperature_celsius': round(25 + temp_adjustment, 1),
                    'rainfall_mm': 1150.0,
                    'humidity_percent': 68.5,
                    'wind_speed_kmh': 8.2
                },
                'monthly_averages': {
                    'temperature': [20.1, 23.2, 28.5, 33.1, 36.2, 34.8, 31.5, 30.2, 29.8, 26.4, 22.1, 19.8],
                    'rainfall': [15.2, 18.5, 22.1, 8.9, 12.3, 85.6, 195.4, 210.8, 165.2, 45.6, 8.2, 5.1],
                    'humidity': [65, 62, 58, 55, 58, 72, 82, 85, 78, 70, 68, 66]
                },
                'extremes': {
                    'max_temperature_celsius': 45.2,
                    'min_temperature_celsius': 2.1,
                    'max_daily_rainfall_mm': 285.6,
                    'max_wind_speed_kmh': 95.3
                },
                'seasonal_patterns': {
                    'monsoon_onset_date': '2024-06-15',
                    'monsoon_withdrawal_date': '2024-09-30',
                    'peak_summer_month': 'May',
                    'peak_winter_month': 'January'
                }
            }
            
            return climate_normals
            
        except Exception as e:
            logger.error(f"Error calculating climate normals: {e}")
            raise
    
    def export_data(self, data: pd.DataFrame, filepath: str, format: str = 'csv'):
        """
        Export processed weather data to file
        
        Args:
            data: Processed weather data
            filepath: Output file path
            format: Export format ('csv', 'json', 'parquet')
        """
        try:
            logger.info(f"Exporting weather data to {filepath}")
            
            if format.lower() == 'csv':
                data.to_csv(filepath, index=False)
            elif format.lower() == 'json':
                data.to_json(filepath, orient='records', date_format='iso')
            elif format.lower() == 'parquet':
                data.to_parquet(filepath, index=False)
            else:
                raise ValueError(f"Unsupported export format: {format}")
            
            logger.info(f"Weather data exported successfully to {filepath}")
            
        except Exception as e:
            logger.error(f"Error exporting weather data: {e}")
            raise
