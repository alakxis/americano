// ====== Audio Assets ======
const sfxClick = document.getElementById("sfxClick");
const sfxTear = document.getElementById("sfxTear");
const sfxMeow = document.getElementById("sfxMeow");
const bgMusic = document.getElementById("bgMusic");
const cassette = document.getElementById("cassette");

function playSfx(audioEl) {
    if(!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(e => console.log("SFX restricted"));
}

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        cassette.classList.add('playing');
    } else {
        bgMusic.pause();
        cassette.classList.remove('playing');
    }
}

// ====== Password Logic ======
const correctPassword = "121606";
let currentInput = "";
const maxLen = 6;
const displayMsg = document.getElementById("displayMessage");
const dotsContainer = document.getElementById("passwordDots");

for (let i = 0; i < maxLen; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dotsContainer.appendChild(dot);
}

function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("filled", index < currentInput.length);
    });
}

function pressKey(num) {
    playSfx(sfxClick);
    if (currentInput.length < maxLen) {
        currentInput += num;
        updateDots();
        if (currentInput.length === maxLen) checkPassword();
    }
}

function clearKeypad() {
    currentInput = "";
    displayMsg.textContent = "Enter Password";
    displayMsg.style.color = "var(--text-light)";
    updateDots();
}

function checkPassword() {
    if (currentInput === correctPassword) {
        displayMsg.textContent = "Access Granted ♡";
        displayMsg.style.color = "#a7f3d0"; 
        
        setTimeout(() => {
            document.getElementById('screen1').classList.remove('active');
            document.getElementById('screen1').classList.add('hidden');
            document.getElementById('heartCheck').classList.remove('hidden');
        }, 1000);
    } else {
        displayMsg.textContent = "Wrong Password 🐾";
        displayMsg.style.color = "#fca5a5"; 
        setTimeout(clearKeypad, 1000);
    }
}

// ====== Heart-Check Logic (Runaway Button) ======
const btnShy = document.getElementById('btnShy');
btnShy.addEventListener('mouseover', function() {
    const x = (Math.random() * 200) - 100; 
    const y = (Math.random() * 100) - 50;
    this.style.transform = `translate(${x}px, ${y}px)`;
});

function proceedToEnvelope() {
    document.getElementById('heartCheck').classList.add('hidden');
    transitionScreen(null, 'screen2', true);
    
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        cassette.classList.remove('hidden');
        cassette.classList.add('playing');
    }).catch(e => console.log("Audio autoplay restricted."));
}

// ====== Screen Transitions ======
function transitionScreen(hideId, showId, forceShow = false) {
    if(hideId) {
        const hideScreen = document.getElementById(hideId);
        hideScreen.classList.remove('active');
        setTimeout(() => hideScreen.classList.add('hidden'), 1000);
    }
    
    const showScreen = document.getElementById(showId);
    if (forceShow || hideId) {
        setTimeout(() => {
            showScreen.classList.remove('hidden');
            void showScreen.offsetWidth; 
            showScreen.classList.add('active');
        }, hideId ? 1000 : 100);
    }
}

// ====== Envelope Interaction ======
let envelopeOpened = false;
function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    playSfx(sfxTear);
    
    document.querySelector('.envelope-container').classList.add('open');
    
    setTimeout(() => {
        transitionScreen('screen2', 'screen3');
        window.scrollTo(0, 0);
        setTimeout(startTypewriter, 1200);
    }, 2000);
}

// ====== Typewriter Reveal ======
const titleText = "Him";
const subtitleText = "Loved quietly, tenderly, and always.";

function typeText(elementId, text, speed, callback) {
    let i = 0;
    const el = document.getElementById(elementId);
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function startTypewriter() {
    typeText("typewriterTitle", titleText, 150, () => {
        typeText("typewriterSubtitle", subtitleText, 50, () => {
            // Trigger staggered fade for paragraphs after titles finish
            document.querySelectorAll('.staggered-fade').forEach(el => {
                el.classList.add('visible');
                
                // Add delays to child paragraphs
                const children = el.querySelectorAll('p, div');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.2}s`;
                });
            });
        });
    });
}

// ====== Interactive Cats (Avoidant Logic) ======
function showCatMessage(element, message) {
    playSfx(sfxMeow);
    const msgDiv = element.nextElementSibling;
    msgDiv.textContent = message;
    msgDiv.classList.add('show');
    setTimeout(() => msgDiv.classList.remove('show'), 2000);
}

let scrollTimer = null;
window.addEventListener('scroll', () => {
    const cats = document.getElementById('avoidantCats');
    if(!cats) return;
    
    cats.classList.add('hide-avoidant');
    
    if(scrollTimer !== null) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        cats.classList.remove('hide-avoidant');
    }, 500); // Cats reappear after 0.5s of no scrolling
});

// ====== Canvas Magic (Petals & Sparkle Trail) ======
const canvas = document.getElementById('magicCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let petals = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Mouse Trail
const mouse = { x: -100, y: -100 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 2; i++) {
        particles.push({
            x: mouse.x, y: mouse.y,
            vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
            life: 1, size: Math.random() * 3 + 1
        });
    }
});

// Cherry Blossoms
for(let i=0; i<30; i++) {
    petals.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: Math.random() * 1 + 0.5, vy: Math.random() * 1 + 0.5,
        size: Math.random() * 4 + 2, angle: Math.random() * 360
    });
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Sparkles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(212, 175, 55, ${p.life})`; // Gold
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
    
    // Draw Petals
    ctx.fillStyle = 'rgba(255, 183, 197, 0.6)'; // Soft pink
    petals.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += 0.02;
        if (p.x > canvas.width) p.x = -10;
        if (p.y > canvas.height) p.y = -10;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
    requestAnimationFrame(animateCanvas);
}
animateCanvas();