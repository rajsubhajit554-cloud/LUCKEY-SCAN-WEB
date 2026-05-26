document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('introOverlay');
    const container = document.querySelector('.container');
    
    // Create Confetti Container
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    // Premium Confetti Effect
    const fireConfetti = () => {
        const colors = ['#d4af37', '#f4c2c2', '#ffffff', '#c5a059', '#fdfbf7'];
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Randomize shape (circle or rectangle)
            if (Math.random() > 0.5) {
                particle.style.borderRadius = '50%';
            } else {
                particle.style.borderRadius = '2px';
            }
            
            const size = Math.random() * 6 + 4; // 4-10px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Initial position (center top)
            particle.style.left = '50%';
            particle.style.top = '30%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.boxShadow = `0 0 ${Math.random() * 10}px ${particle.style.backgroundColor}`;
            
            confettiContainer.appendChild(particle);
            
            // Physics
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100; // slight upward bias
            
            const duration = 2000 + Math.random() * 1500;
            
            particle.animate([
                { 
                    transform: `translate(-50%, -50%) scale(0)`, 
                    opacity: 1 
                },
                { 
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 360}deg) scale(1)`, 
                    offset: 0.2 
                },
                { 
                    transform: `translate(calc(-50% + ${tx * 1.5}px), calc(100vh + 20px)) rotate(${Math.random() * 720}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                if(particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    };

    // Intro Tap Event
    let isRevealed = false;
    introOverlay.addEventListener('click', () => {
        if (isRevealed) return;
        isRevealed = true;
        
        // Hide intro
        introOverlay.classList.add('revealed');
        
        // Show Card with slight delay
        setTimeout(() => {
            container.classList.add('show-card');
        }, 300);
        
        // Fire Confetti
        setTimeout(() => {
            fireConfetti();
        }, 500);
    });

    // Falling Flowers Logic
    const startFallingFlowers = () => {
        const createFlower = () => {
            const flower = document.createElement('div');
            flower.className = 'falling-flower';
            
            const colors = ['#f4c2c2', '#ffb6c1', '#ffffff', '#ffd700', '#ffebcd'];
            flower.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Petal shape
            flower.style.width = `${Math.random() * 8 + 6}px`;
            flower.style.height = `${Math.random() * 12 + 10}px`;
            flower.style.borderRadius = '50% 0 50% 0';
            
            flower.style.top = '-20px';
            flower.style.left = `${Math.random() * 100}vw`;
            flower.style.opacity = Math.random() * 0.6 + 0.4;
            
            const duration = Math.random() * 4 + 4; // 4 to 8 seconds
            const rotation = Math.random() * 360;
            
            flower.animate([
                { transform: `translateY(0) rotate(${rotation}deg)`, opacity: 0 },
                { opacity: flower.style.opacity, offset: 0.1 },
                { transform: `translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(${rotation + 360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'linear',
                fill: 'forwards'
            });
            
            document.body.appendChild(flower);
            
            setTimeout(() => {
                if (flower.parentNode) {
                    flower.parentNode.removeChild(flower);
                }
            }, duration * 1000);
        };

        // Create flowers periodically
        setInterval(createFlower, 400);
    };

    startFallingFlowers();

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
