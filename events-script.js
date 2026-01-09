document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.event-card-full'));
    const leftArrow = document.querySelector('.nav-arrow-left');
    const rightArrow = document.querySelector('.nav-arrow-right');
    let currentIndex = 0;
    const totalCards = cards.length;

    // Initialize card positions
    function updateCardPositions() {
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
    }

    // Navigate to next card
    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCardPositions();
    }

    // Navigate to previous card
    function prevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCardPositions();
    }

    // Event listeners
    rightArrow.addEventListener('click', nextCard);
    leftArrow.addEventListener('click', prevCard);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextCard();
        } else if (e.key === 'ArrowLeft') {
            prevCard();
        }
    });

    // Click on stacked cards to bring forward
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const position = card.getAttribute('data-position');
            if (position !== '0') {
                // Calculate how many steps to reach this card
                const targetIndex = parseInt(card.getAttribute('data-index'));
                currentIndex = targetIndex;
                updateCardPositions();
            }
        });
    });

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
            // Swiped left
            nextCard();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right
            prevCard();
        }
    }

    // Initialize
    updateCardPositions();
});
