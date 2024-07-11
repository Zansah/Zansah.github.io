document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const slideMenu = document.getElementById("slideMenu");
    const closeButton = document.getElementById("closeButton");
    const mainButton = document.getElementById("mainButton");
    const expandedButtons = document.getElementById("expandedButtons");
    const toggleButton = document.getElementById("toggleButton");
    const body = document.body;
    const carouselInner = document.querySelector('.carousel-inner');
    const indicators = document.querySelectorAll('.indicator');

    const navigateCarousel = (index) => {
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    };
document.addEventListener("DOMContentLoaded", function() {
    const slidingElement = document.querySelector(".sliding-element");

    document.querySelector(".fa-bars").addEventListener("click", function() {
        slidingElement.classList.toggle("active");
    });
});
    

    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            navigateCarousel(index);
        });
    });

    hamburger.addEventListener("click", function() {
        slideMenu.style.top = "0";
    });

    closeButton.addEventListener("click", function() {
        slideMenu.style.top = "-100%";
    });

    mainButton.addEventListener("click", function() {
        expandedButtons.classList.toggle("active");
    });

    toggleButton.addEventListener("click", function() {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            toggleButton.classList.remove("dark-mode");
            toggleButton.classList.add("light-mode");
        } else {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            toggleButton.classList.remove("light-mode");
            toggleButton.classList.add("dark-mode");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('header');
    const body = document.body;
    
    
    const handleScroll = () => {
        if (window.scrollY === 0) {
            header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
    };

    
    window.addEventListener('scroll', handleScroll);

   
    handleScroll();

    
});

let scrollAmount = 0;
const grid = document.querySelector('.grid');
const container = document.querySelector('.container');
const cardWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card_width'));
const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap'));

function slide(direction) {
    const maxScroll = grid.scrollWidth - container.clientWidth;
    const containerWidth = container.clientWidth;
    const numCardsInView = Math.floor(containerWidth / (cardWidth + gap));

    if (direction === 'left') {
        scrollAmount = Math.max(scrollAmount - (cardWidth + gap) * numCardsInView, 0);
    } else if (direction === 'right') {
        scrollAmount = Math.min(scrollAmount + (cardWidth + gap) * numCardsInView, maxScroll);
    }

    grid.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function updateGridSize() {
    const containerWidth = container.clientWidth;
    const numCardsInView = Math.floor(containerWidth / (cardWidth + gap));
    const newGridWidth = (cardWidth + gap) * numCardsInView - gap; 
    grid.style.width = `${newGridWidth}px`;
}

window.addEventListener('resize', updateGridSize);
updateGridSize();

function loadContent(page) {
    const displayBox = document.getElementById('displayBox');

    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            displayBox.innerHTML = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            displayBox.innerHTML = '<p>Sorry, an error occurred while loading the content.</p>';
        });
}





