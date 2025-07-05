// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupEventListeners();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.menuIcon = this.mobileMenuToggle?.querySelector('.menu-icon');
        this.closeIcon = this.mobileMenuToggle?.querySelector('.close-icon');
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    setupScrollListener() {
        let ticking = false;

        const updateNavbar = () => {
            if (window.scrollY > 20) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    setupMobileMenu() {
        if (!this.mobileMenuToggle || !this.mobileMenu) return;

        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking on links
        const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.add('active');
        this.menuIcon.style.display = 'none';
        this.closeIcon.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.menuIcon.style.display = 'block';
        this.closeIcon.style.display = 'none';
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('.nav-menu a[href^="#"], .mobile-nav a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if href is just "#" (placeholder link)
                if (href === '#') {
                    e.preventDefault();
                    return;
                }
                
                // Skip if it's an external link or doesn't start with #
                if (!href.startsWith('#')) {
                    return;
                }
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.init();
    }

    init() {
        // Hide loading screen after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500); // Show loading for at least 1.5 seconds
        });
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                this.loadingScreen.remove();
            }, 500);
        }
    }
}

// Scroll to Top Manager
class ScrollToTopManager {
    constructor() {
        this.scrollButton = document.getElementById('scrollToTop');
        this.init();
    }

    init() {
        if (!this.scrollButton) return;

        this.setupScrollListener();
        this.setupClickListener();
    }

    setupScrollListener() {
        let ticking = false;

        const updateButton = () => {
            if (window.scrollY > 300) {
                this.scrollButton.classList.add('visible');
            } else {
                this.scrollButton.classList.remove('visible');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateButton);
                ticking = true;
            }
        });
    }

    setupClickListener() {
        this.scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Media Section Manager
class MediaManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMediaTabs();
    }

    setupMediaTabs() {
        const tabButtons = document.querySelectorAll('.media-tab');
        const tabContents = document.querySelectorAll('.media-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCountdownTimers();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, this.observerOptions);

        // Observe elements that should animate on scroll
        const animatedElements = document.querySelectorAll(
            '.news-card, .match-card, .player-card, .gallery-item, .video-card, .press-item'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    setupCountdownTimers() {
        const countdownElements = document.querySelectorAll('.match-countdown');
        
        countdownElements.forEach(element => {
            // This is a simplified countdown - in a real app, you'd calculate from actual match dates
            const countdownText = element.textContent;
            if (countdownText.includes('kun qoldi')) {
                this.animateCountdown(element);
            }
        });
    }

    animateCountdown(element) {
        // Add a subtle pulse animation to countdown elements
        element.style.animation = 'pulse 2s infinite';
    }
}

// Schedule Page Functions
function openSchedulePage() {
    window.open('schedule.html', '_blank');
}

// Utility Functions
class Utils {
    static formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('uz-UZ', options);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
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
    }
}

// Performance Optimization
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload hero image
        const heroImage = new Image();
        heroImage.src = 'https://images.pexels.com/photos/41257/pexels-photo-41257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    }
}

// Error Handling
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    handleError(event) {
        console.error('JavaScript Error:', event.error);
        // In a production app, you might want to send this to a logging service
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        // In a production app, you might want to send this to a logging service
    }
}

// Main Application
class RealMadridApp {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.loadingManager = new LoadingManager();
        this.scrollToTopManager = new ScrollToTopManager();
        this.mediaManager = new MediaManager();
        this.animationManager = new AnimationManager();
        this.performanceManager = new PerformanceManager();
        this.errorHandler = new ErrorHandler();
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        console.log('Real Madrid UZ website loaded successfully!');
        
        // Add any additional initialization here
        this.setupAnalytics();
        this.setupServiceWorker();
    }

    setupAnalytics() {
        // Placeholder for analytics setup
        // In a real app, you'd integrate with Google Analytics, etc.
        console.log('Analytics initialized');
    }

    setupServiceWorker() {
        // Placeholder for service worker registration
        // In a real app, you'd register a service worker for offline functionality
        if ('serviceWorker' in navigator) {
            console.log('Service Worker support detected');
        }
    }
}

// Initialize the application
const app = new RealMadridApp();