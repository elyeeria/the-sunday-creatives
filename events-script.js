document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminView = urlParams.get('admin') === 'true';
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    // Session expires after 2 hours
    const sessionDuration = 2 * 60 * 60 * 1000;
    const isSessionValid = loginTime && (Date.now() - parseInt(loginTime)) < sessionDuration;
    
    const isAdmin = isAdminView && isAuthenticated && isSessionValid;
    
    // Redirect to login if trying to access admin without auth
    if (isAdminView && (!isAuthenticated || !isSessionValid)) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Handle admin login link visibility
    const adminLoginLink = document.getElementById('adminLoginLink');
    if (adminLoginLink && isAdmin) {
        adminLoginLink.classList.add('hidden');
    }
    
    // Load events from localStorage or get from existing HTML
    let events = JSON.parse(localStorage.getItem('events')) || null;
    
    const cardsStack = document.querySelector('.cards-stack');
    let cards = Array.from(document.querySelectorAll('.event-card-full'));
    const leftArrow = document.querySelector('.nav-arrow-left');
    const rightArrow = document.querySelector('.nav-arrow-right');
    let currentIndex = 0;
    let totalCards = cards.length;
    
    // If we have saved events and in admin mode, render them
    if (events && isAdmin) {
        // Auto-archive past events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        events = events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (eventDate < today) {
                archiveEvent(event);
                return false;
            }
            return true;
        });
        
        saveEvents();
        renderEvents();
        
        // Update cards reference after rendering
        cards = Array.from(document.querySelectorAll('.event-card-full'));
        totalCards = cards.length;
    } else if (!events) {
        // First time load - save existing HTML cards to localStorage
        saveExistingCardsToLocalStorage();
    }
    
    // Admin UI setup
    if (isAdmin) {
        setupAdminUI();
    }

    // Initialize card positions
    function updateCardPositions() {
        requestAnimationFrame(() => {
            cards.forEach((card, index) => {
                const position = (index - currentIndex + totalCards) % totalCards;
                
                if (position === 0) {
                    card.setAttribute('data-position', '0');
                } else if (position === 1) {
                    card.setAttribute('data-position', '1');
                } else if (position === 2) {
                    card.setAttribute('data-position', '2');
                } else if (position === 3) {
                    card.setAttribute('data-position', '3');
                } else {
                    card.setAttribute('data-position', 'hidden');
                }
            });
        });
    }

    // Navigate to next card
    function nextCard() {
        if (totalCards === 0) return;
        currentIndex = (currentIndex + 1) % totalCards;
        updateCardPositions();
    }

    // Navigate to previous card
    function prevCard() {
        if (totalCards === 0) return;
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCardPositions();
    }

    // Event listeners
    if (leftArrow && rightArrow) {
        rightArrow.addEventListener('click', nextCard);
        leftArrow.addEventListener('click', prevCard);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextCard();
        } else if (e.key === 'ArrowLeft') {
            prevCard();
        }
    });

    // Click on stacked cards to bring forward
    function setupCardClickHandlers() {
        cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                // Don't navigate if clicking admin buttons
                if (e.target.closest('.card-admin-btn')) return;
                
                const position = card.getAttribute('data-position');
                if (position !== '0') {
                    const targetIndex = parseInt(card.getAttribute('data-index'));
                    currentIndex = targetIndex;
                    updateCardPositions();
                }
            });
        });
    }
    
    setupCardClickHandlers();

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextCard();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevCard();
        }
    }
    
    // Save existing cards from HTML to localStorage
    function saveExistingCardsToLocalStorage() {
        const existingCards = Array.from(document.querySelectorAll('.event-card-full'));
        const events = existingCards.map((card, index) => {
            const title = card.querySelector('.event-title-full')?.textContent || '';
            const dateText = card.querySelector('.event-date-full')?.textContent || '';
            const details = card.querySelector('.event-details')?.textContent || '';
            const backgroundImage = card.querySelector('.card-background')?.style.backgroundImage?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1] || '';
            const polaroids = card.querySelectorAll('.polaroid');
            const polaroid1 = polaroids[0]?.style.backgroundImage?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1] || '';
            const polaroid2 = polaroids[1]?.style.backgroundImage?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1] || '';
            
            // Parse date from text like "January 15, 2026"
            const date = new Date(dateText).toISOString().split('T')[0];
            
            return {
                id: Date.now() + index,
                title,
                date,
                details,
                backgroundImage,
                polaroid1,
                polaroid2,
                style: 'craft'
            };
        });
        
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Render events
    function renderEvents() {
        if (!cardsStack) return;
        
        cardsStack.innerHTML = '';
        
        events.forEach((event, index) => {
            const cardHTML = createEventCardHTML(event, index);
            cardsStack.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        // Update cards array and total
        cards = Array.from(document.querySelectorAll('.event-card-full'));
        totalCards = cards.length;
        
        // Setup card click handlers
        setupCardClickHandlers();
        
        // Add admin buttons if in admin mode
        if (isAdmin) {
            addAdminButtonsToCards();
        }
        
        updateCardPositions();
    }

    // Create event card HTML
    function createEventCardHTML(event, index) {
        const formattedDate = new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="event-card-full" data-index="${index}" data-event-id="${event.id}" data-style="${event.style || 'craft'}">
                <div class="card-background" style="background-image: url('${event.backgroundImage}');" loading="lazy"></div>
                <div class="card-overlay"></div>
                <div class="card-content">
                    <div class="card-main-info">
                        <h2 class="event-title-full">${event.title}</h2>
                        <p class="event-date-full">${formattedDate}</p>
                        <a href="#" class="calendar-button">Add to Calendar</a>
                        <p class="event-details">${event.details}</p>
                    </div>
                    <div class="polaroid-photos">
                        <div class="polaroid" style="background-image: url('${event.polaroid1}');" loading="lazy">
                            <div class="polaroid-frame"></div>
                        </div>
                        <div class="polaroid" style="background-image: url('${event.polaroid2}');" loading="lazy">
                            <div class="polaroid-frame"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Save events to localStorage
    function saveEvents() {
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Archive event
    function archiveEvent(event) {
        let archivedEvents = JSON.parse(localStorage.getItem('archivedEvents')) || [];
        archivedEvents.push({
            ...event,
            archivedDate: new Date().toISOString()
        });
        localStorage.setItem('archivedEvents', JSON.stringify(archivedEvents));
    }

    // Setup admin UI
    function setupAdminUI() {
        const adminControls = document.getElementById('adminControls');
        const addEventBtn = document.getElementById('addEventBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminModal = document.getElementById('adminModal');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const eventForm = document.getElementById('eventForm');
        const modalTitle = document.getElementById('modalTitle');
        
        let editingEventId = null;
        let selectedStyle = 'craft';
        
        // Show admin controls
        if (adminControls) {
            adminControls.classList.add('active');
        }
        
        // Add event button
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                editingEventId = null;
                modalTitle.textContent = 'Add New Event';
                eventForm.reset();
                selectedStyle = 'craft';
                updateStyleButtons();
                clearImagePreviews();
                
                // Set default outdoor images if outdoor style is selected
                applyStyleDefaults();
                
                adminModal.classList.add('active');
            });
        }
        
        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('adminAuthenticated');
                sessionStorage.removeItem('adminLoginTime');
                window.location.href = 'events.html';
            });
        }
        
        // Close modal
        const closeModalHandler = () => {
            adminModal.classList.remove('active');
            eventForm.reset();
            clearImagePreviews();
        };
        
        if (closeModal) closeModal.addEventListener('click', closeModalHandler);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModalHandler);
        
        // Click outside modal to close
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                closeModalHandler();
            }
        });
        
        // Image upload handlers
        setupImageUpload('backgroundImageFile', 'backgroundImage', 'backgroundImagePreview');
        setupImageUpload('polaroid1File', 'polaroid1', 'polaroid1Preview');
        setupImageUpload('polaroid2File', 'polaroid2', 'polaroid2Preview');
        
        function setupImageUpload(fileInputId, urlInputId, previewId) {
            const fileInput = document.getElementById(fileInputId);
            const urlInput = document.getElementById(urlInputId);
            const preview = document.getElementById(previewId);
            
            if (!fileInput || !urlInput || !preview) return;
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const dataUrl = event.target.result;
                        urlInput.value = dataUrl;
                        preview.style.backgroundImage = `url('${dataUrl}')`;
                        preview.classList.add('show');
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Show preview when URL is entered
            urlInput.addEventListener('input', () => {
                if (urlInput.value) {
                    preview.style.backgroundImage = `url('${urlInput.value}')`;
                    preview.classList.add('show');
                } else {
                    preview.classList.remove('show');
                }
            });
        }
        
        function clearImagePreviews() {
            const previews = ['backgroundImagePreview', 'polaroid1Preview', 'polaroid2Preview'];
            previews.forEach(id => {
                const preview = document.getElementById(id);
                if (preview) {
                    preview.classList.remove('show');
                    preview.style.backgroundImage = '';
                }
            });
        }
        
        // Default outdoor/leafy images
        const outdoorDefaults = {
            backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071',
            polaroid1: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070',
            polaroid2: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2141'
        };
        
        // Apply style-specific defaults
        function applyStyleDefaults() {
            if (selectedStyle === 'outdoor') {
                document.getElementById('backgroundImage').value = outdoorDefaults.backgroundImage;
                document.getElementById('polaroid1').value = outdoorDefaults.polaroid1;
                document.getElementById('polaroid2').value = outdoorDefaults.polaroid2;
                
                // Show previews
                const bgPreview = document.getElementById('backgroundImagePreview');
                const p1Preview = document.getElementById('polaroid1Preview');
                const p2Preview = document.getElementById('polaroid2Preview');
                
                bgPreview.style.backgroundImage = `url('${outdoorDefaults.backgroundImage}')`;
                bgPreview.classList.add('show');
                p1Preview.style.backgroundImage = `url('${outdoorDefaults.polaroid1}')`;
                p1Preview.classList.add('show');
                p2Preview.style.backgroundImage = `url('${outdoorDefaults.polaroid2}')`;
                p2Preview.classList.add('show');
            }
        }
        
        // Style buttons
        const styleBtns = document.querySelectorAll('.style-btn');
        styleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedStyle = btn.dataset.style;
                updateStyleButtons();
                
                // Apply defaults when style changes (only when adding new event)
                if (!editingEventId) {
                    applyStyleDefaults();
                }
            });
        });
        
        function updateStyleButtons() {
            styleBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.style === selectedStyle);
            });
        }
        
        // Form submission
        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const eventData = {
                id: editingEventId || Date.now(),
                title: document.getElementById('eventTitle').value,
                date: document.getElementById('eventDate').value,
                details: document.getElementById('eventDetails').value,
                backgroundImage: document.getElementById('backgroundImage').value,
                polaroid1: document.getElementById('polaroid1').value,
                polaroid2: document.getElementById('polaroid2').value,
                style: selectedStyle
            };
            
            if (editingEventId) {
                // Update existing event
                const index = events.findIndex(e => e.id === editingEventId);
                if (index !== -1) {
                    events[index] = eventData;
                }
            } else {
                // Add new event
                events.push(eventData);
            }
            
            saveEvents();
            renderEvents();
            closeModalHandler();
        });
        
        // Edit event function (will be called by card buttons)
        window.editEvent = (eventId) => {
            const event = events.find(e => e.id === eventId);
            if (!event) return;
            
            editingEventId = eventId;
            modalTitle.textContent = 'Edit Event';
            selectedStyle = event.style || 'craft';
            
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventDetails').value = event.details;
            document.getElementById('backgroundImage').value = event.backgroundImage;
            document.getElementById('polaroid1').value = event.polaroid1;
            document.getElementById('polaroid2').value = event.polaroid2;
            
            // Show image previews
            const bgPreview = document.getElementById('backgroundImagePreview');
            const p1Preview = document.getElementById('polaroid1Preview');
            const p2Preview = document.getElementById('polaroid2Preview');
            
            if (event.backgroundImage) {
                bgPreview.style.backgroundImage = `url('${event.backgroundImage}')`;
                bgPreview.classList.add('show');
            }
            if (event.polaroid1) {
                p1Preview.style.backgroundImage = `url('${event.polaroid1}')`;
                p1Preview.classList.add('show');
            }
            if (event.polaroid2) {
                p2Preview.style.backgroundImage = `url('${event.polaroid2}')`;
                p2Preview.classList.add('show');
            }
            
            updateStyleButtons();
            adminModal.classList.add('active');
        };
        
        // Delete event function
        window.deleteEvent = (eventId) => {
            if (confirm('Are you sure you want to delete this event?')) {
                events = events.filter(e => e.id !== eventId);
                saveEvents();
                renderEvents();
            }
        };
        
        // Archive event function
        window.archiveEventManual = (eventId) => {
            const event = events.find(e => e.id === eventId);
            if (!event) return;
            
            if (confirm('Archive this event?')) {
                archiveEvent(event);
                events = events.filter(e => e.id !== eventId);
                saveEvents();
                renderEvents();
            }
        };
    }

    // Add admin buttons to cards
    function addAdminButtonsToCards() {
        cards.forEach(card => {
            const eventId = parseInt(card.dataset.eventId);
            
            const buttonsHTML = `
                <div class="card-admin-buttons active">
                    <button class="card-admin-btn edit-btn" onclick="editEvent(${eventId})" title="Edit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="card-admin-btn archive-btn" onclick="archiveEventManual(${eventId})" title="Archive">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="21 8 21 21 3 21 3 8"></polyline>
                            <rect x="1" y="3" width="22" height="5"></rect>
                            <line x1="10" y1="12" x2="14" y2="12"></line>
                        </svg>
                    </button>
                    <button class="card-admin-btn delete-btn" onclick="deleteEvent(${eventId})" title="Delete">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            `;
            
            card.insertAdjacentHTML('afterbegin', buttonsHTML);
        });
    }

    // Initialize
    if (totalCards > 0) {
        updateCardPositions();
    }
});
