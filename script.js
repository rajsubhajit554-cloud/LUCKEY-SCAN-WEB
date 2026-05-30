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

    // Show Card almost immediately
    setTimeout(() => {
        container.classList.add('show-card');
    }, 100);
    
    // Unlucky Video Logic & Scratch Card
    const unluckyText = document.getElementById('unluckyText');
    const unluckyVideo = document.getElementById('unluckyVideo');
    const unmuteHint = document.getElementById('unmuteHint');
    const ribbonContainer = document.getElementById('ribbonContainer');
    
    // Modal Elements
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalUnmuteHint = document.getElementById('modalUnmuteHint');

    if (unluckyText && unluckyVideo) {
        // Unmute on interaction
        const enableSound = () => {
            if (unluckyVideo.muted) {
                unluckyVideo.muted = false;
                if (unmuteHint) unmuteHint.style.display = 'none';
            }
            if (modalVideo && modalVideo.muted) {
                modalVideo.muted = false;
                if (modalUnmuteHint) modalUnmuteHint.style.display = 'none';
            }
        };
        document.body.addEventListener('click', enableSound);
        document.body.addEventListener('touchstart', enableSound, { passive: true });

        // Small video loop
        unluckyVideo.addEventListener('ended', () => {
            unluckyVideo.play().catch(e => {
                unluckyVideo.muted = true;
                if (unmuteHint) unmuteHint.style.display = 'block';
                unluckyVideo.play();
            });
        });

        // Modal video logic
        if (modalVideo) {
            modalVideo.addEventListener('ended', () => {
                // Hide modal
                videoModal.classList.remove('active');
                
                // Show and play small video in its original place
                unluckyVideo.style.display = 'block';
                unluckyVideo.currentTime = 0;
                unluckyVideo.play().catch(e => {
                    unluckyVideo.muted = true;
                    if (unmuteHint) unmuteHint.style.display = 'block';
                    unluckyVideo.play();
                });
            });
        }

        const startVideoSequence = () => {
            // Wait 2 seconds so they can read the winner text
            setTimeout(() => {
                unluckyText.style.opacity = '0';
                setTimeout(() => {
                    unluckyText.style.display = 'none';
                    
                    if (videoModal && modalVideo) {
                        videoModal.classList.add('active');
                        modalVideo.muted = false;
                        modalVideo.play().catch(e => {
                            modalVideo.muted = true;
                            if (modalUnmuteHint) modalUnmuteHint.style.display = 'block';
                            modalVideo.play();
                        });
                    } else {
                        unluckyVideo.style.display = 'block';
                        unluckyVideo.play();
                    }
                }, 500);
            }, 2500);
        };

        // Ribbon Logic
        if (ribbonContainer) {
            const cutRibbon = () => {
                // Fire the flower/confetti effect
                fireConfetti();

                // Add the cut class to trigger CSS animations
                ribbonContainer.classList.add('cut');
                
                // After the ribbons slide away, fade out the container
                setTimeout(() => {
                    ribbonContainer.style.transition = "opacity 0.6s ease";
                    ribbonContainer.style.opacity = '0';
                    
                    setTimeout(() => {
                        ribbonContainer.style.display = 'none';
                        startVideoSequence();
                    }, 600);
                }, 800);
            };

            ribbonContainer.addEventListener('click', cutRibbon);
        } else {
            startVideoSequence();
        }
    }
});
