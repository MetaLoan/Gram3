document.addEventListener('DOMContentLoaded', function() {
    
    // --- Channel Tracking & Dynamic Link Update ---
    const urlParams = new URLSearchParams(window.location.search);
    const startParam = urlParams.get('start');
    
    // Update Telegram links with channel parameter
    if (startParam) {
        const telegramFloatBtn = document.getElementById('telegramFloatBtn');
        if (telegramFloatBtn) {
            const telegramUrl = new URL(telegramFloatBtn.href);
            telegramUrl.searchParams.set('start', startParam);
            telegramFloatBtn.href = telegramUrl.toString();
        }
    }
    
    // Track button clicks
    function trackEvent(eventName, params) {
        if (typeof gtag !== 'undefined') {
            const channel = sessionStorage.getItem('channel') || 'direct';
            gtag('event', eventName, {
                ...params,
                'channel': channel
            });
        }
    }
    
    // Track CTA clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            trackEvent('cta_click', {
                'button_text': this.textContent.trim(),
                'button_location': 'hero'
            });
        });
    });
    
    // Track Telegram button clicks
    const telegramBtns = document.querySelectorAll('a[href*="t.me"]');
    telegramBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            trackEvent('telegram_click', {
                'button_location': this.classList.contains('telegram-float') ? 'float' : 'inline'
            });
        });
    });
    
    // --- Dynamic Content Loading ---

    // 1. Load Student Videos
    const videoScroller = document.getElementById('videoScroller');
    
    // List of actual video files found in the directory
    const videoFiles = [
        'studentvideo1.mp4', 'studentvideo2.mp4', 'studentvideo3.mp4', 
        'studentvideo4.mp4', 'studentvideo5.mp4', 'studentvideo6.mp4', 
        'studentvideo7.mp4', 'studentvideo8.mp4', 'studentvideo9.MP4', 
        'studentvideo10.mp4', 'studentvideo11.mp4', 'studentvideo12.mp4',
        'studentvideo13.mp4', 'studentvideo14.mp4', 'studentvideo15.mp4'
    ];
    
    const allVideos = []; // Store video elements for control

    videoFiles.forEach((fileName, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        // Using relative path to local files
        // Appending #t=0.1 tells the browser to use the frame at 0.1s as the thumbnail
        const videoSrc = `student_feedback_videos/${fileName}#t=0.1`;
        
        videoCard.innerHTML = `
            <video controls preload="metadata">
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p style="text-align:center; margin-top:5px; font-size:0.8rem; color:#aaa;">Student Result #${index + 1}</p>
        `;
        videoScroller.appendChild(videoCard);

        // Add to list for mutual exclusion
        const videoEl = videoCard.querySelector('video');
        allVideos.push(videoEl);

        // 3. Mutual Exclusion: Stop others when one plays
        videoEl.addEventListener('play', () => {
            allVideos.forEach(v => {
                if (v !== videoEl) {
                    v.pause();
                }
            });
            // Stop auto scroll when playing
            stopAutoScroll();
        });

        videoEl.addEventListener('pause', () => {
            // Resume auto scroll if no video is playing
            const isAnyPlaying = allVideos.some(v => !v.paused && !v.ended && v.readyState > 2);
            if (!isAnyPlaying) {
                startAutoScroll();
            }
        });
    });

    // 2. Auto Scroll Feature (Video)
    let scrollInterval;
    const scrollSpeed = 1; // px per tick
    const scrollDelay = 20; // ms

    function startAutoScroll() {
        if (scrollInterval) return; // Already running
        scrollInterval = setInterval(() => {
            if (videoScroller.scrollLeft + videoScroller.clientWidth >= videoScroller.scrollWidth) {
                videoScroller.scrollLeft = 0; // Reset to start
            } else {
                videoScroller.scrollLeft += scrollSpeed;
            }
        }, scrollDelay);
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }

    // Start initially
    startAutoScroll();

    // Pause on hover
    videoScroller.addEventListener('mouseenter', stopAutoScroll);
    videoScroller.addEventListener('mouseleave', () => {
        // Only resume if no video is playing
        const isAnyPlaying = allVideos.some(v => !v.paused && !v.ended && v.readyState > 2);
        if (!isAnyPlaying) {
            startAutoScroll();
        }
    });

    // 2. Load Student Images
    const imageWall = document.getElementById('imageWall');
    const imageCount = 20; // Load first 20 images
    
    for (let i = 1; i <= imageCount; i++) {
        const img = document.createElement('img');
        img.src = `student_feedback_images/studentpic${i}.jpg`;
        img.alt = `Student Profit Proof ${i}`;
        img.loading = "lazy"; // Native lazy loading
        
        // Add click to expand (simple lightbox)
        img.onclick = function() {
            this.requestFullscreen();
        };
        
        imageWall.appendChild(img);
    }

    // 3. Auto Scroll Feature (Images)
    let imgScrollInterval;
    
    function startImgAutoScroll() {
        if (imgScrollInterval) return;
        imgScrollInterval = setInterval(() => {
            if (imageWall.scrollLeft + imageWall.clientWidth >= imageWall.scrollWidth) {
                imageWall.scrollLeft = 0;
            } else {
                imageWall.scrollLeft += scrollSpeed;
            }
        }, scrollDelay);
    }

    function stopImgAutoScroll() {
        clearInterval(imgScrollInterval);
        imgScrollInterval = null;
    }

    startImgAutoScroll();

    imageWall.addEventListener('mouseenter', stopImgAutoScroll);
    imageWall.addEventListener('mouseleave', startImgAutoScroll);

    // --- Glitch Effect for Title ---
    const glitchText = document.querySelector('.glitch');
    setInterval(() => {
        glitchText.classList.toggle('active');
    }, 3000);

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Intersection Observer for Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    });

    document.querySelectorAll('.step-card, .faq-item').forEach((el) => {
        observer.observe(el);
    });

    // --- Modal Logic ---
    const modal = document.getElementById("videoModal");
    const btn = document.getElementById("howItWorksBtn");
    const span = document.getElementsByClassName("close-modal")[0];
    const modalVideo = document.getElementById("modalVideo");

    if (btn) {
        btn.onclick = function() {
            modal.style.display = "flex";
            modalVideo.play();
        }
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
    }

    // --- Privacy Modal Logic ---
    const privacyModal = document.getElementById("privacyModal");
    const privacyBtn = document.getElementById("privacyBtn");
    const privacyClose = document.getElementsByClassName("close-privacy")[0];

    if (privacyBtn) {
        privacyBtn.onclick = function(e) {
            e.preventDefault();
            privacyModal.style.display = "flex";
        }
    }

    if (privacyClose) {
        privacyClose.onclick = function() {
            privacyModal.style.display = "none";
        }
    }

    // Update window click to close both modals
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
        if (event.target == privacyModal) {
            privacyModal.style.display = "none";
        }
    }
});
