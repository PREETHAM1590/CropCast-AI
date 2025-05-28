/**
 * CropCast AI - Page Handlers
 * Handles rendering and functionality for each page/screen
 */
console.log('[DEBUG_LOAD] pages.js executing');
const Pages = {
    /**
     * Render New Landing Page (matches provided design)
     */
    async renderLanding() {
        try {
            // Get live statistics
            const analytics = await apiService.getAnalytics('7d');

            return `
                <div class="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
                    <div class="layout-container flex h-full grow flex-col">
                        <main class="flex flex-1 flex-col items-center justify-center py-10 px-4 sm:px-8">
                            <div class="layout-content-container flex flex-col max-w-5xl w-full flex-1">
                                <div class="@container">
                                    <div class="hero-section flex min-h-[50vh] sm:min-h-[60vh] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-center justify-center p-6 sm:p-10 text-center shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <h1 class="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[640px]:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-500">
                                            AI-Powered Agricultural Intelligence
                                        </h1>
                                        <p class="text-slate-700 dark:text-gray-300 text-base font-normal leading-relaxed @[480px]:text-lg max-w-2xl">
                                            Empowering farmers, agricultural officers, and water conservation planners in Karnataka with predictive insights for rainfall, flood risks, and optimal crop
                                            recommendations.
                                        </p>
                                        <div class="flex flex-col sm:flex-row flex-wrap gap-4 mt-6 justify-center">
                                            <button class="nav-btn flex items-center justify-center gap-2 min-w-[180px] cursor-pointer rounded-lg h-12 px-6 bg-[#2563eb] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-80 transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg" data-page="rainfall">
                                                <span class="material-icons text-xl">water_drop</span>
                                                <span class="truncate">Predict Rainfall</span>
                                            </button>
                                            <button class="nav-btn flex items-center justify-center gap-2 min-w-[180px] cursor-pointer rounded-lg h-12 px-6 bg-slate-200 text-slate-900 text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg" data-page="flood">
                                                <span class="material-icons text-xl">flood</span>
                                                <span class="truncate">Check Flood Risk</span>
                                            </button>
                                            <button class="nav-btn flex items-center justify-center gap-2 min-w-[180px] cursor-pointer rounded-lg h-12 px-6 bg-green-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-80 transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg sm:mt-0 mt-4" data-page="crops">
                                                <span class="material-icons text-xl">eco</span>
                                                <span class="truncate">Get Crop Recommendations</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 mt-10">
                                    <div class="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-gray-700 hover:border-[#2563eb] dark:hover:border-blue-500 transition-all duration-300">
                                        <div class="flex items-center gap-3">
                                            <span class="material-icons text-2xl text-[#2563eb] dark:text-blue-400">group</span>
                                            <p class="text-slate-700 dark:text-gray-300 text-lg font-medium leading-normal">Active Users</p>
                                        </div>
                                        <p class="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">${(analytics?.performance_metrics?.active_users_today ? Utils.formatLargeNumber(analytics.performance_metrics.active_users_today) : '1,234')}+</p>
                                    </div>
                                    <div class="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-gray-700 hover:border-[#2563eb] dark:hover:border-blue-500 transition-all duration-300">
                                        <div class="flex items-center gap-3">
                                            <span class="material-icons text-2xl text-[#2563eb] dark:text-blue-400">cloud</span>
                                            <p class="text-slate-700 dark:text-gray-300 text-lg font-medium leading-normal">Rainfall Predicted</p>
                                        </div>
                                        <p class="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">${(analytics?.usage_statistics?.total_predictions ? Utils.formatNumber(analytics.usage_statistics.total_predictions, 0) : '5,678')} mm</p>
                                    </div>
                                    <div class="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-500 transition-all duration-300">
                                        <div class="flex items-center gap-3">
                                            <span class="material-icons text-2xl text-green-600 dark:text-green-400">grass</span>
                                            <p class="text-slate-700 dark:text-gray-300 text-lg font-medium leading-normal">Crops Recommended</p>
                                        </div>
                                        <p class="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">${(analytics?.usage_statistics?.total_recommendations ? Utils.formatLargeNumber(analytics.usage_statistics.total_recommendations) : '9,012')}+</p>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering landing page:', error);
            return this.renderError('Failed to load landing page data');
        }
    },



    /**
     * Render Calculator Page
     */
    async renderCalculator() {
        try {
            return `
                <div class="flex flex-1 flex-col py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
                    <div class="max-w-6xl mx-auto w-full">
                        <!-- Header Section -->
                        <div class="text-center mb-8">
                            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                                <span class="material-icons text-white text-2xl">agriculture</span>
                            </div>
                            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Agricultural Intelligence Calculator</h1>
                            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Harness the power of AI to get comprehensive analysis for rainfall prediction, flood risk assessment,
                                rainwater harvesting potential, soil analysis, and personalized crop recommendations
                            </p>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Input Form Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                                    <div class="flex items-center gap-3">
                                        <span class="material-icons text-white text-xl">tune</span>
                                        <div>
                                            <h2 class="text-xl font-semibold text-white">Input Parameters</h2>
                                            <p class="text-blue-100 text-sm">Configure your analysis settings</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-6 space-y-6">
                                    <!-- Location Input -->
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <span class="material-icons text-lg">location_on</span>
                                            <label class="font-medium">Location (Karnataka State)</label>
                                        </div>
                                        <div class="relative">
                                            <input type="text" id="location-input"
                                                   placeholder="Search for city or district..."
                                                   class="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                            <span class="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                                        </div>
                                        <div id="location-suggestions" class="hidden mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"></div>
                                    </div>

                                    <!-- Plot Size Input -->
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <span class="material-icons text-lg">landscape</span>
                                            <label class="font-medium">Farm Plot Size</label>
                                        </div>
                                        <div class="relative">
                                            <input type="number" id="plot-size-input"
                                                   placeholder="Enter size"
                                                   min="0.1" step="0.1"
                                                   class="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <span class="material-icons text-sm">straighten</span>
                                                <span class="text-sm font-medium">acres</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Season Selection -->
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <span class="material-icons text-lg">wb_sunny</span>
                                            <label class="font-medium">Growing Season</label>
                                        </div>
                                        <div class="relative">
                                            <select id="season-select"
                                                    class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none">
                                                <option value="kharif">🌧️ Kharif Season (June - October)</option>
                                                <option value="rabi">❄️ Rabi Season (November - April)</option>
                                                <option value="summer">☀️ Summer Season (April - June)</option>
                                            </select>
                                            <span class="material-icons absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">calendar_today</span>
                                        </div>
                                    </div>

                                    <!-- Analyze Button -->
                                    <button id="analyze-btn"
                                            class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        <span class="material-icons text-xl">psychology</span>
                                        <span>Analyze Agricultural Data</span>
                                        <span class="material-icons text-xl">arrow_forward</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Features Preview Section -->
                            <div class="space-y-6">
                                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                                    <div class="flex items-center gap-3 mb-6">
                                        <span class="material-icons text-emerald-600 text-2xl">eco</span>
                                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Ready for Agricultural Analysis</h3>
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                                        Configure your parameters and let our AI-powered system analyze your agricultural data to provide comprehensive insights and recommendations
                                    </p>

                                    <!-- Feature Grid -->
                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="feature-card p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <span class="material-icons text-blue-600 dark:text-blue-400 text-2xl mb-2 group-hover:scale-110 transition-transform">cloud</span>
                                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Rainfall</h4>
                                            <p class="text-gray-600 dark:text-gray-400 text-xs">Prediction</p>
                                        </div>
                                        <div class="feature-card p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <span class="material-icons text-orange-600 dark:text-orange-400 text-2xl mb-2 group-hover:scale-110 transition-transform">warning</span>
                                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Flood Risk</h4>
                                            <p class="text-gray-600 dark:text-gray-400 text-xs">Assessment</p>
                                        </div>
                                        <div class="feature-card p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <span class="material-icons text-cyan-600 dark:text-cyan-400 text-2xl mb-2 group-hover:scale-110 transition-transform">water_drop</span>
                                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Water</h4>
                                            <p class="text-gray-600 dark:text-gray-400 text-xs">Harvesting</p>
                                        </div>
                                        <div class="feature-card p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <span class="material-icons text-green-600 dark:text-green-400 text-2xl mb-2 group-hover:scale-110 transition-transform">terrain</span>
                                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Soil</h4>
                                            <p class="text-gray-600 dark:text-gray-400 text-xs">Analysis</p>
                                        </div>
                                        <div class="feature-card p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all duration-200 cursor-pointer group col-span-2">
                                            <span class="material-icons text-purple-600 dark:text-purple-400 text-2xl mb-2 group-hover:scale-110 transition-transform">grass</span>
                                            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Crop</h4>
                                            <p class="text-gray-600 dark:text-gray-400 text-xs">Recommendations</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Trust Indicators -->
                                <div class="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                                    <p class="text-gray-700 dark:text-gray-300 text-center mb-4">
                                        Powered by advanced AI models including LSTM, ARIMA, and Random Forest algorithms
                                    </p>
                                    <div class="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <span class="material-icons">verified</span>
                                        <span class="font-semibold">Trusted by 10,000+ farmers across Karnataka</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering calculator page:', error);
            return this.renderError('Failed to load calculator page');
        }
    },

    /**
     * Render Dashboard Page
     */
    async renderDashboard() {
        try {
            // const [status, analytics] = await Promise.all([ // Keep API calls if needed
            //     apiService.getSystemStatus(),
            //     apiService.getAnalytics('7d')
            // ]);

            // Mock data based on Image 4
            const dashboardStats = {
                expectedRainfall: { value: '150mm', trend: '+10% vs avg.', trendDirection: 'up' },
                floodRisk: { level: 'Low', probability: 'Currently 0% probability' },
                topCrops: { names: 'Rice, Sugarcane, Maize', yieldPotential: '+5% yield potential' },
                waterAvailability: { value: '85%', trend: '-2% vs last week', trendDirection: 'down' },
                soilTemperature: { value: '28°C', note: 'Optimal for germination' }
            };
            const mapImageUrl = "https://source.unsplash.com/random/800x600?map,abstract";

            return `
                <div class="flex flex-1 flex-col lg:flex-row bg-[#101a23] min-h-screen">
                    <!-- Main Map Content -->
                    <div class="flex-1 p-4 sm:p-6 relative">
                        <div id="dashboard-map-container" class="relative rounded-xl overflow-hidden shadow-xl h-full min-h-[calc(100vh-10rem)] bg-[#15202b] border border-[#223649]">
                            <img src="${mapImageUrl}" alt="Map of Karnataka" class="absolute inset-0 w-full h-full object-cover"/>
                            <!-- Search Bar on Map -->
                            <div class="absolute top-4 left-4 w-full max-w-sm z-10">
                                <div class="relative">
                                    <div class="flex items-center bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm rounded-lg shadow-md h-11">
                                        <span class="material-icons text-gray-500 dark:text-gray-400 pl-3">search</span>
                                        <input id="dashboard-location-search" type="text" placeholder="Search for a location in Karnataka..." class="flex-1 bg-transparent border-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 text-sm px-3 py-2 h-full rounded-r-lg">
                                    </div>
                                    <!-- Location Suggestions Dropdown -->
                                    <div id="dashboard-location-suggestions" class="absolute top-full left-0 right-0 bg-white dark:bg-[#1c2a38] border border-gray-200 dark:border-[#223649] rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50 hidden">
                                        <!-- Suggestions will be populated here -->
                                    </div>
                                </div>
                            </div>
                            <!-- Map Controls -->
                            <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                                <button class="map-control-btn bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-[#334155]"><span class="material-icons text-lg">add</span></button>
                                <button class="map-control-btn bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-[#334155]"><span class="material-icons text-lg">remove</span></button>
                                <button class="map-control-btn bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-[#334155] mt-2"><span class="material-icons text-lg">explore</span></button>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar with Stats -->
                    <div class="w-full lg:w-[380px] xl:w-[420px] bg-[#15202b] p-4 sm:p-6 space-y-6 overflow-y-auto border-l border-[#223649]">
                        <div class="flex items-center justify-between">
                            <h2 class="text-white text-xl font-semibold leading-tight">Karnataka, India</h2>
                            <button class="text-gray-400 hover:text-[#3d98f4] transition-colors">
                                <span class="material-icons text-2xl">tune</span>
                            </button>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-1.5" for="dashboard-date-range">Date Range</label>
                            <div class="relative">
                                <select class="form-select block w-full appearance-none rounded-md border border-[#314d68] bg-[#1c2a38] px-3 py-2.5 text-white shadow-sm focus:border-[#3d98f4] focus:outline-none focus:ring-1 focus:ring-[#3d98f4] sm:text-sm" id="dashboard-date-range">
                                    <option>Next 7 Days</option>
                                    <option>Next 15 Days</option>
                                    <option>Next 30 Days</option>
                                </select>
                                <span class="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">arrow_drop_down</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Expected Rainfall -->
                            <div class="bg-[#1c2a38] p-4 rounded-lg border border-[#314d68] shadow-md">
                                <p class="text-sm font-medium text-gray-400 flex items-center gap-1.5"><span class="material-icons text-base text-blue-400">water_drop</span>Expected Rainfall</p>
                                <p class="text-white text-2xl font-semibold mt-1">${dashboardStats.expectedRainfall.value}</p>
                                <p class="text-green-400 text-xs font-medium mt-0.5 flex items-center"><span class="material-icons text-sm">arrow_upward</span>${dashboardStats.expectedRainfall.trend}</p>
                            </div>
                            <!-- Flood Risk Level -->
                            <div class="bg-[#1c2a38] p-4 rounded-lg border border-[#314d68] shadow-md">
                                <p class="text-sm font-medium text-gray-400 flex items-center gap-1.5"><span class="material-icons text-base text-yellow-400">warning_amber</span>Flood Risk Level</p>
                                <p class="text-white text-2xl font-semibold mt-1">${dashboardStats.floodRisk.level}</p>
                                <p class="text-gray-500 text-xs font-medium mt-0.5">${dashboardStats.floodRisk.probability}</p>
                            </div>
                        </div>

                        <!-- Top Recommended Crops -->
                        <div class="bg-[#1c2a38] p-4 rounded-lg border border-[#314d68] shadow-md">
                            <p class="text-sm font-medium text-gray-400 flex items-center gap-1.5"><span class="material-icons text-base text-green-400">eco</span>Top Recommended Crops</p>
                            <p class="text-white text-lg font-semibold mt-1">${dashboardStats.topCrops.names}</p>
                            <p class="text-green-400 text-xs font-medium mt-0.5 flex items-center"><span class="material-icons text-sm">arrow_upward</span>${dashboardStats.topCrops.yieldPotential}</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Water Availability -->
                            <div class="bg-[#1c2a38] p-4 rounded-lg border border-[#314d68] shadow-md">
                                <p class="text-sm font-medium text-gray-400 flex items-center gap-1.5"><span class="material-icons text-base text-blue-400">opacity</span>Water Availability</p>
                                <p class="text-white text-2xl font-semibold mt-1">${dashboardStats.waterAvailability.value}</p>
                                <p class="text-red-400 text-xs font-medium mt-0.5 flex items-center"><span class="material-icons text-sm">arrow_downward</span>${dashboardStats.waterAvailability.trend}</p>
                            </div>
                            <!-- Soil Temperature -->
                            <div class="bg-[#1c2a38] p-4 rounded-lg border border-[#314d68] shadow-md">
                                <p class="text-sm font-medium text-gray-400 flex items-center gap-1.5"><span class="material-icons text-base text-orange-400">thermostat</span>Soil Temperature</p>
                                <p class="text-white text-2xl font-semibold mt-1">${dashboardStats.soilTemperature.value}</p>
                                <p class="text-gray-500 text-xs font-medium mt-0.5">${dashboardStats.soilTemperature.note}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering dashboard:', error);
            return this.renderError('Failed to load dashboard data');
        }
    },

    /**
     * Render Rainfall Prediction Page
     */
    async renderRainfall() {
        try {
            const location = CONFIG.APP.DEFAULT_LOCATION; // This might need to be dynamic based on search
            // const prediction = await apiService.predictRainfall(location, 30, true); // Keep API call

            // Mock data based on Image 5 for "Monthly Breakdown"
            // The image shows a specific structure, will adapt Components.createMonthlyCards or make a new one if needed.
            const monthlyDataImage = [
                { month: "January", rainfall: "40mm", iconName: "cloudy" },
                { month: "February", rainfall: "35mm", iconName: "rainy" }, // Assuming based on pattern
                { month: "March", rainfall: "45mm", iconName: "cloudy_snowing" },
                { month: "April", rainfall: "60mm", iconName: "thunderstorm" },
                { month: "May", rainfall: "75mm", iconName: "rainy_heavy" }, // rainy_heavy or water_drop
                { month: "June", rainfall: "90mm", iconName: "water_drop" },
                // Add more months if visible or needed
            ];


            return `
                <div class="px-4 sm:px-8 md:px-12 lg:px-20 flex flex-1 justify-center py-8 bg-white dark:bg-[#101a23]">
                    <div class="layout-content-container flex flex-col max-w-6xl w-full flex-1 gap-8">
                        <div class="flex flex-wrap justify-between items-center gap-4">
                            <h1 class="text-gray-900 dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight">Rainfall Prediction</h1>
                            <p class="text-gray-600 dark:text-[#90adcb] text-lg">Karnataka, India</p>
                        </div>
                        <div class="relative">
                            <label class="flex flex-col min-w-40 h-12 w-full">
                                <div class="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm bg-[#1c2a38] dark:bg-[#1c2a38] bg-gray-100 border border-transparent focus-within:border-[#3d98f4] focus-within:ring-2 focus-within:ring-[#3d98f4]/50">
                                    <div class="text-[#90adcb] dark:text-[#90adcb] text-gray-500 flex items-center justify-center pl-4">
                                        <span class="material-icons text-xl">search</span>
                                    </div>
                                    <input id="district-search" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white dark:text-white text-gray-900 focus:outline-none border-none bg-transparent h-full placeholder:text-[#6b87a5] dark:placeholder:text-[#6b87a5] placeholder:text-gray-400 px-4 text-base font-normal leading-normal" placeholder="Search for a district (e.g., Bangalore Urban, Mysore)" value=""/>
                                </div>
                            </label>
                            <!-- Location Suggestions Dropdown -->
                            <div id="district-suggestions-rainfall" class="absolute top-full left-0 right-0 bg-white dark:bg-[#1c2a38] border border-gray-200 dark:border-[#223649] rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50 hidden">
                                <!-- Suggestions will be populated here -->
                            </div>
                        </div>
                        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div class="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#223649] bg-gray-50 dark:bg-[#15202b] p-6 shadow-lg">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-gray-900 dark:text-white text-lg font-semibold leading-normal">Predicted vs Historical Rainfall</h3>
                                    <button class="flex items-center gap-2 text-xs text-gray-600 dark:text-[#90adcb] hover:text-[#3d98f4]">
                                        <span class="material-icons text-sm">timeline</span>
                                        <span>Next 12 Months</span>
                                        <span class="material-icons text-sm">arrow_drop_down</span>
                                    </button>
                                </div>
                                <div class="flex items-baseline gap-3">
                                    <p class="text-gray-900 dark:text-white tracking-tight text-5xl font-bold leading-tight">120<span class="text-2xl text-gray-600 dark:text-[#90adcb]">mm</span></p>
                                    <div class="flex items-center gap-1 text-green-500 dark:text-green-400 text-lg font-semibold">
                                        <span class="material-icons text-xl">arrow_upward</span>
                                        <span>15%</span>
                                    </div>
                                </div>
                                <p class="text-gray-600 dark:text-[#90adcb] text-sm font-normal leading-normal">Compared to 5-year average for this period.</p>
                                <div class="h-64 sm:h-80 chart-container mt-4">
                                    <canvas id="rainfall-chart"></canvas>
                                </div>
                            </div>
                            <div class="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-[#223649] bg-gray-50 dark:bg-[#15202b] p-6 shadow-lg items-center justify-center text-center">
                                <h3 class="text-gray-900 dark:text-white text-lg font-semibold leading-normal">Confidence Meter</h3>
                                <div id="confidence-meter-rainfall" class="my-4"></div> {/* Changed ID to be specific */}
                                <p class="text-gray-600 dark:text-[#90adcb] text-sm">High confidence based on multiple AI models and historical accuracy.</p>
                            </div>
                        </section>
                        <section class="flex flex-col gap-4">
                            <h3 class="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Monthly Breakdown</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                ${Components.createMonthlyCards(monthlyDataImage)} {/* Using data from image */}
                            </div>
                        </section>
                        <div class="flex flex-col sm:flex-row justify-start gap-4 pt-4">
                            <button class="flex min-w-[180px] items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#3d98f4] text-white text-base font-semibold leading-normal tracking-[0.015em] hover:bg-opacity-80 transition-colors shadow-md" onclick="App.downloadReport('rainfall')">
                                <span class="material-icons">download</span>
                                <span class="truncate">Download Report</span>
                            </button>
                            <button class="flex min-w-[150px] items-center justify-center gap-2 rounded-lg h-12 px-6 bg-gray-600 dark:bg-[#223649] text-white text-base font-semibold leading-normal tracking-[0.015em] hover:bg-gray-700 dark:hover:bg-[#314d68] transition-colors shadow-md" onclick="App.setAlert('rainfall')">
                                <span class="material-icons">add_alert</span>
                                <span class="truncate">Set Alerts</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering rainfall page:', error);
            return this.renderError('Failed to load rainfall prediction data');
        }
    },

    /**
     * Render Flood Risk Assessment Page
     */
    async renderFlood() {
        try {
            const location = CONFIG.APP.DEFAULT_LOCATION; // This might need to be dynamic
            // const floodRisk = await apiService.assessFloodRisk(location, 30, true); // Keep API call

            // Mock data based on Image 3
            const riskTimelineData = [
                { status: 'Current Risk', level: 'High Risk', details: 'Heavy rainfall expected in the next 6 hours.', icon: 'error', color: 'text-red-500', iconBg: 'bg-red-500/20' },
                { status: '1 Day Ago', level: 'Moderate Risk', details: 'Increased water levels in rivers, moderate risk.', icon: 'warning', color: 'text-orange-500', iconBg: 'bg-orange-500/20' },
                { status: '2 Days Ago', level: 'Low Risk', details: 'Light showers, low risk.', icon: 'info', color: 'text-yellow-500', iconBg: 'bg-yellow-500/20' },
                { status: '3 Days Ago', level: 'No Risk', details: 'Clear weather, no risk.', icon: 'check_circle', color: 'text-green-500', iconBg: 'bg-green-500/20' },
            ];

            const affectedStats = {
                totalArea: '1200 sq km',
                agriculturalLand: '800 sq km',
                residentialZones: '150 sq km',
                estimatedPopulation: '25,000'
            };

            const emergencyContacts = [
                { name: 'Rohan Verma', role: 'District Collector', number: 'Call', icon: 'person' },
                { name: 'Priya Sharma', role: 'Disaster Management Officer', number: 'Call', icon: 'person' },
                { name: 'Local Police Station', role: 'Emergency Line', number: 'Call', icon: 'local_police' },
            ];

            return `
                <div class="px-4 sm:px-6 lg:px-8 flex flex-1 flex-col py-8 bg-white dark:bg-[#101a23]">
                    <div class="layout-content-container flex flex-col max-w-7xl w-full mx-auto flex-1 gap-6">
                        <div class="flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h1 class="text-gray-900 dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight">Flood Risk Assessment</h1>
                                <p id="flood-location-display" class="text-gray-600 dark:text-[#90adcb] text-sm">Karnataka, India</p>
                            </div>
                            <div class="text-xs text-gray-400 flex items-center gap-1">
                                <span class="material-icons text-sm">update</span>
                                Last updated: 5 mins ago
                            </div>
                        </div>

                        <!-- Location Search Section -->
                        <div class="mb-6">
                            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div class="flex-1 relative">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Location</label>
                                    <div class="relative">
                                        <div class="flex items-center bg-white dark:bg-[#1c2a38] border border-gray-300 dark:border-[#223649] rounded-lg shadow-sm h-12 focus-within:border-[#3d98f4] focus-within:ring-2 focus-within:ring-[#3d98f4]/50">
                                            <span class="material-icons text-gray-500 dark:text-gray-400 pl-3">search</span>
                                            <input id="flood-location-search" type="text" placeholder="Search for a district or location (e.g., Mysore, Bangalore)" class="flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 text-sm px-3 py-2 h-full rounded-r-lg">
                                        </div>
                                        <!-- Location Suggestions Dropdown -->
                                        <div id="flood-location-suggestions" class="absolute top-full left-0 right-0 bg-white dark:bg-[#1c2a38] border border-gray-200 dark:border-[#223649] rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50 hidden">
                                            <!-- Suggestions will be populated here -->
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button id="use-current-location-btn" class="flex items-center gap-2 px-4 py-3 bg-[#3d98f4] text-white rounded-lg hover:bg-[#2c7de0] transition-colors shadow-md text-sm font-medium">
                                        <span class="material-icons text-lg">my_location</span>
                                        <span>Use Current Location</span>
                                    </button>
                                    <button id="pin-location-btn" class="flex items-center gap-2 px-4 py-3 bg-gray-600 dark:bg-[#223649] text-white rounded-lg hover:bg-gray-700 dark:hover:bg-[#314d68] transition-colors shadow-md text-sm font-medium">
                                        <span class="material-icons text-lg">place</span>
                                        <span>Pin on Map</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- Map Section -->
                            <div class="lg:col-span-2 bg-gray-100 dark:bg-[#15202b] rounded-xl shadow-xl border border-gray-200 dark:border-[#223649] p-1 relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                                <div id="flood-map-container" class="w-full h-full rounded-lg overflow-hidden bg-gray-200 dark:bg-[#1c2a38]">
                                    <!-- Interactive map will be initialized here -->
                                </div>
                                <!-- Map Controls -->
                                <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
                                    <button class="map-control-btn bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-[#334155]"><span class="material-icons text-lg">add</span></button>
                                    <button class="map-control-btn bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-[#334155]"><span class="material-icons text-lg">remove</span></button>
                                    <button class="map-control-btn bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-200 dark:hover:bg-[#334155] mt-2"><span class="material-icons text-lg">explore</span></button>
                                </div>
                                <!-- District Info Overlay -->
                                <div class="absolute bottom-4 left-4 bg-white/90 dark:bg-[#1c2a38]/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs z-10">
                                    <h4 class="font-semibold text-gray-800 dark:text-white">Mandya District</h4>
                                    <p class="text-sm text-red-600 dark:text-red-400 font-medium">High Flood Risk Zone</p>
                                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Heatmap overlay indicates severe flood potential. Evacuation advising in effect for low-lying areas.</p>
                                </div>
                            </div>

                            <!-- Sidebar Section -->
                            <div class="lg:col-span-1 space-y-6">
                                <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl shadow-lg border border-gray-200 dark:border-[#223649] p-5">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Risk Level</h3>
                                    <div class="flex items-center gap-3">
                                        <div id="flood-risk-icon" class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <span class="material-icons text-2xl text-red-500">error_outline</span>
                                        </div>
                                        <div>
                                            <p id="flood-risk-level" class="text-2xl font-bold text-red-400">High</p>
                                            <p id="flood-risk-probability" class="text-sm text-gray-400">85% Probability</p>
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-2">Based on current precipitation, soil saturation, and upstream river levels.</p>
                                </div>

                                <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl shadow-lg border border-gray-200 dark:border-[#223649] p-5">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Affected Area Statistics</h3>
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p class="text-gray-600 dark:text-gray-400">Total Area at Risk</p>
                                            <p id="flood-total-area" class="text-gray-900 dark:text-white font-semibold text-lg">${affectedStats.totalArea}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600 dark:text-gray-400">Agricultural Land</p>
                                            <p id="flood-agricultural-land" class="text-gray-900 dark:text-white font-semibold text-lg">${affectedStats.agriculturalLand}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600 dark:text-gray-400">Residential Zones</p>
                                            <p id="flood-residential-zones" class="text-gray-900 dark:text-white font-semibold text-lg">${affectedStats.residentialZones}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600 dark:text-gray-400">Estimated Population</p>
                                            <p id="flood-estimated-population" class="text-gray-900 dark:text-white font-semibold text-lg">${affectedStats.estimatedPopulation}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl shadow-lg border border-gray-200 dark:border-[#223649] p-5">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contacts</h3>
                                    <div class="space-y-3">
                                        ${emergencyContacts.map(contact => `
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                        <span class="material-icons text-sm text-blue-400">${contact.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p class="text-sm font-medium text-gray-900 dark:text-white">${contact.name}</p>
                                                        <p class="text-xs text-gray-500 dark:text-gray-400">${contact.role}</p>
                                                    </div>
                                                </div>
                                                <button class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors">${contact.number}</button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Risk Progression Timeline -->
                        <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl shadow-lg border border-gray-200 dark:border-[#223649] p-5 mt-6">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Risk Progression Timeline</h3>
                            <div class="space-y-4">
                                ${riskTimelineData.map(item => `
                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center mt-0.5">
                                            <span class="material-icons text-lg ${item.color}">${item.icon}</span>
                                        </div>
                                        <div>
                                            <p class="font-semibold ${item.color}">${item.status}: <span class="text-gray-900 dark:text-white">${item.level}</span></p>
                                            <p class="text-sm text-gray-500 dark:text-gray-400">${item.details}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering flood page:', error);
            return this.renderError('Failed to load flood risk data');
        }
    },

    /**
     * Render Soil Analysis Page
                </div>
            `;
        } catch (error) {
            console.error('Error rendering flood page:', error);
            return this.renderError('Failed to load flood risk data');
        }
    },

    /**
     * Render Soil Analysis Page
     */
    async renderSoil() {
        try {
            const location = CONFIG.APP.DEFAULT_LOCATION; // This might need to be dynamic
            // const soilData = await apiService.analyzeSoil(location); // Keep API call

            // Mock data based on Image 2
            const soilCompositionData = {
                labels: ['Clay', 'Silt', 'Sand'],
                datasets: [{
                    data: [30, 40, 30], // Clay, Silt, Sand percentages from image
                    backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981'], // Purple, Blue, Green
                    borderWidth: 0
                }]
            };
            const nutrientLevels = { nitrogen: 75, phosphorus: 50, potassium: 60 };
            const soilHealthScore = 72; // Score out of 100
            const soilPH = 6.5;
            const soilMapImageUrl = "https://user-images.githubusercontent.com/33643565/281589004-e7f5f308-19a6-4044-9e08-018f199ac290.png"; // Placeholder similar to image

            return `
                <div class="px-4 sm:px-6 lg:px-8 py-8 flex-1 bg-[#101a23]">
                    <div class="max-w-7xl mx-auto">
                        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-8">Soil Analysis</h1>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Soil Composition -->
                            <div class="bg-[#15202b] rounded-xl p-6 shadow-xl border border-[#223649]">
                                <h3 class="text-xl font-semibold text-white mb-4">Soil Composition</h3>
                                <div class="flex flex-col items-center h-full justify-between">
                                    <div class="w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-4">
                                        <canvas id="soil-composition-chart"></canvas>
                                    </div>
                                    <div class="flex justify-around w-full text-xs text-gray-400">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span> Clay (30%)
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span> Silt (40%)
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Sand (30%)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Nutrient Levels (NPK) -->
                            <div class="bg-[#15202b] rounded-xl p-6 shadow-xl border border-[#223649] space-y-5">
                                <h3 class="text-xl font-semibold text-white mb-3">Nutrient Levels (NPK)</h3>
                                ${Components.createProgressBar(nutrientLevels.nitrogen, 'Nitrogen (N)', 'bg-blue-500')}
                                ${Components.createProgressBar(nutrientLevels.phosphorus, 'Phosphorus (P)', 'bg-purple-500')}
                                ${Components.createProgressBar(nutrientLevels.potassium, 'Potassium (K)', 'bg-green-500')}
                            </div>

                            <!-- Soil Health Score -->
                            <div class="bg-[#15202b] rounded-xl p-6 shadow-xl border border-[#223649] flex flex-col items-center justify-center text-center">
                                <h3 class="text-xl font-semibold text-white mb-4">Soil Health Score</h3>
                                <div id="soil-health-gauge-soilpage" class="w-48 h-auto"></div> {/* Unique ID */}
                                <p class="text-sm text-gray-400 mt-2">
                                    ${soilHealthScore >= 70 ? 'Good' : soilHealthScore >= 40 ? 'Moderate' : 'Poor'}
                                </p>
                            </div>

                            <!-- Soil Map & Type -->
                            <div class="bg-[#15202b] rounded-xl p-6 shadow-xl border border-[#223649] lg:col-span-2">
                                <h3 class="text-xl font-semibold text-white mb-4">Soil Map & Type</h3>
                                <div class="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#223649]">
                                    <img src="https://source.unsplash.com/random/600x400?soil,map" alt="Soil Map of Karnataka" class="w-full h-full object-cover">
                                    <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md">
                                        Soil Type: Loamy Sand
                                    </div>
                                </div>
                            </div>

                            <!-- Soil pH -->
                            <div class="bg-[#15202b] rounded-xl p-6 shadow-xl border border-[#223649]">
                                <h3 class="text-xl font-semibold text-white mb-4">Soil pH</h3>
                                <div id="soil-ph-indicator-soilpage"></div> {/* Unique ID */}
                                <p class="text-center text-sm text-gray-400 mt-2">
                                    ${soilPH < 6.5 ? 'Slightly Acidic' : soilPH > 7.5 ? 'Slightly Alkaline' : 'Neutral'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering soil page:', error);
            return this.renderError('Failed to load soil analysis data');
        }
    },

    /**
     * Render Enhanced Crop Recommendations Page with Map, Soil Analysis, and Rainfall Data
     */
    async renderCrops() {
        try {
            const location = CONFIG.APP.DEFAULT_LOCATION; // This might need to be dynamic

            // Enhanced crop data with better images and more details
            const mockCropsData = [
                {
                    id: 'rice',
                    name: 'Rice',
                    rating: 4.8,
                    expected_yield: '5 tons/acre',
                    market_price_trend: 'stable',
                    water_requirement_level: 'High',
                    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
                    water_requirement_percent: 85,
                    season: 'Kharif',
                    soil_types: ['Clayey', 'Loamy'],
                    description: 'High-yielding variety suitable for monsoon season',
                    growth_duration: '120-150 days'
                },
                {
                    id: 'groundnut',
                    name: 'Groundnut',
                    rating: 4.2,
                    expected_yield: '2.5 tons/acre',
                    market_price_trend: 'increasing',
                    water_requirement_level: 'Medium',
                    image_url: 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=400&h=300&fit=crop',
                    water_requirement_percent: 45,
                    season: 'Kharif',
                    soil_types: ['Sandy', 'Loamy'],
                    description: 'Drought-resistant oilseed crop with good market demand',
                    growth_duration: '90-120 days'
                },
                {
                    id: 'sugarcane',
                    name: 'Sugarcane',
                    rating: 4.0,
                    expected_yield: '45 tons/acre',
                    market_price_trend: 'stable',
                    water_requirement_level: 'Very High',
                    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
                    water_requirement_percent: 95,
                    season: 'Annual',
                    soil_types: ['Black', 'Loamy'],
                    description: 'High water requirement but excellent returns',
                    growth_duration: '12-18 months'
                },
                {
                    id: 'cotton',
                    name: 'Cotton',
                    rating: 3.8,
                    expected_yield: '1.8 tons/acre',
                    market_price_trend: 'decreasing',
                    water_requirement_level: 'Medium',
                    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
                    water_requirement_percent: 55,
                    season: 'Kharif',
                    soil_types: ['Black', 'Sandy'],
                    description: 'Cash crop suitable for black cotton soil',
                    growth_duration: '150-180 days'
                },
                {
                    id: 'maize',
                    name: 'Maize',
                    rating: 4.5,
                    expected_yield: '6 tons/acre',
                    market_price_trend: 'increasing',
                    water_requirement_level: 'Medium',
                    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
                    water_requirement_percent: 50,
                    season: 'Kharif',
                    soil_types: ['Loamy', 'Sandy'],
                    description: 'Versatile cereal crop with multiple uses',
                    growth_duration: '90-110 days'
                },
                {
                    id: 'ragi',
                    name: 'Ragi (Finger Millet)',
                    rating: 4.3,
                    expected_yield: '2 tons/acre',
                    market_price_trend: 'increasing',
                    water_requirement_level: 'Low',
                    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
                    water_requirement_percent: 30,
                    season: 'Kharif',
                    soil_types: ['Sandy', 'Loamy'],
                    description: 'Nutritious millet crop, drought-resistant',
                    growth_duration: '120-130 days'
                }
            ];

            return `
                <div class="flex flex-1 flex-col bg-white dark:bg-[#101a23] min-h-screen">
                    <!-- Header Section -->
                    <div class="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 dark:border-[#223649] bg-white dark:bg-[#101a23]">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 class="text-gray-900 dark:text-white text-3xl sm:text-4xl font-bold leading-tight">Smart Crop Recommendations</h1>
                                <p id="crop-location-display" class="text-gray-600 dark:text-[#90adcb] text-lg">Karnataka, India</p>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <span class="material-icons text-sm">update</span>
                                Last updated: 2 mins ago
                            </div>
                        </div>
                    </div>

                    <!-- Location Search and Map Section -->
                    <div class="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-[#15202b] border-b border-gray-200 dark:border-[#223649]">
                        <div class="max-w-7xl mx-auto">
                            <h2 class="text-gray-900 dark:text-white text-xl font-semibold mb-4 flex items-center gap-2">
                                <span class="material-icons text-green-500 dark:text-green-400">location_on</span>
                                Select Your Farm Location
                            </h2>

                            <!-- Location Search Controls -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <!-- Search and Controls -->
                                <div class="lg:col-span-1 space-y-4">
                                    <!-- Location Search -->
                                    <div class="relative">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Location</label>
                                        <div class="relative">
                                            <div class="flex items-center bg-white dark:bg-[#1c2a38] border border-gray-300 dark:border-[#223649] rounded-lg shadow-sm h-12 focus-within:border-blue-500 dark:focus-within:border-[#3d98f4] focus-within:ring-2 focus-within:ring-blue-500/50 dark:focus-within:ring-[#3d98f4]/50">
                                                <span class="material-icons text-gray-500 dark:text-gray-400 pl-3">search</span>
                                                <input id="crop-location-search" type="text" placeholder="Search for a district or location..." class="flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 text-sm px-3 py-2 h-full rounded-r-lg">
                                            </div>
                                            <!-- Location Suggestions Dropdown -->
                                            <div id="crop-location-suggestions" class="absolute top-full left-0 right-0 bg-white dark:bg-[#1c2a38] border border-gray-300 dark:border-[#223649] rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50 hidden">
                                                <!-- Suggestions will be populated here -->
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Location Action Buttons -->
                                    <div class="flex gap-2">
                                        <button id="crop-current-location-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md">
                                            <span class="material-icons text-lg">my_location</span>
                                            <span>Use Current Location</span>
                                        </button>
                                        <button id="crop-pin-map-btn" class="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md">
                                            <span class="material-icons text-lg">place</span>
                                            <span>Pin on Map</span>
                                        </button>
                                    </div>

                                    <!-- Current Location Info -->
                                    <div class="bg-white dark:bg-[#1c2a38] rounded-lg p-4 border border-gray-300 dark:border-[#223649]">
                                        <h3 class="text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                                            <span class="material-icons text-green-500 dark:text-green-400 text-lg">location_on</span>
                                            Selected Location
                                        </h3>
                                        <p id="crop-selected-location" class="text-gray-700 dark:text-gray-300 text-sm">Karnataka, India</p>
                                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <p>Lat: <span id="crop-selected-lat">12.9716</span></p>
                                            <p>Lng: <span id="crop-selected-lng">77.5946</span></p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Interactive Map -->
                                <div class="lg:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interactive Map</label>
                                    <div id="crop-map-container" class="relative rounded-lg overflow-hidden shadow-xl h-80 bg-gray-100 dark:bg-[#1c2a38] border border-gray-300 dark:border-[#223649]">
                                        <!-- Map will be initialized here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Analysis Results Section -->
                    <div class="flex-1 px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-[#101a23]">
                        <div class="max-w-7xl mx-auto">
                            <!-- Location-Based Analysis Cards -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <!-- Soil Analysis Card -->
                                <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl p-6 shadow-xl border border-gray-200 dark:border-[#223649]">
                                    <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span class="material-icons text-amber-500 dark:text-amber-400">terrain</span>
                                        Soil Analysis
                                    </h3>
                                    <div id="crop-soil-info" class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Type:</span>
                                            <span id="crop-soil-type" class="text-gray-900 dark:text-white font-medium">Red Sandy Loam</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">pH Level:</span>
                                            <span id="crop-soil-ph" class="text-gray-900 dark:text-white font-medium">6.8 (Neutral)</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Fertility:</span>
                                            <span id="crop-soil-fertility" class="text-green-600 dark:text-green-400 font-medium">High</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Drainage:</span>
                                            <span id="crop-soil-drainage" class="text-blue-600 dark:text-blue-400 font-medium">Good</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Rainfall Data Card -->
                                <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl p-6 shadow-xl border border-gray-200 dark:border-[#223649]">
                                    <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span class="material-icons text-blue-500 dark:text-blue-400">water_drop</span>
                                        Annual Rainfall
                                    </h3>
                                    <div id="crop-rainfall-info" class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">This Year:</span>
                                            <span id="crop-rainfall-current" class="text-gray-900 dark:text-white font-medium">850 mm</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Average:</span>
                                            <span id="crop-rainfall-average" class="text-gray-700 dark:text-gray-300">780 mm</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Monsoon:</span>
                                            <span id="crop-rainfall-monsoon" class="text-blue-600 dark:text-blue-400 font-medium">June - September</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Status:</span>
                                            <span id="crop-rainfall-status" class="text-green-600 dark:text-green-400 font-medium">Above Average</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Climate Suitability Card -->
                                <div class="bg-gray-50 dark:bg-[#15202b] rounded-xl p-6 shadow-xl border border-gray-200 dark:border-[#223649]">
                                    <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span class="material-icons text-orange-500 dark:text-orange-400">wb_sunny</span>
                                        Climate Suitability
                                    </h3>
                                    <div id="crop-climate-info" class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Temperature:</span>
                                            <span id="crop-temperature" class="text-gray-900 dark:text-white font-medium">25-32°C</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Humidity:</span>
                                            <span id="crop-humidity" class="text-blue-600 dark:text-blue-400 font-medium">65-75%</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Season:</span>
                                            <span id="crop-current-season" class="text-green-600 dark:text-green-400 font-medium">Kharif</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Suitability:</span>
                                            <span id="crop-climate-suitability" class="text-green-600 dark:text-green-400 font-medium">Excellent</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recommended Crops Section -->
                            <div class="mb-8">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 class="text-gray-900 dark:text-white text-2xl font-bold leading-tight">Recommended Crops</h2>
                                        <p class="text-gray-600 dark:text-[#90adcb] text-sm">Based on your location's soil, climate, and rainfall data</p>
                                    </div>
                                    <div class="flex gap-2">
                                        <select id="crop-season-filter" class="bg-white dark:bg-[#1c2a38] border border-gray-300 dark:border-[#223649] text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-[#3d98f4] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#3d98f4]">
                                            <option value="all">All Seasons</option>
                                            <option value="kharif" selected>Kharif (Monsoon)</option>
                                            <option value="rabi">Rabi (Winter)</option>
                                            <option value="summer">Summer</option>
                                        </select>
                                        <select id="crop-water-filter" class="bg-white dark:bg-[#1c2a38] border border-gray-300 dark:border-[#223649] text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-[#3d98f4] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#3d98f4]">
                                            <option value="all">All Water Needs</option>
                                            <option value="low">Low Water</option>
                                            <option value="medium">Medium Water</option>
                                            <option value="high">High Water</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Crop Cards Grid -->
                                <div id="crop-cards-recommendations" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    ${mockCropsData.map(crop => this.createEnhancedCropCard(crop)).join('')}
                                </div>
                            </div>

                            <!-- Detailed Comparison Table -->
                            <div class="mb-8">
                                <h3 class="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">Detailed Comparison</h3>
                                <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#223649] bg-white dark:bg-[#15202b] shadow-lg">
                                    <table class="min-w-full">
                                        <thead class="bg-gray-100 dark:bg-[#1c2a38]">
                                            <tr>
                                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Crop</th>
                                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Suitability</th>
                                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Water Needs</th>
                                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Expected Yield</th>
                                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Growth Duration</th>
                                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Market Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200 dark:divide-[#223649]">
                                            ${mockCropsData.map(crop => `
                                                <tr class="hover:bg-gray-50 dark:hover:bg-[#1c2a38]/50 transition-colors">
                                                    <td class="px-4 py-3 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <img src="${crop.image_url}" alt="${crop.name}" class="w-8 h-8 rounded-full object-cover mr-3">
                                                            <span class="text-gray-900 dark:text-white text-sm font-medium">${crop.name}</span>
                                                        </div>
                                                    </td>
                                                    <td class="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">
                                                        <span class="flex items-center">
                                                            <span class="material-icons text-base mr-1 text-yellow-500 dark:text-yellow-400">star</span>
                                                            ${crop.rating}/5
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">${crop.water_requirement_level}</td>
                                                    <td class="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">${crop.expected_yield}</td>
                                                    <td class="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">${crop.growth_duration}</td>
                                                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                                            ${crop.market_price_trend === 'increasing' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' :
                                                              crop.market_price_trend === 'decreasing' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' :
                                                              'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'}">
                                                            <span class="material-icons text-sm mr-0.5">
                                                                ${crop.market_price_trend === 'increasing' ? 'trending_up' :
                                                                  crop.market_price_trend === 'decreasing' ? 'trending_down' :
                                                                  'trending_flat'}
                                                            </span>
                                                            ${crop.market_price_trend.charAt(0).toUpperCase() + crop.market_price_trend.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering crops page:', error);
            return this.renderError('Failed to load crop recommendations');
        }
    },

    /**
     * Create Enhanced Crop Card with Images and Detailed Information
     */
    createEnhancedCropCard(crop) {
        const waterLevelColor = {
            'Low': 'text-green-400',
            'Medium': 'text-yellow-400',
            'High': 'text-orange-400',
            'Very High': 'text-red-400'
        };

        const trendIcon = {
            'increasing': 'trending_up',
            'decreasing': 'trending_down',
            'stable': 'trending_flat'
        };

        const trendColor = {
            'increasing': 'text-green-400',
            'decreasing': 'text-red-400',
            'stable': 'text-yellow-400'
        };

        return `
            <div class="bg-white dark:bg-[#15202b] rounded-xl shadow-xl border border-gray-200 dark:border-[#223649] overflow-hidden hover:border-blue-500 dark:hover:border-[#3d98f4] transition-all duration-300 group">
                <!-- Crop Image -->
                <div class="relative h-48 overflow-hidden">
                    <img src="${crop.image_url}" alt="${crop.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <span class="material-icons text-yellow-400 text-sm">star</span>
                        <span class="text-white text-xs font-medium">${crop.rating}</span>
                    </div>
                    <div class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span class="text-white text-xs font-medium">${crop.season}</span>
                    </div>
                </div>

                <!-- Crop Details -->
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-gray-900 dark:text-white text-lg font-semibold">${crop.name}</h3>
                        <span class="material-icons ${trendColor[crop.market_price_trend]} text-lg" title="Market Trend">
                            ${trendIcon[crop.market_price_trend]}
                        </span>
                    </div>

                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${crop.description}</p>

                    <!-- Key Metrics -->
                    <div class="space-y-3 mb-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400 text-sm">Expected Yield:</span>
                            <span class="text-gray-900 dark:text-white font-medium text-sm">${crop.expected_yield}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400 text-sm">Water Requirement:</span>
                            <span class="${waterLevelColor[crop.water_requirement_level]} font-medium text-sm">${crop.water_requirement_level}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400 text-sm">Growth Duration:</span>
                            <span class="text-gray-900 dark:text-white font-medium text-sm">${crop.growth_duration}</span>
                        </div>
                    </div>

                    <!-- Water Requirement Bar -->
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-gray-600 dark:text-gray-400 text-xs">Water Needs</span>
                            <span class="text-gray-700 dark:text-gray-300 text-xs">${crop.water_requirement_percent}%</span>
                        </div>
                        <div class="w-full bg-gray-300 dark:bg-[#223649] rounded-full h-2">
                            <div class="h-2 rounded-full transition-all duration-300"
                                 style="width: ${crop.water_requirement_percent}%; background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%);">
                            </div>
                        </div>
                    </div>

                    <!-- Suitable Soil Types -->
                    <div class="mb-4">
                        <span class="text-gray-600 dark:text-gray-400 text-xs block mb-2">Suitable Soil Types:</span>
                        <div class="flex flex-wrap gap-1">
                            ${crop.soil_types.map(soil => `
                                <span class="bg-gray-200 dark:bg-[#223649] text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">${soil}</span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2">
                        <button class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-[#3d98f4] dark:hover:bg-[#2c7de0] text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                                onclick="App.selectCrop('${crop.id}')">
                            Select Crop
                        </button>
                        <button class="bg-gray-300 hover:bg-gray-400 dark:bg-[#223649] dark:hover:bg-[#314d68] text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                                onclick="App.viewCropDetails('${crop.id}')">
                            <span class="material-icons text-sm">info</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render Agricultural Calculator Page - Main functionality
     */
    /**
     * Render error page
     */
    renderError(message) {
        return `
            <div class="flex flex-1 items-center justify-center py-20">
                <div class="text-center">
                    <span class="material-icons text-6xl text-red-400 mb-4">error</span>
                    <h2 class="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                    <p class="text-gray-400 mb-6">${message}</p>
                    <button onclick="location.reload()" class="bg-[#3d98f4] text-white px-6 py-2 rounded-lg hover:bg-opacity-80 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render Features Page (Placeholder)
     */
    async renderFeatures() { // This will be removed if "Features" is not one of the 6 core pages
        return `<div class="p-8 text-center"><h1 class="text-3xl font-bold text-white mb-4">Features</h1><p class="text-gray-400">Features page placeholder.</p></div>`;
    },
    async renderAbout() { // This will be removed
        return `<div class="p-8 text-center"><h1 class="text-3xl font-bold text-white mb-4">About Us</h1><p class="text-gray-400">About Us page placeholder.</p></div>`;
    },
    async renderContact() { // This will be removed
        return `<div class="p-8 text-center"><h1 class="text-3xl font-bold text-white mb-4">Contact Us</h1><p class="text-gray-400">Contact page placeholder.</p></div>`;
    },
    // Placeholder for other pages that might be linked but not part of core 6 (e.g. Support, Reports, Settings etc.)
    async renderPlaceholder(pageTitle = "Page") {
        return `
            <div class="p-8 text-center">
                <h1 class="text-3xl font-bold text-white mb-4">${pageTitle}</h1>
                <p class="text-gray-400">This page is under construction or a placeholder.</p>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pages;
}

// Global access
window.Pages = Pages;
