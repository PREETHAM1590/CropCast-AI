/**
 * Agricultural Intelligence Calculator Engine
 * Implements core calculations for rainfall prediction, flood risk, water harvesting, soil analysis, and crop recommendations
 */

class AgriculturalCalculator {
    constructor() {
        this.soilTypes = {
            'red': { ph: 6.5, drainage: 'good', fertility: 'medium', crops: ['cotton', 'groundnut', 'millets'] },
            'black': { ph: 7.5, drainage: 'poor', fertility: 'high', crops: ['cotton', 'sugarcane', 'wheat'] },
            'alluvial': { ph: 7.0, drainage: 'excellent', fertility: 'high', crops: ['rice', 'wheat', 'sugarcane'] },
            'laterite': { ph: 5.5, drainage: 'excellent', fertility: 'low', crops: ['cashew', 'coconut', 'pepper'] }
        };

        this.cropDatabase = {
            'rice': { waterNeed: 'high', season: ['kharif'], yield: 25, price: 2000 },
            'wheat': { waterNeed: 'medium', season: ['rabi'], yield: 30, price: 2200 },
            'cotton': { waterNeed: 'medium', season: ['kharif'], yield: 15, price: 5500 },
            'sugarcane': { waterNeed: 'very_high', season: ['kharif', 'rabi'], yield: 800, price: 350 },
            'groundnut': { waterNeed: 'low', season: ['kharif', 'rabi'], yield: 20, price: 5000 },
            'millets': { waterNeed: 'very_low', season: ['kharif'], yield: 12, price: 3000 },
            'maize': { waterNeed: 'medium', season: ['kharif', 'rabi'], yield: 35, price: 1800 },
            'pulses': { waterNeed: 'low', season: ['rabi'], yield: 8, price: 6000 }
        };

        this.rainfallPatterns = {
            'bangalore': { annual: 970, monsoon: 650, winter: 180, summer: 140 },
            'mysore': { annual: 785, monsoon: 520, winter: 165, summer: 100 },
            'hubli': { annual: 838, monsoon: 580, winter: 158, summer: 100 },
            'mangalore': { annual: 3200, monsoon: 2800, winter: 250, summer: 150 },
            'belgaum': { annual: 1050, monsoon: 750, winter: 200, summer: 100 }
        };
    }

    /**
     * Main calculation method
     */
    async performCalculations(formData) {
        const results = {
            location: formData.location,
            coordinates: { lat: formData.latitude, lng: formData.longitude },
            plotSize: formData.plotSize,
            season: formData.season,
            timestamp: new Date().toISOString()
        };

        // Perform all calculations
        results.rainfall = await this.calculateRainfallPrediction(formData);
        results.floodRisk = await this.assessFloodRisk(formData);
        results.waterHarvesting = await this.calculateWaterHarvesting(formData);
        results.soilAnalysis = await this.analyzeSoil(formData);
        results.cropRecommendations = await this.recommendCrops(formData, results.soilAnalysis, results.rainfall);

        return results;
    }

    /**
     * Calculate rainfall prediction using LSTM/ARIMA simulation
     */
    async calculateRainfallPrediction(formData) {
        // Simulate LSTM/ARIMA model prediction
        const baseRainfall = this.getBaseRainfall(formData.location, formData.season);
        const variability = this.calculateVariability();

        const predicted = {
            annual: Math.round(baseRainfall.annual * variability),
            seasonal: Math.round(baseRainfall.seasonal * variability),
            monthly: this.generateMonthlyPrediction(baseRainfall.seasonal, formData.season),
            confidence: this.calculateConfidence(),
            trend: this.calculateTrend()
        };

        return {
            ...predicted,
            riskLevel: this.getRainfallRiskLevel(predicted.annual),
            recommendation: this.getRainfallRecommendation(predicted.annual, formData.season)
        };
    }

