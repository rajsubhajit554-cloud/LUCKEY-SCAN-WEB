document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    const container = document.querySelector('.container');
    
    // Create Confetti Container
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    // Falling Flowers Effect
    const fireConfetti = () => {
        const colors = ['#d4af37', '#f4c2c2', '#ffb6c1', '#ffc0cb', '#ffffff']; // Added pink/flower colors
        const particleCount = 60;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Randomize shape (circle or petal-like)
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '50% 0 50% 50%'; // petal shape
            
            const size = Math.random() * 8 + 6; // 6-14px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Initial position (random across top of screen)
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `-20px`; // start above screen
            particle.style.opacity = (Math.random() * 0.5 + 0.5).toString();
            
            confettiContainer.appendChild(particle);
            
            // Physics for falling
            const tx = (Math.random() - 0.5) * 200; // random drift left/right
            const ty = window.innerHeight + 50; // fall to bottom
            const duration = 3000 + Math.random() * 4000; // fall slower
            
            particle.animate([
                { 
                    transform: `translate(0, 0) rotate(0deg)`,
                    opacity: 1
                },
                { 
                    transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'linear',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                if(particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    };

    // Splash Screen Auto Reveal
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('revealed');
        }
        
        // Show Card with slight delay
        setTimeout(() => {
            container.classList.add('show-card');
        }, 300);
        
        // Fire Flowers
        setTimeout(() => {
            fireConfetti();
        }, 500);
    }, 2000); // 2 seconds animation before opening

    // Scratch Card Logic
    const canvas = document.getElementById('scratchCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let isDrawing = false;
        
        // Resize canvas to match its CSS size to avoid blurriness
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            initCanvas();
        };

        // Initialize canvas cover
        const initCanvas = () => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#c5a059'; // Warm Gold cover
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text pattern
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Outfit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2);
            
            ctx.globalCompositeOperation = 'destination-out';
        };

        const getMousePos = (canvas, evt) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            let clientX = evt.clientX;
            let clientY = evt.clientY;

            if (evt.touches && evt.touches.length > 0) {
                clientX = evt.touches[0].clientX;
                clientY = evt.touches[0].clientY;
            }

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        };

        const scratch = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getMousePos(canvas, e);
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
            ctx.fill();

            checkScratched();
        };

        const checkScratched = () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;

            // Only check every 4th pixel (alpha channel)
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) {
                    transparentPixels++;
                }
            }

            const totalPixels = pixels.length / 4;
            const percentScratched = (transparentPixels / totalPixels) * 100;

            if (percentScratched > 40) {
                // Clear the rest of the canvas
                canvas.style.transition = "opacity 0.6s ease";
                canvas.style.opacity = 0;
                
                setTimeout(() => {
                    canvas.style.display = 'none';
                    fireConfetti(); // Fire confetti when scratched
                }, 600);
                
                // Remove listeners
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', scratch);
                canvas.removeEventListener('mouseup', stopDrawing);
                canvas.removeEventListener('touchstart', startDrawing);
                canvas.removeEventListener('touchmove', scratch);
                canvas.removeEventListener('touchend', stopDrawing);
            }
        };

        const startDrawing = (e) => {
            isDrawing = true;
            scratch(e);
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
        
        // Wait for next tick so bounding rect is correct
        setTimeout(resizeCanvas, 100);
        window.addEventListener('resize', resizeCanvas);
    }
});
