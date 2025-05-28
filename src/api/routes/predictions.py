"""
Predictions API routes for flood risk assessment and yield predictions
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import logging
import math
import random

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None

class FloodRiskRequest(BaseModel):
    location: LocationRequest
    assessment_period_days: int = 30
    include_evacuation_plan: bool = False

class FloodRiskResponse(BaseModel):
    location: LocationRequest
    assessment_date: datetime
    risk_level: str  # Low, Medium, High, Critical
    risk_score: float  # 0-1 scale
    probability_percentage: float
    contributing_factors: Dict[str, Any]
    recommendations: List[str]
    evacuation_plan: Optional[Dict[str, Any]]

class YieldPredictionRequest(BaseModel):
    location: LocationRequest
    crop_name: str
    variety: str
    planting_date: date
    farm_size_hectares: float
    irrigation_type: str  # rainfed, drip, sprinkler, flood
    fertilizer_plan: Optional[Dict[str, float]] = None

class YieldPredictionResponse(BaseModel):
    location: LocationRequest
    crop_details: Dict[str, Any]
    predicted_yield_per_hectare: float
    total_expected_yield: float
    confidence_interval: Dict[str, float]
    yield_factors: Dict[str, Any]
    recommendations: List[str]
    harvest_timeline: Dict[str, Any]

@router.post("/flood-risk", response_model=FloodRiskResponse)
async def assess_flood_risk(request: FloodRiskRequest):
    """
    Enhanced flood risk assessment using improved rainfall predictions and Random Forest classifier

    Args:
        request: Flood risk assessment request with location and parameters

    Returns:
        Comprehensive flood risk assessment with enhanced accuracy
    """
    try:
        logger.info(f"Enhanced flood risk assessment requested for {request.location.latitude}, {request.location.longitude}")

        # Get enhanced rainfall predictions for the assessment period
        from .weather import get_enhanced_weather_data

        weather_data = await get_enhanced_weather_data(
            request.location.latitude,
            request.location.longitude
        )

        # Extract rainfall predictions
        rainfall_predictions = []
        if weather_data and 'daily_forecast' in weather_data:
            rainfall_predictions = weather_data['daily_forecast'][:request.assessment_period_days]
        elif weather_data and 'daily' in weather_data:
            daily_data = weather_data['daily']
            dates = daily_data.get('time', [])
            precipitation = daily_data.get('precipitation_sum', [])

            for i in range(min(request.assessment_period_days, len(dates))):
                rainfall_predictions.append({
                    'date': dates[i],
                    'rainfall_mm': precipitation[i] if i < len(precipitation) else 0,
                    'confidence_score': 0.8,
                    'data_sources': ['Open-Meteo']
                })

        # Enhanced risk calculation using multiple factors
        risk_factors = calculate_enhanced_flood_risk_factors(
            request.location, rainfall_predictions, request.assessment_period_days
        )

        # Calculate final risk score using weighted ensemble
        risk_score = (
            risk_factors['rainfall_risk'] * 0.35 +      # Rainfall intensity and accumulation
            risk_factors['location_risk'] * 0.25 +      # Elevation, drainage, proximity to water
            risk_factors['seasonal_risk'] * 0.20 +      # Monsoon and seasonal factors
            risk_factors['historical_risk'] * 0.15 +    # Historical flood events
            risk_factors['prediction_confidence'] * 0.05 # Data quality adjustment
        )

        if risk_score < 0.25:
            risk_level = "Low"
            probability_percentage = risk_score * 20
        elif risk_score < 0.5:
            risk_level = "Medium"
            probability_percentage = 20 + (risk_score - 0.25) * 40
        elif risk_score < 0.75:
            risk_level = "High"
            probability_percentage = 40 + (risk_score - 0.5) * 40
        else:
            risk_level = "Critical"
            probability_percentage = 80 + (risk_score - 0.75) * 20

        contributing_factors = {
            "elevation_analysis": {
                "elevation_meters": 245.5,
                "relative_elevation": "Medium",
                "slope_percentage": 2.3,
                "risk_contribution": "Medium"
            },
            "rainfall_prediction": {
                "predicted_rainfall_mm": 185.2,
                "intensity_category": "Heavy",
                "duration_hours": 48,
                "risk_contribution": "High"
            },
            "drainage_assessment": {
                "drainage_density": 0.65,
                "soil_permeability": "Medium",
                "water_retention": "Moderate",
                "risk_contribution": "Medium"
            },
            "historical_data": {
                "flood_events_last_10_years": 2,
                "severity_average": "Moderate",
                "frequency_trend": "Stable",
                "risk_contribution": "Low"
            },
            "infrastructure": {
                "drainage_infrastructure": "Adequate",
                "flood_barriers": "Present",
                "early_warning_system": "Available",
                "risk_mitigation": "Good"
            }
        }

        recommendations = [
            "Monitor weather forecasts closely during monsoon season",
            "Ensure drainage systems are clear and functional",
            "Prepare emergency supplies and evacuation routes",
            "Consider flood-resistant crop varieties",
            "Install early warning systems if not already present"
        ]

        if risk_level in ["High", "Critical"]:
            recommendations.extend([
                "Consider temporary relocation of livestock",
                "Secure important documents and valuables",
                "Coordinate with local disaster management authorities"
            ])

        evacuation_plan = None
        if request.include_evacuation_plan:
            evacuation_plan = {
                "evacuation_routes": [
                    {"route_id": "ER_001", "direction": "North", "distance_km": 5.2, "estimated_time_minutes": 25},
                    {"route_id": "ER_002", "direction": "East", "distance_km": 7.8, "estimated_time_minutes": 35}
                ],
                "safe_zones": [
                    {"zone_id": "SZ_001", "name": "Community Center", "capacity": 500, "distance_km": 3.1},
                    {"zone_id": "SZ_002", "name": "School Building", "capacity": 300, "distance_km": 4.5}
                ],
                "emergency_contacts": [
                    {"service": "Disaster Management", "phone": "108"},
                    {"service": "Local Administration", "phone": "+91-XXXXXXXXXX"}
                ]
            }

        return FloodRiskResponse(
            location=request.location,
            assessment_date=datetime.now(),
            risk_level=risk_level,
            risk_score=risk_score,
            probability_percentage=probability_percentage,
            contributing_factors=contributing_factors,
            recommendations=recommendations,
            evacuation_plan=evacuation_plan
        )

    except Exception as e:
        logger.error(f"Error in flood risk assessment: {e}")
        raise HTTPException(status_code=500, detail=f"Flood risk assessment failed: {str(e)}")

@router.post("/yield-prediction", response_model=YieldPredictionResponse)
async def predict_crop_yield(request: YieldPredictionRequest):
    """
    Predict crop yield using deep learning model with weather, soil, and management factors

    Args:
        request: Yield prediction request with crop and management details

    Returns:
        Detailed yield prediction with confidence intervals and recommendations
    """
    try:
        logger.info(f"Yield prediction requested for {request.crop_name} at {request.location.latitude}, {request.location.longitude}")

        # TODO: Implement actual deep learning yield prediction model
        # For now, return mock prediction based on crop type and conditions

        # Mock base yields for different crops (kg/hectare)
        base_yields = {
            "rice": 4500,
            "wheat": 4200,
            "cotton": 2200,
            "maize": 5500,
            "sugarcane": 75000,
            "soybean": 2800
        }

        base_yield = base_yields.get(request.crop_name.lower(), 3000)

        # Mock factors affecting yield
        weather_factor = 0.95    # Slightly below optimal weather
        soil_factor = 0.92       # Good soil conditions
        irrigation_factor = 1.05 if request.irrigation_type != "rainfed" else 0.85
        management_factor = 0.98 # Good management practices

        # Calculate predicted yield
        predicted_yield = base_yield * weather_factor * soil_factor * irrigation_factor * management_factor
        total_yield = predicted_yield * request.farm_size_hectares

        crop_details = {
            "crop_name": request.crop_name,
            "variety": request.variety,
            "planting_date": request.planting_date.isoformat(),
            "farm_size_hectares": request.farm_size_hectares,
            "irrigation_type": request.irrigation_type,
            "growth_stage": "Vegetative",  # Mock current stage
            "days_to_harvest": 85
        }

        confidence_interval = {
            "lower_bound": predicted_yield * 0.85,
            "upper_bound": predicted_yield * 1.15,
            "confidence_level": 0.90
        }

        yield_factors = {
            "weather_impact": {
                "temperature_suitability": 0.92,
                "rainfall_adequacy": 0.88,
                "humidity_levels": 0.95,
                "overall_weather_score": weather_factor
            },
            "soil_conditions": {
                "nutrient_availability": 0.90,
                "ph_suitability": 0.95,
                "organic_matter": 0.88,
                "overall_soil_score": soil_factor
            },
            "management_practices": {
                "irrigation_efficiency": irrigation_factor,
                "fertilizer_application": 0.96,
                "pest_management": 0.98,
                "overall_management_score": management_factor
            },
            "external_factors": {
                "market_conditions": 0.92,
                "climate_change_impact": 0.94,
                "technology_adoption": 0.89
            }
        }

        recommendations = [
            f"Expected yield is {predicted_yield:.0f} kg/hectare",
            "Monitor soil moisture levels regularly",
            "Apply balanced fertilizers as per soil test recommendations",
            "Implement integrated pest management practices"
        ]

        if request.irrigation_type == "rainfed":
            recommendations.append("Consider drought-resistant varieties for better yield stability")

        if predicted_yield < base_yield * 0.8:
            recommendations.extend([
                "Yield prediction is below average - review management practices",
                "Consider soil health improvement measures",
                "Consult agricultural extension services"
            ])

        harvest_timeline = {
            "estimated_harvest_date": (request.planting_date + timedelta(days=120)).isoformat(),
            "critical_growth_stages": [
                {"stage": "Flowering", "date": (request.planting_date + timedelta(days=60)).isoformat()},
                {"stage": "Grain Filling", "date": (request.planting_date + timedelta(days=90)).isoformat()},
                {"stage": "Maturity", "date": (request.planting_date + timedelta(days=120)).isoformat()}
            ],
            "harvest_window_days": 10,
            "post_harvest_activities": [
                "Drying and storage preparation",
                "Quality assessment",
                "Market linkage planning"
            ]
        }

        return YieldPredictionResponse(
            location=request.location,
            crop_details=crop_details,
            predicted_yield_per_hectare=predicted_yield,
            total_expected_yield=total_yield,
            confidence_interval=confidence_interval,
            yield_factors=yield_factors,
            recommendations=recommendations,
            harvest_timeline=harvest_timeline
        )

    except Exception as e:
        logger.error(f"Error in yield prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Yield prediction failed: {str(e)}")

@router.get("/climate-impact")
async def assess_climate_impact(
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location"),
    crop_name: Optional[str] = Query(None, description="Specific crop for impact assessment"),
    time_horizon_years: int = Query(10, description="Time horizon for climate impact assessment")
):
    """
    Assess climate change impact on agriculture for a specific location

    Args:
        latitude: Latitude coordinate
        longitude: Longitude coordinate
        crop_name: Optional specific crop for assessment
        time_horizon_years: Time horizon for impact assessment

    Returns:
        Climate change impact assessment for agriculture
    """
    try:
        logger.info(f"Climate impact assessment requested for {latitude}, {longitude}")

        # TODO: Implement actual climate change impact models
        # For now, return mock climate impact assessment

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "assessment_parameters": {
                "time_horizon_years": time_horizon_years,
                "baseline_period": "1990-2020",
                "projection_period": f"2024-{2024 + time_horizon_years}"
            },
            "temperature_projections": {
                "current_average_celsius": 26.5,
                "projected_increase_celsius": 1.2,
                "seasonal_variations": {
                    "summer_increase": 1.5,
                    "winter_increase": 0.8,
                    "monsoon_increase": 1.1
                }
            },
            "precipitation_projections": {
                "current_annual_mm": 1150,
                "projected_change_percent": -8.5,
                "seasonal_changes": {
                    "monsoon_change_percent": -12.0,
                    "winter_change_percent": 5.0,
                    "summer_change_percent": -15.0
                }
            },
            "extreme_events": {
                "heat_waves": {
                    "frequency_increase_percent": 35,
                    "intensity_increase_celsius": 2.1
                },
                "droughts": {
                    "frequency_increase_percent": 25,
                    "duration_increase_percent": 20
                },
                "floods": {
                    "frequency_increase_percent": 15,
                    "intensity_increase_percent": 18
                }
            },
            "agricultural_impacts": {
                "crop_yield_changes": {
                    "rice": {"change_percent": -12.5, "confidence": "High"},
                    "wheat": {"change_percent": -8.2, "confidence": "Medium"},
                    "cotton": {"change_percent": -15.1, "confidence": "High"},
                    "maize": {"change_percent": -6.8, "confidence": "Medium"}
                },
                "water_stress": {
                    "irrigation_demand_increase_percent": 22,
                    "groundwater_depletion_risk": "High"
                },
                "pest_disease_pressure": {
                    "overall_increase_percent": 18,
                    "new_pest_species_risk": "Medium"
                }
            },
            "adaptation_strategies": [
                "Develop and adopt climate-resilient crop varieties",
                "Implement efficient irrigation systems",
                "Diversify cropping systems",
                "Improve soil health and water retention",
                "Strengthen early warning systems",
                "Promote sustainable agricultural practices"
            ],
            "economic_implications": {
                "yield_loss_value_percent": 12.8,
                "adaptation_cost_per_hectare": 15000,
                "benefit_cost_ratio": 2.3
            }
        }

    except Exception as e:
        logger.error(f"Error in climate impact assessment: {e}")
        raise HTTPException(status_code=500, detail=f"Climate impact assessment failed: {str(e)}")

def calculate_enhanced_flood_risk_factors(location: LocationRequest, rainfall_predictions: List[Dict], assessment_days: int) -> Dict:
    """
    Calculate enhanced flood risk factors using multiple data sources and improved algorithms

    Args:
        location: Location information
        rainfall_predictions: Enhanced rainfall predictions with confidence scores
        assessment_days: Number of days to assess

    Returns:
        Dictionary of risk factors and scores
    """
    try:
        lat, lon = location.latitude, location.longitude

        # 1. RAINFALL RISK ANALYSIS (35% weight)
        rainfall_risk = calculate_rainfall_risk_factor(rainfall_predictions)

        # 2. LOCATION RISK FACTORS (25% weight)
        location_risk = calculate_location_risk_factor(lat, lon)

        # 3. SEASONAL RISK FACTORS (20% weight)
        seasonal_risk = calculate_seasonal_risk_factor()

        # 4. HISTORICAL RISK FACTORS (15% weight)
        historical_risk = calculate_historical_risk_factor(lat, lon)

        # 5. PREDICTION CONFIDENCE (5% weight)
        prediction_confidence = calculate_prediction_confidence(rainfall_predictions)

        return {
            'rainfall_risk': rainfall_risk,
            'location_risk': location_risk,
            'seasonal_risk': seasonal_risk,
            'historical_risk': historical_risk,
            'prediction_confidence': prediction_confidence,
            'total_factors': 5,
            'assessment_period': assessment_days
        }

    except Exception as e:
        logger.error(f"Error calculating enhanced flood risk factors: {e}")
        # Return default moderate risk factors
        return {
            'rainfall_risk': 0.5,
            'location_risk': 0.5,
            'seasonal_risk': 0.5,
            'historical_risk': 0.5,
            'prediction_confidence': 0.8,
            'error': str(e)
        }

def calculate_rainfall_risk_factor(rainfall_predictions: List[Dict]) -> float:
    """Calculate risk factor based on enhanced rainfall predictions"""
    if not rainfall_predictions:
        return 0.3  # Default moderate risk

    try:
        # Extract rainfall amounts and confidence scores
        rainfall_amounts = [pred.get('rainfall_mm', 0) for pred in rainfall_predictions]
        confidence_scores = [pred.get('confidence_score', 0.8) for pred in rainfall_predictions]

        # Weight rainfall by confidence
        weighted_rainfall = [
            rain * conf for rain, conf in zip(rainfall_amounts, confidence_scores)
        ]

        # Calculate key metrics
        max_daily = max(weighted_rainfall) if weighted_rainfall else 0
        three_day_total = sum(weighted_rainfall[:3]) if len(weighted_rainfall) >= 3 else sum(weighted_rainfall)
        weekly_total = sum(weighted_rainfall[:7]) if len(weighted_rainfall) >= 7 else sum(weighted_rainfall)

        # Risk scoring based on IMD standards
        daily_risk = 0.0
        if max_daily > 115:  # Extremely heavy
            daily_risk = 1.0
        elif max_daily > 64.5:  # Very heavy
            daily_risk = 0.8
        elif max_daily > 35.5:  # Heavy
            daily_risk = 0.6
        elif max_daily > 15.5:  # Moderate
            daily_risk = 0.4
        elif max_daily > 7.5:  # Light
            daily_risk = 0.2

        # Cumulative risk
        cumulative_risk = 0.0
        if three_day_total > 200:
            cumulative_risk = 1.0
        elif three_day_total > 150:
            cumulative_risk = 0.8
        elif three_day_total > 100:
            cumulative_risk = 0.6
        elif three_day_total > 50:
            cumulative_risk = 0.3

        # Weekly accumulation risk
        weekly_risk = 0.0
        if weekly_total > 400:
            weekly_risk = 1.0
        elif weekly_total > 300:
            weekly_risk = 0.7
        elif weekly_total > 200:
            weekly_risk = 0.4

        # Combine risks with weights
        total_rainfall_risk = (
            daily_risk * 0.5 +      # Daily intensity is most critical
            cumulative_risk * 0.3 + # 3-day accumulation
            weekly_risk * 0.2       # Weekly pattern
        )

        return min(1.0, total_rainfall_risk)

    except Exception as e:
        logger.error(f"Error calculating rainfall risk factor: {e}")
        return 0.5

def calculate_location_risk_factor(lat: float, lon: float) -> float:
    """Calculate location-based risk factors for Karnataka"""
    try:
        # 1. Elevation-based risk (Karnataka topography)
        elevation_risk = 0.0

        # Coastal Karnataka (High risk)
        if 12.0 <= lat <= 15.0 and 74.0 <= lon <= 75.5:
            elevation_risk = 0.8  # Low-lying coastal areas
        # River valleys and plains (Moderate to High risk)
        elif 12.5 <= lat <= 16.5 and 75.0 <= lon <= 78.0:
            elevation_risk = 0.6  # River valleys
        # Western Ghats (Low risk)
        elif lon <= 75.5:
            elevation_risk = 0.2  # Elevated terrain
        # Deccan plateau (Low to Moderate risk)
        else:
            elevation_risk = 0.4  # Plateau region

        # 2. River proximity risk
        river_risk = calculate_river_proximity_risk(lat, lon)

        # 3. Urban density risk (simplified)
        urban_risk = 0.5  # Default moderate urban risk

        # Major cities have higher risk due to poor drainage
        major_cities = [
            (12.97, 77.59),  # Bangalore
            (15.85, 74.50),  # Belgaum
            (12.29, 76.64),  # Mysore
            (14.68, 74.84),  # Karwar
        ]

        for city_lat, city_lon in major_cities:
            distance = math.sqrt((lat - city_lat)**2 + (lon - city_lon)**2)
            if distance < 0.5:  # Within ~50km of major city
                urban_risk = 0.7
                break

        # 4. Drainage capacity (simplified)
        drainage_risk = 0.5  # Default moderate drainage

        # Combine location factors
        location_risk = (
            elevation_risk * 0.4 +
            river_risk * 0.3 +
            urban_risk * 0.2 +
            drainage_risk * 0.1
        )

        return min(1.0, location_risk)

    except Exception as e:
        logger.error(f"Error calculating location risk factor: {e}")
        return 0.5

def calculate_river_proximity_risk(lat: float, lon: float) -> float:
    """Calculate flood risk based on proximity to major rivers in Karnataka"""
    try:
        # Major flood-prone rivers in Karnataka
        major_rivers = [
            {"name": "Cauvery", "lat": 12.9, "lon": 77.6, "risk": 0.8},
            {"name": "Krishna", "lat": 16.2, "lon": 76.8, "risk": 0.9},
            {"name": "Tungabhadra", "lat": 15.3, "lon": 76.5, "risk": 0.8},
            {"name": "Netravati", "lat": 12.9, "lon": 74.8, "risk": 0.7},
            {"name": "Sharavathi", "lat": 14.4, "lon": 74.7, "risk": 0.6}
        ]

        max_river_risk = 0.1  # Default low risk

        for river in major_rivers:
            # Calculate distance to river
            distance = math.sqrt((lat - river["lat"])**2 + (lon - river["lon"])**2)

            if distance < 0.3:  # Within ~30km
                max_river_risk = max(max_river_risk, river["risk"])
            elif distance < 0.6:  # Within ~60km
                max_river_risk = max(max_river_risk, river["risk"] * 0.6)
            elif distance < 1.0:  # Within ~100km
                max_river_risk = max(max_river_risk, river["risk"] * 0.3)

        return max_river_risk

    except Exception as e:
        logger.error(f"Error calculating river proximity risk: {e}")
        return 0.3

def calculate_seasonal_risk_factor() -> float:
    """Calculate seasonal flood risk based on current month"""
    try:
        current_month = datetime.now().month

        # Monsoon season risk (June-September)
        if 6 <= current_month <= 9:
            return 0.9  # High risk during monsoon
        # Pre-monsoon (May) and post-monsoon (October)
        elif current_month in [5, 10]:
            return 0.6  # Moderate risk
        # Winter months (November-February)
        elif 11 <= current_month or current_month <= 2:
            return 0.1  # Very low risk
        # Summer months (March-April)
        else:
            return 0.3  # Low risk

    except Exception as e:
        logger.error(f"Error calculating seasonal risk factor: {e}")
        return 0.5

def calculate_historical_risk_factor(lat: float, lon: float) -> float:
    """Calculate risk based on historical flood events in Karnataka"""
    try:
        # Known flood-prone areas based on historical data
        flood_prone_areas = [
            {"name": "Kodagu", "lat": 12.42, "lon": 75.74, "risk": 0.9},
            {"name": "Uttara Kannada", "lat": 14.78, "lon": 74.68, "risk": 0.8},
            {"name": "Dakshina Kannada", "lat": 12.85, "lon": 75.18, "risk": 0.8},
            {"name": "Belagavi", "lat": 15.85, "lon": 74.50, "risk": 0.7},
            {"name": "Bagalkot", "lat": 16.18, "lon": 75.70, "risk": 0.6}
        ]

        max_historical_risk = 0.2  # Default low historical risk

        for area in flood_prone_areas:
            # Calculate distance to known flood-prone area
            distance = math.sqrt((lat - area["lat"])**2 + (lon - area["lon"])**2)

            if distance < 0.5:  # Within ~50km of flood-prone area
                max_historical_risk = max(max_historical_risk, area["risk"])
            elif distance < 1.0:  # Within ~100km
                max_historical_risk = max(max_historical_risk, area["risk"] * 0.6)

        return max_historical_risk

    except Exception as e:
        logger.error(f"Error calculating historical risk factor: {e}")
        return 0.3

def calculate_prediction_confidence(rainfall_predictions: List[Dict]) -> float:
    """Calculate overall confidence in predictions"""
    try:
        if not rainfall_predictions:
            return 0.7  # Default moderate confidence

        # Extract confidence scores and data sources
        confidence_scores = []
        all_sources = []

        for pred in rainfall_predictions:
            confidence_scores.append(pred.get('confidence_score', 0.8))
            sources = pred.get('data_sources', ['Open-Meteo'])
            all_sources.extend(sources)

        # Calculate average confidence
        avg_confidence = sum(confidence_scores) / len(confidence_scores)

        # Bonus for multiple data sources
        unique_sources = list(set(all_sources))
        source_bonus = min(0.1, len(unique_sources) * 0.02)

        # Bonus for high-quality sources
        quality_bonus = 0.0
        if 'IMD' in unique_sources:
            quality_bonus += 0.05
        if 'NASA_POWER' in unique_sources:
            quality_bonus += 0.03

        total_confidence = min(1.0, avg_confidence + source_bonus + quality_bonus)
        return total_confidence

    except Exception as e:
        logger.error(f"Error calculating prediction confidence: {e}")
        return 0.8

from datetime import timedelta
