// The Sunday Creatives - Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Dynamic hero title sizing to maintain margins
    function resizeHeroTitle() {
        const heroTitle = document.querySelector('.hero-title');
        const titleLine1 = document.querySelector('.title-line-1');
        if (!heroTitle || !titleLine1) return;
        
        // Get the actual available viewport width (minus sidebar and extra spacing)
        const viewportWidth = window.innerWidth - 180; // 80px sidebar + 100px extra spacing
        
        // Use 80% of viewport for the title (10% margin each side)
        const availableWidth = viewportWidth * 0.8;
        
        // Reset to minimum to get accurate measurements
        heroTitle.style.fontSize = '1px';
        
        // Binary search for optimal font size based on first line
        let minSize = 1;
        let maxSize = viewportWidth * 2; // Allow very large sizes
        let fontSize = 1;
        let iterations = 0;
        const maxIterations = 50;
        
        while (maxSize - minSize > 1 && iterations < maxIterations) {
            fontSize = Math.floor((minSize + maxSize) / 2);
            heroTitle.style.fontSize = fontSize + 'px';
            
            // Force layout recalculation
            void titleLine1.offsetWidth;
            const textWidth = titleLine1.scrollWidth;
            
            if (textWidth <= availableWidth) {
                minSize = fontSize;
            } else {
                maxSize = fontSize;
            }
            iterations++;
        }
        
        // Apply final size with small safety margin
        const finalSize = Math.floor(minSize * 0.98);
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
    
    // Shift hero title when navbar expands
    const navbar = document.querySelector('.navbar');
    const heroTitle = document.querySelector('.hero-title');
    
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
    const eventsGallery = document.querySelector('.events-gallery');
    
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