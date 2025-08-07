// Load saved data when page loads
window.addEventListener('load', function() {
    // Load panels
    const savedPanels = JSON.parse(localStorage.getItem('panels')) || [];
    savedPanels.forEach((panelData, index) => {
        const panel = document.querySelectorAll('.panel-container')[index];
        if (panel) {
            panel.querySelector('.panel-background').src = panelData.imageUrl;
            panel.querySelector('.panel-subtitle').textContent = panelData.subtitle;
            panel.querySelector('.panel-title').textContent = panelData.title;
            panel.querySelector('a').href = panelData.link;
        }
    });

    // Load cards
    const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
    savedCards.forEach((cardData, index) => {
        const card = document.querySelectorAll('.card-wrapper')[index];
        if (card) {
            card.querySelector('.card img').src = cardData.imageUrl;
            card.querySelector('.tiny-text').textContent = cardData.category;
            card.querySelector('.slightly-bigger').textContent = cardData.title;
            card.querySelector('.card-link').href = cardData.link;
        }
    });

    // Load news
    const savedNews = JSON.parse(localStorage.getItem('news')) || {};
    if (savedNews.section) {
        document.querySelector('.news-header h2').textContent = savedNews.section.title;
        document.querySelector('.news-link').href = savedNews.section.link;
    }
    if (savedNews.cards) {
        savedNews.cards.forEach((newsCardData, index) => {
            const newsCard = document.querySelectorAll('.news-card')[index];
            if (newsCard) {
                newsCard.querySelector('img').src = newsCardData.imageUrl;
                newsCard.querySelector('.news-meta').textContent = newsCardData.meta;
                newsCard.querySelector('h3').textContent = newsCardData.title;
                newsCard.querySelector('p').textContent = newsCardData.description;
            }
        });
    }
});

// Simplified carousel
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let interval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    function startCarousel() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }
    
    // Event listeners
    document.querySelector('.carousel-arrow.left')?.addEventListener('click', () => {
        clearInterval(interval);
        showSlide(currentIndex - 1);
        startCarousel();
    });
    
    document.querySelector('.carousel-arrow.right')?.addEventListener('click', () => {
        clearInterval(interval);
        nextSlide();
        startCarousel();
    });
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(interval);
            showSlide(i);
            startCarousel();
        });
    });
    
    
    showSlide(0);
    startCarousel();
});

