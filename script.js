// Your JavaScript code starts here
console.log('The Sunday Creatives - Ready to build!');

// Generative Pattern
class GenerativePattern {
    constructor(canvas, ctx, images) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.time = 0;
        this.shapes = [];
        this.images = images;
        this.initShapes();
    }
    
    initShapes() {
        const numShapes = 15;
        for (let i = 0; i < numShapes; i++) {
            this.shapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 150 + 75,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                type: Math.floor(Math.random() * 3),
                opacity: Math.random() * 0.3 + 0.1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                image: this.images.length > 0 ? this.images[Math.floor(Math.random() * this.images.length)] : null
            });
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.01;
        
        this.shapes.forEach(shape => {
            this.ctx.save();
            
            // Move shape
            shape.x += shape.speedX;
            shape.y += shape.speedY;
            
            // Wrap around edges
            if (shape.x < -shape.size) shape.x = this.canvas.width + shape.size;
            if (shape.x > this.canvas.width + shape.size) shape.x = -shape.size;
            if (shape.y < -shape.size) shape.y = this.canvas.height + shape.size;
            if (shape.y > this.canvas.height + shape.size) shape.y = -shape.size;
            
            this.ctx.translate(shape.x, shape.y);
            shape.rotation += shape.rotationSpeed;
            this.ctx.rotate(shape.rotation);
            
            this.ctx.globalAlpha = shape.opacity;
            
            // Draw PNG image if available
            if (shape.image && shape.image.complete) {
                this.ctx.drawImage(
                    shape.image,
                    -shape.size / 2,
                    -shape.size / 2,
                    shape.size,
                    shape.size
                );
            } else {
                // Fallback to geometric shapes
                const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${shape.opacity})`;
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                
                switch(shape.type) {
                    case 0: // Triangle
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, -shape.size / 2);
                        this.ctx.lineTo(shape.size / 2, shape.size / 2);
                        this.ctx.lineTo(-shape.size / 2, shape.size / 2);
                        this.ctx.closePath();
                        this.ctx.stroke();
                        break;
                    case 1: // Circle
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                        this.ctx.stroke();
                        break;
                    case 2: // Square
                        this.ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                        break;
                }
            }
            
            this.ctx.restore();
        });
    }
}

// Kinetic Typography Effect
document.addEventListener('DOMContentLoaded', function() {
    // Setup Canvases
    const particleCanvas = document.getElementById('particleCanvas');
    const patternCanvas = document.getElementById('patternCanvas');
    const hero = document.querySelector('.hero');
    
    if (!particleCanvas || !patternCanvas) return;
    
    const particleCtx = particleCanvas.getContext('2d');
    const patternCtx = patternCanvas.getContext('2d');
    
    // Set canvas sizes
    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        patternCanvas.width = window.innerWidth;
        patternCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Load PNG images for particles and patterns
    // TO USE YOUR OWN IMAGES: Add image paths to these arrays
    const particleImagePaths = [
        // 'images/particle1.png',
        // 'images/particle2.png',
        // 'images/particle3.png',
    ];
    
    const patternImagePaths = [
        // 'images/pattern1.png',
        // 'images/pattern2.png',
        // 'images/pattern3.png',
    ];
    
    // Preload images
    const particleImages = [];
    const patternImages = [];
    
    let imagesLoaded = 0;
    const totalImages = particleImagePaths.length + patternImagePaths.length;
    
    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages || totalImages === 0) {
            startAnimation();
        }
    }
    
    // Load particle images
    particleImagePaths.forEach(path => {
        const img = new Image();
        img.onload = imageLoaded;
        img.onerror = imageLoaded;
        img.src = path;
        particleImages.push(img);
    });
    
    // Load pattern images
    patternImagePaths.forEach(path => {
        const img = new Image();
        img.onload = imageLoaded;
        img.onerror = imageLoaded;
        img.src = path;
        patternImages.push(img);
    });
    
    // If no images, start immediately
    if (totalImages === 0) {
        startAnimation();
    }
    
    function startAnimation() {
        // Initialize systems
        const particles = [];
        const maxParticles = 150;
        const generativePattern = new GenerativePattern(patternCanvas, patternCtx, patternImages);
        
        // Mouse tracking
        let mouseX = 0;
        let mouseY = 0;
        let isMouseMoving = false;
        
        hero.addEventListener('mousemove', function(e) {
            const rect = hero.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isMouseMoving = true;
            
            // Create particles on mouse move
            if (Math.random() > 0.7) {
                particles.push(new Particle(particleCanvas, mouseX, mouseY, particleImages));
            }
        });
        
        // Kinetic text
        const textLayers = document.querySelectorAll('.text-layer');
        let textMouseX = 0;
        let textMouseY = 0;
        
        if (textLayers.length > 0) {
            hero.addEventListener('mousemove', function(e) {
                textMouseX = (e.clientX / window.innerWidth - 0.5) * 50;
                textMouseY = (e.clientY / window.innerHeight - 0.5) * 50;
            });
        }
        
        // Animation loop
        function animate() {
            // Clear particle canvas
            particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            // Add random particles
            if (particles.length < maxParticles && Math.random() > 0.95) {
                particles.push(new Particle(particleCanvas, undefined, undefined, particleImages));
            }
            
            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                if (particles[i].update()) {
                    particles[i].draw(particleCtx);
                } else {
                    particles.splice(i, 1);
                }
            }
            
            // Draw generative pattern
            generativePattern.draw();
            
            // Update text layers
            textLayers.forEach((layer) => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 1;
                const x = textMouseX * speed;
                const y = textMouseY * speed;
                
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