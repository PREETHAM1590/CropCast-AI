"""
Crop Recommendation API routes for intelligent crop selection and planning
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None

class SoilConditions(BaseModel):
    ph_level: float
    nitrogen_kg_per_ha: float
    phosphorus_kg_per_ha: float
    potassium_kg_per_ha: float
    organic_carbon_percent: float
    soil_type: str

class CropRecommendationRequest(BaseModel):
    location: LocationRequest
    soil_conditions: SoilConditions
    planting_season: str  # kharif, rabi, zaid
    farm_size_hectares: float
    irrigation_available: bool
    budget_range: Optional[str] = None  # low, medium, high
    market_preference: Optional[str] = None  # local, export, processing

class CropRecommendation(BaseModel):
    crop_name: str
    variety: str
    suitability_score: float
    expected_yield_per_hectare: float
    water_requirement_mm: float
    growth_duration_days: int
    market_price_per_kg: float
    profit_potential: str
    risk_factors: List[str]
    cultivation_tips: List[str]

class CropRecommendationResponse(BaseModel):
    location: LocationRequest
    analysis_date: datetime
    season: str
    recommendations: List[CropRecommendation]
    market_analysis: Dict[str, Any]
    climate_suitability: Dict[str, Any]

@router.post("/recommend", response_model=CropRecommendationResponse)
async def recommend_crops(request: CropRecommendationRequest):
    """
    Get AI-powered crop recommendations based on location, soil, and market conditions
    
    Args:
        request: Crop recommendation request with all relevant parameters
        
    Returns:
        Ranked list of crop recommendations with detailed analysis
    """
    try:
        logger.info(f"Crop recommendation requested for {request.location.latitude}, {request.location.longitude}")
        
        # TODO: Implement actual ML-based crop recommendation system
        # For now, return mock recommendations based on soil and season
        
        mock_recommendations = []
        
        # Sample recommendations based on season and soil type
        if request.planting_season.lower() == "kharif":
            if request.soil_conditions.soil_type.lower() in ["loamy", "clay"]:
                mock_recommendations.extend([
                    CropRecommendation(
                        crop_name="Rice",
                        variety="Basmati 370",
                        suitability_score=0.92,
                        expected_yield_per_hectare=4500.0,
                        water_requirement_mm=1200.0,
                        growth_duration_days=120,
                        market_price_per_kg=45.0,
                        profit_potential="High",
                        risk_factors=["Blast disease", "Water logging"],
                        cultivation_tips=[
                            "Maintain 2-3 cm water level during vegetative stage",
                            "Apply nitrogen in 3 splits",
                            "Monitor for brown plant hopper"
                        ]
                    ),
                    CropRecommendation(
                        crop_name="Cotton",
                        variety="Bt Cotton Hybrid",
                        suitability_score=0.85,
                        expected_yield_per_hectare=2200.0,
                        water_requirement_mm=800.0,
                        growth_duration_days=180,
                        market_price_per_kg=85.0,
                        profit_potential="Medium-High",
                        risk_factors=["Bollworm attack", "Market price volatility"],
                        cultivation_tips=[
                            "Maintain proper plant spacing",
                            "Regular monitoring for pest attacks",
                            "Ensure good drainage"
                        ]
                    )
                ])
            
            if request.soil_conditions.soil_type.lower() in ["sandy", "sandy loam"]:
                mock_recommendations.append(
                    CropRecommendation(
                        crop_name="Pearl Millet",
                        variety="Hybrid Bajra",
                        suitability_score=0.88,
                        expected_yield_per_hectare=2800.0,
                        water_requirement_mm=400.0,
                        growth_duration_days=75,
                        market_price_per_kg=25.0,
                        profit_potential="Medium",
                        risk_factors=["Drought stress", "Bird damage"],
                        cultivation_tips=[
                            "Drought tolerant crop suitable for arid regions",
                            "Minimal water requirement",
                            "Good for intercropping"
                        ]
                    )
                )
        
        elif request.planting_season.lower() == "rabi":
            mock_recommendations.extend([
                CropRecommendation(
                    crop_name="Wheat",
                    variety="HD 2967",
                    suitability_score=0.90,
                    expected_yield_per_hectare=4200.0,
                    water_requirement_mm=450.0,
                    growth_duration_days=120,
                    market_price_per_kg=22.0,
                    profit_potential="High",
                    risk_factors=["Late blight", "Aphid attack"],
                    cultivation_tips=[
                        "Timely sowing is crucial",
                        "Apply balanced fertilizers",
                        "Monitor for yellow rust"
                    ]
                ),
                CropRecommendation(
                    crop_name="Mustard",
                    variety="Pusa Bold",
                    suitability_score=0.82,
                    expected_yield_per_hectare=1800.0,
                    water_requirement_mm=300.0,
                    growth_duration_days=90,
                    market_price_per_kg=55.0,
                    profit_potential="Medium-High",
                    risk_factors=["Aphid infestation", "White rust"],
                    cultivation_tips=[
                        "Good for oil extraction",
                        "Requires well-drained soil",
                        "Regular weeding essential"
                    ]
                )
            ])
        
        # Sort recommendations by suitability score
        mock_recommendations.sort(key=lambda x: x.suitability_score, reverse=True)
        
        # Mock market analysis
        market_analysis = {
            "current_trends": {
                "high_demand_crops": ["Rice", "Wheat", "Cotton"],
                "price_trends": "Stable to increasing",
                "export_opportunities": ["Basmati Rice", "Organic Cotton"]
            },
            "seasonal_factors": {
                "monsoon_dependency": 0.7,
                "irrigation_advantage": 0.3,
                "market_accessibility": "Good"
            },
            "risk_assessment": {
                "weather_risk": "Medium",
                "market_risk": "Low",
                "pest_disease_risk": "Medium"
            }
        }
        
        # Mock climate suitability
        climate_suitability = {
            "temperature_suitability": 0.85,
            "rainfall_suitability": 0.78,
            "humidity_suitability": 0.82,
            "overall_climate_score": 0.82,
            "climate_change_impact": "Moderate adaptation required"
        }
        
        return CropRecommendationResponse(
            location=request.location,
            analysis_date=datetime.now(),
            season=request.planting_season,
            recommendations=mock_recommendations,
            market_analysis=market_analysis,
            climate_suitability=climate_suitability
        )
        
    except Exception as e:
        logger.error(f"Error in crop recommendation: {e}")
        raise HTTPException(status_code=500, detail=f"Crop recommendation failed: {str(e)}")

@router.get("/crop-database")
async def get_crop_database(
    crop_name: Optional[str] = Query(None, description="Filter by crop name"),
    season: Optional[str] = Query(None, description="Filter by growing season"),
    soil_type: Optional[str] = Query(None, description="Filter by suitable soil type")
):
    """
    Get comprehensive crop database with cultivation requirements
    
    Args:
        crop_name: Optional crop name filter
        season: Optional season filter (kharif, rabi, zaid)
        soil_type: Optional soil type filter
        
    Returns:
        Filtered crop database with cultivation details
    """
    try:
        logger.info(f"Crop database requested with filters: crop={crop_name}, season={season}, soil={soil_type}")
        
        # TODO: Implement actual crop database query
        # For now, return mock database
        
        mock_crops = [
            {
                "crop_id": "CROP_001",
                "name": "Rice",
                "scientific_name": "Oryza sativa",
                "category": "Cereal",
                "seasons": ["Kharif"],
                "suitable_soil_types": ["Clay", "Loamy", "Clay Loam"],
                "water_requirement": {
                    "total_mm": 1200,
                    "critical_stages": ["Tillering", "Panicle initiation", "Grain filling"]
                },
                "nutrient_requirements": {
                    "nitrogen_kg_per_ha": 120,
                    "phosphorus_kg_per_ha": 60,
                    "potassium_kg_per_ha": 40
                },
                "climate_requirements": {
                    "temperature_range_celsius": [20, 35],
                    "rainfall_mm": [1000, 2000],
                    "humidity_percent": [70, 90]
                },
                "varieties": [
                    {"name": "Basmati 370", "duration_days": 120, "yield_potential": 4500},
                    {"name": "IR 64", "duration_days": 115, "yield_potential": 5000},
                    {"name": "Pusa 44", "duration_days": 110, "yield_potential": 4800}
                ],
                "market_info": {
                    "average_price_per_kg": 25.0,
                    "demand_level": "High",
                    "export_potential": "High"
                }
            },
            {
                "crop_id": "CROP_002",
                "name": "Wheat",
                "scientific_name": "Triticum aestivum",
                "category": "Cereal",
                "seasons": ["Rabi"],
                "suitable_soil_types": ["Loamy", "Clay Loam", "Sandy Loam"],
                "water_requirement": {
                    "total_mm": 450,
                    "critical_stages": ["Crown root initiation", "Jointing", "Grain filling"]
                },
                "nutrient_requirements": {
                    "nitrogen_kg_per_ha": 150,
                    "phosphorus_kg_per_ha": 60,
                    "potassium_kg_per_ha": 40
                },
                "climate_requirements": {
                    "temperature_range_celsius": [15, 25],
                    "rainfall_mm": [300, 600],
                    "humidity_percent": [50, 70]
                },
                "varieties": [
                    {"name": "HD 2967", "duration_days": 120, "yield_potential": 4200},
                    {"name": "PBW 343", "duration_days": 125, "yield_potential": 4500},
                    {"name": "WH 147", "duration_days": 115, "yield_potential": 4000}
                ],
                "market_info": {
                    "average_price_per_kg": 22.0,
                    "demand_level": "Very High",
                    "export_potential": "Medium"
                }
            }
        ]
        
        # Apply filters
        filtered_crops = mock_crops
        
        if crop_name:
            filtered_crops = [crop for crop in filtered_crops if crop_name.lower() in crop["name"].lower()]
        
        if season:
            filtered_crops = [crop for crop in filtered_crops if season.title() in crop["seasons"]]
        
        if soil_type:
            filtered_crops = [crop for crop in filtered_crops if any(soil_type.title() in soil for soil in crop["suitable_soil_types"])]
        
        return {
            "total_crops": len(filtered_crops),
            "filters_applied": {
                "crop_name": crop_name,
                "season": season,
                "soil_type": soil_type
            },
            "crops": filtered_crops
        }
        
    except Exception as e:
        logger.error(f"Error retrieving crop database: {e}")
        raise HTTPException(status_code=500, detail=f"Crop database retrieval failed: {str(e)}")

@router.get("/market-prices")
async def get_market_prices(
    crop_name: Optional[str] = Query(None, description="Crop name"),
    state: Optional[str] = Query(None, description="State name"),
    market: Optional[str] = Query(None, description="Market name")
):
    """
    Get current market prices for crops
    
    Args:
        crop_name: Optional crop name filter
        state: Optional state filter
        market: Optional market filter
        
    Returns:
        Current market prices and trends
    """
    try:
        logger.info(f"Market prices requested for crop={crop_name}, state={state}, market={market}")
        
        # TODO: Implement actual market price data scraping/API integration
        # For now, return mock market data
        
        mock_market_data = [
            {
                "crop_name": "Rice",
                "variety": "Common",
                "state": "Punjab",
                "market": "Ludhiana",
                "price_per_quintal": 2250.0,
                "price_date": datetime.now().date().isoformat(),
                "price_trend": "Stable",
                "quality": "FAQ",
                "arrival_tonnes": 1250.5
            },
            {
                "crop_name": "Wheat",
                "variety": "Sharbati",
                "state": "Madhya Pradesh",
                "market": "Bhopal",
                "price_per_quintal": 2180.0,
                "price_date": datetime.now().date().isoformat(),
                "price_trend": "Increasing",
                "quality": "FAQ",
                "arrival_tonnes": 890.2
            },
            {
                "crop_name": "Cotton",
                "variety": "Medium Staple",
                "state": "Gujarat",
                "market": "Rajkot",
                "price_per_quintal": 8500.0,
                "price_date": datetime.now().date().isoformat(),
                "price_trend": "Decreasing",
                "quality": "FAQ",
                "arrival_tonnes": 456.8
            }
        ]
        
        # Apply filters
        filtered_data = mock_market_data
        
        if crop_name:
            filtered_data = [item for item in filtered_data if crop_name.lower() in item["crop_name"].lower()]
        
        if state:
            filtered_data = [item for item in filtered_data if state.lower() in item["state"].lower()]
        
        if market:
            filtered_data = [item for item in filtered_data if market.lower() in item["market"].lower()]
        
        return {
            "total_records": len(filtered_data),
            "last_updated": datetime.now().isoformat(),
            "market_data": filtered_data,
            "price_summary": {
                "highest_price": max([item["price_per_quintal"] for item in filtered_data]) if filtered_data else 0,
                "lowest_price": min([item["price_per_quintal"] for item in filtered_data]) if filtered_data else 0,
                "average_price": sum([item["price_per_quintal"] for item in filtered_data]) / len(filtered_data) if filtered_data else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Error retrieving market prices: {e}")
        raise HTTPException(status_code=500, detail=f"Market price retrieval failed: {str(e)}")
