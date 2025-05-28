/**
 * CropCast AI - Utility Functions
 * Common utility functions used throughout the application
 */
console.log('[DEBUG_LOAD] utils.js executing');
const Utils = {
    /**
     * Format date to readable string
     */
    formatDate(date, format = 'short') {
        const d = new Date(date);
        const options = {
            short: { month: 'short', day: 'numeric' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            full: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        return d.toLocaleDateString('en-US', options[format]);
    },

    /**
     * Format number with appropriate units
     */
    formatNumber(value, decimals = 1, unit = '') {
        if (value === null || value === undefined) return 'N/A';

        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';

        return `${num.toFixed(decimals)}${unit}`;
    },

    /**
     * Format percentage
     */
    formatPercentage(value, decimals = 1) {
        return this.formatNumber(value, decimals, '%');
    },

    /**
     * Format currency (Indian Rupees)
     */
    formatCurrency(value, decimals = 0) {
        if (value === null || value === undefined) return 'N/A';

        const num = parseFloat(value);
        if (isNaN(num)) return 'N/A';

        return `₹${num.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}`;
    },

    /**
     * Validate coordinates
     */
    validateCoordinates(latitude, longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        return !isNaN(lat) && !isNaN(lng) &&
               lat >= CONFIG.VALIDATION.LATITUDE.MIN &&
               lat <= CONFIG.VALIDATION.LATITUDE.MAX &&
               lng >= CONFIG.VALIDATION.LONGITUDE.MIN &&
               lng <= CONFIG.VALIDATION.LONGITUDE.MAX;
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Local storage helpers
     */
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage set error:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Storage get error:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage remove error:', error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Storage clear error:', error);
                return false;
            }
        }
    },

    /**
     * Show notification toast
     */
    showNotification(message, type = 'info', duration = 5000) {
        const toast = document.getElementById('notification-toast');
        const messageEl = document.getElementById('toast-message');

        if (!toast || !messageEl) return;

        // Set message and type
        messageEl.textContent = message;
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${this.getNotificationClass(type)}`;

        // Show toast
        toast.style.transform = 'translateX(0)';

        // Auto hide
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
        }, duration);
    },

    /**
     * Get notification CSS class based on type
     */
    getNotificationClass(type) {
        const classes = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };
        return classes[type] || classes.info;
    },

    /**
     * Show error modal
     */
    showError(message) {
        const modal = document.getElementById('error-modal');
        const messageEl = document.getElementById('error-message');

        if (!modal || !messageEl) return;

        messageEl.textContent = message;
        modal.classList.remove('hidden');
    },

    /**
     * Hide error modal
     */
    hideError() {
        const modal = document.getElementById('error-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    /**
     * Show loading state
     */
    showLoading(element) {
        if (!element) return;

        element.innerHTML = `
            <div class="flex items-center justify-center py-8">
                <div class="spinner"></div>
                <span class="ml-3 text-gray-400">Loading...</span>
            </div>
        `;
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Validate file upload
     */
    validateFile(file) {
        if (!file) {
            throw new Error('No file selected');
        }

        if (file.size > CONFIG.APP.MAX_UPLOAD_SIZE) {
            throw new Error(CONFIG.ERRORS.FILE_SIZE);
        }

        if (!CONFIG.APP.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            throw new Error(CONFIG.ERRORS.FILE_TYPE);
        }

        return true;
    },

    /**
     * Convert file to base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    /**
     * Download data as file
     */
    downloadFile(data, filename, type = 'application/json') {
        const blob = new Blob([data], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard', 'success');
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Failed to copy', 'error');
            return false;
        }
    },

    /**
     * Get risk level color and text
     */
    getRiskLevel(score) {
        if (score < 0.25) {
            return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-500/20' };
        } else if (score < 0.5) {
            return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
        } else if (score < 0.75) {
            return { level: 'High', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
        } else {
            return { level: 'Critical', color: 'text-red-400', bgColor: 'bg-red-500/20' };
        }
    },

    /**
     * Get water requirement level
     */
    getWaterLevel(percentage) {
        if (percentage < 30) {
            return { level: 'Low', color: 'text-green-400' };
        } else if (percentage < 70) {
            return { level: 'Medium', color: 'text-yellow-400' };
        } else {
            return { level: 'High', color: 'text-red-400' };
        }
    },

    /**
     * Get soil health description
     */
    getSoilHealth(score) {
        if (score >= 80) {
            return { description: 'Excellent', color: 'text-green-400' };
        } else if (score >= 60) {
            return { description: 'Good', color: 'text-green-400' };
        } else if (score >= 40) {
            return { description: 'Fair', color: 'text-yellow-400' };
        } else if (score >= 20) {
            return { description: 'Poor', color: 'text-orange-400' };
        } else {
            return { description: 'Very Poor', color: 'text-red-400' };
        }
    },

    /**
     * Get pH level description
     */
    getPhLevel(ph) {
        if (ph < 6.0) {
            return { description: 'Acidic', color: 'text-red-400' };
        } else if (ph < 6.5) {
            return { description: 'Slightly Acidic', color: 'text-yellow-400' };
        } else if (ph < 7.5) {
            return { description: 'Neutral', color: 'text-green-400' };
        } else if (ph < 8.0) {
            return { description: 'Slightly Alkaline', color: 'text-yellow-400' };
        } else {
            return { description: 'Alkaline', color: 'text-red-400' };
        }
    },

    /**
     * Calculate confidence meter rotation
     */
    getConfidenceRotation(percentage) {
        // Convert percentage to rotation angle (0-180 degrees)
        return (percentage / 100) * 180 - 90;
    },

    /**
     * Format large numbers with K, M suffixes
     */
    formatLargeNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * Check if device is mobile
     */
    isMobile() {
        return window.innerWidth < CONFIG.UI.BREAKPOINTS.MD;
    },

    /**
     * Smooth scroll to element
     */
    scrollTo(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Get user's current location with enhanced error handling
     */
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            // Show loading notification
            this.showNotification('Getting your location...', 'info', 3000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date().toISOString()
                    };

                    this.showNotification(`Location found: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`, 'success', 3000);
                    resolve(location);
                },
                (error) => {
                    let errorMessage = 'Failed to get location';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }

                    this.showNotification(errorMessage, 'error', 5000);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    },

    /**
     * Search for locations using geocoding
     */
    async searchLocation(query) {
        try {
            // Use a free geocoding service
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`);

            if (!response.ok) {
                throw new Error('Geocoding service unavailable');
            }

            const results = await response.json();

            return results.map(result => ({
                name: result.display_name,
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                type: result.type,
                importance: result.importance
            }));
        } catch (error) {
            console.error('Location search failed:', error);
            this.showNotification('Location search failed', 'error', 3000);
            return [];
        }
    },

    /**
     * Get location name from coordinates (reverse geocoding)
     */
    async getLocationName(latitude, longitude) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);

            if (!response.ok) {
                throw new Error('Reverse geocoding failed');
            }

            const result = await response.json();
            return result.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

// Global access
window.Utils = Utils;
