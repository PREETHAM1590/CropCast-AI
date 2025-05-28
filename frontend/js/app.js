/**
 * CropCast AI - Main Application Controller
 */
class CropCastApp {
    constructor() {
        this.currentPage = 'landing';
        this.charts = {};
        this.maps = {};
        this.isInitialized = false;
        this.loadingScreen = document.getElementById('loading-screen');
        this.appContainer = document.getElementById('app');
        this.pageContainer = document.getElementById('page-container');
    }

    async init() {
        try {
            console.log('Initializing CropCast AI...');
            this.showLoading();
            const loadingTimeout = setTimeout(() => {
                if (!this.isInitialized) {
                    console.warn('Initialization timeout, hiding loading screen.');
                    this.hideLoading();
                }
            }, 7000);

            await this.checkAPIHealth();
            this.setupEventListeners();
            window.App = this; // Expose app instance globally

            await this.navigateToPage('landing');

            clearTimeout(loadingTimeout);
            this.hideLoading();
            this.isInitialized = true;
            console.log('CropCast AI initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.hideLoading();
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    async checkAPIHealth() {
        try {
            // Ensure apiService and Utils are defined (they should be global or imported)
            if (typeof apiService === 'undefined' || typeof Utils === 'undefined') {
                console.error("apiService or Utils not defined. Cannot check API health.");
                return false;
            }
            await apiService.healthCheck();
            Utils.showNotification('Connected to CropCast AI services', 'success', 3000);
            return true;
        } catch (error) {
            console.warn('API health check failed:', error);
            if (typeof Utils !== 'undefined') {
                Utils.showNotification('Running in demo mode - Backend may not be available', 'warning', 5000);
            }
            return false;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const navTarget = e.target.closest('.nav-link, .nav-btn, [data-page]');
            if (navTarget) {
                e.preventDefault();
                const page = navTarget.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            }
        });

        this.setupThemeToggle();

        const errorClose = document.getElementById('error-close');
        if (errorClose && typeof Utils !== 'undefined') errorClose.onclick = () => Utils.hideError();

        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        window.addEventListener('popstate', (event) => this.handlePopState(event));

        this.attachHeaderButtonListeners();
    }

    attachHeaderButtonListeners() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.onclick = () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
                mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
                mobileMenu.classList.toggle('opacity-0');
                mobileMenu.classList.toggle('translate-y-[-100%]');
                mobileMenu.classList.toggle('show');
            };
        }
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) notificationsBtn.onclick = () => this.showNotifications();
    }

    async navigateToPage(pageName) {
        try {
            console.log(`Navigating to page: ${pageName}`);
            this.updateHeaderNavigation(pageName);
            if (typeof Utils !== 'undefined') Utils.showLoading(this.pageContainer);

            let content = '';
            // Ensure Pages object and its methods are defined
            if (typeof Pages === 'undefined') {
                console.error("Pages object is not defined. Cannot render page content.");
                content = this.renderFallbackError("Core page rendering module missing.");
            } else {
                switch (pageName) {
                    case 'landing': case 'home': content = await Pages.renderLanding(); break;
                    case 'calculator': content = await Pages.renderCalculator(); break;
                    case 'dashboard': content = await Pages.renderDashboard(); break;
                    case 'rainfall': content = await Pages.renderRainfall(); break;
                    case 'flood': content = await Pages.renderFlood(); break;
                    case 'soil': content = await Pages.renderSoil(); break;
                    case 'crops': content = await Pages.renderCrops(); break;
                    case 'features': case 'about': case 'contact': case 'support': case 'water':
                    case 'reports': case 'settings': case 'alerts': case 'community':
                        content = await Pages.renderPlaceholder(pageName.charAt(0).toUpperCase() + pageName.slice(1));
                        break;
                    default:
                        console.warn(`Page "${pageName}" not found, rendering error page.`);
                        content = Pages.renderError(`Page "${pageName}" not found`);
                }
            }
            this.pageContainer.innerHTML = content;
            await this.initializePage(pageName);
            this.currentPage = pageName;
            this.updateURL(pageName);
        } catch (error) {
            console.error(`Error navigating to page ${pageName}:`, error);
            if (this.pageContainer) this.pageContainer.innerHTML = (typeof Pages !== 'undefined' ? Pages.renderError(`Failed to load ${pageName} page`) : `<p>Error loading page.</p>`);
        }
    }

    updateHeaderNavigation(pageName) {
        // Simplified navigation update - just update active states
        this.updateNavigationActiveLink(pageName);
    }

    updateNavigationActiveLink(activePage) {
        // Remove active states from all navigation links
        document.querySelectorAll('#main-nav .nav-link, #mobile-menu .nav-link').forEach(link => {
            // Remove all active styling classes
            link.classList.remove('nav-active', 'bg-blue-600', 'text-white', 'dark:bg-blue-500', 'dark:text-white');

            // Reset to default navigation styling
            if (link.closest('#main-nav')) {
                // Header navigation styling
                link.classList.add('text-gray-300', 'hover:text-white', 'dark:text-gray-400', 'dark:hover:text-white', 'hover:bg-gray-700', 'dark:hover:bg-gray-700/50');
            } else {
                // Mobile menu styling
                link.classList.add('text-gray-700', 'hover:text-blue-600', 'dark:text-gray-400', 'dark:hover:text-white', 'hover:bg-gray-50', 'dark:hover:bg-[#1e293b]');
            }
        });

        // Set active page styling (without blue background)
        document.querySelectorAll(`#main-nav [data-page="${activePage}"], #mobile-menu [data-page="${activePage}"]`).forEach(link => {
            link.classList.add('nav-active');

            // Apply subtle active styling without blue background
            if (link.closest('#main-nav')) {
                // Header navigation active styling - just brighter text
                link.classList.remove('text-gray-300', 'dark:text-gray-400');
                link.classList.add('text-white', 'dark:text-white');
            } else {
                // Mobile menu active styling - just brighter text
                link.classList.remove('text-gray-700', 'dark:text-gray-400');
                link.classList.add('text-blue-600', 'dark:text-blue-400');
            }
        });
    }

    async initializePage(pageName) {
        try {
            // Ensure Components object is available for page initializers
            if (typeof Components === 'undefined') {
                console.error("Components object not defined. Cannot initialize page components.");
                return;
            }
            switch (pageName) {
                case 'rainfall': await this.initializeRainfallPage(); break;
                case 'flood': await this.initializeFloodPage(); break;
                case 'soil': await this.initializeSoilPage(); break;
                case 'crops': await this.initializeCropsPage(); break;
                case 'dashboard': await this.initializeDashboardPage(); break;
            }
        } catch (error) { console.error(`Error initializing ${pageName} page:`, error); }
    }

    async initializeCropsPage() {
        try {
            // Setup location search for crop recommendations
            this.setupLocationSearch('crop-location-search', 'crop-location-suggestions', 'cropMap');
            this.setupCropPageButtons();

            // Initialize the crop map with theme-responsive tiles
            setTimeout(() => {
                // Use theme-responsive map tiles
                const isDark = document.documentElement.classList.contains('dark');
                const tileLayer = isDark
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

                const map = this.initializeMap('crop-map-container', CONFIG.MAP.DEFAULT_CENTER, 7, 'cropMap', tileLayer);
                if (map) {
                    this.cropMap = map;
                    this.maps.cropMap = map;
                    map.on('click', (e) => {
                        console.log('Crop map clicked at:', e.latlng.lat, e.latlng.lng);
                        this.onCropMapClick(e.latlng.lat, e.latlng.lng);
                    });
                }
            }, 100);

            // Setup crop filters and search
            this.setupCropFilters();
            this.setupCropSearch();

            Utils.showNotification('Crop recommendations loaded', 'success', 2000);
        } catch (e) {
            console.error('Error initializing crops page:', e);
            Utils.showNotification('Failed to initialize crop recommendations', 'error');
        }
    }

    async initializeDashboardPage() {
        try {
            // Setup location search for dashboard
            this.setupLocationSearch('dashboard-location-search', 'dashboard-location-suggestions', 'dashboardMap');

            // Initialize the dashboard map
            setTimeout(() => {
                this.initializeMap('dashboard-map-container', CONFIG.MAP.DEFAULT_CENTER, CONFIG.MAP.DEFAULT_ZOOM, 'dashboardMap');
            }, 100);

            Utils.showNotification('Dashboard loaded', 'success', 2000);
        } catch (e) {
            console.error('Error initializing dashboard:', e);
            Utils.showNotification('Failed to initialize dashboard', 'error');
        }
    }
    async initializeRainfallPage() { try { this.setupLocationSearch('district-search', 'district-suggestions-rainfall', null); setTimeout(() => { if (document.getElementById('rainfall-chart')) this.charts.rainfall = Components.createRainfallChart('rainfall-chart'); if (document.getElementById('confidence-meter-rainfall')) Components.createConfidenceMeter('confidence-meter-rainfall', 85); }, 100); Utils.showNotification('Rainfall predictions loaded', 'success', 2000); } catch (e) { console.error('Error initializing rainfall page:', e); Utils.showNotification('Failed to load rainfall data', 'error'); }}
    async initializeFloodPage() {
        try {
            this.setupLocationSearch('flood-location-search', 'flood-location-suggestions', 'floodMap');
            this.setupFloodPageButtons();

            setTimeout(() => {
                // Use theme-responsive map tiles
                const isDark = document.documentElement.classList.contains('dark');
                const tileLayer = isDark
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

                const map = this.initializeMap('flood-map-container', CONFIG.MAP.DEFAULT_CENTER, 7, 'floodMap', tileLayer);
                if (map) {
                    this.floodMap = map;
                    this.maps.floodMap = map;
                    map.on('click', (e) => {
                        console.log('Map clicked at:', e.latlng.lat, e.latlng.lng);
                        this.onMapClick(e.latlng.lat, e.latlng.lng);
                    });
                }
            }, 100);
        } catch (e) {
            console.error('Error initializing flood map:', e);
        }
    }
    async initializeSoilPage() { try { setTimeout(() => { if (document.getElementById('soil-composition-chart')) this.charts.soilComposition = Components.createSoilCompositionChart('soil-composition-chart', { labels: ['Clay', 'Silt', 'Sand'], datasets: [{ data: [30, 40, 30], backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981'], borderWidth: 0 }] }); if (document.getElementById('soil-health-gauge-soilpage')) Components.createSoilHealthGauge('soil-health-gauge-soilpage', 7.2); if (document.getElementById('soil-ph-indicator-soilpage')) Components.createPhIndicator('soil-ph-indicator-soilpage', 6.5); }, 100); Utils.showNotification('Soil analysis loaded', 'success', 2000); } catch (e) { console.error('Error initializing soil page:', e); Utils.showNotification('Failed to load soil data', 'error'); }}

    setupCropFilters() { console.log('Setting up crop filters (placeholder)'); }
    setupCropSearch() { const searchInput = document.getElementById('crop-recommendation-search'); if(searchInput) searchInput.addEventListener('input', Utils.debounce(() => console.log('Searching crops:', searchInput.value), 300));}
    setupLocationSearch(inputId, suggestionsId, mapInstanceKey) { const locInput = document.getElementById(inputId); const suggCont = document.getElementById(suggestionsId); if (locInput) { locInput.addEventListener('input', Utils.debounce(async (e) => { const q = e.target.value.trim(); if (q.length > 2 && suggCont) { try { const sugg = await Utils.searchLocation(q); this.showLocationSuggestions(sugg, suggestionsId, inputId, mapInstanceKey); } catch (err) { console.error('Loc search fail:', err); if(suggCont) this.hideLocationSuggestions(suggestionsId);}} else if (suggCont) this.hideLocationSuggestions(suggestionsId);}, 300)); if(suggCont) { document.addEventListener('click', (e) => { if (locInput && suggCont && !locInput.contains(e.target) && !suggCont.contains(e.target)) this.hideLocationSuggestions(suggestionsId);}); locInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.hideLocationSuggestions(suggestionsId);});}}}
    showLocationSuggestions(sugg, suggContId, inputId, mapKey) { const sc = document.getElementById(suggContId); if (!sc || !sugg.length) { if(sc) this.hideLocationSuggestions(suggContId); return; } sc.innerHTML = sugg.map(s => `<div class="location-suggestion-item px-4 py-3 hover:bg-[#223649] cursor-pointer" data-lat="${s.latitude}" data-lng="${s.longitude}" data-name="${s.name}"><div class="text-white text-sm">${s.name.split(',')[0]}</div><div class="text-[#90adcb] text-xs">${s.name}</div></div>`).join(''); sc.classList.remove('hidden'); sc.querySelectorAll('.location-suggestion-item').forEach(i => { i.onclick = () => { const n = i.dataset.name; const locationName = n.split(',')[0]; document.getElementById(inputId).value = locationName; this.hideLocationSuggestions(suggContId); if (mapKey && this.maps[mapKey]) this.maps[mapKey].setView([parseFloat(i.dataset.lat), parseFloat(i.dataset.lng)], 12); Utils.showNotification(`Location: ${locationName}`, 'success'); if (inputId === 'district-search') this.updateRainfallData(locationName, parseFloat(i.dataset.lat), parseFloat(i.dataset.lng)); if (inputId === 'flood-location-search') this.updateFloodData(locationName, parseFloat(i.dataset.lat), parseFloat(i.dataset.lng)); if (inputId === 'crop-location-search') this.updateCropData(locationName, parseFloat(i.dataset.lat), parseFloat(i.dataset.lng));
                            if (inputId === 'dashboard-location-search') this.updateDashboardData(locationName, parseFloat(i.dataset.lat), parseFloat(i.dataset.lng));};});}
    hideLocationSuggestions(suggContId) { const sc = document.getElementById(suggContId); if (sc) sc.classList.add('hidden');}

    setupFloodPageButtons() {
        // Setup "Use Current Location" button
        const currentLocationBtn = document.getElementById('use-current-location-btn');
        if (currentLocationBtn) {
            currentLocationBtn.addEventListener('click', () => this.useCurrentLocation());
        }

        // Setup "Pin on Map" button
        const pinLocationBtn = document.getElementById('pin-location-btn');
        if (pinLocationBtn) {
            pinLocationBtn.addEventListener('click', () => this.togglePinMode());
        }
    }

    async useCurrentLocation() {
        try {
            Utils.showNotification('Getting your current location...', 'info', 3000);

            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Get location name from coordinates
            const locationName = await Utils.getLocationName(latitude, longitude);
            const displayName = locationName.split(',')[0];

            // Update the search input
            const searchInput = document.getElementById('flood-location-search');
            if (searchInput) {
                searchInput.value = displayName;
            }

            // Update map view
            if (this.floodMap) {
                this.floodMap.setView([latitude, longitude], 12);

                // Add a marker for current location
                if (this.currentLocationMarker) {
                    this.floodMap.removeLayer(this.currentLocationMarker);
                }
                this.currentLocationMarker = L.marker([latitude, longitude])
                    .addTo(this.floodMap)
                    .bindPopup(`📍 Your Current Location<br>${displayName}`)
                    .openPopup();
            }

            // Update flood data
            this.updateFloodData(displayName, latitude, longitude);

            Utils.showNotification(`Current location: ${displayName}`, 'success');
        } catch (error) {
            console.error('Error getting current location:', error);
            let errorMessage = 'Failed to get current location';
            if (error.code === 1) {
                errorMessage = 'Location access denied. Please enable location permissions.';
            } else if (error.code === 2) {
                errorMessage = 'Location unavailable. Please try again.';
            } else if (error.code === 3) {
                errorMessage = 'Location request timed out. Please try again.';
            }
            Utils.showNotification(errorMessage, 'error');
        }
    }

    togglePinMode() {
        const pinBtn = document.getElementById('pin-location-btn');
        if (!pinBtn) return;

        if (this.pinModeActive) {
            // Disable pin mode
            this.pinModeActive = false;
            pinBtn.innerHTML = '<span class="material-icons text-lg">place</span><span>Pin on Map</span>';
            pinBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            pinBtn.classList.add('bg-gray-600', 'dark:bg-[#223649]', 'hover:bg-gray-700', 'dark:hover:bg-[#314d68]');

            if (this.floodMap) {
                this.floodMap.getContainer().style.cursor = '';
            }

            Utils.showNotification('Pin mode disabled', 'info');
        } else {
            // Enable pin mode
            this.pinModeActive = true;
            pinBtn.innerHTML = '<span class="material-icons text-lg">close</span><span>Cancel Pin</span>';
            pinBtn.classList.remove('bg-gray-600', 'dark:bg-[#223649]', 'hover:bg-gray-700', 'dark:hover:bg-[#314d68]');
            pinBtn.classList.add('bg-red-500', 'hover:bg-red-600');

            if (this.floodMap) {
                this.floodMap.getContainer().style.cursor = 'crosshair';
            }

            Utils.showNotification('Click on the map to pin a location', 'info', 5000);
        }
    }

    async updateRainfallData(locationName, latitude, longitude) {
        try {
            // Update the location display
            const locationDisplay = document.querySelector('.layout-content-container h1 + p');
            if (locationDisplay) {
                locationDisplay.textContent = `${locationName}, Karnataka, India`;
            }

            // Generate location-specific rainfall data (mock data for now)
            const locationBasedData = this.generateLocationBasedRainfallData(locationName, latitude, longitude);

            // Update the main rainfall prediction value
            const rainfallValue = document.querySelector('.layout-content-container p.text-white.tracking-tight.text-5xl');
            if (rainfallValue) {
                rainfallValue.innerHTML = `${locationBasedData.predicted}<span class="text-2xl text-[#90adcb]">mm</span>`;
            }

            // Update the percentage change
            const percentageChange = document.querySelector('.text-green-400.text-lg.font-semibold span:last-child');
            if (percentageChange) {
                percentageChange.textContent = `${locationBasedData.change}%`;
            }

            // Update the chart if it exists
            if (this.charts.rainfall) {
                this.charts.rainfall.destroy();
                setTimeout(() => {
                    this.charts.rainfall = Components.createRainfallChart('rainfall-chart', locationBasedData.chartData);
                }, 100);
            }

            // Update confidence meter
            const confidenceMeter = document.getElementById('confidence-meter-rainfall');
            if (confidenceMeter) {
                confidenceMeter.innerHTML = '';
                Components.createConfidenceMeter('confidence-meter-rainfall', locationBasedData.confidence);
            }

            Utils.showNotification(`Rainfall prediction updated for ${locationName}`, 'success');
        } catch (error) {
            console.error('Error updating rainfall data:', error);
            Utils.showNotification('Failed to update rainfall data', 'error');
        }
    }

    generateLocationBasedRainfallData(locationName, latitude, longitude) {
        // Generate realistic rainfall data based on location
        // This is mock data - in a real app, this would call an API
        const baseRainfall = 120;
        const locationFactor = Math.sin(latitude * Math.PI / 180) * 50; // Latitude-based variation
        const predicted = Math.round(baseRainfall + locationFactor + (Math.random() * 40 - 20));

        return {
            predicted: predicted,
            change: Math.round((predicted - baseRainfall) / baseRainfall * 100),
            confidence: Math.round(75 + Math.random() * 20), // 75-95% confidence
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Predicted Rainfall',
                    data: Array.from({length: 12}, (_, i) => Math.round(predicted * (0.5 + Math.sin((i + 3) * Math.PI / 6) * 0.5))),
                    borderColor: '#3d98f4',
                    backgroundColor: 'rgba(61, 152, 244, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Historical Average',
                    data: Array.from({length: 12}, (_, i) => Math.round(baseRainfall * (0.5 + Math.sin((i + 3) * Math.PI / 6) * 0.5))),
                    borderColor: '#90adcb',
                    backgroundColor: 'rgba(144, 173, 203, 0.1)',
                    tension: 0.4
                }]
            }
        };
    }

    async updateDashboardData(locationName, latitude, longitude) {
        try {
            // Update the location display in sidebar
            const locationHeader = document.querySelector('.w-full.lg\\:w-\\[380px\\].xl\\:w-\\[420px\\] h2');
            if (locationHeader) {
                locationHeader.textContent = `${locationName}, Karnataka, India`;
            }

            // Generate location-specific dashboard data
            const locationBasedData = this.generateLocationBasedDashboardData(locationName, latitude, longitude);

            // Update Expected Rainfall
            const rainfallValue = document.querySelector('.bg-\\[\\#1c2a38\\] .text-white.text-2xl.font-semibold');
            if (rainfallValue) {
                rainfallValue.textContent = locationBasedData.expectedRainfall.value;
            }

            // Update Flood Risk Level
            const floodRiskElements = document.querySelectorAll('.bg-\\[\\#1c2a38\\] .text-white.text-2xl.font-semibold');
            if (floodRiskElements.length > 1) {
                floodRiskElements[1].textContent = locationBasedData.floodRisk.level;
            }

            // Update Top Recommended Crops
            const cropsElement = document.querySelector('.bg-\\[\\#1c2a38\\] .text-white.text-lg.font-semibold');
            if (cropsElement) {
                cropsElement.textContent = locationBasedData.topCrops.names;
            }

            // Update Water Availability
            const waterElements = document.querySelectorAll('.bg-\\[\\#1c2a38\\] .text-white.text-2xl.font-semibold');
            if (waterElements.length > 2) {
                waterElements[2].textContent = locationBasedData.waterAvailability.value;
            }

            // Update Soil Temperature
            const soilElements = document.querySelectorAll('.bg-\\[\\#1c2a38\\] .text-white.text-2xl.font-semibold');
            if (soilElements.length > 3) {
                soilElements[3].textContent = locationBasedData.soilTemperature.value;
            }

            Utils.showNotification(`Dashboard updated for ${locationName}`, 'success');
        } catch (error) {
            console.error('Error updating dashboard data:', error);
            Utils.showNotification('Failed to update dashboard data', 'error');
        }
    }

    generateLocationBasedDashboardData(locationName, latitude, longitude) {
        // Generate realistic dashboard data based on location
        const baseRainfall = 150;
        const locationFactor = Math.sin(latitude * Math.PI / 180) * 30; // Latitude-based variation
        const expectedRainfall = Math.round(baseRainfall + locationFactor + (Math.random() * 30 - 15));

        // Generate flood risk based on location
        const floodRiskAssessment = this.calculateRealisticFloodRisk(locationName, latitude, longitude);
        const riskLevels = ['Low', 'Moderate', 'High', 'Critical'];
        const floodRisk = riskLevels[floodRiskAssessment.riskIndex];

        // Generate crop recommendations based on location
        const cropOptions = [
            ['Rice, Sugarcane, Maize', 'Cotton, Groundnut, Ragi'],
            ['Wheat, Jowar, Sunflower', 'Turmeric, Chili, Onion'],
            ['Coconut, Areca nut, Pepper', 'Cardamom, Coffee, Tea']
        ];
        const cropIndex = Math.floor((latitude + longitude) * 10) % cropOptions.length;
        const topCrops = cropOptions[cropIndex][Math.floor(Math.random() * 2)];

        // Generate water availability based on location and season
        const baseWater = 85;
        const seasonalFactor = Math.sin((new Date().getMonth() + 1) * Math.PI / 6) * 15; // Seasonal variation
        const waterAvailability = Math.max(40, Math.min(95, Math.round(baseWater + seasonalFactor + (Math.random() * 10 - 5))));

        // Generate soil temperature based on location and season
        const baseSoilTemp = 28;
        const latitudeFactor = (15 - latitude) * 2; // Cooler at higher latitudes
        const seasonalTempFactor = Math.sin((new Date().getMonth() + 1) * Math.PI / 6) * 5;
        const soilTemperature = Math.round(baseSoilTemp + latitudeFactor + seasonalTempFactor + (Math.random() * 4 - 2));

        return {
            expectedRainfall: {
                value: `${expectedRainfall}mm`,
                trend: expectedRainfall > baseRainfall ? '+' + Math.round((expectedRainfall - baseRainfall) / baseRainfall * 100) + '% vs avg.' : Math.round((expectedRainfall - baseRainfall) / baseRainfall * 100) + '% vs avg.',
                trendDirection: expectedRainfall > baseRainfall ? 'up' : 'down'
            },
            floodRisk: {
                level: floodRisk,
                probability: `Currently ${floodRiskAssessment.probability}% probability`
            },
            topCrops: {
                names: topCrops,
                yieldPotential: '+' + Math.round(3 + Math.random() * 4) + '% yield potential'
            },
            waterAvailability: {
                value: `${waterAvailability}%`,
                trend: waterAvailability > 85 ? '+' + (waterAvailability - 85) + '% vs last week' : '-' + (85 - waterAvailability) + '% vs last week',
                trendDirection: waterAvailability > 85 ? 'up' : 'down'
            },
            soilTemperature: {
                value: `${soilTemperature}°C`,
                note: soilTemperature >= 25 && soilTemperature <= 30 ? 'Optimal for germination' : soilTemperature > 30 ? 'High for most crops' : 'Cool for germination'
            }
        };
    }

    async onMapClick(latitude, longitude) {
        try {
            console.log('Processing map click at coordinates:', latitude, longitude);

            // Round coordinates to avoid precision issues
            const roundedLat = Math.round(latitude * 10000) / 10000;
            const roundedLng = Math.round(longitude * 10000) / 10000;

            // Get location name from coordinates
            const locationName = await Utils.getLocationName(roundedLat, roundedLng);
            const displayName = locationName.split(',')[0];

            console.log('Location resolved to:', displayName);

            // Update the search input
            const searchInput = document.getElementById('flood-location-search');
            if (searchInput) {
                searchInput.value = displayName;
            }

            // Add a pin marker
            if (this.floodMap) {
                // Remove previous pin marker if exists
                if (this.pinMarker) {
                    this.floodMap.removeLayer(this.pinMarker);
                }

                // Add new pin marker with custom icon
                this.pinMarker = L.marker([roundedLat, roundedLng], {
                    icon: L.divIcon({
                        className: 'custom-pin-marker',
                        html: '<div style="background: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    })
                })
                    .addTo(this.floodMap)
                    .bindPopup(`📍 Pinned Location<br><strong>${displayName}</strong><br>Lat: ${roundedLat}<br>Lng: ${roundedLng}`)
                    .openPopup();
            }

            // If pin mode is active, disable it after placing the pin
            if (this.pinModeActive) {
                this.togglePinMode();
            }

            // Update flood data with rounded coordinates
            this.updateFloodData(displayName, roundedLat, roundedLng);

            Utils.showNotification(`📍 Pinned: ${displayName}`, 'success');
        } catch (error) {
            console.error('Error handling map click:', error);
            Utils.showNotification('Failed to pin location', 'error');
        }
    }

    async updateFloodData(locationName, latitude, longitude) {
        try {
            // Update the location display
            const locationDisplay = document.getElementById('flood-location-display');
            if (locationDisplay) {
                locationDisplay.textContent = `${locationName}, Karnataka, India`;
            }

            // Generate location-specific flood data (mock data for now)
            const locationBasedData = this.generateLocationBasedFloodData(locationName, latitude, longitude);

            // Update risk level
            const riskLevel = document.getElementById('flood-risk-level');
            const riskProbability = document.getElementById('flood-risk-probability');
            const riskIcon = document.getElementById('flood-risk-icon');

            if (riskLevel) riskLevel.textContent = locationBasedData.riskLevel;
            if (riskProbability) riskProbability.textContent = `${locationBasedData.probability}% Probability`;

            // Update risk icon and colors
            if (riskIcon) {
                const iconSpan = riskIcon.querySelector('span');
                if (iconSpan) {
                    iconSpan.className = `material-icons text-2xl ${locationBasedData.riskColor}`;
                    iconSpan.textContent = locationBasedData.riskIcon;
                }
                riskIcon.className = `w-12 h-12 rounded-full ${locationBasedData.riskBg} flex items-center justify-center`;
            }

            if (riskLevel) riskLevel.className = `text-2xl font-bold ${locationBasedData.riskColor}`;

            // Update affected area statistics
            const totalArea = document.getElementById('flood-total-area');
            const agriculturalLand = document.getElementById('flood-agricultural-land');
            const residentialZones = document.getElementById('flood-residential-zones');
            const estimatedPopulation = document.getElementById('flood-estimated-population');

            if (totalArea) totalArea.textContent = locationBasedData.stats.totalArea;
            if (agriculturalLand) agriculturalLand.textContent = locationBasedData.stats.agriculturalLand;
            if (residentialZones) residentialZones.textContent = locationBasedData.stats.residentialZones;
            if (estimatedPopulation) estimatedPopulation.textContent = locationBasedData.stats.estimatedPopulation;

            Utils.showNotification(`Flood risk updated for ${locationName}`, 'success');
        } catch (error) {
            console.error('Error updating flood data:', error);
            Utils.showNotification('Failed to update flood data', 'error');
        }
    }

    generateLocationBasedFloodData(locationName, latitude, longitude) {
        // Generate realistic flood data based on actual geographical and meteorological factors
        // This uses real flood risk assessment criteria for Karnataka
        const riskLevels = ['Low', 'Moderate', 'High', 'Critical'];
        const riskColors = ['text-green-400', 'text-yellow-400', 'text-red-400', 'text-red-600'];
        const riskBgs = ['bg-green-500/20', 'bg-yellow-500/20', 'bg-red-500/20', 'bg-red-600/20'];
        const riskIcons = ['check_circle', 'warning', 'error_outline', 'dangerous'];

        // Calculate realistic flood risk based on multiple factors
        const floodRiskAssessment = this.calculateRealisticFloodRisk(locationName, latitude, longitude);

        const baseArea = 1000;
        // Calculate area multiplier based on actual risk factors
        const areaMultiplier = 1 + (floodRiskAssessment.riskIndex * 0.4) + (floodRiskAssessment.populationDensityFactor * 0.3);

        return {
            riskLevel: riskLevels[floodRiskAssessment.riskIndex],
            probability: floodRiskAssessment.probability,
            riskColor: riskColors[floodRiskAssessment.riskIndex],
            riskBg: riskBgs[floodRiskAssessment.riskIndex],
            riskIcon: riskIcons[floodRiskAssessment.riskIndex],
            stats: {
                totalArea: Math.round(baseArea * areaMultiplier) + ' sq km',
                agriculturalLand: Math.round(baseArea * areaMultiplier * 0.65) + ' sq km',
                residentialZones: Math.round(baseArea * areaMultiplier * 0.18) + ' sq km',
                estimatedPopulation: (Math.round(baseArea * areaMultiplier * floodRiskAssessment.populationDensityFactor * 25)).toLocaleString()
            },
            riskFactors: floodRiskAssessment.factors
        };
    }

    calculateRealisticFloodRisk(locationName, latitude, longitude) {
        // Real flood risk factors for Karnataka
        let riskScore = 0;
        let factors = [];

        // 1. ELEVATION FACTOR (Lower elevation = Higher risk)
        const elevationFactor = this.getElevationRiskFactor(latitude, longitude);
        riskScore += elevationFactor.score;
        factors.push(elevationFactor.description);

        // 2. RIVER PROXIMITY FACTOR (Closer to rivers = Higher risk)
        const riverFactor = this.getRiverProximityFactor(locationName, latitude, longitude);
        riskScore += riverFactor.score;
        factors.push(riverFactor.description);

        // 3. MONSOON ZONE FACTOR (Different zones have different rainfall patterns)
        const monsoonFactor = this.getMonsoonZoneFactor(latitude, longitude);
        riskScore += monsoonFactor.score;
        factors.push(monsoonFactor.description);

        // 4. URBAN DRAINAGE FACTOR (Poor drainage = Higher risk)
        const drainageFactor = this.getUrbanDrainageFactor(locationName, latitude, longitude);
        riskScore += drainageFactor.score;
        factors.push(drainageFactor.description);

        // 5. HISTORICAL FLOOD DATA (Known flood-prone areas)
        const historicalFactor = this.getHistoricalFloodFactor(locationName, latitude, longitude);
        riskScore += historicalFactor.score;
        factors.push(historicalFactor.description);

        // 6. SEASONAL FACTOR (Current time of year)
        const seasonalFactor = this.getSeasonalRiskFactor();
        riskScore += seasonalFactor.score;
        factors.push(seasonalFactor.description);

        // Calculate final risk index (0-3) and probability
        const riskIndex = Math.max(0, Math.min(3, Math.floor(riskScore / 2)));
        const probability = Math.min(95, Math.max(5, Math.round(15 + (riskScore * 8))));

        // Population density factor for area calculations
        const populationDensityFactor = this.getPopulationDensityFactor(locationName, latitude, longitude);

        return {
            riskIndex,
            probability,
            populationDensityFactor,
            factors,
            totalScore: riskScore
        };
    }

    getElevationRiskFactor(latitude, longitude) {
        // Karnataka elevation zones: Coastal (0-100m), Plains (100-500m), Hills (500m+)
        // Lower elevation = Higher flood risk
        let elevationScore = 0;
        let description = "";

        // Coastal Karnataka (High risk)
        if (latitude >= 12.0 && latitude <= 15.0 && longitude >= 74.0 && longitude <= 75.5) {
            elevationScore = 2.5;
            description = "Coastal low-lying area - High flood risk";
        }
        // River valleys and plains (Moderate to High risk)
        else if (latitude >= 12.5 && latitude <= 16.5 && longitude >= 75.0 && longitude <= 78.0) {
            elevationScore = 1.5;
            description = "River valley/plains - Moderate flood risk";
        }
        // Western Ghats and hills (Low risk)
        else if (longitude <= 75.5) {
            elevationScore = 0.5;
            description = "Elevated terrain - Low flood risk";
        }
        // Deccan plateau (Low to Moderate risk)
        else {
            elevationScore = 1.0;
            description = "Plateau region - Low to moderate flood risk";
        }

        return { score: elevationScore, description };
    }

    getRiverProximityFactor(locationName, latitude, longitude) {
        // Major rivers in Karnataka and flood-prone areas
        const floodProneRivers = [
            { name: "Cauvery", lat: 12.9, lng: 77.6, risk: 2.0 },
            { name: "Krishna", lat: 16.2, lng: 76.8, risk: 2.5 },
            { name: "Tungabhadra", lat: 15.3, lng: 76.5, risk: 2.0 },
            { name: "Netravati", lat: 12.9, lng: 74.8, risk: 1.8 },
            { name: "Sharavathi", lat: 14.4, lng: 74.7, risk: 1.5 }
        ];

        let riverScore = 0;
        let description = "No major rivers nearby";

        // Check proximity to major rivers
        for (const river of floodProneRivers) {
            const distance = Math.sqrt(Math.pow(latitude - river.lat, 2) + Math.pow(longitude - river.lng, 2));
            if (distance < 0.5) { // Within ~50km
                riverScore = Math.max(riverScore, river.risk);
                description = `Near ${river.name} river - Increased flood risk`;
                break;
            } else if (distance < 1.0) { // Within ~100km
                riverScore = Math.max(riverScore, river.risk * 0.6);
                description = `Moderate distance from ${river.name} river`;
            }
        }

        return { score: riverScore, description };
    }

    getMonsoonZoneFactor(latitude, longitude) {
        // Karnataka monsoon zones based on rainfall patterns
        let monsoonScore = 0;
        let description = "";

        // Heavy rainfall zone (Western Ghats)
        if (longitude <= 75.5 && latitude >= 12.0 && latitude <= 15.0) {
            monsoonScore = 2.0;
            description = "Heavy monsoon zone - High rainfall risk";
        }
        // Moderate rainfall zone (Coastal and transition)
        else if (longitude <= 76.0) {
            monsoonScore = 1.5;
            description = "Moderate monsoon zone";
        }
        // Low rainfall zone (Interior Deccan)
        else {
            monsoonScore = 0.8;
            description = "Low rainfall zone - Reduced flood risk";
        }

        return { score: monsoonScore, description };
    }

    getUrbanDrainageFactor(locationName, latitude, longitude) {
        // Urban areas with known drainage issues
        const urbanAreas = [
            { name: "Bangalore", lat: 12.97, lng: 77.59, drainageScore: 2.0 },
            { name: "Bengaluru", lat: 12.97, lng: 77.59, drainageScore: 2.0 },
            { name: "Mysore", lat: 12.31, lng: 76.65, drainageScore: 1.5 },
            { name: "Mysuru", lat: 12.31, lng: 76.65, drainageScore: 1.5 },
            { name: "Hubli", lat: 15.36, lng: 75.12, drainageScore: 1.8 },
            { name: "Dharwad", lat: 15.46, lng: 75.01, drainageScore: 1.6 },
            { name: "Mangalore", lat: 12.91, lng: 74.86, drainageScore: 2.2 },
            { name: "Belgaum", lat: 15.85, lng: 74.50, drainageScore: 1.4 }
        ];

        let drainageScore = 0.5; // Default for rural areas
        let description = "Rural area - Good natural drainage";

        // Check if location matches known urban areas
        for (const city of urbanAreas) {
            if (locationName.toLowerCase().includes(city.name.toLowerCase()) ||
                (Math.abs(latitude - city.lat) < 0.2 && Math.abs(longitude - city.lng) < 0.2)) {
                drainageScore = city.drainageScore;
                description = `Urban area (${city.name}) - Poor drainage infrastructure`;
                break;
            }
        }

        return { score: drainageScore, description };
    }

    getHistoricalFloodFactor(locationName, latitude, longitude) {
        // Known flood-prone areas in Karnataka based on historical data
        const floodProneAreas = [
            { name: "Kodagu", lat: 12.42, lng: 75.74, risk: 2.5, desc: "Historically flood-prone district" },
            { name: "Uttara Kannada", lat: 14.78, lng: 74.68, risk: 2.0, desc: "Coastal flooding history" },
            { name: "Dakshina Kannada", lat: 12.85, lng: 75.18, risk: 2.2, desc: "Frequent coastal floods" },
            { name: "Belagavi", lat: 15.85, lng: 74.50, risk: 1.8, desc: "Krishna river flooding" },
            { name: "Bagalkot", lat: 16.18, lng: 75.70, risk: 1.6, desc: "River basin flooding" }
        ];

        let historicalScore = 0.3; // Default low risk
        let description = "No significant flood history";

        // Check against historical flood data
        for (const area of floodProneAreas) {
            if (locationName.toLowerCase().includes(area.name.toLowerCase()) ||
                (Math.abs(latitude - area.lat) < 0.5 && Math.abs(longitude - area.lng) < 0.5)) {
                historicalScore = area.risk;
                description = area.desc;
                break;
            }
        }

        return { score: historicalScore, description };
    }

    getSeasonalRiskFactor() {
        // Seasonal flood risk based on current month
        const currentMonth = new Date().getMonth(); // 0-11
        let seasonalScore = 0;
        let description = "";

        if (currentMonth >= 5 && currentMonth <= 9) { // June to October - Monsoon
            seasonalScore = 2.0;
            description = "Monsoon season - Peak flood risk";
        } else if (currentMonth === 4 || currentMonth === 10) { // May, November - Pre/Post monsoon
            seasonalScore = 1.0;
            description = "Pre/Post monsoon - Moderate risk";
        } else { // December to April - Dry season
            seasonalScore = 0.2;
            description = "Dry season - Low flood risk";
        }

        return { score: seasonalScore, description };
    }

    getPopulationDensityFactor(locationName, latitude, longitude) {
        // Population density affects impact calculations
        const majorCities = [
            { name: "Bangalore", density: 2.5 },
            { name: "Bengaluru", density: 2.5 },
            { name: "Mysore", density: 1.8 },
            { name: "Mysuru", density: 1.8 },
            { name: "Hubli", density: 1.6 },
            { name: "Mangalore", density: 1.7 },
            { name: "Belgaum", density: 1.4 }
        ];

        for (const city of majorCities) {
            if (locationName.toLowerCase().includes(city.name.toLowerCase())) {
                return city.density;
            }
        }

        return 1.0; // Default for smaller towns/rural areas
    }

    setupCropPageButtons() {
        // Setup "Use Current Location" button for crop page
        const currentLocationBtn = document.getElementById('crop-current-location-btn');
        if (currentLocationBtn) {
            currentLocationBtn.addEventListener('click', () => this.useCropCurrentLocation());
        }

        // Setup "Pin on Map" button for crop page
        const pinLocationBtn = document.getElementById('crop-pin-map-btn');
        if (pinLocationBtn) {
            pinLocationBtn.addEventListener('click', () => this.toggleCropPinMode());
        }

        // Setup season and water filters
        const seasonFilter = document.getElementById('crop-season-filter');
        const waterFilter = document.getElementById('crop-water-filter');

        if (seasonFilter) {
            seasonFilter.addEventListener('change', () => this.filterCrops());
        }

        if (waterFilter) {
            waterFilter.addEventListener('change', () => this.filterCrops());
        }
    }

    async useCropCurrentLocation() {
        try {
            Utils.showNotification('Getting your current location...', 'info', 3000);

            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Get location name from coordinates
            const locationName = await Utils.getLocationName(latitude, longitude);
            const displayName = locationName.split(',')[0];

            // Update the search input
            const searchInput = document.getElementById('crop-location-search');
            if (searchInput) {
                searchInput.value = displayName;
            }

            // Update map view
            if (this.cropMap) {
                this.cropMap.setView([latitude, longitude], 12);

                // Add a marker for current location
                if (this.cropCurrentLocationMarker) {
                    this.cropMap.removeLayer(this.cropCurrentLocationMarker);
                }
                this.cropCurrentLocationMarker = L.marker([latitude, longitude])
                    .addTo(this.cropMap)
                    .bindPopup(`📍 Your Current Location<br>${displayName}`)
                    .openPopup();
            }

            // Update crop data based on location
            this.updateCropData(displayName, latitude, longitude);

            Utils.showNotification(`Current location: ${displayName}`, 'success');
        } catch (error) {
            console.error('Error getting current location:', error);
            let errorMessage = 'Failed to get current location';
            if (error.code === 1) {
                errorMessage = 'Location access denied. Please enable location permissions.';
            } else if (error.code === 2) {
                errorMessage = 'Location unavailable. Please try again.';
            } else if (error.code === 3) {
                errorMessage = 'Location request timed out. Please try again.';
            }
            Utils.showNotification(errorMessage, 'error');
        }
    }

    toggleCropPinMode() {
        const pinBtn = document.getElementById('crop-pin-map-btn');
        if (!pinBtn) return;

        if (this.cropPinModeActive) {
            // Disable pin mode
            this.cropPinModeActive = false;
            pinBtn.innerHTML = '<span class="material-icons text-lg">place</span><span>Pin on Map</span>';
            pinBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            pinBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');

            if (this.cropMap) {
                this.cropMap.getContainer().style.cursor = '';
            }

            Utils.showNotification('Pin mode disabled', 'info');
        } else {
            // Enable pin mode
            this.cropPinModeActive = true;
            pinBtn.innerHTML = '<span class="material-icons text-lg">close</span><span>Cancel Pin</span>';
            pinBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
            pinBtn.classList.add('bg-red-500', 'hover:bg-red-600');

            if (this.cropMap) {
                this.cropMap.getContainer().style.cursor = 'crosshair';
            }

            Utils.showNotification('Click on the map to pin a location', 'info', 5000);
        }
    }

    async onCropMapClick(latitude, longitude) {
        try {
            console.log('Processing crop map click at coordinates:', latitude, longitude);

            // Round coordinates to avoid precision issues
            const roundedLat = Math.round(latitude * 10000) / 10000;
            const roundedLng = Math.round(longitude * 10000) / 10000;

            // Get location name from coordinates
            const locationName = await Utils.getLocationName(roundedLat, roundedLng);
            const displayName = locationName.split(',')[0];

            console.log('Location resolved to:', displayName);

            // Update the search input
            const searchInput = document.getElementById('crop-location-search');
            if (searchInput) {
                searchInput.value = displayName;
            }

            // Add a pin marker
            if (this.cropMap) {
                // Remove previous pin marker if exists
                if (this.cropPinMarker) {
                    this.cropMap.removeLayer(this.cropPinMarker);
                }

                // Add new pin marker with custom icon
                this.cropPinMarker = L.marker([roundedLat, roundedLng], {
                    icon: L.divIcon({
                        className: 'custom-pin-marker',
                        html: '<div style="background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🌾</div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    })
                })
                    .addTo(this.cropMap)
                    .bindPopup(`🌾 Farm Location<br><strong>${displayName}</strong><br>Lat: ${roundedLat}<br>Lng: ${roundedLng}`)
                    .openPopup();
            }

            // If pin mode is active, disable it after placing the pin
            if (this.cropPinModeActive) {
                this.toggleCropPinMode();
            }

            // Update crop data with rounded coordinates
            this.updateCropData(displayName, roundedLat, roundedLng);

            Utils.showNotification(`🌾 Farm location set: ${displayName}`, 'success');
        } catch (error) {
            console.error('Error handling crop map click:', error);
            Utils.showNotification('Failed to set farm location', 'error');
        }
    }

    async updateCropData(locationName, latitude, longitude) {
        try {
            // Update the location display
            const locationDisplay = document.getElementById('crop-location-display');
            const selectedLocation = document.getElementById('crop-selected-location');
            const selectedLat = document.getElementById('crop-selected-lat');
            const selectedLng = document.getElementById('crop-selected-lng');

            if (locationDisplay) {
                locationDisplay.textContent = `${locationName}, Karnataka, India`;
            }
            if (selectedLocation) {
                selectedLocation.textContent = `${locationName}, Karnataka, India`;
            }
            if (selectedLat) {
                selectedLat.textContent = latitude.toFixed(4);
            }
            if (selectedLng) {
                selectedLng.textContent = longitude.toFixed(4);
            }

            // Generate location-specific data
            const locationBasedData = this.generateLocationBasedCropData(locationName, latitude, longitude);

            // Store current location data for intelligent recommendations
            this.currentLocationData = locationBasedData;

            // Update soil analysis
            this.updateSoilAnalysis(locationBasedData.soil);

            // Update rainfall data
            this.updateRainfallAnalysis(locationBasedData.rainfall);

            // Update climate suitability
            this.updateClimateAnalysis(locationBasedData.climate);

            // Generate and display intelligent crop recommendations
            this.filterCrops();

            Utils.showNotification(`Smart crop recommendations updated for ${locationName}`, 'success');
        } catch (error) {
            console.error('Error updating crop data:', error);
            Utils.showNotification('Failed to update crop analysis', 'error');
        }
    }

    generateLocationBasedCropData(locationName, latitude, longitude) {
        // Generate realistic agricultural data based on location
        const soilTypes = ['Red Sandy Loam', 'Black Cotton Soil', 'Laterite Soil', 'Alluvial Soil', 'Red Loamy Soil'];
        const soilType = soilTypes[Math.floor((latitude + longitude) * 10) % soilTypes.length];

        // Calculate pH based on soil type and location
        const basePH = soilType.includes('Black') ? 7.8 : soilType.includes('Red') ? 6.2 : 6.8;
        const pH = basePH + ((latitude * longitude) % 1) * 0.8 - 0.4;

        // Calculate rainfall based on location (monsoon patterns)
        const baseRainfall = 780;
        const locationFactor = Math.sin(latitude * Math.PI / 180) * Math.cos(longitude * Math.PI / 180);
        const currentYearRainfall = Math.round(baseRainfall + locationFactor * 200 + 70);

        return {
            soil: {
                type: soilType,
                ph: Math.round(pH * 10) / 10,
                fertility: pH > 6.0 && pH < 7.5 ? 'High' : pH > 5.5 && pH < 8.0 ? 'Medium' : 'Low',
                drainage: soilType.includes('Sandy') ? 'Excellent' : soilType.includes('Clay') ? 'Poor' : 'Good'
            },
            rainfall: {
                current: currentYearRainfall,
                average: baseRainfall,
                status: currentYearRainfall > baseRainfall ? 'Above Average' : 'Below Average',
                monsoon: 'June - September'
            },
            climate: {
                temperature: '25-32°C',
                humidity: '65-75%',
                season: this.getCurrentSeason(),
                suitability: 'Excellent'
            }
        };
    }

    getCurrentSeason() {
        const month = new Date().getMonth(); // 0-11
        if (month >= 5 && month <= 9) return 'Kharif';
        if (month >= 10 || month <= 3) return 'Rabi';
        return 'Summer';
    }

    updateSoilAnalysis(soilData) {
        const soilType = document.getElementById('crop-soil-type');
        const soilPH = document.getElementById('crop-soil-ph');
        const soilFertility = document.getElementById('crop-soil-fertility');
        const soilDrainage = document.getElementById('crop-soil-drainage');

        if (soilType) soilType.textContent = soilData.type;
        if (soilPH) soilPH.textContent = `${soilData.ph} (${soilData.ph < 6.5 ? 'Acidic' : soilData.ph > 7.5 ? 'Alkaline' : 'Neutral'})`;
        if (soilFertility) {
            soilFertility.textContent = soilData.fertility;
            soilFertility.className = `font-medium ${soilData.fertility === 'High' ? 'text-green-400' : soilData.fertility === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`;
        }
        if (soilDrainage) {
            soilDrainage.textContent = soilData.drainage;
            soilDrainage.className = `font-medium ${soilData.drainage === 'Excellent' || soilData.drainage === 'Good' ? 'text-blue-400' : 'text-orange-400'}`;
        }
    }

    updateRainfallAnalysis(rainfallData) {
        const currentRainfall = document.getElementById('crop-rainfall-current');
        const averageRainfall = document.getElementById('crop-rainfall-average');
        const rainfallStatus = document.getElementById('crop-rainfall-status');
        const monsoonPeriod = document.getElementById('crop-rainfall-monsoon');

        if (currentRainfall) currentRainfall.textContent = `${rainfallData.current} mm`;
        if (averageRainfall) averageRainfall.textContent = `${rainfallData.average} mm`;
        if (rainfallStatus) {
            rainfallStatus.textContent = rainfallData.status;
            rainfallStatus.className = `font-medium ${rainfallData.status === 'Above Average' ? 'text-green-400' : 'text-orange-400'}`;
        }
        if (monsoonPeriod) monsoonPeriod.textContent = rainfallData.monsoon;
    }

    updateClimateAnalysis(climateData) {
        const temperature = document.getElementById('crop-temperature');
        const humidity = document.getElementById('crop-humidity');
        const currentSeason = document.getElementById('crop-current-season');
        const climateSuitability = document.getElementById('crop-climate-suitability');

        if (temperature) temperature.textContent = climateData.temperature;
        if (humidity) humidity.textContent = climateData.humidity;
        if (currentSeason) currentSeason.textContent = climateData.season;
        if (climateSuitability) climateSuitability.textContent = climateData.suitability;
    }

    filterCrops() {
        // Get current location data
        const locationData = this.currentLocationData || this.getDefaultLocationData();

        // Get filter selections
        const seasonFilter = document.getElementById('crop-season-filter')?.value || 'All Seasons';
        const waterFilter = document.getElementById('crop-water-filter')?.value || 'All Water Needs';

        // Generate intelligent crop recommendations
        const recommendedCrops = this.generateIntelligentCropRecommendations(locationData, seasonFilter, waterFilter);

        // Update the crop display
        this.updateCropRecommendationsDisplay(recommendedCrops);

        console.log('Smart crop recommendations updated based on:', {
            soil: locationData.soil,
            rainfall: locationData.rainfall,
            climate: locationData.climate,
            season: seasonFilter,
            water: waterFilter
        });

        Utils.showNotification(`${recommendedCrops.length} crops recommended for your conditions`, 'success', 2000);
    }

    getDefaultLocationData() {
        return {
            soil: {
                type: 'Red Sandy Loam',
                ph: 6.8,
                fertility: 'High',
                drainage: 'Good'
            },
            rainfall: {
                current: 850,
                average: 780,
                status: 'Above Average'
            },
            climate: {
                season: this.getCurrentSeason(),
                temperature: '25-32°C',
                humidity: '65-75%'
            }
        };
    }

    generateIntelligentCropRecommendations(locationData, seasonFilter, waterFilter) {
        console.log('Generating intelligent recommendations with:', {
            locationData,
            seasonFilter,
            waterFilter
        });

        // Comprehensive crop database with detailed requirements
        const cropDatabase = [
            {
                name: 'Rice',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                suitableSeasons: ['Kharif', 'All Seasons'],
                waterRequirement: 'High',
                waterNeedsPercent: 85,
                soilTypes: ['Clayey', 'Loamy', 'Alluvial'],
                phRange: [5.5, 7.0],
                minRainfall: 1000,
                maxRainfall: 2500,
                expectedYield: '5-7 tons/acre',
                growthDuration: '120-150 days',
                marketTrend: 'stable',
                description: 'High-yielding variety suitable for monsoon season',
                soilDrainagePreference: ['Poor', 'Moderate'], // Rice likes waterlogged conditions
                climatePreference: 'Tropical'
            },
            {
                name: 'Groundnut',
                image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400',
                suitableSeasons: ['Kharif', 'Rabi', 'All Seasons'],
                waterRequirement: 'Medium',
                waterNeedsPercent: 45,
                soilTypes: ['Sandy', 'Loamy', 'Red Sandy Loam'],
                phRange: [6.0, 7.5],
                minRainfall: 500,
                maxRainfall: 1200,
                expectedYield: '2-3 tons/acre',
                growthDuration: '90-120 days',
                marketTrend: 'increasing',
                description: 'Drought-resistant oilseed crop with good market demand',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Semi-arid'
            },
            {
                name: 'Sugarcane',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
                suitableSeasons: ['Annual', 'All Seasons'],
                waterRequirement: 'Very High',
                waterNeedsPercent: 95,
                soilTypes: ['Black', 'Loamy', 'Alluvial'],
                phRange: [6.5, 8.0],
                minRainfall: 1200,
                maxRainfall: 3000,
                expectedYield: '40-50 tons/acre',
                growthDuration: '12-18 months',
                marketTrend: 'stable',
                description: 'High water requirement but excellent returns',
                soilDrainagePreference: ['Good', 'Moderate'],
                climatePreference: 'Tropical'
            },
            {
                name: 'Cotton',
                image: 'https://images.unsplash.com/photo-1586155609628-5d936d7d6f98?w=400',
                suitableSeasons: ['Kharif', 'All Seasons'],
                waterRequirement: 'Medium',
                waterNeedsPercent: 55,
                soilTypes: ['Black', 'Sandy', 'Black Cotton Soil'],
                phRange: [6.0, 8.0],
                minRainfall: 600,
                maxRainfall: 1200,
                expectedYield: '1.5-2.5 tons/acre',
                growthDuration: '150-180 days',
                marketTrend: 'decreasing',
                description: 'Cash crop suitable for black cotton soil',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Semi-arid'
            },
            {
                name: 'Maize',
                image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
                suitableSeasons: ['Kharif', 'Rabi', 'All Seasons'],
                waterRequirement: 'Medium',
                waterNeedsPercent: 50,
                soilTypes: ['Loamy', 'Sandy', 'Alluvial'],
                phRange: [6.0, 7.5],
                minRainfall: 600,
                maxRainfall: 1200,
                expectedYield: '5-8 tons/acre',
                growthDuration: '90-110 days',
                marketTrend: 'increasing',
                description: 'Versatile cereal crop with multiple uses',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Temperate'
            },
            {
                name: 'Ragi (Finger Millet)',
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
                suitableSeasons: ['Kharif', 'All Seasons'],
                waterRequirement: 'Low',
                waterNeedsPercent: 30,
                soilTypes: ['Sandy', 'Loamy', 'Red Sandy Loam', 'Red Loamy Soil'],
                phRange: [5.0, 7.0],
                minRainfall: 400,
                maxRainfall: 800,
                expectedYield: '1.5-2.5 tons/acre',
                growthDuration: '120-130 days',
                marketTrend: 'increasing',
                description: 'Nutritious millet crop, drought-resistant',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Semi-arid'
            },
            {
                name: 'Jowar (Sorghum)',
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
                suitableSeasons: ['Kharif', 'Rabi', 'All Seasons'],
                waterRequirement: 'Low',
                waterNeedsPercent: 35,
                soilTypes: ['Sandy', 'Loamy', 'Red Sandy Loam', 'Black'],
                phRange: [6.0, 8.0],
                minRainfall: 400,
                maxRainfall: 750,
                expectedYield: '2-3 tons/acre',
                growthDuration: '100-120 days',
                marketTrend: 'stable',
                description: 'Drought-tolerant cereal crop ideal for dry regions',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Semi-arid'
            },
            {
                name: 'Sunflower',
                image: 'https://images.unsplash.com/photo-1597848212624-e6ec2d17d05a?w=400',
                suitableSeasons: ['Kharif', 'Rabi', 'All Seasons'],
                waterRequirement: 'Medium',
                waterNeedsPercent: 40,
                soilTypes: ['Sandy', 'Loamy', 'Red Sandy Loam'],
                phRange: [6.0, 7.5],
                minRainfall: 500,
                maxRainfall: 900,
                expectedYield: '1.5-2 tons/acre',
                growthDuration: '90-110 days',
                marketTrend: 'increasing',
                description: 'Oilseed crop with good drought tolerance',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Temperate'
            },
            {
                name: 'Wheat',
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
                suitableSeasons: ['Rabi', 'All Seasons'],
                waterRequirement: 'Medium',
                waterNeedsPercent: 60,
                soilTypes: ['Loamy', 'Alluvial', 'Black'],
                phRange: [6.0, 7.5],
                minRainfall: 300,
                maxRainfall: 800,
                expectedYield: '3-4 tons/acre',
                growthDuration: '120-150 days',
                marketTrend: 'stable',
                description: 'Winter crop requiring cool climate',
                soilDrainagePreference: ['Good', 'Excellent'],
                climatePreference: 'Temperate'
            },
            {
                name: 'Turmeric',
                image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
                suitableSeasons: ['Kharif', 'All Seasons'],
                waterRequirement: 'High',
                waterNeedsPercent: 75,
                soilTypes: ['Loamy', 'Red Loamy Soil', 'Alluvial'],
                phRange: [6.0, 7.5],
                minRainfall: 1000,
                maxRainfall: 2000,
                expectedYield: '8-12 tons/acre',
                growthDuration: '8-10 months',
                marketTrend: 'increasing',
                description: 'High-value spice crop with medicinal properties',
                soilDrainagePreference: ['Good', 'Moderate'],
                climatePreference: 'Tropical'
            }
        ];

        // Calculate suitability scores for each crop
        const scoredCrops = cropDatabase.map(crop => {
            const score = this.calculateCropSuitabilityScore(crop, locationData);
            console.log(`${crop.name} suitability score:`, score);
            return { ...crop, suitabilityScore: score };
        });

        console.log('All scored crops:', scoredCrops.map(c => ({ name: c.name, score: c.suitabilityScore })));

        // Filter by season
        let filteredCrops = scoredCrops;
        console.log('Season filter:', seasonFilter);
        console.log('Available seasons in crops:', scoredCrops.map(c => ({ name: c.name, seasons: c.suitableSeasons })));

        if (seasonFilter !== 'All Seasons') {
            // Convert filter values to match crop data
            let filterSeason = seasonFilter;
            if (seasonFilter === 'Kharif (Monsoon)') filterSeason = 'Kharif';
            if (seasonFilter === 'Rabi (Winter)') filterSeason = 'Rabi';

            filteredCrops = scoredCrops.filter(crop =>
                crop.suitableSeasons.includes(filterSeason) ||
                crop.suitableSeasons.includes('All Seasons')
            );
            console.log('After season filtering:', filteredCrops.length, 'crops remain');
        }

        // Filter by water requirement
        console.log('Water filter:', waterFilter);
        console.log('Available water requirements in crops:', scoredCrops.map(c => ({ name: c.name, water: c.waterRequirement })));

        if (waterFilter !== 'All Water Needs' && waterFilter !== 'all') {
            // Convert filter values to match crop data
            let filterWater = waterFilter;
            if (waterFilter === 'Low Water') filterWater = 'Low';
            if (waterFilter === 'Medium Water') filterWater = 'Medium';
            if (waterFilter === 'High Water') filterWater = 'High';

            filteredCrops = filteredCrops.filter(crop => crop.waterRequirement === filterWater);
            console.log('After water filtering:', filteredCrops.length, 'crops remain');
        } else {
            console.log('Skipping water filtering - showing all water requirements');
        }

        // Sort by suitability score (highest first) and return top recommendations
        return filteredCrops
            .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
            .slice(0, 6); // Show top 6 recommendations
    }

    calculateCropSuitabilityScore(crop, locationData) {
        let score = 0;
        let maxScore = 0;

        // Soil type compatibility (25% weight)
        maxScore += 25;
        if (crop.soilTypes.some(soilType =>
            locationData.soil.type.includes(soilType) ||
            soilType.includes(locationData.soil.type)
        )) {
            score += 25;
        } else {
            // Partial match for similar soil types
            const soilSimilarity = this.getSoilTypeSimilarity(crop.soilTypes, locationData.soil.type);
            score += soilSimilarity * 25;
        }

        // pH compatibility (20% weight)
        maxScore += 20;
        const ph = locationData.soil.ph;
        if (ph >= crop.phRange[0] && ph <= crop.phRange[1]) {
            score += 20;
        } else {
            // Partial score for near-optimal pH
            const phDistance = Math.min(
                Math.abs(ph - crop.phRange[0]),
                Math.abs(ph - crop.phRange[1])
            );
            const phScore = Math.max(0, 20 - (phDistance * 5));
            score += phScore;
        }

        // Rainfall compatibility (25% weight)
        maxScore += 25;
        const rainfall = locationData.rainfall.current;
        if (rainfall >= crop.minRainfall && rainfall <= crop.maxRainfall) {
            score += 25;
        } else {
            // Partial score for rainfall outside optimal range
            let rainfallScore = 0;
            if (rainfall < crop.minRainfall) {
                const deficit = crop.minRainfall - rainfall;
                rainfallScore = Math.max(0, 25 - (deficit / 50));
            } else {
                const excess = rainfall - crop.maxRainfall;
                rainfallScore = Math.max(0, 25 - (excess / 100));
            }
            score += rainfallScore;
        }

        // Drainage compatibility (15% weight)
        maxScore += 15;
        if (crop.soilDrainagePreference.includes(locationData.soil.drainage)) {
            score += 15;
        } else {
            // Partial score for acceptable drainage
            score += 7;
        }

        // Season compatibility (15% weight)
        maxScore += 15;
        const currentSeason = locationData.climate.season;
        if (crop.suitableSeasons.includes(currentSeason) || crop.suitableSeasons.includes('All Seasons')) {
            score += 15;
        } else {
            score += 5; // Minimal score for off-season crops
        }

        // Return percentage score
        return Math.round((score / maxScore) * 100);
    }

    getSoilTypeSimilarity(cropSoilTypes, locationSoilType) {
        // Define soil type similarity groups
        const soilGroups = {
            sandy: ['Sandy', 'Red Sandy Loam'],
            loamy: ['Loamy', 'Red Loamy Soil', 'Alluvial'],
            clayey: ['Clayey', 'Black Cotton Soil', 'Black'],
            red: ['Red Sandy Loam', 'Red Loamy Soil']
        };

        for (const [group, soils] of Object.entries(soilGroups)) {
            if (soils.includes(locationSoilType)) {
                const matchingSoils = cropSoilTypes.filter(soil => soils.includes(soil));
                if (matchingSoils.length > 0) {
                    return 0.7; // 70% similarity for same group
                }
            }
        }
        return 0.3; // 30% base compatibility
    }

    updateCropRecommendationsDisplay(crops) {
        console.log('Attempting to update crop display with', crops.length, 'crops');

        const cropGrid = document.getElementById('crop-cards-recommendations');
        const comparisonTable = document.querySelector('table tbody');

        console.log('Crop grid element found:', !!cropGrid);
        console.log('Comparison table found:', !!comparisonTable);

        if (!cropGrid) {
            console.error('Crop grid element not found - ID: crop-cards-recommendations');
            // Try alternative selectors
            const altGrid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
            console.log('Alternative grid found:', !!altGrid);
            if (altGrid) {
                altGrid.innerHTML = crops.map(crop => this.generateCropCard(crop)).join('');
            }
            return;
        }

        console.log('Updating crop grid with', crops.length, 'crops');
        // Update crop cards
        cropGrid.innerHTML = crops.map(crop => this.generateCropCard(crop)).join('');

        // Update comparison table if it exists
        if (comparisonTable) {
            console.log('Updating comparison table');
            comparisonTable.innerHTML = crops.map(crop => this.generateComparisonRow(crop)).join('');
        }

        console.log('Crop display update completed');
    }

    generateCropCard(crop) {
        const trendIcon = this.getTrendIcon(crop.marketTrend);
        const trendColor = this.getTrendColor(crop.marketTrend);
        const suitabilityStars = this.generateStarRating(crop.suitabilityScore);
        const seasonTag = this.getSeasonTag(crop);

        return `
            <div class="bg-[#1a2332] rounded-xl p-6 hover:bg-[#223649] transition-colors">
                <div class="flex items-start justify-between mb-4">
                    <img src="${crop.image}" alt="${crop.name}" class="w-16 h-16 rounded-lg object-cover">
                    <div class="text-right">
                        <div class="flex items-center gap-1 text-yellow-400 mb-1">
                            ${suitabilityStars.html}
                            <span class="text-sm ml-1">${suitabilityStars.score}</span>
                        </div>
                        <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">${seasonTag}</span>
                    </div>
                </div>

                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-white">${crop.name}</h3>
                        <span class="material-icons text-sm ${trendColor}" title="Market Trend">${trendIcon}</span>
                    </div>
                    <p class="text-[#90adcb] text-sm">${crop.description}</p>
                </div>

                <div class="space-y-3 mb-4">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-[#90adcb]">Expected Yield:</span>
                            <span class="text-white font-medium">${crop.expectedYield}</span>
                        </div>
                        <div>
                            <span class="text-[#90adcb]">Water Requirement:</span>
                            <span class="text-white font-medium">${crop.waterRequirement}</span>
                        </div>
                        <div class="col-span-2">
                            <span class="text-[#90adcb]">Growth Duration:</span>
                            <span class="text-white font-medium">${crop.growthDuration}</span>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-[#90adcb]">Water Needs</span>
                            <span class="text-white">${crop.waterNeedsPercent}%</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${crop.waterNeedsPercent}%"></div>
                        </div>
                    </div>

                    <div>
                        <span class="text-[#90adcb] text-sm">Suitable Soil Types:</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${crop.soilTypes.slice(0, 2).map(soil =>
                                `<span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">${soil}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Select Crop
                    </button>
                    <button class="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                        <span class="material-icons text-lg">info</span>
                    </button>
                </div>
            </div>
        `;
    }

    generateComparisonRow(crop) {
        const trendIcon = this.getTrendIcon(crop.marketTrend);
        const trendColor = this.getTrendColor(crop.marketTrend);
        const trendText = crop.marketTrend.charAt(0).toUpperCase() + crop.marketTrend.slice(1);
        const suitabilityStars = this.generateStarRating(crop.suitabilityScore);

        return `
            <tr class="border-b border-gray-700 hover:bg-[#1a2332]">
                <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                        <img src="${crop.image}" alt="${crop.name}" class="w-10 h-10 rounded object-cover">
                        <span class="text-white font-medium">${crop.name}</span>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center gap-1 text-yellow-400">
                        ${suitabilityStars.html}
                        <span class="text-sm ml-1">${suitabilityStars.score}/5</span>
                    </div>
                </td>
                <td class="py-4 px-4 text-white">${crop.waterRequirement}</td>
                <td class="py-4 px-4 text-white">${crop.expectedYield}</td>
                <td class="py-4 px-4 text-white">${crop.growthDuration}</td>
                <td class="py-4 px-4">
                    <div class="flex items-center gap-1 ${trendColor}">
                        <span class="material-icons text-sm">${trendIcon}</span>
                        <span class="text-sm">${trendText}</span>
                    </div>
                </td>
            </tr>
        `;
    }

    generateStarRating(score) {
        const rating = (score / 100) * 5; // Convert to 5-star scale
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '';
        for (let i = 0; i < fullStars; i++) {
            html += '<span class="material-icons text-sm">star</span>';
        }
        if (hasHalfStar) {
            html += '<span class="material-icons text-sm">star_half</span>';
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '<span class="material-icons text-sm text-gray-600">star_border</span>';
        }

        return {
            html: html,
            score: rating.toFixed(1)
        };
    }

    getTrendIcon(trend) {
        switch (trend) {
            case 'increasing': return 'trending_up';
            case 'decreasing': return 'trending_down';
            case 'stable': return 'trending_flat';
            default: return 'trending_flat';
        }
    }

    getTrendColor(trend) {
        switch (trend) {
            case 'increasing': return 'text-green-400';
            case 'decreasing': return 'text-red-400';
            case 'stable': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    }

    getSeasonTag(crop) {
        const currentSeason = this.getCurrentSeason();
        if (crop.suitableSeasons.includes(currentSeason)) {
            return currentSeason;
        }
        return crop.suitableSeasons[0];
    }

    showLoading() { if (this.loadingScreen) this.loadingScreen.style.display = 'flex'; if (this.appContainer) this.appContainer.style.display = 'none'; }
    hideLoading() { if (this.loadingScreen) this.loadingScreen.style.display = 'none'; if (this.appContainer) this.appContainer.style.display = 'block'; }
    showError(message) { if (typeof Utils !== 'undefined') Utils.showError(message); console.error("APP_ERROR:", message); }
    async showNotifications() { if (typeof Utils !== 'undefined') Utils.showNotification('Notifications feature coming soon', 'info'); }

    updateURL(pageName) { if (window.location.protocol !== 'file:') try { window.history.pushState({ page: pageName }, '', pageName === 'home' ? '/' : `/${pageName}`); } catch (e) { console.warn('URL update failed',e);}}
    handlePopState(event) { this.navigateToPage(event.state?.page || 'landing'); }
    handleResize() { Object.values(this.charts).forEach(c => c?.resize && c.resize()); Object.values(this.maps).forEach(m => m?.invalidateSize && m.invalidateSize()); }
    handleKeyboardShortcuts(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); const searchInput = document.querySelector('input[placeholder*="Search"]'); if(searchInput) searchInput.focus(); }}

    initializeMap(containerId, center, zoom, mapKey = containerId, tileLayerUrl = (typeof CONFIG !== 'undefined' ? CONFIG.MAP.TILE_LAYER : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"), attribution = (typeof CONFIG !== 'undefined' ? CONFIG.MAP.ATTRIBUTION : "")) {
        const mapContainer = document.getElementById(containerId);
        if (!mapContainer || typeof L === 'undefined') { console.warn(`Map container ${containerId} not found or Leaflet (L) not loaded.`); return null; }
        if (this.maps[mapKey]) { try { this.maps[mapKey].remove(); } catch(e) { console.warn("Error removing map:", e); } }

        this.maps[mapKey] = L.map(containerId, { center, zoom, minZoom: (CONFIG?.MAP?.MIN_ZOOM || 5), maxZoom: (CONFIG?.MAP?.MAX_ZOOM || 18), zoomControl: false });
        L.tileLayer(tileLayerUrl, { attribution, maxZoom: (CONFIG?.MAP?.MAX_ZOOM || 18) }).addTo(this.maps[mapKey]);

        document.querySelectorAll(`[data-map-target="${containerId}"]`).forEach(c => { const a = c.dataset.mapControl; if (a === 'zoom-in') c.onclick = () => this.maps[mapKey].zoomIn(); if (a === 'zoom-out') c.onclick = () => this.maps[mapKey].zoomOut(); if (a === 'current-location') c.onclick = () => this.getCurrentLocation(mapKey);});
        console.log(`${containerId} (key: ${mapKey}) map initialized`);
        return this.maps[mapKey];
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

        // Try to get saved theme, fallback to light if localStorage is not available
        let savedTheme = 'light';
        try {
            savedTheme = localStorage.getItem('theme') || 'light';
        } catch (e) {
            console.warn('localStorage not available, using default light theme');
        }

        this.setTheme(savedTheme, true);
        const toggleListener = () => this.setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
        if (themeToggle) themeToggle.onclick = toggleListener;
        if (mobileThemeToggle) mobileThemeToggle.onclick = toggleListener;
    }

    setTheme(theme, isInitial = false) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Try to save theme, handle localStorage errors gracefully
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Could not save theme to localStorage:', e);
        }
        const isDark = theme === 'dark';

        // Update theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const moonIcon = themeToggle.querySelector('.moon-icon');
            const sunIcon = themeToggle.querySelector('.sun-icon');

            if (isDark) {
                // Dark mode - show moon icon
                if (moonIcon) {
                    moonIcon.classList.remove('scale-0', 'opacity-0');
                    moonIcon.classList.add('scale-100', 'opacity-100');
                }
                if (sunIcon) {
                    sunIcon.classList.remove('scale-100', 'opacity-100');
                    sunIcon.classList.add('scale-0', 'opacity-0');
                }
                themeToggle.setAttribute('data-state', 'on');
            } else {
                // Light mode - show sun icon
                if (moonIcon) {
                    moonIcon.classList.remove('scale-100', 'opacity-100');
                    moonIcon.classList.add('scale-0', 'opacity-0');
                }
                if (sunIcon) {
                    sunIcon.classList.remove('scale-0', 'opacity-0');
                    sunIcon.classList.add('scale-100', 'opacity-100');
                }
                themeToggle.removeAttribute('data-state');
            }
        }

        // Update mobile theme toggle
        document.querySelectorAll('.mobile-theme-slider').forEach(s => s.classList.toggle('light', !isDark));
        document.querySelectorAll('.mobile-theme-icon').forEach(i => i.textContent = isDark ? 'dark_mode' : 'light_mode');

        Object.values(this.maps).forEach(map => this.updateMapTheme(map, theme));
        // Note: Removed notification to avoid blue animation when toggling theme
    }

    updateMapTheme(mapInstance, theme) {
        // Update map tile layer based on theme
        if (mapInstance && mapInstance._layers) {
            // Find and remove existing tile layer
            mapInstance.eachLayer((layer) => {
                if (layer._url && layer._url.includes('basemaps.cartocdn.com')) {
                    mapInstance.removeLayer(layer);
                }
            });

            // Add new tile layer based on theme
            const tileLayer = theme === 'dark'
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

            L.tileLayer(tileLayer, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(mapInstance);
        }
    }

    async getCurrentLocation(mapInstanceKey) {
        try {
            if (typeof Utils === 'undefined') { console.error("Utils not defined."); return; }
            const location = await Utils.getCurrentLocation();
            Utils.showNotification(`Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`, 'success');
            const locInput = document.getElementById('location-search') || document.getElementById('district-search') || document.getElementById('flood-location-search');
            if (locInput) { const locName = await Utils.getLocationName(location.latitude, location.longitude); locInput.value = locName.split(',')[0]; }
            const mapToUpdate = mapInstanceKey && this.maps[mapInstanceKey] ? this.maps[mapInstanceKey] : (this.maps.dashboardMap || Object.values(this.maps)[0]);
            if (mapToUpdate && typeof L !== 'undefined') {
                 mapToUpdate.setView([location.latitude, location.longitude], 12);
                 if (mapToUpdate.currentLocationMarker) try { mapToUpdate.removeLayer(mapToUpdate.currentLocationMarker); } catch(e) {/*ignore*/}
                 mapToUpdate.currentLocationMarker = L.marker([location.latitude, location.longitude]).addTo(mapToUpdate).bindPopup("Your Current Location").openPopup();
            } else console.warn("No map instance or Leaflet (L) to update location.");
        } catch (error) { if (typeof Utils !== 'undefined') Utils.showNotification('Failed to get current location', 'error'); console.error('Location error:', error); }
    }

    downloadReport(typeOrLocation) {
        try {
            const reportData = { type: typeof typeOrLocation === 'string' ? typeOrLocation : 'general', timestamp: new Date().toISOString(), location: (CONFIG?.APP?.DEFAULT_LOCATION || 'N/A'), data: `Sample report data for ${typeOrLocation}` };
            const filename = `${reportData.type}-report-${new Date().toISOString().split('T')[0]}.json`;
            if (typeof Utils !== 'undefined') Utils.downloadFile(JSON.stringify(reportData, null, 2), filename, 'application/json');
            if (typeof Utils !== 'undefined') Utils.showNotification(`${reportData.type} report downloaded`, 'success');
        } catch (error) { if (typeof Utils !== 'undefined') Utils.showNotification('Failed to download report', 'error'); console.error('Download error:', error); }
    }

    setAlert(type) { if (typeof Utils !== 'undefined') Utils.showNotification(`${type} alerts feature coming soon`, 'info'); console.log(`Setting alert for ${type}`); }
    applyCropFilters() { if (typeof Utils !== 'undefined') Utils.showNotification('Filters applied', 'success'); const wr = document.getElementById('water-needs-slider'); const st = document.querySelector('input[name="soil_type_filter"]:checked'); const sn = document.querySelector('input[name="season_filter"]:checked'); console.log('Applying crop filters:', { water: wr?.value, soil: st?.value, season: sn?.value });}
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, creating CropCast app instance...');
    if (typeof Utils === 'undefined' || typeof Pages === 'undefined' || typeof Components === 'undefined' || typeof apiService === 'undefined' || typeof CONFIG === 'undefined') {
        console.error("One or more core script (Utils, Pages, Components, apiService, CONFIG) is not loaded. App initialization halted.");
        document.body.innerHTML = '<div style="color: red; text-align: center; padding: 50px; font-family: sans-serif;"><h1>Application Error</h1><p>Core script files are missing. Please check the console and ensure all JavaScript files are correctly loaded.</p></div>';
        return;
    }
    window.cropCastApp = new CropCastApp();
    window.App = window.cropCastApp;
    try { await window.App.init(); } catch (initError) { console.error("Fatal error during app initialization:", initError); if (document.body) document.body.innerHTML = '<div style="color: red; text-align: center; padding: 50px; font-family: sans-serif;"><h1>Application Error</h1><p>Could not initialize the application. Please try refreshing the page or contact support.</p></div>';}
});
