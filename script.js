document.addEventListener("DOMContentLoaded", () => {
    // 1. Reusable CSV Parser Function
    function parseCSV(text) {
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const row = {};

            headers.forEach((header, index) => {
                let val = values[index] ? values[index].trim() : '';
                val = val.replace(/^"|"$/g, '');
                row[header] = val;
            });
            data.push(row);
        }
        return data;
    }

    // Detect language setting (<html lang="ar">)
    const isArabic = document.documentElement.lang?.toLowerCase().startsWith('ar');

    // ==========================================
    // 2. FETCH & RENDER DISCOUNTS SLIDER
    // ==========================================
    fetch('inventory/discounts.csv')
        .then(response => {
            if (!response.ok) throw new Error("Unable to load discounts CSV.");
            return response.text();
        })
        .then(csvText => {
            const allDiscounts = parseCSV(csvText);
            const activeDiscounts = allDiscounts.filter(item =>
                item['status']?.toLowerCase() === 'active' || item['discount-status']?.toLowerCase() === 'active'
            );

            renderDiscountCards(activeDiscounts);
        })
        .catch(error => {
            console.error("Error loading discounts CSV:", error);
        });

    function renderDiscountCards(discounts) {
        const container = document.querySelector('.discounts-slider-container');
        const slider = document.querySelector('.discounts-slider');
        const discountsSection = document.querySelector('.discounts');

        if (!slider || !container) return;

        slider.innerHTML = '';

        if (discounts.length === 0) {
            if (discountsSection) discountsSection.style.display = 'none';
            return;
        }

        if (discountsSection) discountsSection.style.display = 'block';

        const buttonText = isArabic ? 'احجز الخصم' : 'Claim Discount';

        discounts.forEach(item => {
            const percentage = isArabic
                ? (item['discount-percentage-ar'] || item['discount-percentage'])
                : item['discount-percentage'];

            const name = isArabic
                ? (item['discount-name-ar'] || item['discount-name'])
                : item['discount-name'];

            const card = document.createElement('div');
            card.className = 'discount-card';
            card.style.backgroundImage = `url('${item['photo-url']}')`;

            card.innerHTML = `
                <h1>${percentage}</h1>
                <h2>${name}</h2>
                <a href="https://wa.me/201097000139" target="_blank" rel="noopener noreferrer" class="discount-button">
                     ${buttonText}
                </a>
            `;

            slider.appendChild(card);
        });

        initSlider(container, slider, '.discount-card');
    }

    // ==========================================
    // 3. FETCH & RENDER BUCKET LIST SLIDER
    // ==========================================
    fetch('inventory/bucket-list.csv')
        .then(response => {
            if (!response.ok) throw new Error("Unable to load bucket list CSV.");
            return response.text();
        })
        .then(csvText => {
            const allBucketItems = parseCSV(csvText);
            const activeBucketItems = allBucketItems.filter(item =>
                item['status']?.toLowerCase() === 'active'
            );

            renderBucketListCards(activeBucketItems);
        })
        .catch(error => {
            console.error("Error loading bucket list CSV:", error);
        });

    function renderBucketListCards(items) {
        const container = document.querySelector('.bucket-list-slider-container');
        const slider = document.querySelector('.bucket-list-slider');
        const section = document.querySelector('.bucket-list-container');

        if (!slider || !container) return;

        slider.innerHTML = '';

        if (items.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        if (section) section.style.display = 'block';

        const hotelsLabel = isArabic ? 'فنادق' : 'Hotels';
        const activitiesLabel = isArabic ? 'أنشطة' : 'Activities';
        const flightsLabel = isArabic ? 'طيران' : 'Flights';

        items.forEach(item => {
            const title = isArabic
                ? (item['title-ar'] || item['title'])
                : item['title'];

            const subtitle = isArabic
                ? (item['subtitle-ar'] || item['subtitle'])
                : item['subtitle'];

            const card = document.createElement('div');
            card.className = 'destination-card';
            card.style.backgroundImage = `url('${item['photo-url']}')`;

            card.innerHTML = `
                <h1>${title}</h1>
                <p>${subtitle}</p>
                <div class="icons">
                    <a href="accommodations-search-form.html">
                        <div class="hotels">
                            <i class="fa-solid fa-bed"></i>
                            <h1>${hotelsLabel}</h1>
                        </div>
                    </a>
                    <a href="activities-search-form.html">
                        <div class="activities">
                            <i class="fa-solid fa-person-hiking"></i>
                            <h1>${activitiesLabel}</h1>
                        </div>
                    </a>
                    <a href="flights-search-form.html">
                        <div class="flights">
                            <i class="fa-solid fa-plane-up"></i>
                            <h1>${flightsLabel}</h1>
                        </div>
                    </a>
                </div>
            `;

            slider.appendChild(card);
        });

        initSlider(container, slider, '.destination-card');
    }

    // ==========================================
    // 4. FETCH & RENDER WORTH A SHOT SLIDER
    // ==========================================
    fetch('inventory/worth-a-shot.csv')
        .then(response => {
            if (!response.ok) throw new Error("Unable to load worth-a-shot CSV.");
            return response.text();
        })
        .then(csvText => {
            const allItems = parseCSV(csvText);
            const activeItems = allItems.filter(item =>
                item['status']?.toLowerCase() === 'active'
            );

            renderWorthAShotCards(activeItems);
        })
        .catch(error => {
            console.error("Error loading worth-a-shot CSV:", error);
        });

    function renderWorthAShotCards(items) {
        const container = document.querySelector('.worth-a-shot-slider-container');
        const slider = document.querySelector('.worth-a-shot-slider');
        const section = document.querySelector('.worth-a-shot-container');

        if (!slider || !container) return;

        slider.innerHTML = '';

        if (items.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        if (section) section.style.display = 'block';

        const buttonText = isArabic ? 'عرض تفاصيل النشاط' : 'View Activity Details';

        items.forEach(item => {
            const title = isArabic ? (item['title-ar'] || item['title']) : item['title'];
            const location = isArabic ? (item['location-ar'] || item['location']) : item['location'];
            const rating = isArabic ? (item['rating-ar'] || item['rating']) : item['rating'];
            const duration = isArabic ? (item['duration-ar'] || item['duration']) : item['duration'];
            const feature1 = isArabic ? (item['feature1-ar'] || item['feature1']) : item['feature1'];
            const feature2 = isArabic ? (item['feature2-ar'] || item['feature2']) : item['feature2'];
            const reviewsCount = isArabic ? (item['reviews-count-ar'] || item['reviews-count']) : item['reviews-count'];

            const card = document.createElement('div');
            card.className = 'worth-a-shot-card';
            card.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 40%), url('${item['photo-url']}')`;

            card.innerHTML = `
                <div class="top">
                    <div class="activity-name-and-star-rating">
                        <div class="activity-name-and-location">
                            <h1>${title}</h1>
                            <div class="city-and-country">
                                <i class="fa-solid fa-location-dot"></i>
                                <p>${location}</p>
                            </div>
                        </div>
                        <div class="star-rating-and-reviews-count">
                            <div class="star-rating">
                                <i class="fa-solid fa-star"></i>
                                <p>${rating || '5.0'}</p>
                            </div>
                            <div class="reviews-count">
                                <p>${reviewsCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bottom">
                    <div class="bottom-container">
                        <div class="bottom-icons">
                            <div class="bottom icon1">
                                <i class="fa-solid fa-stopwatch"></i>
                                <p>${duration}</p>
                            </div>
                            <div class="icon2">
                                <i class="fa-solid fa-utensils"></i>
                                <p>${feature1}</p>
                            </div>
                            <div class="icon3">
                                <i class="fa-solid fa-language"></i>
                                <p>${feature2}</p>
                            </div>
                        </div>
                        <a href="${item['link-url'] || 'activities-search-form.html'}">
                            <button class="activity-button">${buttonText}</button>
                        </a>
                    </div>
                </div>
            `;

            slider.appendChild(card);
        });

        initSlider(container, slider, '.worth-a-shot-card');
    }

    // ==========================================
    // 5. REUSABLE RTL-AWARE SLIDER ENGINE (MANUAL DRAG/SWIPE ONLY)
    // ==========================================
    function initSlider(container, slider, cardSelector) {
        const cards = slider.querySelectorAll(cardSelector);
        if (cards.length <= 1) return;

        let currentIndex = 0;
        const totalCards = cards.length;

        const isRTL = document.documentElement.dir === 'rtl' || getComputedStyle(document.body).direction === 'rtl';

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        function goToSlide(index) {
            currentIndex = index;
            slider.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            const offset = isRTL ? (currentIndex * 100) : (-currentIndex * 100);
            slider.style.transform = `translateX(${offset}%)`;
        }

        function handleDragStart(e) {
            isDragging = true;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            currentX = startX;
            slider.style.transition = 'none';
        }

        function handleDragMove(e) {
            if (!isDragging) return;

            currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const diffX = currentX - startX;
            const containerWidth = container.offsetWidth;

            const currentOffset = isRTL ? (currentIndex * containerWidth) : (-currentIndex * containerWidth);
            const dragOffset = currentOffset + diffX;

            slider.style.transform = `translateX(${dragOffset}px)`;
        }

        function handleDragEnd() {
            if (!isDragging) return;
            isDragging = false;

            const diffX = currentX - startX;
            const threshold = container.offsetWidth * 0.2;

            if (isRTL) {
                if (diffX > threshold && currentIndex < totalCards - 1) {
                    currentIndex++;
                } else if (diffX < -threshold && currentIndex > 0) {
                    currentIndex--;
                }
            } else {
                if (diffX < -threshold && currentIndex < totalCards - 1) {
                    currentIndex++;
                } else if (diffX > threshold && currentIndex > 0) {
                    currentIndex--;
                }
            }

            goToSlide(currentIndex);
        }

        container.addEventListener('touchstart', handleDragStart, { passive: true });
        container.addEventListener('touchmove', handleDragMove, { passive: true });
        container.addEventListener('touchend', handleDragEnd);

        container.addEventListener('mousedown', handleDragStart);
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
    }
});