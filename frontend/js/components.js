/**
 * CropCast AI - UI Components
 * Reusable UI components and chart generators
 */
console.log('[DEBUG_LOAD] components.js executing');
const Components = {
    /**
     * Create a rainfall chart using Chart.js
     */
    createRainfallChart(canvasId, data) {
        try {
            const ctx = document.getElementById(canvasId);
            if (!ctx) {
                console.error(`Canvas element with id '${canvasId}' not found`);
                return null;
            }

            const chartData = data || {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Predicted Rainfall',
                        data: [45, 35, 55, 85, 120, 180, 220, 200, 150, 90, 60, 40],
                        borderColor: '#3d98f4',
                        backgroundColor: 'rgba(61, 152, 244, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Historical Average',
                        data: [40, 30, 50, 80, 110, 170, 210, 190, 140, 85, 55, 35],
                        borderColor: '#90adcb',
                        backgroundColor: 'rgba(144, 173, 203, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            };

            return new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#90adcb'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#90adcb'
                            },
                            grid: {
                                color: '#223649'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#90adcb'
                            },
                            grid: {
                                color: '#223649'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating rainfall chart:', error);
            return null;
        }
    },

    /**
     * Create a soil composition chart
     */
    createSoilCompositionChart(canvasId, data) {
        try {
            const ctx = document.getElementById(canvasId);
            if (!ctx) {
                console.error(`Canvas element with id '${canvasId}' not found`);
                return null;
            }

            const chartData = data || {
                labels: ['Clay', 'Silt', 'Sand'],
                datasets: [{
                    data: [30, 40, 30],
                    backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981'],
                    borderWidth: 0
                }]
            };

            return new Chart(ctx, {
                type: 'doughnut',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating soil composition chart:', error);
            return null;
        }
    },

    // createNPKChart removed as it's not used by the 6 core pages and NPK is shown with progress bars.

    /**
     * Create confidence meter
     */
    createConfidenceMeter(containerId, percentage) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container element with id '${containerId}' not found`);
                return;
            }

            const percent = percentage || 85;
            const circumference = 2 * Math.PI * 45;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (percent / 100) * circumference;

            container.innerHTML = `
                <div class="confidence-meter relative w-32 h-32 mx-auto">
                    <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="#314d68" stroke-width="8" fill="none"/>
                        <circle cx="50" cy="50" r="45" stroke="#3d98f4" stroke-width="8" fill="none"
                                stroke-dasharray="${strokeDasharray}"
                                stroke-dashoffset="${strokeDashoffset}"
                                stroke-linecap="round"
                                class="transition-all duration-1000 ease-out"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-2xl font-bold text-white">${percent}%</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error creating confidence meter:', error);
        }
    },

    /**
     * Create soil health gauge
     */
    createSoilHealthGauge(containerId, score) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container element with id '${containerId}' not found`);
                return;
            }

            const healthScore = score || 7.5;
            const percentage = (healthScore / 10) * 100;

            let color = '#ef4444'; // red
            if (healthScore >= 7) color = '#10b981'; // green
            else if (healthScore >= 5) color = '#f59e0b'; // yellow

            container.innerHTML = `
                <div class="gauge-container mx-auto mb-4">
                    <div class="gauge-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                    <div class="gauge-cover"></div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-white mb-1">${healthScore}/10</div>
                    <div class="text-sm text-gray-400">
                        ${healthScore >= 7 ? 'Excellent' : healthScore >= 5 ? 'Good' : 'Needs Improvement'}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error creating soil health gauge:', error);
        }
    },

    /**
     * Create pH indicator
     */
    createPhIndicator(containerId, phValue) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container element with id '${containerId}' not found`);
                return;
            }

            const ph = phValue || 6.5;
            const position = ((ph - 1) / 13) * 100; // pH scale 1-14

            let status = 'Neutral';
            let color = '#10b981';
            if (ph < 6) {
                status = 'Acidic';
                color = '#ef4444';
            } else if (ph > 8) {
                status = 'Alkaline';
                color = '#3b82f6';
            }

            container.innerHTML = `
                <div class="ph-indicator-container">
                    <div class="ph-scale relative h-8 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg mb-4">
                        <div class="ph-marker absolute top-0 w-1 h-8 bg-white rounded" style="left: ${position}%;"></div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-white mb-1">${ph}</div>
                        <div class="text-sm" style="color: ${color};">${status}</div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Acidic (1-6)</span>
                        <span>Neutral (7)</span>
                        <span>Alkaline (8-14)</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error creating pH indicator:', error);
        }
    },

    /**
     * Create crop card
     */
    createCropCard(crop) {
        try {
            const trendIcon = crop.price_trend === 'increasing' ? 'trending_up' :
                             crop.price_trend === 'decreasing' ? 'trending_down' : 'trending_flat';
            const trendColor = crop.price_trend === 'increasing' ? 'text-green-500' :
                              crop.price_trend === 'decreasing' ? 'text-red-500' : 'text-gray-400';

            return `
                <div class="bg-[#1f2937] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <img src="${crop.image_url || 'https://via.placeholder.com/48'}"
                                 alt="${crop.name}"
                                 class="w-12 h-12 rounded-lg object-cover">
                            <div>
                                <h3 class="text-lg font-semibold text-white">${crop.name}</h3>
                                <div class="flex items-center gap-1">
                                    ${Array.from({length: 5}, (_, i) =>
                                        `<span class="material-icons text-sm ${i < Math.floor(crop.rating) ? 'text-yellow-400' : 'text-gray-600'}">star</span>`
                                    ).join('')}
                                    <span class="text-sm text-gray-400 ml-1">${crop.rating}</span>
                                </div>
                            </div>
                        </div>
                        <span class="material-icons ${trendColor}">${trendIcon}</span>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Expected Yield</span>
                            <span class="text-white font-medium">${crop.expected_yield}</span>
                        </div>

                        <div class="flex justify-between">
                            <span class="text-gray-400">Water Requirement</span>
                            <span class="text-white font-medium">${crop.water_requirement_percent}%</span>
                        </div>

                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                 style="width: ${crop.water_requirement_percent}%"></div>
                        </div>

                        <div class="flex justify-between items-center pt-2">
                            <span class="text-gray-400">Market Trend</span>
                            <span class="${trendColor} font-medium capitalize">${crop.price_trend}</span>
                        </div>
                    </div>

                    <button class="w-full mt-4 bg-[#3d98f4] hover:bg-[#2c7de0] text-white py-2 px-4 rounded-lg transition-colors duration-200">
                        View Details
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Error creating crop card:', error);
            return '<div class="bg-red-500 p-4 rounded-lg text-white">Error loading crop data</div>';
        }
    },

    /**
     * Create stats card
     */
    createStatsCard(title, value, icon, trend = null, color = 'text-[#3d98f4]') {
        try {
            const trendElement = trend ? `
                <p class="${trend.value > 0 ? 'text-green-400' : 'text-red-400'} text-xs font-medium mt-0.5 flex items-center">
                    <span class="material-icons text-sm">${trend.value > 0 ? 'arrow_upward' : 'arrow_downward'}</span>
                    ${Math.abs(trend.value)}% ${trend.label || ''}
                </p>
            ` : '';

            return `
                <div class="bg-[#101a23] p-4 rounded-lg border border-[#314d68] shadow-md hover:border-[#3d98f4] transition-all duration-200">
                    <p class="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                        <span class="material-icons text-base ${color}">${icon}</span>
                        ${title}
                    </p>
                    <p class="text-white text-lg font-semibold mt-1">${value}</p>
                    ${trendElement}
                </div>
            `;
        } catch (error) {
            console.error('Error creating stats card:', error);
            return '<div class="bg-red-500 p-4 rounded-lg text-white">Error loading stats</div>';
        }
    },

    /**
     * Create alert card
     */
    // createAlertCard removed as it's not used by the 6 core pages.
    // createLoadingSkeleton removed as it's not explicitly used by the 6 core pages.

    /**
     * Create progress bar
     */
    createProgressBar(percentage, label = '', color = 'bg-[#3d98f4]') {
        try {
            return `
                <div class="mb-3">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm text-gray-400">${label}</span>
                        <span class="text-sm text-white font-medium">${percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="${color} h-2 rounded-full transition-all duration-500"
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error creating progress bar:', error);
            return '<div class="bg-red-500 p-2 rounded text-white text-sm">Error loading progress bar</div>';
        }
    },

    /**
     * Create filter section
     */
    createFilterSection(title, options, type = 'radio', name = '') {
        try {
            const inputType = type === 'checkbox' ? 'checkbox' : 'radio';
            const inputName = name || title.toLowerCase().replace(/\s+/g, '_');

            const optionsHtml = options.map((option, index) => `
                <label class="flex items-center gap-2 cursor-pointer hover:bg-[#223649] p-2 rounded transition-colors">
                    <input type="${inputType}"
                           name="${inputName}"
                           value="${option.value}"
                           ${option.selected ? 'checked' : ''}
                           class="w-4 h-4 text-[#3d98f4] bg-[#314d68] border-[#314d68] focus:ring-[#3d98f4] focus:ring-2">
                    <span class="text-white text-sm">${option.label}</span>
                </label>
            `).join('');

            return `
                <div class="mb-6">
                    <h3 class="text-[#c2d3e3] text-sm font-semibold leading-normal mb-3">${title}</h3>
                    <div class="space-y-1">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error creating filter section:', error);
            return '<div class="bg-red-500 p-4 rounded-lg text-white">Error loading filters</div>';
        }
    },

    /**
     * Create monthly cards
     */
    createMonthlyCards(monthlyData) {
        try {
            return monthlyData.map(item => `
                <div class="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                    <div class="space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Month:</span>
                            <span class="text-gray-900 dark:text-white font-medium">${item.month}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Rainfall:</span>
                            <span class="text-gray-900 dark:text-white font-medium">${item.rainfall}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Icon:</span>
                            <span class="text-gray-900 dark:text-white font-medium">${item.iconName}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error creating monthly cards:', error);
            return '<div class="bg-red-500 p-4 rounded-lg text-white">Error loading monthly data</div>';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}

// Global access
window.Components = Components;
