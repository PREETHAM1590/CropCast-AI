"""
FastAPI application for WeatherCrop AI Platform
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import logging
from typing import Dict, Any

from utils.config import get_config

logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    
    config = get_config()
    
    app = FastAPI(
        title="WeatherCrop AI Platform",
        description="AI-powered agricultural platform for rainfall prediction, flood risk assessment, and crop recommendations",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    from api.routes import weather, soil, crops, predictions, dashboard
    
    app.include_router(weather.router, prefix="/api/v1/weather", tags=["Weather"])
    app.include_router(soil.router, prefix="/api/v1/soil", tags=["Soil Analysis"])
    app.include_router(crops.router, prefix="/api/v1/crops", tags=["Crop Recommendations"])
    app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["Predictions"])
    app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
    
    @app.get("/", response_class=HTMLResponse)
    async def root():
        """Root endpoint with platform information"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>WeatherCrop AI Platform</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #2c5530; text-align: center; }
                .feature { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #28a745; }
                .api-link { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
                .api-link:hover { background: #0056b3; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🌾 WeatherCrop AI Platform</h1>
                <p>Welcome to the AI-powered agricultural platform that predicts rainfall, flood risks, and recommends optimal crops.</p>
                
                <div class="feature">
                    <h3>🌧️ Rainfall Prediction</h3>
                    <p>LSTM/ARIMA models trained on IMD historical data for accurate rainfall forecasting.</p>
                </div>
                
                <div class="feature">
                    <h3>🌊 Flood Risk Assessment</h3>
                    <p>Random Forest classifier for flood probability mapping with detailed risk scores.</p>
                </div>
                
                <div class="feature">
                    <h3>🌱 Smart Soil Analysis</h3>
                    <p>Computer Vision on satellite imagery for comprehensive soil health analysis.</p>
                </div>
                
                <div class="feature">
                    <h3>🌾 Crop Recommendations</h3>
                    <p>Multi-factor AI considering weather, soil, and market data for optimal crop selection.</p>
                </div>
                
                <div class="feature">
                    <h3>📈 Yield Prediction</h3>
                    <p>Deep learning models for accurate crop yield forecasting.</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="/docs" class="api-link">📚 API Documentation</a>
                    <a href="/redoc" class="api-link">📖 ReDoc</a>
                    <a href="/api/v1/dashboard/status" class="api-link">📊 System Status</a>
                </div>
            </div>
        </body>
        </html>
        """
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {
            "status": "healthy",
            "service": "WeatherCrop AI Platform",
            "version": "1.0.0"
        }
    
    @app.on_event("startup")
    async def startup_event():
        """Application startup event"""
        logger.info("WeatherCrop AI Platform starting up...")
        
        # Initialize any required services here
        # For example: database connections, model loading, etc.
        
        logger.info("WeatherCrop AI Platform startup complete")
    
    @app.on_event("shutdown")
    async def shutdown_event():
        """Application shutdown event"""
        logger.info("WeatherCrop AI Platform shutting down...")
        
        # Cleanup any resources here
        
        logger.info("WeatherCrop AI Platform shutdown complete")
    
    return app

app = create_app()
