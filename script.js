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

        discounts.forEach((item, index) => {
            const percentage = isArabic
                ? (item['discount-percentage-ar'] || item['discount-percentage'])
                : item['discount-percentage'];

            const name = isArabic
                ? (item['discount-name-ar'] || item['discount-name'])
                : item['discount-name'];

            // Priority: link-url column from CSV -> fallback to discount1.html, discount2.html, etc.
            const targetUrl = item['link-url'] || `discount${index + 1}.html`;

            // Create card directly as an anchor tag
            const card = document.createElement('a');
            card.className = 'discount-card';
            card.href = targetUrl;
            card.style.backgroundImage = `url('${item['photo-url']}')`;

            card.innerHTML = `
                <h1>${percentage}</h1>
                <h2>${name}</h2>
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
    // 4. FETCH & RENDER AIRPORT TRANSFERS SLIDER
    // ==========================================
    fetch('inventory/transfers.csv')
        .then(response => {
            if (!response.ok) throw new Error("Unable to load transfers CSV.");
            return response.text();
        })
        .then(csvText => {
            const allTransfers = parseCSV(csvText);
            const activeTransfers = allTransfers.filter(item =>
                item['status']?.toLowerCase() === 'active'
            );

            renderTransfersCards(activeTransfers);
        })
        .catch(error => {
            console.error("Error loading transfers CSV:", error);
        });

    function renderTransfersCards(items) {
        const container = document.querySelector('.transfers-slider-container');
        const slider = document.querySelector('.transfers-slider');
        const section = document.querySelector('.airport-transfers-container');

        if (!slider || !container) return;

        slider.innerHTML = '';

        if (items.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        if (section) section.style.display = 'block';

        items.forEach(item => {
            const type = isArabic ? (item['transfer-type-ar'] || item['transfer-type']) : item['transfer-type'];
            const model = isArabic ? (item['car-model-ar'] || item['car-model']) : item['car-model'];
            const passengers = isArabic ? (item['passengers-count-ar'] || item['passengers-count']) : item['passengers-count'];
            const baggage = isArabic ? (item['baggage-count-ar'] || item['baggage-count']) : item['baggage-count'];
            const imageUrl = item['image-url'];
            const linkUrl = item['link-url'] || 'transfers-search-form.html';

            const card = document.createElement('a');
            card.className = 'transfers-card';
            card.href = linkUrl;

            card.innerHTML = `
                <div class="car-and-text">
                    <div class="transfers-img">
                        <img src="${imageUrl}" oncontextmenu="return false;" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; pointer-events: none;">
                    </div>
                    <h1>${type}</h1>
                    <p>${model}</p>
                </div>
                <div class="passengers-and-baggage">
                    <div class="passengers">
                        <i class="fa-solid fa-user"></i>
                        <p>x ${passengers}</p>
                    </div>
                    <div class="baggage">
                        <i class="fa-solid fa-suitcase-rolling"></i>
                        <p>x ${baggage}</p>
                    </div>
                </div>
            `;

            slider.appendChild(card);
        });

        initSlider(container, slider, '.transfers-card');
    }

    // ==========================================
    // 6. REUSABLE RTL-AWARE SLIDER ENGINE (MANUAL DRAG/SWIPE ONLY)
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