    /**
     * Assess flood risk based on location and rainfall
     */
    async assessFloodRisk(formData) {
        const elevation = await this.getElevationData(formData.latitude, formData.longitude);
        const drainageCapacity = this.getDrainageCapacity(formData.location);
        const historicalFloods = this.getHistoricalFloodData(formData.location);

        const riskScore = this.calculateFloodRiskScore(elevation, drainageCapacity, historicalFloods);

        return {
            riskLevel: this.getFloodRiskLevel(riskScore),
            probability: Math.round(riskScore * 100),
            affectedArea: this.calculateAffectedArea(formData.plotSize, riskScore),
            evacuationTime: this.calculateEvacuationTime(riskScore),
            mitigationSteps: this.getFloodMitigationSteps(riskScore),
            emergencyContacts: this.getEmergencyContacts(formData.location)
        };
    }

    /**
     * Calculate rainwater harvesting potential
     */
    async calculateWaterHarvesting(formData) {
        const rainfall = await this.calculateRainfallPrediction(formData);
        const roofArea = formData.plotSize * 4047; // Convert acres to sq meters
        const runoffCoefficient = 0.8; // Typical for agricultural land

        const harvestable = rainfall.annual * roofArea * runoffCoefficient * 0.001; // Convert to cubic meters

        return {
            potential: Math.round(harvestable),
            dailyAverage: Math.round(harvestable / 365),
            storageRecommendation: Math.round(harvestable * 0.3), // 30% storage capacity
            costEstimate: this.calculateHarvestingCost(harvestable),
            roi: this.calculateHarvestingROI(harvestable, formData.plotSize),
            implementation: this.getHarvestingImplementation(formData.plotSize)
        };
    }

    /**
     * Analyze soil type and characteristics
     */
    async analyzeSoil(formData) {
        // Simulate soil analysis based on location
        const soilType = this.predictSoilType(formData.latitude, formData.longitude);
        const soilData = this.soilTypes[soilType];

        return {
            type: soilType,
            ph: soilData.ph + (Math.random() - 0.5) * 0.5, // Add some variation
            drainage: soilData.drainage,
            fertility: soilData.fertility,
            organicMatter: Math.round((Math.random() * 3 + 1) * 10) / 10,
            nitrogen: Math.round((Math.random() * 300 + 200)),
            phosphorus: Math.round((Math.random() * 50 + 20)),
            potassium: Math.round((Math.random() * 400 + 200)),
            recommendations: this.getSoilRecommendations(soilType),
            amendments: this.getSoilAmendments(soilType)
        };
    }

    /**
     * Recommend crops based on all factors
     */
    async recommendCrops(formData, soilAnalysis, rainfall) {
        const suitableCrops = this.soilTypes[soilAnalysis.type].crops;
        const seasonalCrops = Object.keys(this.cropDatabase).filter(crop =>
            this.cropDatabase[crop].season.includes(formData.season)
        );

        const recommendations = suitableCrops
            .filter(crop => seasonalCrops.includes(crop))
            .map(crop => {
                const cropData = this.cropDatabase[crop];
                const suitability = this.calculateCropSuitability(crop, soilAnalysis, rainfall, formData.season);

                return {
                    name: crop,
                    suitability: suitability,
                    expectedYield: Math.round(cropData.yield * suitability * formData.plotSize),
                    waterRequirement: this.calculateWaterRequirement(crop, formData.plotSize),
                    marketPrice: cropData.price,
                    profitEstimate: this.calculateProfitEstimate(crop, formData.plotSize, suitability),
                    riskLevel: this.calculateCropRisk(crop, rainfall),
                    plantingDate: this.getOptimalPlantingDate(crop, formData.season),
                    harvestDate: this.getOptimalHarvestDate(crop, formData.season)
                };
            })
            .sort((a, b) => b.suitability - a.suitability)
            .slice(0, 5); // Top 5 recommendations

        return recommendations;
    }

    // Helper methods
    getBaseRainfall(location, season) {
        const locationKey = location.toLowerCase();
        const pattern = this.rainfallPatterns[locationKey] || this.rainfallPatterns['bangalore'];

        let seasonal;
        switch(season) {
            case 'kharif': seasonal = pattern.monsoon; break;
            case 'rabi': seasonal = pattern.winter; break;
            case 'summer': seasonal = pattern.summer; break;
            default: seasonal = pattern.monsoon;
        }

        return { annual: pattern.annual, seasonal };
    }

