"""
WeatherCrop AI Platform - Main Application Entry Point
"""

import sys
import os
import asyncio
import logging
from pathlib import Path

# Add src directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.config import get_config
from api.app import create_app

logger = logging.getLogger(__name__)

def setup_directories():
    """Create necessary directories if they don't exist"""
    directories = [
        "data/raw",
        "data/processed",
        "data/models",
        "logs",
        "notebooks/outputs"
    ]

    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        logger.info(f"Ensured directory exists: {directory}")

def check_dependencies():
    """Check if all required dependencies are available"""
    # Map package names to their import names
    required_packages = {
        'pandas': 'pandas',
        'numpy': 'numpy',
        'fastapi': 'fastapi',
        'uvicorn': 'uvicorn',
        'yaml': 'yaml'
    }

    # Optional packages that won't prevent startup
    optional_packages = {
        'tensorflow': 'tensorflow',
        'sklearn': 'scikit-learn'
    }

    missing_required = []
    missing_optional = []

    # Check required packages
    for import_name, package_name in required_packages.items():
        try:
            __import__(import_name)
        except ImportError:
            missing_required.append(package_name)

    # Check optional packages
    for import_name, package_name in optional_packages.items():
        try:
            __import__(import_name)
        except ImportError:
            missing_optional.append(package_name)
            logger.warning(f"Optional package not available: {package_name}")

    if missing_required:
        logger.error(f"Missing required packages: {missing_required}")
        logger.error("Please install requirements: pip install -r requirements.txt")
        return False

    if missing_optional:
        logger.info(f"Optional packages not available: {missing_optional}")
        logger.info("Some AI features may not work without these packages")

    logger.info("All required dependencies are available")
    return True

def main():
    """Main application entry point"""
    print("🌾 WeatherCrop AI Platform Starting...")

    try:
        # Load configuration
        config = get_config()
        logger.info("Configuration loaded successfully")

        # Setup directories
        setup_directories()

        # Check dependencies
        if not check_dependencies():
            sys.exit(1)

        # Get app configuration
        app_config = config.get_app_config()

        print(f"🚀 Starting server on {app_config.host}:{app_config.port}")
        print(f"📊 Debug mode: {app_config.debug}")
        print(f"📝 Log level: {app_config.log_level}")

        # Create and run the FastAPI application
        app = create_app()

        import uvicorn
        uvicorn.run(
            app,
            host=app_config.host,
            port=app_config.port,
            log_level=app_config.log_level.lower()
        )

    except KeyboardInterrupt:
        logger.info("Application stopped by user")
        print("\n👋 WeatherCrop AI Platform stopped")
    except Exception as e:
        logger.error(f"Application error: {e}")
        print(f"❌ Error starting application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
