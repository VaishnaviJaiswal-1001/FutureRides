// Global state management
class SkyTaxiApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'booking';
        this.activeFlight = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startBackgroundAnimations();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => this.handleLogout());

        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Booking form
        const bookingForm = document.getElementById('bookingForm');
        bookingForm.addEventListener('submit', (e) => this.handleBooking(e));

        // Taxi option selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.taxi-option')) {
                this.selectTaxi(e.target.closest('.taxi-option'));
            }
        });
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simulate login process
        this.showLoading(e.target.querySelector('button'));
        
        setTimeout(() => {
            this.currentUser = { email, name: 'User' };
            this.showScreen('dashboardScreen');
            this.showNotification('Welcome to SkyTaxi!', 'success');
            this.updateUserDisplay();
        }, 1500);
    }

    handleLogout() {
        this.currentUser = null;
        this.showScreen('loginScreen');
        this.showNotification('Logged out successfully', 'success');
    }

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // Start tab-specific animations
        if (tabName === 'tracking') {
            this.startTrackingAnimations();
        } else if (tabName === 'traffic') {
            this.startTrafficAnimations();
        }
    }

    handleBooking(e) {
        e.preventDefault();
        
        const pickup = document.getElementById('pickup').value;
        const destination = document.getElementById('destination').value;
        const passengers = document.getElementById('passengers').value;
        const priority = document.getElementById('priority').value;

        if (!pickup || !destination) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Simulate route calculation
        this.showLoading(e.target.querySelector('button'));
        this.updateRouteInfo(pickup, destination);
        
        setTimeout(() => {
            this.showAvailableTaxis(passengers, priority);
            this.hideLoading(e.target.querySelector('button'));
        }, 2000);
    }

    updateRouteInfo(pickup, destination) {
        // Calculate mock route data
        const distance = (Math.random() * 15 + 5).toFixed(1);
        const flightTime = Math.ceil(distance / 3);
        
        document.getElementById('routeDistance').textContent = `${distance} km`;
        document.getElementById('flightTime').textContent = `${flightTime} min`;
        
        // Update weather randomly
        const weather = ['Clear', 'Partly Cloudy', 'Light Wind', 'Optimal'][Math.floor(Math.random() * 4)];
        document.getElementById('weather').textContent = weather;
    }

    showAvailableTaxis(passengers, priority) {
        const taxiContainer = document.getElementById('availableTaxis');
        const taxiOptions = taxiContainer.querySelector('.taxi-options');
        
        // Generate mock taxi options
        const taxis = this.generateTaxiOptions(passengers, priority);
        
        taxiOptions.innerHTML = '';
        taxis.forEach((taxi, index) => {
            const taxiElement = this.createTaxiOption(taxi, index);
            taxiOptions.appendChild(taxiElement);
        });
        
        taxiContainer.classList.remove('hidden');
    }

    generateTaxiOptions(passengers, priority) {
        const basePrice = priority === 'standard' ? 80 : priority === 'express' ? 130 : 280;
        const models = ['SkyGlider X1', 'AeroTaxi Pro', 'CloudRider Elite', 'UrbanFlyer 2025'];
        
        return Array.from({ length: 3 }, (_, i) => ({
            id: `taxi-${Date.now()}-${i}`,
            model: models[i % models.length],
            driver: `Pilot ${String.fromCharCode(65 + i)} Johnson`,
            rating: (4.7 + Math.random() * 0.3).toFixed(1),
            eta: `${2 + i} min`,
            price: basePrice + (i * 15) + Math.floor(Math.random() * 20),
            capacity: passengers
        }));
    }

    createTaxiOption(taxi, index) {
        const div = document.createElement('div');
        div.className = 'taxi-option';
        div.dataset.taxiId = taxi.id;
        div.style.animationDelay = `${index * 0.1}s`;
        
        div.innerHTML = `
            <div class="taxi-info">
                <div class="taxi-details">
                    <h4>${taxi.model}</h4>
                    <p>Pilot: ${taxi.driver} (★${taxi.rating})</p>
                    <p>Capacity: ${taxi.capacity} passengers</p>
                </div>
                <div class="taxi-price">
                    <div class="price">$${taxi.price}</div>
                    <div class="eta">ETA: ${taxi.eta}</div>
                </div>
            </div>
        `;
        
        return div;
    }

    selectTaxi(taxiElement) {
        // Remove previous selections
        document.querySelectorAll('.taxi-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to current taxi
        taxiElement.classList.add('selected');
        
        // Simulate booking process
        const taxiId = taxiElement.dataset.taxiId;
        this.bookTaxi(taxiId);
    }

    bookTaxi(taxiId) {
        this.showNotification('Booking your SkyTaxi...', 'info');
        
        setTimeout(() => {
            this.showNotification('SkyTaxi booked successfully! Pilot is en route.', 'success');
            this.activeFlight = {
                id: `ST-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                taxiId,
                status: 'approaching',
                progress: 0
            };
            
            // Auto-switch to tracking tab
            setTimeout(() => {
                this.switchTab('tracking');
            }, 2000);
        }, 1500);
    }

    startBackgroundAnimations() {
        // Continuously update real-time elements
        setInterval(() => {
            this.updateTrafficMetrics();
            this.updateFlightProgress();
        }, 3000);
    }

    startTrackingAnimations() {
        const activeTaxi = document.querySelector('.active-taxi');
        if (activeTaxi) {
            // Simulate taxi movement towards destination
            const currentX = parseInt(activeTaxi.style.getPropertyValue('--x')) || 30;
            const targetX = 80;
            
            if (currentX < targetX) {
                activeTaxi.style.setProperty('--x', `${Math.min(currentX + 5, targetX)}%`);
            }
        }
    }

    startTrafficAnimations() {
        // Traffic vehicles are already animated via CSS
        // Add any additional dynamic behavior here
        this.updateAirspaceActivity();
    }

    updateTrafficMetrics() {
        const activeFlights = document.querySelector('.metric-value');
        if (activeFlights && this.currentTab === 'traffic') {
            const currentValue = parseInt(activeFlights.textContent) || 24;
            const newValue = Math.max(15, Math.min(35, currentValue + Math.floor(Math.random() * 6 - 3)));
            activeFlights.textContent = newValue;
        }
    }

    updateFlightProgress() {
        if (this.activeFlight && this.currentTab === 'tracking') {
            const progressBar = document.querySelector('.progress');
            if (progressBar) {
                this.activeFlight.progress = Math.min(100, this.activeFlight.progress + Math.random() * 10);
                progressBar.style.width = `${this.activeFlight.progress}%`;
                
                if (this.activeFlight.progress >= 100) {
                    this.showNotification('Flight completed! Thank you for using SkyTaxi.', 'success');
                    this.activeFlight = null;
                }
            }
        }
    }

    updateAirspaceActivity() {
        // Add dynamic no-fly zones or update traffic patterns
        const trafficVehicles = document.querySelectorAll('.traffic-vehicle');
        trafficVehicles.forEach((vehicle, index) => {
            const speed = Math.random() * 5 + 5;
            vehicle.style.setProperty('--speed', `${speed}s`);
        });
    }

    updateUserDisplay() {
        const userName = document.querySelector('.user-name');
        if (userName && this.currentUser) {
            userName.textContent = `Welcome, ${this.currentUser.name}`;
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showLoading(button) {
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Processing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    hideLoading(button) {
        const originalText = button.dataset.originalText || 'Submit';
        button.textContent = originalText;
        button.disabled = false;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Real-time data simulation
class DataSimulator {
    constructor(app) {
        this.app = app;
        this.startSimulation();
    }

    startSimulation() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateFlightData();
            this.updateWeatherData();
            this.updateTrafficData();
        }, 5000);
    }

    updateFlightData() {
        // Update ETAs and positions
        const etaElements = document.querySelectorAll('.eta');
        etaElements.forEach(eta => {
            if (eta.textContent.includes('min')) {
                const currentEta = parseInt(eta.textContent);
                if (currentEta > 1) {
                    eta.textContent = `ETA: ${currentEta - 1} minutes`;
                }
            }
        });
    }

    updateWeatherData() {
        const weatherElement = document.getElementById('weather');
        if (weatherElement) {
            const conditions = ['Clear', 'Partly Cloudy', 'Light Wind', 'Optimal', 'Fair'];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            weatherElement.textContent = randomCondition;
        }
    }

    updateTrafficData() {
        // Update traffic metrics
        const efficiencyElement = document.querySelectorAll('.metric-value')[1];
        if (efficiencyElement && this.app.currentTab === 'traffic') {
            const currentValue = parseInt(efficiencyElement.textContent) || 89;
            const newValue = Math.max(85, Math.min(98, currentValue + Math.floor(Math.random() * 4 - 2)));
            efficiencyElement.textContent = `${newValue}%`;
        }
    }
}

// Route optimization system
class RouteOptimizer {
    constructor() {
        this.routes = [];
        this.restrictions = [];
    }

    calculateOptimalRoute(start, end, priority = 'standard') {
        // Simulate advanced route calculation
        const distance = this.calculateDistance(start, end);
        const weather = this.getWeatherConditions();
        const traffic = this.getTrafficDensity();
        
        return {
            distance,
            estimatedTime: this.calculateFlightTime(distance, priority, weather, traffic),
            waypoints: this.generateWaypoints(start, end),
            safety: this.calculateSafetyScore(),
            cost: this.calculateCost(distance, priority)
        };
    }

    calculateDistance(start, end) {
        // Mock distance calculation
        return Math.random() * 15 + 5;
    }

    getWeatherConditions() {
        return {
            visibility: Math.random() * 10 + 10, // km
            windSpeed: Math.random() * 20 + 5, // km/h
            conditions: ['clear', 'cloudy', 'windy'][Math.floor(Math.random() * 3)]
        };
    }

    getTrafficDensity() {
        return Math.random() * 0.5 + 0.3; // 0.3 to 0.8
    }

    calculateFlightTime(distance, priority, weather, traffic) {
        let baseSpeed = 180; // km/h
        
        if (priority === 'express') baseSpeed *= 1.3;
        if (priority === 'emergency') baseSpeed *= 1.6;
        
        // Weather and traffic adjustments
        const weatherFactor = weather.windSpeed > 15 ? 0.9 : 1.0;
        const trafficFactor = 1 - (traffic * 0.2);
        
        const adjustedSpeed = baseSpeed * weatherFactor * trafficFactor;
        return Math.ceil((distance / adjustedSpeed) * 60); // minutes
    }

    generateWaypoints(start, end) {
        const waypoints = [start];
        const numWaypoints = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numWaypoints; i++) {
            waypoints.push(`Waypoint ${i + 1}`);
        }
        
        waypoints.push(end);
        return waypoints;
    }

    calculateSafetyScore() {
        return Math.random() * 5 + 95; // 95-100%
    }

    calculateCost(distance, priority) {
        let baseCost = distance * 5; // $5 per km
        
        if (priority === 'express') baseCost += 50;
        if (priority === 'emergency') baseCost += 200;
        
        return Math.ceil(baseCost);
    }
}

// Flight tracking system
class FlightTracker {
    constructor() {
        this.activeFlights = new Map();
        this.updateInterval = null;
    }

    startTracking(flightId) {
        const flight = {
            id: flightId,
            position: { x: 30, y: 40 },
            destination: { x: 80, y: 20 },
            speed: 180,
            altitude: 485,
            status: 'en-route'
        };
        
        this.activeFlights.set(flightId, flight);
        this.startPositionUpdates(flightId);
    }

    startPositionUpdates(flightId) {
        this.updateInterval = setInterval(() => {
            const flight = this.activeFlights.get(flightId);
            if (!flight) return;
            
            // Update position towards destination
            const dx = flight.destination.x - flight.position.x;
            const dy = flight.destination.y - flight.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 2) {
                flight.position.x += (dx / distance) * 2;
                flight.position.y += (dy / distance) * 2;
                
                // Update UI
                const taxiElement = document.querySelector('.active-taxi');
                if (taxiElement) {
                    taxiElement.style.setProperty('--x', `${flight.position.x}%`);
                    taxiElement.style.setProperty('--y', `${flight.position.y}%`);
                }
            } else {
                // Flight completed
                this.completeFlight(flightId);
            }
        }, 500);
    }

    completeFlight(flightId) {
        clearInterval(this.updateInterval);
        this.activeFlights.delete(flightId);
        // Update UI to show completion
    }
}

// Traffic management system
class TrafficManager {
    constructor() {
        this.airspace = {
            capacity: 50,
            current: 24,
            efficiency: 89
        };
        this.restrictions = [];
    }

    addRestriction(zone) {
        this.restrictions.push({
            id: Date.now(),
            zone,
            type: 'temporary',
            reason: 'Weather',
            duration: 30 // minutes
        });
        
        this.updateAirspaceDisplay();
    }

    removeRestriction(restrictionId) {
        this.restrictions = this.restrictions.filter(r => r.id !== restrictionId);
        this.updateAirspaceDisplay();
    }

    updateAirspaceDisplay() {
        // Update the visual representation of airspace
        const airspaceGrid = document.querySelector('.airspace-grid');
        if (airspaceGrid) {
            // Add visual indicators for new restrictions
            this.restrictions.forEach(restriction => {
                if (!document.querySelector(`[data-restriction-id="${restriction.id}"]`)) {
                    const restrictionElement = this.createRestrictionElement(restriction);
                    airspaceGrid.appendChild(restrictionElement);
                }
            });
        }
    }

    createRestrictionElement(restriction) {
        const div = document.createElement('div');
        div.className = 'restricted-zone dynamic';
        div.dataset.restrictionId = restriction.id;
        div.style.top = `${Math.random() * 60 + 10}%`;
        div.style.left = `${Math.random() * 60 + 10}%`;
        div.style.width = `${Math.random() * 15 + 10}%`;
        div.style.height = `${Math.random() * 15 + 10}%`;
        
        return div;
    }

    optimizeTraffic() {
        // AI-powered traffic optimization
        this.airspace.efficiency = Math.min(98, this.airspace.efficiency + Math.random() * 3);
        
        // Update efficiency display
        const efficiencyElement = document.querySelectorAll('.metric-value')[1];
        if (efficiencyElement) {
            efficiencyElement.textContent = `${Math.round(this.airspace.efficiency)}%`;
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new SkyTaxiApp();
    const simulator = new DataSimulator(app);
    const routeOptimizer = new RouteOptimizer();
    const flightTracker = new FlightTracker();
    const trafficManager = new TrafficManager();
    
    // Make systems available globally for debugging
    window.skyTaxiSystems = {
        app,
        simulator,
        routeOptimizer,
        flightTracker,
        trafficManager
    };
    
    // Start periodic optimization
    setInterval(() => {
        trafficManager.optimizeTraffic();
    }, 10000);
    
    // Simulate emergency scenarios occasionally
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            app.showNotification('Emergency vehicle priority access granted', 'warning');
        }
    }, 30000);
});

// Utility functions
function showElement(element) {
    element.classList.remove('hidden');
    element.classList.add('fade-in');
}

function hideElement(element) {
    element.classList.add('hidden');
    element.classList.remove('fade-in');
}

// Enhanced CSS animations for specific interactions
document.addEventListener('click', (e) => {
    // Add ripple effect to buttons
    if (e.target.matches('button, .taxi-option, .metric-card')) {
        createRippleEffect(e);
    }
});

function createRippleEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        background-color: rgba(255, 255, 255, 0.3);
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .taxi-option.selected {
        background: rgba(14, 165, 233, 0.2) !important;
        border-color: #0EA5E9 !important;
        transform: translateY(-4px) !important;
        box-shadow: 0 15px 35px rgba(14, 165, 233, 0.3) !important;
    }
    
    .dynamic {
        animation: fadeInScale 0.8s ease-out !important;
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
