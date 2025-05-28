# WeatherCrop AI Platform

An AI-powered agricultural platform that predicts rainfall, flood risks, and recommends optimal crops based on real-time analysis of location, soil conditions, and climate patterns.

## 🌟 Features

### Core AI Components
- **Rainfall Prediction Engine**: LSTM/ARIMA models trained on IMD historical data
- **Flood Risk Assessment**: Random Forest classifier for flood probability mapping
- **Smart Soil Analysis**: Computer Vision on satellite imagery for soil health
- **Crop Recommendation System**: Multi-factor AI considering weather, soil, and market data
- **Yield Prediction Model**: Deep learning for crop yield forecasting

### Key Capabilities
- Monthly/seasonal rainfall predictions
- Flood risk probability maps with detailed scoring
- Real-time soil health analysis using satellite data
- Personalized crop recommendations based on local conditions
- Market-aware agricultural planning
- Climate change impact assessment

## 🏗️ Project Structure

```
wchr/
├── data/                    # Data storage and processing
│   ├── raw/                # Raw datasets
│   ├── processed/          # Cleaned and processed data
│   └── models/             # Trained model files
├── src/                    # Source code
│   ├── models/             # AI model implementations
│   ├── data_processing/    # Data collection and preprocessing
│   ├── api/               # Backend API
│   └── utils/             # Utility functions
├── notebooks/             # Jupyter notebooks for experimentation
├── frontend/              # Web interface
├── tests/                 # Unit and integration tests
├── config/                # Configuration files
└── docs/                  # Documentation
```

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   cd wchr
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure API Keys**
   ```bash
   cp config/config.example.yaml config/config.yaml
   # Edit config.yaml with your API keys
   ```

3. **Run the Platform**
   ```bash
   python src/main.py
   ```

## 📊 Data Sources

- **Weather Data**: India Meteorological Department (IMD)
- **Satellite Imagery**: ISRO Bhuvan API
- **Soil Data**: Soil Health Card Database
- **Agricultural Data**: Government agricultural databases
- **Market Data**: Agricultural commodity price APIs

## 🤖 AI Models

### 1. Rainfall Prediction
- **Algorithm**: LSTM + ARIMA ensemble
- **Features**: Historical rainfall, temperature, El Niño/La Niña indices
- **Output**: Monthly/seasonal rainfall predictions

### 2. Flood Risk Assessment
- **Algorithm**: Random Forest Classifier
- **Features**: Elevation, drainage, rainfall intensity, soil absorption
- **Output**: Flood probability maps with risk scores

### 3. Soil Analysis
- **Algorithm**: Computer Vision (CNN)
- **Input**: Satellite imagery, soil health card data
- **Output**: Soil type, moisture, NPK levels, erosion patterns

### 4. Crop Recommendation
- **Algorithm**: Multi-factor ML with collaborative filtering
- **Features**: Predicted rainfall, soil health, market prices, climate projections
- **Output**: Optimal crop suggestions with expected yields

### 5. Yield Prediction
- **Algorithm**: Deep Neural Network
- **Features**: Weather patterns, soil health, NDVI, historical yields
- **Output**: Expected crop yield predictions

## 🛠️ Technology Stack

- **Backend**: Python, FastAPI, PostgreSQL
- **AI/ML**: TensorFlow, Scikit-learn, OpenCV
- **Frontend**: React, D3.js for visualizations
- **Data Processing**: Pandas, NumPy, GeoPandas
- **APIs**: ISRO Bhuvan, IMD, Agricultural databases

## 📈 Development Roadmap

- [x] Project setup and structure
- [ ] Data collection modules
- [ ] Rainfall prediction model
- [ ] Flood risk assessment model
- [ ] Soil analysis system
- [ ] Crop recommendation engine
- [ ] Yield prediction model
- [ ] Web platform development
- [ ] Integration and testing
- [ ] Deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions and support, please open an issue or contact the development team.
