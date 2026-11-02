// ============= PAGE NAVIGATION =============
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    document.getElementById(page).classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Show/hide back button
    const backBtn = document.getElementById('backBtn');
    if (page === 'home') {
        backBtn.style.display = 'none';
    } else {
        backBtn.style.display = 'block';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Navigation event listeners
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// ============= PHOTO BOOTH FUNCTIONALITY =============
let currentFrame = 'single';
let photoBuffer = [];

const photoInput = document.getElementById('photoInput');
const uploadArea = document.getElementById('uploadArea');
const photoGallery = document.getElementById('photoGallery');
const finalFrameGallery = document.getElementById('finalFrameGallery');
const momentsGallery = document.getElementById('momentsGallery');
const captureCanvas = document.getElementById('captureCanvas');

// Upload area click handler
uploadArea.addEventListener('click', () => {
    photoInput.click();
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = 'rgba(129, 11, 56, 0.15)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = 'rgba(129, 11, 56, 0.08)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = 'rgba(129, 11, 56, 0.08)';
    const files = e.dataTransfer.files;
    handlePhotos(files);
});

// File input change
photoInput.addEventListener('change', (e) => {
    handlePhotos(e.target.files);
});

function handlePhotos(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                photoBuffer.push(imageData);
                displayPhotos();
                displayMoments();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Save to localStorage
    localStorage.setItem('photoBoothPhotos', JSON.stringify(photoBuffer));
}

function selectFrame(frame) {
    currentFrame = frame;
    document.querySelectorAll('.frame-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-frame="${frame}"]`).classList.add('active');
    displayPhotos();
}

function displayPhotos() {
    photoGallery.innerHTML = '';
    finalFrameGallery.innerHTML = '';
    
    if (photoBuffer.length === 0) {
        photoGallery.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">Upload photos to create photo booth frames</p>';
        finalFrameGallery.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">Your final frame will appear here</p>';
        return;
    }

    if (currentFrame === 'single') {
        photoBuffer.forEach((photo, index) => {
            // Editable frame with delete buttons
            const editFrame = document.createElement('div');
            editFrame.className = 'photo-frame single-frame';
            editFrame.innerHTML = `
                <img src="${photo}" alt="photo">
                <div class="photo-controls">
                    <button class="delete-btn" onclick="deletePhoto(${index})">Delete</button>
                </div>
            `;
            photoGallery.appendChild(editFrame);

            // Final frame without delete buttons
            const finalFrame = document.createElement('div');
            finalFrame.className = 'photo-frame single-frame';
            finalFrame.innerHTML = `<img src="${photo}" alt="photo">`;
            finalFrameGallery.appendChild(finalFrame);
        });
    } else if (currentFrame === 'double') {
        for (let i = 0; i < photoBuffer.length; i += 2) {
            if (photoBuffer[i + 1]) {
                // Editable frame with delete buttons
                const editFrame = document.createElement('div');
                editFrame.className = 'photo-frame double-frame';
                editFrame.innerHTML = `
                    <img class="frame-image" src="${photoBuffer[i]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 1]}" alt="photo">
                    <div class="photo-controls" style="grid-column: 1/-1;">
                        <button class="delete-btn" onclick="deletePhoto(${i})">Delete</button>
                        <button class="delete-btn" onclick="deletePhoto(${i + 1})">Delete</button>
                    </div>
                `;
                photoGallery.appendChild(editFrame);

                // Final frame without delete buttons
                const finalFrame = document.createElement('div');
                finalFrame.className = 'photo-frame double-frame';
                finalFrame.innerHTML = `
                    <img class="frame-image" src="${photoBuffer[i]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 1]}" alt="photo">
                `;
                finalFrameGallery.appendChild(finalFrame);
            }
        }
    } else if (currentFrame === 'quad') {
        for (let i = 0; i < photoBuffer.length; i += 4) {
            if (photoBuffer[i + 3]) {
                // Editable frame with delete buttons
                const editFrame = document.createElement('div');
                editFrame.className = 'photo-frame quad-frame';
                editFrame.innerHTML = `
                    <img class="frame-image" src="${photoBuffer[i]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 1]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 2]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 3]}" alt="photo">
                    <div class="photo-controls" style="grid-column: 1/-1;">
                        <button class="delete-btn" onclick="deletePhoto(${i})">Delete</button>
                        <button class="delete-btn" onclick="deletePhoto(${i + 1})">Delete</button>
                        <button class="delete-btn" onclick="deletePhoto(${i + 2})">Delete</button>
                        <button class="delete-btn" onclick="deletePhoto(${i + 3})">Delete</button>
                    </div>
                `;
                photoGallery.appendChild(editFrame);

                // Final frame without delete buttons
                const finalFrame = document.createElement('div');
                finalFrame.className = 'photo-frame quad-frame';
                finalFrame.innerHTML = `
                    <img class="frame-image" src="${photoBuffer[i]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 1]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 2]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 3]}" alt="photo">
                `;
                finalFrameGallery.appendChild(finalFrame);
            }
        }
    } else if (currentFrame === 'strip') {
        for (let i = 0; i < photoBuffer.length; i += 3) {
            if (photoBuffer[i + 2]) {
                // Editable frame with delete buttons
                const editFrame = document.createElement('div');
                editFrame.className = 'photo-frame strip-frame';
                editFrame.innerHTML = `
                    <img class="frame-image" src="${photoBuffer[i]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 1]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 2]}" alt="photo">
                    <div class="photo-controls" style="grid-column: 1/-1;">
                        <button class="delete-btn" onclick="deletePhoto(${i})">Delete</button>
                        <button class="delete-btn" onclick="deletePhoto(${i + 1})">Delete</button>
                        <button class="delete-btn" onclick="deletePhoto(${i + 2})">Delete</button>
                    </div>
                `;
                photoGallery.appendChild(editFrame);

                // Final frame without delete buttons
                const finalFrame = document.createElement('div');
                finalFrame.className = 'photo-frame strip-frame';
                finalFrame.innerHTML = `
                    <img class="frame-image" src="${photoBuffer[i]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 1]}" alt="photo">
                    <img class="frame-image" src="${photoBuffer[i + 2]}" alt="photo">
                `;
                finalFrameGallery.appendChild(finalFrame);
            }
        }
    }
}

function deletePhoto(index) {
    photoBuffer.splice(index, 1);
    localStorage.setItem('photoBoothPhotos', JSON.stringify(photoBuffer));
    displayPhotos();
    displayMoments();
}

function displayMoments() {
    momentsGallery.innerHTML = '';
    
    if (photoBuffer.length === 0) {
        momentsGallery.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">No moments yet. Upload photos to see them here!</p>';
        return;
    }

    photoBuffer.forEach((photo, index) => {
        const momentItem = document.createElement('div');
        momentItem.className = 'moment-item';
        momentItem.innerHTML = `<img src="${photo}" alt="moment">`;
        momentsGallery.appendChild(momentItem);
    });
}

// ============= SAVE PHOTO BOOTH FRAME =============
async function savePhotoBoothFrame() {
    const finalFrameElement = document.querySelector('#finalFrameGallery .photo-frame');
    
    if (!finalFrameElement) {
        alert('📸 No photo booth frame to save! Create a frame first.');
        return;
    }

    try {
        // Get the frame element to capture
        const frameRect = finalFrameElement.getBoundingClientRect();
        const width = finalFrameElement.offsetWidth;
        const height = finalFrameElement.offsetHeight;

        // Set canvas size with higher DPI for better quality
        const scale = 2;
        captureCanvas.width = width * scale;
        captureCanvas.height = height * scale;
        
        const ctx = captureCanvas.getContext('2d', { willReadFrequently: true });
        ctx.scale(scale, scale);

        // Draw background
        ctx.fillStyle = '#F1E2D1';
        ctx.fillRect(0, 0, width, height);

        // Draw border
        ctx.strokeStyle = '#810B38';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, width - 8, height - 8);

        // Get all images in the final frame
        const images = finalFrameElement.querySelectorAll('img');
        let imageLoadCount = 0;

        images.forEach((imgElement, idx) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = function() {
                imageLoadCount++;
                drawImageOnCanvas(ctx, img, width, height, idx, images.length);
                
                if (imageLoadCount === images.length) {
                    downloadCanvas();
                }
            };
            
            img.onerror = function() {
                imageLoadCount++;
                if (imageLoadCount === images.length) {
                    downloadCanvas();
                }
            };
            
            img.src = imgElement.src;
        });

        if (images.length === 0) {
            downloadCanvas();
        }

    } catch (error) {
        console.error('Error saving photo booth:', error);
        alert('❌ Error saving photo booth. Please try again.');
    }
}

