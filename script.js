// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const landingPage = document.getElementById('landingPage');
    const mainContent = document.getElementById('mainContent');
    const enterButton = document.getElementById('enterButton');
    const heartCanvas = document.getElementById('heartCanvas');
    const ctx = heartCanvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        heartCanvas.width = window.innerWidth;
        heartCanvas.height = window.innerHeight;
    }
    
    // Initial resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Heart particle class
    class HeartParticle {
        constructor() {
            this.x = Math.random() * heartCanvas.width;
            this.y = Math.random() * heartCanvas.height;
            this.size = Math.random() * 10 + 5;
            this.speed = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.oscillation = Math.random() * 0.05;
            this.angle = 0;
        }
        
        update() {
            this.y -= this.speed;
            this.angle += this.oscillation;
            this.x += Math.sin(this.angle) * 0.5;
            
            if (this.y < -this.size) {
                this.y = heartCanvas.height + this.size;
                this.x = Math.random() * heartCanvas.width;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ff69b4';
            
            // Draw heart shape
            const x = this.x;
            const y = this.y;
            const size = this.size;
            
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(
                x, y - size * 0.7,
                x - size * 0.7, y - size * 0.7,
                x - size * 0.7, y
            );
            ctx.bezierCurveTo(
                x - size * 0.7, y + size * 0.5,
                x, y + size * 0.7,
                x, y + size
            );
            ctx.bezierCurveTo(
                x, y + size * 0.7,
                x + size * 0.7, y + size * 0.5,
                x + size * 0.7, y
            );
            ctx.bezierCurveTo(
                x + size * 0.7, y - size * 0.7,
                x, y - size * 0.7,
                x, y
            );
            
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Create heart particles
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new HeartParticle());
    }
    
    // Animation loop for heart particles
    function animateHearts() {
        ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animateHearts);
    }
    
    // Start animation
    animateHearts();
    
    // Button click event
    enterButton.addEventListener('click', function() {
        // Fade out landing page
        landingPage.style.opacity = '0';
        
        // After fade out, hide landing and show main content
        setTimeout(function() {
            landingPage.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // Trigger entrance animations for main content
            document.querySelectorAll('.message-section, .gallery-section, .timeline-section, .music-section, .ending-section, .qr-section').forEach((section, index) => {
                setTimeout(() => {
                    section.style.animation = `fadeInUp 1s forwards`;
                }, index * 200);
            });
        }, 1000);
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    document.querySelectorAll('.gallery-section, .timeline-section, .music-section, .ending-section, .qr-section').forEach(section => {
        observer.observe(section);
    });
    
    // Audio control enhancements
    const audioElement = document.getElementById('backgroundMusic');
    
    // Try to play audio automatically (browsers may block this)
    setTimeout(() => {
        audioElement.play().catch(e => console.log("Autoplay prevented by browser:", e));
    }, 1000);
    
    // Add volume control on first interaction
    document.body.addEventListener('click', function initAudio() {
        audioElement.volume = 0.3; // Set lower volume
        document.body.removeEventListener('click', initAudio);
    }, { once: true });
});

// Add CSS for scroll animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .gallery-section, .timeline-section, .music-section, .ending-section, .qr-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .gallery-section.animated, .timeline-section.animated, .music-section.animated, 
    .ending-section.animated, .qr-section.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);