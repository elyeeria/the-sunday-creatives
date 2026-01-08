// The Sunday Creatives - Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Cache DOM elements
    const heroTitle = document.querySelector('.hero-title');
    const titleLine1 = document.querySelector('.title-line-1');
    const heroSection = document.querySelector('.hero-section');
    const eventsSection = document.querySelector('.events-section');
    const navbar = document.querySelector('.navbar');
    const eventsGallery = document.querySelector('.events-gallery');
    
    // Dynamic hero title sizing to maintain margins
    function resizeHeroTitle() {
        if (!heroTitle || !titleLine1 || !heroSection) return;
        
        // Calculate available space with responsive adjustments
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust navbar width based on screen size
        let navbarWidth = 180;
        if (viewportWidth <= 480) {
            navbarWidth = 50;
        } else if (viewportWidth <= 768) {
            navbarWidth = 60;
        } else if (viewportWidth <= 1024) {
            navbarWidth = 80;
        }
        
        const availableWidth = (viewportWidth - navbarWidth) * 0.7;
        
        // Calculate available height with responsive margins
        const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        let marginSpace;
        let subtitleSize;
        let buttonPadding;
        let gapSpacing;
        
        if (viewportWidth <= 360) {
            marginSpace = 3 * remInPx; // 1.5rem top + 1.5rem bottom
            subtitleSize = 1.5 * remInPx * 1.4;
            buttonPadding = 0.4 * remInPx * 2;
            gapSpacing = 0.2 * remInPx + 0.8 * remInPx + 0.8 * remInPx;
        } else if (viewportWidth <= 480) {
            marginSpace = 4 * remInPx; // 2rem top + 2rem bottom
            subtitleSize = 1.6 * remInPx * 1.4;
            buttonPadding = 0.5 * remInPx * 2;
            gapSpacing = 0.2 * remInPx + 0.8 * remInPx + 0.8 * remInPx;
        } else if (viewportWidth <= 768) {
            marginSpace = 6 * remInPx; // 3rem top + 3rem bottom
            subtitleSize = 1.7 * remInPx * 1.4;
            buttonPadding = 0.6 * remInPx * 2;
            gapSpacing = 0.3 * remInPx + 1.0 * remInPx + 1.0 * remInPx;
        } else if (viewportWidth <= 1024) {
            marginSpace = 8 * remInPx; // 4rem top + 4rem bottom
            subtitleSize = 1.8 * remInPx * 1.4;
            buttonPadding = 0.7 * remInPx * 2;
            gapSpacing = 0.5 * remInPx + 1.2 * remInPx + 1.2 * remInPx;
        } else {
            marginSpace = 10 * remInPx; // 5rem top + 5rem bottom
            subtitleSize = 2.0 * remInPx * 1.4;
            buttonPadding = 0.8 * remInPx * 2;
            gapSpacing = 0.5 * remInPx + 1.5 * remInPx + 1.5 * remInPx;
        }
        
        const buttonHeight = buttonPadding + 3 * remInPx;
        const availableHeight = viewportHeight - marginSpace - subtitleSize - buttonHeight - gapSpacing;
        
        // Reset to minimum
        heroTitle.style.fontSize = '1px';
        
        // Binary search for optimal font size
        let minSize = 1;
        let maxSize = viewportWidth * 2;
        let fontSize = 1;
        let iterations = 0;
        const maxIterations = 50;
        
        while (maxSize - minSize > 1 && iterations < maxIterations) {
            fontSize = Math.floor((minSize + maxSize) / 2);
            heroTitle.style.fontSize = fontSize + 'px';
            
            void titleLine1.offsetWidth;
            const textWidth = titleLine1.scrollWidth;
            const titleHeight = heroTitle.scrollHeight;
            
            // Check both width and height constraints
            if (textWidth <= availableWidth && titleHeight <= availableHeight) {
                minSize = fontSize;
            } else {
                maxSize = fontSize;
            }
            iterations++;
        }
        
        // Apply final size with safety margin
        const finalSize = Math.floor(minSize * 0.95);
        heroTitle.style.fontSize = finalSize + 'px';
        
        console.log('Title resized:', finalSize + 'px', 'Available width:', availableWidth + 'px');
    }
    
    // Call on load with delay for fonts
    setTimeout(resizeHeroTitle, 150);
    
    // Call on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHeroTitle, 100);
    });
    
    // Re-run when fonts are fully loaded
    if (document.fonts) {
        document.fonts.ready.then(function() {
            setTimeout(resizeHeroTitle, 100);
        });
    }
    
    // Parallax scroll effect - collapse hero content as user scrolls
    let scrollThrottle;
    const heroContent = document.querySelector('.hero-content');
    
    function handleScrollCollapse() {
        if (scrollThrottle) return;
        scrollThrottle = setTimeout(() => {
            scrollThrottle = null;
        }, 10); // Throttle to ~60fps
        
        const scrollY = window.scrollY;
        
        if (heroContent) {
            // Fade out hero content as user scrolls
            const collapseDistance = window.innerHeight * 0.5; // Fade over half viewport
            const contentOpacity = Math.max(0, 1 - (scrollY / collapseDistance));
            heroContent.style.opacity = contentOpacity;
            heroContent.style.pointerEvents = contentOpacity === 0 ? 'none' : 'auto';
        }
    }
    
    window.addEventListener('scroll', handleScrollCollapse, { passive: true });
    handleScrollCollapse(); // Initialize on load
    
    // Shift hero title when navbar expands
    if (navbar && heroTitle) {
        navbar.addEventListener('mouseenter', function() {
            heroTitle.style.transform = 'translateX(50px)'; // (180px - 80px) / 2 = 50px
        });
        
        navbar.addEventListener('mouseleave', function() {
            heroTitle.style.transform = 'translateX(0)';
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add scroll indicator for events gallery
    // 3D Carousel functionality
    if (eventsGallery) {
        const eventCards = document.querySelectorAll('.event-card');
        const totalCards = eventCards.length;
        let currentRotation = 0;
        const angleIncrement = 360 / totalCards;
        const radius = 500; // Distance from center
        
        // Position cards in 3D circle
        function positionCards() {
            eventCards.forEach((card, index) => {
                const angle = (angleIncrement * index) * Math.PI / 180;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;
                
                card.style.transform = `
                    translateX(${x}px)
                    translateZ(${z}px)
                    rotateY(${-angleIncrement * index}deg)
                `;
            });
        }
        
        // Rotate carousel
        function rotateCarousel(direction) {
            currentRotation += direction * angleIncrement;
            eventsGallery.style.transform = `rotateY(${currentRotation}deg)`;
        }
        
        positionCards();
        
        // Auto-rotate carousel
        let autoRotateInterval = setInterval(() => {
            rotateCarousel(1);
        }, 3000);
        
        // Manual navigation on click
        eventsGallery.addEventListener('click', (e) => {
            clearInterval(autoRotateInterval);
            rotateCarousel(1);
            
            // Restart auto-rotate after 5 seconds of inactivity
            autoRotateInterval = setInterval(() => {
                rotateCarousel(1);
            }, 3000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                clearInterval(autoRotateInterval);
                rotateCarousel(-1);
                autoRotateInterval = setInterval(() => rotateCarousel(1), 3000);
            } else if (e.key === 'ArrowRight') {
                clearInterval(autoRotateInterval);
                rotateCarousel(1);
                autoRotateInterval = setInterval(() => rotateCarousel(1), 3000);
            }
        });
    }
    
    // Animate section title
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        sectionTitle.style.opacity = '0';
        sectionTitle.style.transform = 'translateY(30px)';
        sectionTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(sectionTitle);
    }
});