function drawImageOnCanvas(ctx, img, canvasWidth, canvasHeight, idx, totalImages) {
    if (currentFrame === 'single') {
        ctx.drawImage(img, 4, 4, canvasWidth - 8, canvasHeight - 8);
    } else if (currentFrame === 'double') {
        const photoWidth = (canvasWidth - 20) / 2;
        const photoHeight = canvasHeight - 20;
        if (idx === 0) {
            ctx.drawImage(img, 12, 12, photoWidth - 4, photoHeight - 4);
        } else {
            ctx.drawImage(img, 12 + photoWidth, 12, photoWidth - 4, photoHeight - 4);
        }
    } else if (currentFrame === 'quad') {
        const photoWidth = (canvasWidth - 20) / 2;
        const photoHeight = (canvasHeight - 20) / 2;
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        ctx.drawImage(img, 12 + col * photoWidth, 12 + row * photoHeight, photoWidth - 4, photoHeight - 4);
    } else if (currentFrame === 'strip') {
        const photoHeight = (canvasHeight - 20) / 3;
        ctx.drawImage(img, 12, 12 + idx * photoHeight, canvasWidth - 24, photoHeight - 4);
    }
}

function downloadCanvas() {
    captureCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `photo-booth-${currentFrame}-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Photo booth frame saved! Check your downloads folder.');
    }, 'image/png', 0.95);
}

// ============= LOVE NOTES FUNCTIONALITY =============
let loveNotes = JSON.parse(localStorage.getItem('loveNotes')) || [];

const loveNoteForm = document.getElementById('loveNoteForm');
const notesList = document.getElementById('notesList');

loveNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const note = {
        text: document.getElementById('noteText').value,
        timestamp: new Date().toLocaleString()
    };
    
    loveNotes.unshift(note);
    localStorage.setItem('loveNotes', JSON.stringify(loveNotes));
    
    loveNoteForm.reset();
    displayLoveNotes();
    
    // Show success message
    alert('Love note added! 💕');
});

function displayLoveNotes() {
    notesList.innerHTML = '';
    
    if (loveNotes.length === 0) {
        notesList.innerHTML = '<p style="text-align: center; color: #999;">No love notes yet. Be the first to share your feelings! 💕</p>';
        return;
    }
    
    loveNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <p class="note-text">"${escapeHtml(note.text)}"</p>
            <p class="note-time">${note.timestamp}</p>
        `;
        notesList.appendChild(noteCard);
    });
}

// ============= UTILITY FUNCTIONS =============
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    // Load saved photos
    const savedPhotos = localStorage.getItem('photoBoothPhotos');
    if (savedPhotos) {
        photoBuffer = JSON.parse(savedPhotos);
        displayPhotos();
    }
    
    displayLoveNotes();
    displayMoments();
    createConfetti();
});

// Create confetti animation on home page
function createConfetti() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -10px;
            width: 10px;
            height: 10px;
            background: ${['#810B38', '#DCC3AA', '#F1E2D1', '#6a0930', '#B8956A'][Math.floor(Math.random() * 5)]};
            border-radius: 50%;
            pointer-events: none;
            animation: confetti ${2 + Math.random() * 1}s ease-in forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3500);
    }
}

// ============= SMOOTH SCROLLING =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
