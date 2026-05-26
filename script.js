document.addEventListener('DOMContentLoaded', () => {
    const ribbonOverlay = document.getElementById('ribbonOverlay');
    const container = document.querySelector('.container');
    const video = document.getElementById('invitationVideo');
    const playBtn = document.getElementById('playBtn');
    const videoOverlay = document.querySelector('.video-overlay');
    
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

    // Video Play/Pause Handling
    const togglePlay = () => {
        if (video.paused) {
            video.play().then(() => {
                videoOverlay.classList.add('hidden');
                video.classList.remove('paused');
            }).catch(e => {
                console.error("Autoplay prevented:", e);
                video.muted = true;
                video.play();
                videoOverlay.classList.add('hidden');
                video.classList.remove('paused');
            });
        } else {
            video.pause();
            videoOverlay.classList.remove('hidden');
            video.classList.add('paused');
        }
    };

    // Ribbon Tap Event
    let isRevealed = false;
    ribbonOverlay.addEventListener('click', () => {
        if (isRevealed) return;
        isRevealed = true;
        
        // Hide ribbon
        ribbonOverlay.classList.add('revealed');
        
        // Show Card with slight delay
        setTimeout(() => {
            container.classList.add('show-card');
        }, 300);
        
        // Fire Confetti
        setTimeout(() => {
            fireConfetti();
        }, 500);

        // Auto-play video after card reveal animation finishes
        setTimeout(() => {
            if (video.paused) {
                togglePlay();
            }
        }, 1200);
    });


    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent bubbling if we add click to wrapper
        togglePlay();
    });
    
    // Tap anywhere on video to toggle play/pause
    video.addEventListener('click', togglePlay);

    // Initial state
    video.classList.add('paused');
    
    // Error handling
    video.addEventListener('error', () => {
        const messageContainer = document.querySelector('.message-content p');
        messageContainer.innerHTML = '<em>We apologize, but the special video message could not be loaded.</em>';
        messageContainer.style.color = '#ff2a5f';
    });
});
