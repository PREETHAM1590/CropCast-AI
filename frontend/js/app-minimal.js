/**
 * CropCast AI - Minimal Test Application Controller
 */

console.log('Loading minimal app.js...');

class CropCastApp {
    constructor() {
        console.log('CropCastApp constructor called');
        this.currentPage = 'home';
        this.charts = {};
        this.isInitialized = false;
        this.loadingScreen = document.getElementById('loading-screen');
        this.appContainer = document.getElementById('app');
        this.pageContainer = document.getElementById('page-container');
    }

    async init() {
        try {
            console.log('Initializing CropCast AI...');

            // Show loading screen
            this.showLoading();

            // Add timeout to ensure loading screen is hidden
            setTimeout(() => {
                if (!this.isInitialized) {
                    console.log('Initialization timeout - hiding loading screen');
                    this.hideLoading();
                }
            }, 5000);

            // Setup event listeners
            this.setupEventListeners();

            // Load initial page
            this.pageContainer.innerHTML = this.renderFallbackHome();

            // Hide loading screen and show app
            this.hideLoading();

            this.isInitialized = true;
            console.log('CropCast AI initialized successfully');

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.hideLoading();
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.matches('.nav-btn')) {
                e.preventDefault();
                const page = e.target.dataset.page || e.target.closest('[data-page]')?.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            }
        });
    }

    async navigateToPage(pageName) {
        console.log(`Navigating to page: ${pageName}`);
        this.pageContainer.innerHTML = this.renderFallbackHome();
        this.currentPage = pageName;
    }

    showLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }
        if (this.appContainer) {
            this.appContainer.style.display = 'none';
        }
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
        if (this.appContainer) {
            this.appContainer.style.display = 'flex';
        }
    }

    renderFallbackHome() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-primary to-secondary text-white">
                <div class="container mx-auto px-4 py-16 text-center">
                    <h1 class="text-5xl font-bold mb-6">🌾 CropCast AI</h1>
                    <p class="text-xl mb-8">Agricultural Intelligence Platform</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div class="bg-surface p-6 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2">🌧️ Rainfall Prediction</h3>
                            <p class="text-gray-400">AI-powered weather forecasting</p>
                        </div>
                        <div class="bg-surface p-6 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2">🌱 Soil Analysis</h3>
                            <p class="text-gray-400">Comprehensive soil health monitoring</p>
                        </div>
                        <div class="bg-surface p-6 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2">🌾 Crop Recommendations</h3>
                            <p class="text-gray-400">Smart crop selection guidance</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

console.log('CropCastApp class defined');

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, creating CropCast app...');
    window.cropCastApp = new CropCastApp();
    await window.cropCastApp.init();
});

console.log('Minimal app.js loaded successfully');
