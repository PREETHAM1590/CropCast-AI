/**
 * CropCast AI - Configuration
 * Contains all configuration settings for the frontend application
 */
console.log('[DEBUG_LOAD] config.js executing');
const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:8001',
        ENDPOINTS: {
            // Weather endpoints
            WEATHER_PREDICT: '/api/v1/weather/predict-rainfall',
            WEATHER_CURRENT: '/api/v1/weather/current-conditions',
            WEATHER_HISTORICAL: '/api/v1/weather/historical-data',
            WEATHER_CLIMATE: '/api/v1/weather/climate-patterns',

            // Soil endpoints
            SOIL_ANALYZE: '/api/v1/soil/analyze',
            SOIL_IMAGE: '/api/v1/soil/analyze-image',
            SOIL_HEALTH_CARD: '/api/v1/soil/health-card-data',
            SOIL_SATELLITE: '/api/v1/soil/satellite-analysis',

            // Crop endpoints
            CROP_RECOMMEND: '/api/v1/crops/recommend',
            CROP_DATABASE: '/api/v1/crops/crop-database',
            CROP_MARKET: '/api/v1/crops/market-prices',

            // Prediction endpoints
            FLOOD_RISK: '/api/v1/predictions/flood-risk',
            YIELD_PREDICT: '/api/v1/predictions/yield-prediction',
            CLIMATE_IMPACT: '/api/v1/predictions/climate-impact',

            // Dashboard endpoints
            DASHBOARD_STATUS: '/api/v1/dashboard/status',
            DASHBOARD_ANALYTICS: '/api/v1/dashboard/analytics',
            DASHBOARD_ALERTS: '/api/v1/dashboard/alerts',
            DASHBOARD_PERFORMANCE: '/api/v1/dashboard/model-performance',

            // Health check
            HEALTH: '/health'
        },
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 second
    },

    // Application Settings
    APP: {
        NAME: 'CropCast AI',
        VERSION: '1.0.0',
        DESCRIPTION: 'AI-powered agricultural intelligence platform',
        DEFAULT_LOCATION: {
            latitude: 15.3173,
            longitude: 75.7139,
            name: 'Karnataka, India'
        },
        REFRESH_INTERVAL: 300000, // 5 minutes
        CACHE_DURATION: 600000, // 10 minutes
        MAX_UPLOAD_SIZE: 10485760, // 10MB
        SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    },

    // UI Configuration
    UI: {
        THEME: {
            PRIMARY: '#3d98f4',
            SECONDARY: '#10b981',
            BACKGROUND: '#101a23',
            SURFACE: '#182634',
            BORDER: '#223649',
            TEXT_PRIMARY: '#ffffff',
            TEXT_SECONDARY: '#90adcb',
            SUCCESS: '#10b981',
            WARNING: '#f59e0b',
            ERROR: '#ef4444',
            INFO: '#3d98f4'
        },
        ANIMATION: {
            DURATION: 300,
            EASING: 'ease-in-out'
        },
        BREAKPOINTS: {
            SM: 640,
            MD: 768,
            LG: 1024,
            XL: 1280
        },
        CHART_COLORS: [
            '#3d98f4', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ]
    },

    // Map Configuration
    MAP: {
        DEFAULT_CENTER: [15.3173, 75.7139], // Karnataka center
        DEFAULT_ZOOM: 7,
        MIN_ZOOM: 5,
        MAX_ZOOM: 18,
        TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ATTRIBUTION: '© OpenStreetMap contributors'
    },

    // Data Validation
    VALIDATION: {
        LATITUDE: {
            MIN: -90,
            MAX: 90
        },
        LONGITUDE: {
            MIN: -180,
            MAX: 180
        },
        RAINFALL: {
            MIN: 0,
            MAX: 1000
        },
        TEMPERATURE: {
            MIN: -50,
            MAX: 60
        },
        HUMIDITY: {
            MIN: 0,
            MAX: 100
        },
        PH: {
            MIN: 0,
            MAX: 14
        },
        NPK: {
            MIN: 0,
            MAX: 100
        }
    },

    // Feature Flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        OFFLINE_MODE: false,
        PUSH_NOTIFICATIONS: true,
        EXPORT_DATA: true,
        ADVANCED_ANALYTICS: true,
        SATELLITE_IMAGERY: true,
        WEATHER_ALERTS: true,
        CROP_CALENDAR: true,
        MARKET_INTEGRATION: true,
        SOCIAL_FEATURES: false
    },

    // Error Messages
    ERRORS: {
        NETWORK: 'Network connection error. Please check your internet connection.',
        SERVER: 'Server error. Please try again later.',
        VALIDATION: 'Invalid data provided. Please check your input.',
        PERMISSION: 'Permission denied. Please check your access rights.',
        NOT_FOUND: 'Requested resource not found.',
        TIMEOUT: 'Request timeout. Please try again.',
        UNKNOWN: 'An unexpected error occurred. Please try again.',
        LOCATION: 'Unable to get your location. Please enter manually.',
        FILE_SIZE: 'File size too large. Maximum size is 10MB.',
        FILE_TYPE: 'Unsupported file type. Please use JPEG, PNG, or WebP.',
        API_KEY: 'API key missing or invalid.',
        RATE_LIMIT: 'Too many requests. Please wait and try again.'
    },

    // Success Messages
    SUCCESS: {
        DATA_LOADED: 'Data loaded successfully',
        PREDICTION_COMPLETE: 'Prediction completed successfully',
        ANALYSIS_COMPLETE: 'Analysis completed successfully',
        SETTINGS_SAVED: 'Settings saved successfully',
        ALERT_SET: 'Alert set successfully',
        EXPORT_COMPLETE: 'Data exported successfully',
        UPLOAD_COMPLETE: 'File uploaded successfully'
    },

    // Local Storage Keys
    STORAGE: {
        USER_PREFERENCES: 'cropcast_user_preferences',
        CACHE_PREFIX: 'cropcast_cache_',
        LOCATION_HISTORY: 'cropcast_locations',
        SEARCH_HISTORY: 'cropcast_searches',
        ALERTS: 'cropcast_alerts',
        OFFLINE_DATA: 'cropcast_offline'
    },

    // Chart Configuration
    CHARTS: {
        RAINFALL: {
            TYPE: 'line',
            TENSION: 0.4,
            FILL: true,
            POINT_RADIUS: 4,
            POINT_HOVER_RADIUS: 6
        },
        SOIL_COMPOSITION: {
            TYPE: 'doughnut',
            CUTOUT: '50%',
            BORDER_WIDTH: 2
        },
        NPK_LEVELS: {
            TYPE: 'bar',
            BORDER_RADIUS: 4,
            BORDER_SKIP_PIXELS: 2
        },
        FLOOD_RISK: {
            TYPE: 'radar',
            SCALE_MIN: 0,
            SCALE_MAX: 100
        }
    },

    // Notification Settings
    NOTIFICATIONS: {
        POSITION: 'top-right',
        DURATION: 5000,
        MAX_VISIBLE: 3,
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },

    // Development Settings
    DEV: {
        DEBUG: false,
        MOCK_DATA: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        PERFORMANCE_MONITORING: true
    }
};

// Freeze configuration to prevent modifications
Object.freeze(CONFIG);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Global access
window.CONFIG = CONFIG;
