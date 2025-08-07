document.addEventListener('DOMContentLoaded', function() {
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
});