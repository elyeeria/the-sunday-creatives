// Kinetic Typography Effect
document.addEventListener('DOMContentLoaded', function() {
    // Mouse-reactive kinetic text
    const hero = document.querySelector('.hero');
    const textLayers = document.querySelectorAll('.text-layer');
    
    let mouseX = 0;
    let mouseY = 0;
    
    if (hero && textLayers.length > 0) {
        hero.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 50;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 50;
        });
        
        function animate() {
            textLayers.forEach((layer) => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 1;
                const x = mouseX * speed;
                const y = mouseY * speed;
                
                // Apply transform without overriding CSS animations
                layer.style.setProperty('--mouse-x', `${x}px`);
                layer.style.setProperty('--mouse-y', `${y}px`);
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add smooth scrolling behavior
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to header - make it more visible against dark hero
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > window.innerHeight - 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animate service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // CTA Button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});