    calculateVariability() {
        // Simulate climate variability (±20%)
        return 0.8 + Math.random() * 0.4;
    }

    generateMonthlyPrediction(seasonalTotal, season) {
        const months = season === 'kharif' ? 5 : season === 'rabi' ? 6 : 3;
        const monthly = [];
        let remaining = seasonalTotal;

        for (let i = 0; i < months - 1; i++) {
            const amount = Math.round(remaining * (0.1 + Math.random() * 0.3));
            monthly.push(amount);
            remaining -= amount;
        }
        monthly.push(Math.max(0, remaining));

        return monthly;
    }

    calculateConfidence() {
        return Math.round(75 + Math.random() * 20); // 75-95% confidence
    }

    calculateTrend() {
        const trends = ['increasing', 'decreasing', 'stable'];
        return trends[Math.floor(Math.random() * trends.length)];
    }

    getRainfallRiskLevel(annual) {
        if (annual < 600) return 'drought';
        if (annual < 800) return 'low';
        if (annual < 1200) return 'normal';
        if (annual < 1800) return 'high';
        return 'flood';
    }

    getRainfallRecommendation(annual, season) {
        const risk = this.getRainfallRiskLevel(annual);
        const recommendations = {
            'drought': 'Consider drought-resistant crops and water conservation',
            'low': 'Plan for supplemental irrigation',
            'normal': 'Optimal conditions for most crops',
            'high': 'Good for water-intensive crops, ensure proper drainage',
            'flood': 'Focus on flood-resistant varieties and drainage systems'
        };
        return recommendations[risk];
    }

    async getElevationData(lat, lng) {
        // Simulate elevation data (Karnataka ranges from 0-2000m)
        return Math.round(Math.random() * 1000 + 500);
    }

    getDrainageCapacity(location) {
        // Simulate drainage capacity based on location
        const capacities = { 'bangalore': 0.7, 'mysore': 0.8, 'hubli': 0.6, 'mangalore': 0.9, 'belgaum': 0.7 };
        return capacities[location.toLowerCase()] || 0.7;
    }

    getHistoricalFloodData(location) {
        // Simulate historical flood frequency
        return Math.round(Math.random() * 5 + 1); // 1-6 floods in last 10 years
    }

    calculateFloodRiskScore(elevation, drainage, historical) {
        // Normalize and combine factors
        const elevationScore = Math.max(0, (1000 - elevation) / 1000);
        const drainageScore = 1 - drainage;
        const historicalScore = Math.min(1, historical / 10);

        return (elevationScore * 0.4 + drainageScore * 0.3 + historicalScore * 0.3);
    }

    getFloodRiskLevel(score) {
        if (score < 0.2) return 'very_low';
        if (score < 0.4) return 'low';
        if (score < 0.6) return 'medium';
        if (score < 0.8) return 'high';
        return 'very_high';
    }

    calculateAffectedArea(plotSize, riskScore) {
        return Math.round(plotSize * riskScore * 100) / 100;
    }

    calculateEvacuationTime(riskScore) {
        return Math.round((1 - riskScore) * 24 + 2); // 2-26 hours
    }

    getFloodMitigationSteps(riskScore) {
        const steps = [
            'Install early warning systems',
            'Create drainage channels',
            'Build elevated storage areas',
            'Develop evacuation plans',
            'Plant flood-resistant crops'
        ];
        return steps.slice(0, Math.ceil(riskScore * 5));
    }

    getEmergencyContacts(location) {
        return [
            { name: 'District Collector', phone: '080-22222222' },
            { name: 'Emergency Services', phone: '108' },
            { name: 'Fire Department', phone: '101' },
            { name: 'Police', phone: '100' }
        ];
    }

    calculateHarvestingCost(volume) {
        // Cost per cubic meter of storage
        return Math.round(volume * 150); // ₹150 per cubic meter
    }

