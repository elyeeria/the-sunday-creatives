// The Sunday Creatives - Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Dynamic hero title sizing to maintain 5% margins
    function resizeHeroTitle() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const availableWidth = window.innerWidth * 0.5; // 50vw (5% margin each side)
        
        // Reset to ensure accurate measurement
        heroTitle.style.fontSize = '10px';
        
        // Binary search for optimal font size
        let minSize = 10;
        let maxSize = 300;
        let fontSize = 10;
        
        while (maxSize - minSize > 0.5) {
            fontSize = (minSize + maxSize) / 2;
            heroTitle.style.fontSize = fontSize + 'px';
            
            // Force reflow to get accurate width
            const textWidth = heroTitle.scrollWidth;
            
            if (textWidth < availableWidth) {
                minSize = fontSize;
            } else {
                maxSize = fontSize;
            }
        }
        
        // Apply the final size with a safety margin to prevent overflow
        heroTitle.style.fontSize = (minSize * 0.95) + 'px';
    }
    
    // Call on load with a slight delay to ensure fonts are loaded
    setTimeout(resizeHeroTitle, 100);
    window.addEventListener('resize', resizeHeroTitle);
    
    // Re-run when fonts are fully loaded
    if (document.fonts) {
        document.fonts.ready.then(resizeHeroTitle);
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