// admin mode
document.addEventListener('DOMContentLoaded', function() {
    // ================= ADMIN MODE =================
    // Admin security configuration
    const ADMIN_PASSWORD = "king";
    const ADMIN_HASH = "admin";
    const ADMIN_SESSION_TIMEOUT = 30; // Minutes
    
    // Admin elements
    const adminToggle = document.getElementById('admin-toggle');
    const adminPanel = document.getElementById('admin-panel');
    
    // Create login form
    const adminLogin = document.createElement('div');
    adminLogin.id = 'admin-login';
    adminLogin.innerHTML = `
        <input type="password" id="admin-password" placeholder="Enter admin password">
        <button id="submit-password">Submit</button>
    `;
    document.body.appendChild(adminLogin);
    
    const adminPasswordInput = document.getElementById('admin-password');
    const submitPassword = document.getElementById('submit-password');
    
    // Hide admin controls by default
    adminToggle.style.display = 'none';
    adminLogin.style.display = 'none';
    adminPanel.style.display = 'none';
    
    // Check for admin hash in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlHash = urlParams.get('admin');
    
    if (urlHash === ADMIN_HASH) {
        adminLogin.style.display = 'block';
        
        // Session timeout function
        let timeout;
        function resetSessionTimeout() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.removeItem('adminAuthenticated');
                adminToggle.style.display = 'none';
                adminLogin.style.display = 'none';
                adminPanel.style.display = 'none';
                alert('Admin session expired. Please log in again.');
            }, ADMIN_SESSION_TIMEOUT * 60 * 1000);
        }
        
        // Check existing session
        if (localStorage.getItem('adminAuthenticated') === 'true') {
            adminLogin.style.display = 'none';
            adminToggle.style.display = 'block';
            resetSessionTimeout();
        }
        
        // Password submission
        submitPassword.addEventListener('click', function() {
            if (adminPasswordInput.value === ADMIN_PASSWORD) {
                localStorage.setItem('adminAuthenticated', 'true');
                adminLogin.style.display = 'none';
                adminToggle.style.display = 'block';
                resetSessionTimeout();
                alert('Admin access granted. Session will expire after ' + ADMIN_SESSION_TIMEOUT + ' minutes of inactivity.');
            } else {
                alert('Incorrect password!');
                adminPasswordInput.value = '';
            }
        });
        
        // Enter key submission
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitPassword.click();
            }
        });
        
        // Admin toggle functionality
        adminToggle.addEventListener('click', function() {
            adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
            if (adminPanel.style.display === 'block') {
                loadAllSavedData();
                resetSessionTimeout();
            }
        });
        
        // Activity tracking for session timeout
        document.addEventListener('mousemove', resetSessionTimeout);
        document.addEventListener('keypress', resetSessionTimeout);
    }

    // ================= FOUR PANEL WINDOW =================
    const panels = document.querySelectorAll('.panel-container');
    panels.forEach(panel => {
        panel.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                panels.forEach(otherPanel => {
                    if (otherPanel !== this) {
                        otherPanel.classList.remove('expanded');
                    }
                });
            }
        });
    });

    // ================= NEWS CARDS =================
    const newsCards = document.querySelectorAll('.news-card');
    let currentCardIndex = 0;
    
    function showNextCard() {
        newsCards[currentCardIndex].classList.remove('active');
        currentCardIndex = (currentCardIndex + 1) % newsCards.length;
        newsCards[currentCardIndex].classList.add('active');
    }


    // auto rate the card
    const newsInterval = setInterval(showNextCard, 5000);
    
    // Manual navigation
    document.querySelectorAll('.news-nav').forEach(button => {
        button.addEventListener('click', function() {
            clearInterval(newsInterval);
            showNextCard();
            newsInterval = setInterval(showNextCard, 5000);
        });
    });

    // Initialize first card
    if (newsCards.length > 0) {
        newsCards[0].classList.add('active');
    }

    // ================= ADMIN DATA LOADING =================
    // Load all saved data
    function loadAllSavedData() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        
        // Load panels
        const savedPanels = JSON.parse(localStorage.getItem('panels')) || [];
        savedPanels.forEach((panelData, index) => {
            const panel = document.querySelectorAll('.panel-container')[index];
            if (panel) {
                panel.querySelector('.panel-background').src = panelData.imageUrl;
                panel.querySelector('.panel-subtitle').textContent = panelData.subtitle;
                panel.querySelector('.panel-title').textContent = panelData.title;
                panel.querySelector('a').href = panelData.link;
            }
        });

        // Load news
        const savedNews = JSON.parse(localStorage.getItem('news')) || {};
        if (savedNews.section) {
            document.querySelector('.news-header h2').textContent = savedNews.section.title;
            document.querySelector('.news-link').href = savedNews.section.link;
        }
        if (savedNews.cards) {
            savedNews.cards.forEach((newsCardData, index) => {
                const newsCard = document.querySelectorAll('.news-card')[index];
                if (newsCard) {
                    newsCard.querySelector('img').src = newsCardData.imageUrl;
                    newsCard.querySelector('.news-meta').textContent = newsCardData.meta;
                    newsCard.querySelector('h3').textContent = newsCardData.title;
                    newsCard.querySelector('p').textContent = newsCardData.description;
                }
            });
        }

        // Load grid data
        loadGridData();
        
        // Load cards data
        loadCardsData();
    }

    // ================= PANEL EDITOR FUNCTIONALITY =================
    const panelEditor = document.getElementById('panel-editor');
    const panelSelect = document.getElementById('panel-select');
    const panelImageUrl = document.getElementById('image-url');
    const panelUploadBtn = document.getElementById('upload-btn');
    const panelImageUpload = document.getElementById('image-upload');
    const panelSubtitle = document.getElementById('panel-subtitle');
    const panelTitle = document.getElementById('panel-title');
    const panelLink = document.getElementById('panel-link');
    const addNewPanelBtn = document.getElementById('add-new-panel');

    // Load panel data
    function loadPanelData(panelIndex) {
        const panels = document.querySelectorAll('.panel-container');
        if (panelIndex >= panels.length) return;
        
        const panel = panels[panelIndex];
        const img = panel.querySelector('.panel-background').src;
        const subtitle = panel.querySelector('.panel-subtitle').textContent;
        const title = panel.querySelector('.panel-title').textContent;
        const link = panel.querySelector('a').href;
        
        panelImageUrl.value = img;
        panelSubtitle.value = subtitle;
        panelTitle.value = title;
        panelLink.value = link;
    }

    // Save panel data
    function savePanelData(panelIndex) {
        const panels = document.querySelectorAll('.panel-container');
        if (panelIndex >= panels.length) return;
        
        const panelData = {
            imageUrl: panelImageUrl.value,
            subtitle: panelSubtitle.value,
            title: panelTitle.value,
            link: panelLink.value
        };
        
        // Save to localStorage
        let savedPanels = JSON.parse(localStorage.getItem('panels')) || [];
        savedPanels[panelIndex] = panelData;
        localStorage.setItem('panels', JSON.stringify(savedPanels));
        
        // Update UI
        updatePanelsFromStorage();
    }

    // Update panels from saved data
    function updatePanelsFromStorage() {
        const savedPanels = JSON.parse(localStorage.getItem('panels')) || [];
        const panels = document.querySelectorAll('.panel-container');
        
        savedPanels.forEach((panelData, index) => {
            if (index < panels.length) {
                const panel = panels[index];
                if (panelData.imageUrl) {
                    panel.querySelector('.panel-background').src = panelData.imageUrl;
                }
                if (panelData.subtitle) {
                    panel.querySelector('.panel-subtitle').textContent = panelData.subtitle;
                }
                if (panelData.title) {
                    panel.querySelector('.panel-title').textContent = panelData.title;
                }
                if (panelData.link) {
                    panel.querySelector('a').href = panelData.link;
                }
            }
        });
    }

    // Panel event listeners
    panelSelect.addEventListener('change', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        loadPanelData(parseInt(this.value));
    });

    panelUploadBtn.addEventListener('click', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        panelImageUpload.click();
    });

    panelImageUpload.addEventListener('change', function(e) {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                panelImageUrl.value = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    panelEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            alert('Please authenticate as admin first');
            return;
        }
        savePanelData(parseInt(panelSelect.value));
    });

    // ================= CARDS EDITOR FUNCTIONALITY =================
    const cardsEditor = document.getElementById('cards-editor');
    const cardSelect = document.getElementById('card-select');
    const cardImageUrl = document.getElementById('card-image-url');
    const cardUploadBtn = document.getElementById('card-upload-btn');
    const cardImageUpload = document.getElementById('card-image-upload');
    const cardCategory = document.getElementById('card-category');
    const cardTitle = document.getElementById('card-title');
    const cardLink = document.getElementById('card-link');
    const addNewCardBtn = document.getElementById('add-new-card');

    // Load cards data
    function loadCardsData() {
        const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
        if (savedCards.length > 0) {
            loadCardData(0);
        }
    }

    // Load specific card data
    function loadCardData(cardIndex) {
        const cards = document.querySelectorAll('.card-wrapper');
        if (cardIndex >= cards.length) return;
        
        const card = cards[cardIndex];
        const img = card.querySelector('.card img').src;
        const category = card.querySelector('.tiny-text').textContent;
        const title = card.querySelector('.slightly-bigger').textContent;
        const link = card.querySelector('.card-link').href;
        
        cardImageUrl.value = img;
        cardCategory.value = category;
        cardTitle.value = title;
        cardLink.value = link;
    }

    // Save card data
    function saveCardData(cardIndex) {
        const cards = document.querySelectorAll('.card-wrapper');
        if (cardIndex >= cards.length) return;
        
        const cardData = {
            imageUrl: cardImageUrl.value,
            category: cardCategory.value,
            title: cardTitle.value,
            link: cardLink.value
        };
        
        // Save to localStorage
        let savedCards = JSON.parse(localStorage.getItem('cards')) || [];
        savedCards[cardIndex] = cardData;
        localStorage.setItem('cards', JSON.stringify(savedCards));
        
        // Update UI
        updateCardsFromStorage();
    }

    // Update cards from saved data
    function updateCardsFromStorage() {
        const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
        const cards = document.querySelectorAll('.card-wrapper');
        
        savedCards.forEach((cardData, index) => {
            if (index < cards.length) {
                const card = cards[index];
                if (cardData.imageUrl) {
                    card.querySelector('.card img').src = cardData.imageUrl;
                }
                if (cardData.category) {
                    card.querySelector('.tiny-text').textContent = cardData.category;
                }
                if (cardData.title) {
                    card.querySelector('.slightly-bigger').textContent = cardData.title;
                }
                if (cardData.link) {
                    card.querySelector('.card-link').href = cardData.link;
                }
            }
        });
    }

    // Cards event listeners
    cardSelect.addEventListener('change', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        loadCardData(parseInt(this.value));
    });

    cardUploadBtn.addEventListener('click', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        cardImageUpload.click();
    });

    cardImageUpload.addEventListener('change', function(e) {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                cardImageUrl.value = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    cardsEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            alert('Please authenticate as admin first');
            return;
        }
        saveCardData(parseInt(cardSelect.value));
    });

    // ================= NEWS EDITOR FUNCTIONALITY =================
    const newsEditor = document.getElementById('news-editor');
    const newsSectionTitle = document.getElementById('news-section-title');
    const newsSectionLink = document.getElementById('news-section-link');
    const newsCardSelect = document.getElementById('news-card-select');
    const newsImageUrl = document.getElementById('news-image-url');
    const newsUploadBtn = document.getElementById('news-upload-btn');
    const newsImageUpload = document.getElementById('news-image-upload');
    const newsMeta = document.getElementById('news-meta');
    const newsTitle = document.getElementById('news-title');
    const newsDescription = document.getElementById('news-description');

    // Load news data
    function loadNewsSectionData() {
        const savedNews = JSON.parse(localStorage.getItem('news')) || {};
        if (savedNews.section) {
            newsSectionTitle.value = savedNews.section.title;
            newsSectionLink.value = savedNews.section.link;
        }
    }

    // Load specific news card data
    function loadNewsCardData(cardIndex) {
        const newsCards = document.querySelectorAll('.news-card');
        if (cardIndex >= newsCards.length) return;
        
        const card = newsCards[cardIndex];
        const img = card.querySelector('img').src;
        const meta = card.querySelector('.news-meta').textContent;
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        
        newsImageUrl.value = img;
        newsMeta.value = meta;
        newsTitle.value = title;
        newsDescription.value = description;
    }

    // Save news data
    function saveNewsData() {
        const savedNews = JSON.parse(localStorage.getItem('news')) || {};
        
        // Save section data
        savedNews.section = {
            title: newsSectionTitle.value,
            link: newsSectionLink.value
        };
        
        // Save card data if editing
        const cardIndex = parseInt(newsCardSelect.value);
        if (!savedNews.cards) savedNews.cards = [];
        
        savedNews.cards[cardIndex] = {
            imageUrl: newsImageUrl.value,
            meta: newsMeta.value,
            title: newsTitle.value,
            description: newsDescription.value
        };
        
        localStorage.setItem('news', JSON.stringify(savedNews));
        updateNewsFromStorage();
    }

    // Update news from saved data
    function updateNewsFromStorage() {
        const savedNews = JSON.parse(localStorage.getItem('news')) || {};
        
        if (savedNews.section) {
            document.querySelector('.news-header h2').textContent = savedNews.section.title;
            document.querySelector('.news-link').href = savedNews.section.link;
        }
        
        if (savedNews.cards) {
            savedNews.cards.forEach((newsCardData, index) => {
                const newsCard = document.querySelectorAll('.news-card')[index];
                if (newsCard) {
                    if (newsCardData.imageUrl) newsCard.querySelector('img').src = newsCardData.imageUrl;
                    if (newsCardData.meta) newsCard.querySelector('.news-meta').textContent = newsCardData.meta;
                    if (newsCardData.title) newsCard.querySelector('h3').textContent = newsCardData.title;
                    if (newsCardData.description) newsCard.querySelector('p').textContent = newsCardData.description;
                }
            });
        }
    }

    // News event listeners
    newsCardSelect.addEventListener('change', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        loadNewsCardData(parseInt(this.value));
    });

    newsUploadBtn.addEventListener('click', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        newsImageUpload.click();
    });

    newsImageUpload.addEventListener('change', function(e) {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                newsImageUrl.value = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    newsEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            alert('Please authenticate as admin first');
            return;
        }
        saveNewsData();
    });

    // ================= BOTTOM GRID ADMIN FUNCTIONALITY =================
    const gridEditor = document.getElementById('grid-editor');
    const gridSelect = document.getElementById('grid-select');
    const gridImageUrl = document.getElementById('grid-image-url');
    const gridUploadBtn = document.getElementById('grid-upload-btn');
    const gridImageUpload = document.getElementById('grid-image-upload');
    const gridTitle = document.getElementById('grid-title');
    const gridLink = document.getElementById('grid-link');

    // Load grid data
    function loadGridData() {
        const savedGrid = JSON.parse(localStorage.getItem('bottomGrid')) || [];
        if (savedGrid.length > 0) {
            loadGridBoxData(0);
        }
    }

    // Load specific box data
    function loadGridBoxData(boxIndex) {
        const boxes = document.querySelectorAll('.bottom-grid-box');
        if (boxIndex >= boxes.length) return;
        
        const box = boxes[boxIndex];
        const img = box.querySelector('img').src;
        const title = box.querySelector('.box-overlay h3').textContent;
        const link = box.querySelector('a').href;
        
        gridImageUrl.value = img;
        gridTitle.value = title;
        gridLink.value = link;
    }

    // Save grid data
    function saveGridBoxData(boxIndex) {
        const boxes = document.querySelectorAll('.bottom-grid-box');
        if (boxIndex >= boxes.length) return;
        
        const boxData = {
            imageUrl: gridImageUrl.value,
            title: gridTitle.value,
            link: gridLink.value
        };
        
        // Save to localStorage
        let savedGrid = JSON.parse(localStorage.getItem('bottomGrid')) || [];
        savedGrid[boxIndex] = boxData;
        localStorage.setItem('bottomGrid', JSON.stringify(savedGrid));
        
        // Update UI
        updateGridFromStorage();
    }

    // Update grid from saved data
    function updateGridFromStorage() {
        const savedGrid = JSON.parse(localStorage.getItem('bottomGrid')) || [];
        const boxes = document.querySelectorAll('.bottom-grid-box');
        
        savedGrid.forEach((boxData, index) => {
            if (index < boxes.length) {
                const box = boxes[index];
                if (boxData.imageUrl) {
                    box.querySelector('img').src = boxData.imageUrl;
                }
                if (boxData.title) {
                    box.querySelector('.box-overlay h3').textContent = boxData.title;
                }
                if (boxData.link) {
                    box.querySelector('a').href = boxData.link;
                }
            }
        });
    }

    // Grid event listeners
    gridSelect.addEventListener('change', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        loadGridBoxData(parseInt(this.value));
    });

    gridUploadBtn.addEventListener('click', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        gridImageUpload.click();
    });

    gridImageUpload.addEventListener('change', function(e) {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                gridImageUrl.value = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    gridEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            alert('Please authenticate as admin first');
            return;
        }
        saveGridBoxData(parseInt(gridSelect.value));
    });

    // ================= CAROUSEL FUNCTIONALITY =================
    const carouselEditor = document.getElementById('carousel-editor');
    const carouselSelect = document.getElementById('carousel-select');
    const carouselImageUrl = document.getElementById('carousel-image-url');
    const carouselUploadBtn = document.getElementById('carousel-upload-btn');
    const carouselImageUpload = document.getElementById('carousel-image-upload');
    const carouselTitle = document.getElementById('carousel-title');
    const carouselDescription = document.getElementById('carousel-description');
    const carouselButton1Text = document.getElementById('carousel-button1-text');
    const carouselButton1Url = document.getElementById('carousel-button1-url');
    const carouselButton2Text = document.getElementById('carousel-button2-text');
    const carouselButton2Url = document.getElementById('carousel-button2-url');
    const addNewSlideBtn = document.getElementById('add-new-slide');

    // Load carousel data
    function loadCarouselData() {
        const savedCarousel = JSON.parse(localStorage.getItem('carousel')) || [];
        if (savedCarousel.length > 0) {
            loadCarouselSlideData(0);
        }
    }

    // Load specific slide data
    function loadCarouselSlideData(slideIndex) {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slideIndex >= slides.length) return;
        
        const slide = slides[slideIndex];
        const img = slide.querySelector('img').src;
        const title = slide.querySelector('h1')?.textContent || '';
        const description = slide.querySelector('p')?.textContent || '';
        const buttons = slide.querySelectorAll('.carousel-buttons button');
        
        carouselImageUrl.value = img;
        carouselTitle.value = title;
        carouselDescription.value = description;
        
        if (buttons.length > 0) {
            carouselButton1Text.value = buttons[0]?.textContent || '';
            carouselButton1Url.value = buttons[0]?.getAttribute('onclick')?.replace("window.location.href=", "").replace(/'/g, "") || '';
            
            if (buttons.length > 1) {
                carouselButton2Text.value = buttons[1]?.textContent || '';
                carouselButton2Url.value = buttons[1]?.getAttribute('onclick')?.replace("window.location.href=", "").replace(/'/g, "") || '';
            } else {
                carouselButton2Text.value = '';
                carouselButton2Url.value = '';
            }
        } else {
            carouselButton1Text.value = '';
            carouselButton1Url.value = '';
            carouselButton2Text.value = '';
            carouselButton2Url.value = '';
        }
    }

    // Save carousel data
    function saveCarouselSlideData(slideIndex) {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slideIndex >= slides.length) return;
        
        const slideData = {
            imageUrl: carouselImageUrl.value,
            title: carouselTitle.value,
            description: carouselDescription.value,
            button1: {
                text: carouselButton1Text.value,
                url: carouselButton1Url.value
            },
            button2: {
                text: carouselButton2Text.value,
                url: carouselButton2Url.value
            }
        };
        
        // Save to localStorage
        let savedCarousel = JSON.parse(localStorage.getItem('carousel')) || [];
        savedCarousel[slideIndex] = slideData;
        localStorage.setItem('carousel', JSON.stringify(savedCarousel));
        
        // Update UI
        updateCarouselFromStorage();
    }

    // Update carousel from saved data
    function updateCarouselFromStorage() {
        const savedCarousel = JSON.parse(localStorage.getItem('carousel')) || [];
        const slides = document.querySelectorAll('.carousel-slide');
        
        savedCarousel.forEach((slideData, index) => {
            if (index < slides.length) {
                const slide = slides[index];
                if (slideData.imageUrl) {
                    slide.querySelector('img').src = slideData.imageUrl;
                }
                if (slideData.title) {
                    const titleEl = slide.querySelector('h1');
                    if (titleEl) titleEl.textContent = slideData.title;
                }
                if (slideData.description) {
                    const descEl = slide.querySelector('p');
                    if (descEl) descEl.textContent = slideData.description;
                }
                
                // Update buttons
                const buttonsContainer = slide.querySelector('.carousel-buttons');
                if (buttonsContainer) {
                    buttonsContainer.innerHTML = '';
                    
                    if (slideData.button1 && slideData.button1.text && slideData.button1.url) {
                        const button1 = document.createElement('button');
                        button1.textContent = slideData.button1.text;
                        button1.setAttribute('onclick', `window.location.href='${slideData.button1.url}'`);
                        buttonsContainer.appendChild(button1);
                    }
                    
                    if (slideData.button2 && slideData.button2.text && slideData.button2.url) {
                        const button2 = document.createElement('button');
                        button2.textContent = slideData.button2.text;
                        button2.setAttribute('onclick', `window.location.href='${slideData.button2.url}'`);
                        buttonsContainer.appendChild(button2);
                    }
                }
            }
        });
    }

    // Carousel event listeners
    carouselSelect.addEventListener('change', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        loadCarouselSlideData(parseInt(this.value));
    });

    carouselUploadBtn.addEventListener('click', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        carouselImageUpload.click();
    });

    carouselImageUpload.addEventListener('change', function(e) {
        if (localStorage.getItem('adminAuthenticated') !== 'true') return;
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                carouselImageUrl.value = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    carouselEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            alert('Please authenticate as admin first');
            return;
        }
        saveCarouselSlideData(parseInt(carouselSelect.value));
    });

    // ================= RESET FUNCTIONALITY =================
    const resetAllBtn = document.getElementById('reset-all');
    resetAllBtn.addEventListener('click', function() {
        if (localStorage.getItem('adminAuthenticated') !== 'true') {
            alert('Please authenticate as admin first');
            return;
        }
        
        if (confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
            localStorage.removeItem('panels');
            localStorage.removeItem('cards');
            localStorage.removeItem('news');
            localStorage.removeItem('bottomGrid');
            localStorage.removeItem('carousel');
            location.reload();
        }
    });

    // ================= HAMBURGER MENU =================
    const hamburger = document.querySelector('.hamburger-menu');
    const slidingPage = document.querySelector('.main-sliding-page');
    const closeBtn = document.querySelector('.close-slider');
    
    if (hamburger && slidingPage && closeBtn) {
        // Toggle sliding page
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            slidingPage.classList.toggle('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close sliding page
        closeBtn.addEventListener('click', function() {
            slidingPage.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!slidingPage.contains(e.target) && !hamburger.contains(e.target)) {
                slidingPage.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ================= CAROUSEL ANIMATION =================
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let interval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    function startCarousel() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }
    
    // Event listeners
    document.querySelector('.carousel-arrow.left')?.addEventListener('click', () => {
        clearInterval(interval);
        showSlide(currentIndex - 1);
        startCarousel();
    });
    
    document.querySelector('.carousel-arrow.right')?.addEventListener('click', () => {
        clearInterval(interval);
        nextSlide();
        startCarousel();
    });
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(interval);
            showSlide(i);
            startCarousel();
        });
    });
    
    showSlide(0);
    startCarousel();

    // ================= INITIAL LOAD =================
    // Load all data from localStorage when page loads
    window.addEventListener('load', function() {
        // Load panels
        const savedPanels = JSON.parse(localStorage.getItem('panels')) || [];
        savedPanels.forEach((panelData, index) => {
            const panel = document.querySelectorAll('.panel-container')[index];
            if (panel) {
                panel.querySelector('.panel-background').src = panelData.imageUrl;
                panel.querySelector('.panel-subtitle').textContent = panelData.subtitle;
                panel.querySelector('.panel-title').textContent = panelData.title;
                panel.querySelector('a').href = panelData.link;
            }
        });

        // Load cards
        const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
        savedCards.forEach((cardData, index) => {
            const card = document.querySelectorAll('.card-wrapper')[index];
            if (card) {
                card.querySelector('.card img').src = cardData.imageUrl;
                card.querySelector('.tiny-text').textContent = cardData.category;
                card.querySelector('.slightly-bigger').textContent = cardData.title;
                card.querySelector('.card-link').href = cardData.link;
            }
        });

        // Load news
        const savedNews = JSON.parse(localStorage.getItem('news')) || {};
        if (savedNews.section) {
            document.querySelector('.news-header h2').textContent = savedNews.section.title;
            document.querySelector('.news-link').href = savedNews.section.link;
        }
        if (savedNews.cards) {
            savedNews.cards.forEach((newsCardData, index) => {
                const newsCard = document.querySelectorAll('.news-card')[index];
                if (newsCard) {
                    newsCard.querySelector('img').src = newsCardData.imageUrl;
                    newsCard.querySelector('.news-meta').textContent = newsCardData.meta;
                    newsCard.querySelector('h3').textContent = newsCardData.title;
                    newsCard.querySelector('p').textContent = newsCardData.description;
                }
            });
        }

        // Load grid
        const savedGrid = JSON.parse(localStorage.getItem('bottomGrid')) || [];
        savedGrid.forEach((boxData, index) => {
            const box = document.querySelectorAll('.bottom-grid-box')[index];
            if (box) {
                if (boxData.imageUrl) box.querySelector('img').src = boxData.imageUrl;
                if (boxData.title) box.querySelector('.box-overlay h3').textContent = boxData.title;
                if (boxData.link) box.querySelector('a').href = boxData.link;
            }
        });

        // Load carousel
        const savedCarousel = JSON.parse(localStorage.getItem('carousel')) || [];
        savedCarousel.forEach((slideData, index) => {
            const slide = document.querySelectorAll('.carousel-slide')[index];
            if (slide) {
                if (slideData.imageUrl) slide.querySelector('img').src = slideData.imageUrl;
                if (slideData.title) {
                    const titleEl = slide.querySelector('h1');
                    if (titleEl) titleEl.textContent = slideData.title;
                }
                if (slideData.description) {
                    const descEl = slide.querySelector('p');
                    if (descEl) descEl.textContent = slideData.description;
                }
                
                const buttonsContainer = slide.querySelector('.carousel-buttons');
                if (buttonsContainer) {
                    buttonsContainer.innerHTML = '';
                    
                    if (slideData.button1 && slideData.button1.text && slideData.button1.url) {
                        const button1 = document.createElement('button');
                        button1.textContent = slideData.button1.text;
                        button1.setAttribute('onclick', `window.location.href='${slideData.button1.url}'`);
                        buttonsContainer.appendChild(button1);
                    }
                    
                    if (slideData.button2 && slideData.button2.text && slideData.button2.url) {
                        const button2 = document.createElement('button');
                        button2.textContent = slideData.button2.text;
                        button2.setAttribute('onclick', `window.location.href='${slideData.button2.url}'`);
                        buttonsContainer.appendChild(button2);
                    }
                }
            }
        });
    });
});

