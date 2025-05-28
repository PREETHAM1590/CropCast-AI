#!/usr/bin/env python3
"""
Test script to verify WeatherCrop AI Platform installation
"""

import sys
import os
import importlib
from datetime import datetime

def test_python_version():
    """Test Python version compatibility"""
    print("🐍 Testing Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.8+")
        return False

def test_dependencies():
    """Test required dependencies"""
    print("\n📦 Testing dependencies...")

    required_packages = [
        'pandas', 'numpy', 'matplotlib', 'seaborn', 'requests',
        'yaml', 'fastapi', 'uvicorn', 'pydantic'
    ]

    optional_packages = [
        'tensorflow', 'scikit-learn', 'statsmodels', 'opencv-python',
        'geopandas', 'rasterio', 'folium'
    ]

    missing_required = []
    missing_optional = []

    # Test required packages
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - REQUIRED")
            missing_required.append(package)

    # Test optional packages
    for package in optional_packages:
        try:
            importlib.import_module(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ⚠️  {package} - OPTIONAL")
            missing_optional.append(package)

    return missing_required, missing_optional

def test_project_structure():
    """Test project directory structure"""
    print("\n📁 Testing project structure...")

    required_dirs = [
        'src', 'src/api', 'src/models', 'src/data_processing', 'src/utils',
        'data', 'data/raw', 'data/processed', 'data/models',
        'config', 'notebooks', 'tests'
    ]

    required_files = [
        'README.md', 'requirements.txt', 'setup.py',
        'config/config.example.yaml',
        'src/main.py', 'src/utils/config.py',
        'src/api/app.py'
    ]

    missing_dirs = []
    missing_files = []

    # Check directories
    for directory in required_dirs:
        if os.path.exists(directory):
            print(f"   ✅ {directory}/")
        else:
            print(f"   ❌ {directory}/ - MISSING")
            missing_dirs.append(directory)

    # Check files
    for file in required_files:
        if os.path.exists(file):
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} - MISSING")
            missing_files.append(file)

    return missing_dirs, missing_files

def test_configuration():
    """Test configuration loading"""
    print("\n⚙️  Testing configuration...")

    try:
        # Add src to path
        sys.path.append('src')
        from utils.config import get_config

        config = get_config()
        print("   ✅ Configuration loaded successfully")

        # Test configuration sections
        required_sections = ['api_keys', 'data_sources', 'models', 'app']
        for section in required_sections:
            if section in config.config:
                print(f"   ✅ Configuration section: {section}")
            else:
                print(f"   ⚠️  Configuration section missing: {section}")

        return True

    except Exception as e:
        print(f"   ❌ Configuration loading failed: {e}")
        return False

def test_models():
    """Test model imports"""
    print("\n🤖 Testing model imports...")

    try:
        sys.path.append('src')

        # Test rainfall prediction model
        from models.rainfall_prediction import RainfallPredictor
        print("   ✅ Rainfall prediction model")

        # Test data processing
        from data_processing.weather_data import WeatherDataCollector
        print("   ✅ Weather data collector")

        return True

    except Exception as e:
        print(f"   ❌ Model import failed: {e}")
        return False

def test_api():
    """Test API application"""
    print("\n🌐 Testing API application...")

    try:
        sys.path.append('src')
        from api.app import create_app

        app = create_app()
        print("   ✅ FastAPI application created successfully")

        # Test if app has required routes
        routes = [route.path for route in app.routes]
        required_routes = ['/health', '/docs', '/']

        for route in required_routes:
            if route in routes:
                print(f"   ✅ Route: {route}")
            else:
                print(f"   ⚠️  Route missing: {route}")

        return True

    except Exception as e:
        print(f"   ❌ API application test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 WeatherCrop AI Platform - Installation Test")
    print("=" * 50)
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📂 Working Directory: {os.getcwd()}")

    # Run tests
    python_ok = test_python_version()
    missing_required, missing_optional = test_dependencies()
    missing_dirs, missing_files = test_project_structure()
    config_ok = test_configuration()
    models_ok = test_models()
    api_ok = test_api()

    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)

    if python_ok:
        print("✅ Python version: PASS")
    else:
        print("❌ Python version: FAIL")

    if not missing_required:
        print("✅ Required dependencies: PASS")
    else:
        print(f"❌ Required dependencies: FAIL ({len(missing_required)} missing)")

    if not missing_dirs and not missing_files:
        print("✅ Project structure: PASS")
    else:
        print(f"❌ Project structure: FAIL ({len(missing_dirs + missing_files)} missing)")

    if config_ok:
        print("✅ Configuration: PASS")
    else:
        print("❌ Configuration: FAIL")

    if models_ok:
        print("✅ Models: PASS")
    else:
        print("❌ Models: FAIL")

    if api_ok:
        print("✅ API: PASS")
    else:
        print("❌ API: FAIL")

    # Overall status
    all_tests_passed = (
        python_ok and
        not missing_required and
        not missing_dirs and
        not missing_files and
        config_ok and
        models_ok and
        api_ok
    )

    print("\n" + "=" * 50)
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ WeatherCrop AI Platform is ready to use")
        print("\n🚀 Next steps:")
        print("   1. Install missing optional dependencies if needed:")
        if missing_optional:
            print(f"      pip install {' '.join(missing_optional)}")
        print("   2. Configure API keys in config/config.yaml")
        print("   3. Start the application: python src/main.py")
        print("   4. Open browser: http://localhost:8000")
        print("   5. Explore notebooks: jupyter notebook notebooks/")
    else:
        print("❌ SOME TESTS FAILED!")
        print("⚠️  Please fix the issues above before proceeding")

        if missing_required:
            print(f"\n📦 Install missing required packages:")
            print(f"   pip install {' '.join(missing_required)}")

        if missing_dirs or missing_files:
            print(f"\n📁 Missing project files/directories:")
            for item in missing_dirs + missing_files:
                print(f"   - {item}")

    print("=" * 50)
    return 0 if all_tests_passed else 1

if __name__ == "__main__":
    sys.exit(main())
