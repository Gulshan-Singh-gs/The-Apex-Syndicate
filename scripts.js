document.addEventListener("DOMContentLoaded", () => {
    // Set up the Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adding a slight delay based on index for a cascading "waterfall" effect
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                
                // Unobserve once it has appeared so it doesn't animate again
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with the 'scroll-target' class
    const elementsToAnimate = document.querySelectorAll('.scroll-target');
    elementsToAnimate.forEach((el) => {
        observer.observe(el);
    });

    // Toggle lessons content
    const learnBtn = document.getElementById('learn-btn');
    const lessonsContent = document.getElementById('lessons-content');

    if (learnBtn && lessonsContent) {
        const originalText = learnBtn.textContent;
        learnBtn.addEventListener('click', () => {
            if (lessonsContent.style.display === 'none' || lessonsContent.style.display === '') {
                lessonsContent.style.display = 'block';
                // Trigger reflow for fade-in effect
                void lessonsContent.offsetWidth;
                lessonsContent.style.opacity = '1';
                learnBtn.textContent = 'Hide Insights';
                
                // Scroll to the content smoothly
                setTimeout(() => {
                    lessonsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                lessonsContent.style.opacity = '0';
                setTimeout(() => {
                    lessonsContent.style.display = 'none';
                    learnBtn.textContent = originalText;
                }, 500); // Wait for transition to finish
            }
        });
    }

    // Initialize Neural Network (Plexus Effect) Background
    initPlexus();
});

// Plexus Effect Engine
function initPlexus() {
    const canvas = document.createElement('canvas');
    canvas.id = 'plexus-canvas';
    // Position it securely in the background
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1'; // Keep behind text
    canvas.style.pointerEvents = 'none';
    
    // Inject right after mist-container so it completely overlays the mist but stays behind the text
    const mist = document.querySelector('.mist-container');
    if (mist) {
        mist.parentNode.insertBefore(canvas, mist.nextSibling);
    } else {
        document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const particles = [];
    // Increase density specifically for desktop, dial down for mobile
    const particleCount = window.innerWidth < 768 ? 40 : 100;
    const connectionDistance = 180; // Extended reach to make the web tighter
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.0,
            vy: (Math.random() - 0.5) * 1.0,
            radius: Math.random() * 2 + 1 // Slightly larger nodes
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebound physics off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            // Draw particle nodes with a highly visible stark crimson
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 60, 60, 0.8)';
            ctx.fill();
            
            // Calculate and draw neural links
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Fade out the line based on how far the nodes are
                    let opacity = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(255, 60, 60, ${opacity * 0.6})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
