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
        
        // Calculate available space
        const viewportWidth = window.innerWidth - 180;
        const viewportHeight = window.innerHeight;
        const availableWidth = viewportWidth * 0.7;
        
        // Calculate available height: 100vh - 10rem margins - subtitle - button - gaps
        const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const marginSpace = 10 * remInPx; // 5rem top + 5rem bottom
        const subtitleHeight = 1.2 * remInPx * 1.4; // 1.2rem font-size with line-height
        const buttonHeight = 0.8 * remInPx * 2 + 3 * remInPx; // padding + borders/spacing
        const gapSpace = 0.5 * remInPx + 1.5 * remInPx + 1.5 * remInPx; // title gap + subtitle margin + button margin
        const availableHeight = viewportHeight - marginSpace - subtitleHeight - buttonHeight - gapSpace;
        
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
    
    // Parallax scroll effect - fade out sections as user scrolls
    let scrollThrottle;
    function handleScrollCollapse() {
        if (scrollThrottle) return;
        scrollThrottle = setTimeout(() => {
            scrollThrottle = null;
        }, 10); // Throttle to ~60fps
        
        const scrollY = window.scrollY;
        
        if (heroSection) {
            // Fade out hero section as user scrolls (collapses by 50vh instead of 100vh)
            const collapseDistance = window.innerHeight * 0.5; // Collapse over half viewport
            const heroOpacity = Math.max(0, 1 - (scrollY / collapseDistance));
            heroSection.style.opacity = heroOpacity;
            heroSection.style.pointerEvents = heroOpacity === 0 ? 'none' : 'auto';
        }
        
        if (eventsSection) {
            // Start fading events section after hero is scrolled past
            const eventsStart = window.innerHeight;
            const eventsScrollY = Math.max(0, scrollY - eventsStart);
            const collapseDistance = window.innerHeight * 0.5; // Collapse over half viewport
            const eventsOpacity = Math.max(0, 1 - (eventsScrollY / collapseDistance));
            eventsSection.style.opacity = eventsOpacity;
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
    if (eventsGallery) {
        // Check if gallery is scrollable
        function checkScrollable() {
            const isScrollable = eventsGallery.scrollWidth > eventsGallery.clientWidth;
            if (isScrollable) {
                eventsGallery.style.cursor = 'grab';
            }
        }
        
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        
        // Drag to scroll functionality
        let isDown = false;
        let startX;
        let scrollLeft;
        
        eventsGallery.addEventListener('mousedown', (e) => {
            isDown = true;
            eventsGallery.style.cursor = 'grabbing';
            startX = e.pageX - eventsGallery.offsetLeft;
            scrollLeft = eventsGallery.scrollLeft;
        });
        
        eventsGallery.addEventListener('mouseleave', () => {
            isDown = false;
            eventsGallery.style.cursor = 'grab';
        });
        
        eventsGallery.addEventListener('mouseup', () => {
            isDown = false;
            eventsGallery.style.cursor = 'grab';
        });
        
        eventsGallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - eventsGallery.offsetLeft;
            const walk = (x - startX) * 2;
            eventsGallery.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe event cards for animation
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});