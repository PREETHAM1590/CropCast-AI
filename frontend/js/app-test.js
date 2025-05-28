/**
 * CropCast AI - Test Application Controller
 * Simple test version to check for syntax errors
 */

class CropCastApp {
    constructor() {
        this.currentPage = 'home';
        this.charts = {};
        this.isInitialized = false;
        this.loadingScreen = document.getElementById('loading-screen');
        this.appContainer = document.getElementById('app');
        this.pageContainer = document.getElementById('page-container');
    }

    /**
     * Initialize the application
     */
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

            // Check API health
            await this.checkAPIHealth();

            // Setup event listeners
            this.setupEventListeners();

            // Load initial page
            try {
                await this.navigateToPage('home');
            } catch (pageError) {
                console.error('Error loading home page:', pageError);
                // Try to load a simple fallback page
                this.pageContainer.innerHTML = '<div class="p-8 text-center"><h1 class="text-2xl text-white">Welcome to CropCast AI</h1><p class="text-gray-400 mt-4">Agricultural Intelligence Platform</p></div>';
            }

            // Hide loading screen and show app
            this.hideLoading();

            this.isInitialized = true;
            console.log('CropCast AI initialized successfully');

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.hideLoading(); // Ensure loading screen is hidden even on error
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Check API health
     */
    async checkAPIHealth() {
        try {
            await apiService.healthCheck();
            Utils.showNotification('Connected to CropCast AI services', 'success', 3000);
        } catch (error) {
            console.warn('API health check failed:', error);
            Utils.showNotification('Running in demo mode - Backend may not be available', 'warning', 5000);
            return false;
        }
        return true;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
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

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Error modal close
        const errorClose = document.getElementById('error-close');
        if (errorClose) {
            errorClose.addEventListener('click', () => {
                Utils.hideError();
            });
        }

        // Notifications button
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    /**
     * Navigate to a specific page
     */
    async navigateToPage(pageName) {
        try {
            console.log(`Navigating to page: ${pageName}`);

            // Update navigation state
            this.updateNavigation(pageName);

            // Show loading state
            Utils.showLoading(this.pageContainer);

            // Render page content
            let content = '';
            try {
                switch (pageName) {
                    case 'home':
                        content = typeof Pages !== 'undefined' ? await Pages.renderHome() : this.renderFallbackHome();
                        break;
                    case 'dashboard':
                        content = typeof Pages !== 'undefined' ? await Pages.renderDashboard() : this.renderFallbackDashboard();
                        break;
                    default:
                        content = this.renderFallbackHome();
                }
            } catch (renderError) {
                console.error(`Error rendering ${pageName} page:`, renderError);
                content = this.renderFallbackHome();
            }

            // Update page content
            this.pageContainer.innerHTML = content;

            // Update current page
            this.currentPage = pageName;

        } catch (error) {
            console.error(`Error navigating to page ${pageName}:`, error);
            this.pageContainer.innerHTML = '<div class="p-8 text-center"><h1 class="text-2xl text-white">Error loading page</h1></div>';
        }
    }

    /**
     * Update navigation state
     */
    updateNavigation(activePage) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('nav-active');
        });

        // Add active class to current page link
        document.querySelectorAll(`[data-page="${activePage}"]`).forEach(link => {
            link.classList.add('nav-active');
        });
    }

    /**
     * Show loading screen
     */
    showLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }
        if (this.appContainer) {
            this.appContainer.style.display = 'none';
        }
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
        if (this.appContainer) {
            this.appContainer.style.display = 'flex';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        Utils.showError(message);
    }

    /**
     * Show notifications panel
     */
    async showNotifications() {
        Utils.showNotification('Notifications feature coming soon', 'info');
    }

    /**
     * Fallback render methods
     */
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

    renderFallbackDashboard() {
        return `
            <div class="p-6">
                <h1 class="text-2xl font-bold text-white mb-6">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-surface p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-white mb-2">Weather Overview</h3>
                        <p class="text-gray-400">Current conditions and forecasts</p>
                    </div>
                    <div class="bg-surface p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-white mb-2">Crop Status</h3>
                        <p class="text-gray-400">Monitor your agricultural assets</p>
                    </div>
                    <div class="bg-surface p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-white mb-2">Alerts</h3>
                        <p class="text-gray-400">Important notifications and warnings</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, creating CropCast app...');
    window.cropCastApp = new CropCastApp();
    await window.cropCastApp.init();
});