    calculateHarvestingROI(volume, plotSize) {
        const annualSavings = volume * 20; // ₹20 per cubic meter saved
        const cost = this.calculateHarvestingCost(volume);
        return Math.round((annualSavings / cost) * 100);
    }

    getHarvestingImplementation(plotSize) {
        if (plotSize < 1) return 'Rooftop collection with small tanks';
        if (plotSize < 5) return 'Farm pond with filtration system';
        return 'Large-scale collection with multiple storage points';
    }

    predictSoilType(lat, lng) {
        // Simulate soil type prediction based on coordinates
        const types = ['red', 'black', 'alluvial', 'laterite'];
        const index = Math.floor((lat + lng) * 100) % types.length;
        return types[index];
    }

    getSoilRecommendations(soilType) {
        const recommendations = {
            'red': ['Add organic matter', 'Use phosphorus fertilizers', 'Implement contour farming'],
            'black': ['Improve drainage', 'Add gypsum for structure', 'Use raised bed cultivation'],
            'alluvial': ['Maintain organic content', 'Balanced NPK application', 'Crop rotation'],
            'laterite': ['Heavy organic matter addition', 'Lime application', 'Mulching']
        };
        return recommendations[soilType] || [];
    }

    getSoilAmendments(soilType) {
        const amendments = {
            'red': ['Compost: 5 tons/acre', 'Rock phosphate: 200 kg/acre'],
            'black': ['Gypsum: 500 kg/acre', 'Organic matter: 3 tons/acre'],
            'alluvial': ['FYM: 4 tons/acre', 'NPK: 120:60:40 kg/acre'],
            'laterite': ['Lime: 1 ton/acre', 'Compost: 8 tons/acre']
        };
        return amendments[soilType] || [];
    }

    calculateCropSuitability(crop, soil, rainfall, season) {
        // Complex suitability calculation
        let score = 0.5; // Base score

        // Soil suitability
        if (this.soilTypes[soil.type].crops.includes(crop)) score += 0.3;

        // Water requirement vs rainfall
        const cropWater = this.cropDatabase[crop].waterNeed;
        const rainfallLevel = this.getRainfallRiskLevel(rainfall.annual);

        if ((cropWater === 'high' && rainfallLevel === 'high') ||
            (cropWater === 'medium' && rainfallLevel === 'normal') ||
            (cropWater === 'low' && ['low', 'normal'].includes(rainfallLevel))) {
            score += 0.2;
        }

        return Math.min(1, score);
    }

    calculateWaterRequirement(crop, plotSize) {
        const requirements = {
            'very_high': 2000, 'high': 1500, 'medium': 1000, 'low': 600, 'very_low': 400
        };
        const cropWater = this.cropDatabase[crop].waterNeed;
        return Math.round(requirements[cropWater] * plotSize);
    }

    calculateProfitEstimate(crop, plotSize, suitability) {
        const cropData = this.cropDatabase[crop];
        const cropYield = cropData.yield * suitability * plotSize;
        const revenue = cropYield * cropData.price;
        const costs = cropYield * cropData.price * 0.6; // 60% of revenue as costs
        return Math.round(revenue - costs);
    }

    calculateCropRisk(crop, rainfall) {
        const rainfallRisk = this.getRainfallRiskLevel(rainfall.annual);
        const riskLevels = ['very_low', 'low', 'medium', 'high', 'very_high'];
        return riskLevels[Math.floor(Math.random() * 3) + 1]; // Random between low-high
    }

    getOptimalPlantingDate(crop, season) {
        const dates = {
            'kharif': 'June 15 - July 15',
            'rabi': 'November 1 - December 15',
            'summer': 'March 1 - April 15'
        };
        return dates[season];
    }

    getOptimalHarvestDate(crop, season) {
        const dates = {
            'kharif': 'October 15 - November 30',
            'rabi': 'March 15 - May 15',
            'summer': 'June 1 - July 15'
        };
        return dates[season];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgriculturalCalculator;
}

// Global access
window.AgriculturalCalculator = AgriculturalCalculator;