// Prevent image drag
document.querySelectorAll('.slide-image').forEach(image => {
    image.addEventListener('dragstart', (e) => e.preventDefault());
});

// Add admin login styles
const style = document.createElement('style');
style.textContent = `
#admin-login {
    position: fixed;
    bottom: 70px;
    right: 20px;
    background: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    z-index: 10000;
}

#admin-login input {
    padding: 8px;
    margin-right: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#admin-login button {
    padding: 8px 12px;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#admin-login button:hover {
    background: #3498db;
}
`;

document.head.appendChild(style);

// Load saved data when page loads
window.addEventListener('load', function() {
    // Load panels
    const savedPanels = JSON.parse(localStorage.getItem('panels')) || [];
    savedPanels.forEach((panelData, index) => {
        const panel = document.querySelectorAll('.panel-container')[index];
        if (panel) {
            panel.querySelector('.panel-background').src = panelData.imageUrl;
            panel.querySelector('.panel-subtitle').textContent = panelData.subtitle;
            panel.querySelector('.panel-title').textContent = panelData.title;
            panel.querySelector('a').href = panelData.link;
        }
    });

    // Load news
    const savedNews = JSON.parse(localStorage.getItem('news')) || {};
    if (savedNews.section) {
        document.querySelector('.news-header h2').textContent = savedNews.section.title;
        document.querySelector('.news-link').href = savedNews.section.link;
    }
    if (savedNews.cards) {
        savedNews.cards.forEach((newsCardData, index) => {
            const newsCard = document.querySelectorAll('.news-card')[index];
            if (newsCard) {
                newsCard.querySelector('img').src = newsCardData.imageUrl;
                newsCard.querySelector('.news-meta').textContent = newsCardData.meta;
                newsCard.querySelector('h3').textContent = newsCardData.title;
                newsCard.querySelector('p').textContent = newsCardData.description;
            }
        });
    }
});

// Prevent image drag
document.querySelectorAll('.slide-image').forEach(image => {
    image.addEventListener('dragstart', (e) => e.preventDefault());
});

