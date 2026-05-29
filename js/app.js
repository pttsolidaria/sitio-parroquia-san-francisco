/* GLOBAL APPLICATION LOGIC - PARROQUIA SAN FRANCISCO DE ASÍS */

document.addEventListener("DOMContentLoaded", () => {
    // 1. MOBILE MENU NAVIGATION
    const navToggle = document.getElementById("nav-toggle");
    const mobileOverlay = document.getElementById("mobile-menu-overlay");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    
    if (navToggle && mobileOverlay) {
        navToggle.addEventListener("click", () => {
            const isOpen = mobileOverlay.classList.toggle("open");
            
            // Toggle hamburger icon animation
            const spans = navToggle.querySelectorAll("span");
            if (isOpen) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });
        
        // Close menu on click of any mobile link
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileOverlay.classList.remove("open");
                const spans = navToggle.querySelectorAll("span");
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            });
        });
    }

    // 2. TAB SYSTEM HANDLERS
    const tabSelectors = document.querySelectorAll("[data-tab-target]");
    tabSelectors.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-tab-target");
            const targetContent = document.getElementById(targetId);
            const parent = tab.closest(".tabs-parent") || document;
            
            // Remove active classes in parent context
            parent.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
            parent.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
            
            // Activate selected
            tab.classList.add("active");
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });

    // 3. MODAL POPUP SYSTEM
    const modalTrigger = document.querySelectorAll("[data-modal-open]");
    const modalClose = document.querySelectorAll(".modal-close-btn");
    const modals = document.querySelectorAll(".modal-overlay");
    
    modalTrigger.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute("data-modal-open");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add("open");
                document.body.style.overflow = "hidden"; // Lock scroll
            }
        });
    });
    
    modalClose.forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            closeAllModals();
        });
    });
    
    // Close modal on background click
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Close modal on Escape key press
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });
    
    function closeAllModals() {
        modals.forEach(modal => modal.classList.remove("open"));
        document.body.style.overflow = ""; // Restore scroll
    }

    // 4. DYNAMIC PASTORS & SERVICES SEARCH FILTER
    const searchInput = document.getElementById("pastoral-search");
    const filterableCards = document.querySelectorAll("[data-searchable]");
    
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            filterableCards.forEach(card => {
                const keywords = card.getAttribute("data-search-keywords").toLowerCase();
                const cardTitle = card.querySelector(".card-title") ? card.querySelector(".card-title").textContent.toLowerCase() : "";
                const cardDesc = card.querySelector(".card-desc") ? card.querySelector(".card-desc").textContent.toLowerCase() : "";
                
                const matches = keywords.includes(query) || cardTitle.includes(query) || cardDesc.includes(query);
                
                if (matches || query === "") {
                    card.style.display = "";
                    card.style.animation = "fadeIn 0.3s ease forwards";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // 5. CONTACT FORM TO WHATSAPP REDIRECT ENGINE
    const contactForm = document.getElementById("parish-contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const subject = document.getElementById("contact-subject").value;
            const message = document.getElementById("contact-message").value.trim();
            
            // Build standard Chilean Parish Secretariat WhatsApp Number (Mock/Example)
            // Replace with actual parish office number
            const phone = "56988595892"; 
            
            const whatsappText = `*Consulta Parroquia San Francisco — Temuco*
            
*Nombre:* ${name}
*Email:* ${email}
*Asunto:* ${subject}

*Mensaje:*
${message}`;
            
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
            
            // Open in new tab
            window.open(whatsappUrl, "_blank");
            
            // Reset form & close parent modal if open
            contactForm.reset();
            closeAllModals();
        });
    }

    // 6. INTERACTIVE INSTAGRAM POST WIDGET
    const instaLikeBtn = document.getElementById("insta-like-btn");
    const instaHeartIcon = document.getElementById("insta-heart-icon");
    const instaLikesCount = document.getElementById("insta-likes-count");
    const instaPostImgContainer = document.getElementById("insta-post-img-container");
    const instaDoubletapHeart = document.getElementById("insta-doubletap-heart");
    const instaCommentsToggle = document.getElementById("insta-comments-toggle");
    const instaCommentsList = document.getElementById("insta-comments-list");

    let isLiked = false;
    let likes = 124;

    function toggleLike() {
        isLiked = !isLiked;
        if (isLiked) {
            likes++;
            instaHeartIcon.style.fill = "#e1306c";
            instaHeartIcon.style.stroke = "#e1306c";
            instaLikeBtn.style.transform = "scale(1.2)";
            setTimeout(() => {
                instaLikeBtn.style.transform = "scale(1)";
            }, 100);
        } else {
            likes--;
            instaHeartIcon.style.fill = "none";
            instaHeartIcon.style.stroke = "var(--text-normal)";
        }
        instaLikesCount.textContent = likes;
    }

    if (instaLikeBtn && instaHeartIcon && instaLikesCount) {
        instaLikeBtn.addEventListener("click", toggleLike);
    }

    if (instaPostImgContainer && instaDoubletapHeart) {
        instaPostImgContainer.addEventListener("dblclick", () => {
            if (!isLiked) {
                toggleLike();
            }
            
            // Pop heart animation
            instaDoubletapHeart.style.opacity = "1";
            instaDoubletapHeart.style.transform = "scale(1.2)";
            
            setTimeout(() => {
                instaDoubletapHeart.style.opacity = "0";
                instaDoubletapHeart.style.transform = "scale(0)";
            }, 800);
        });
    }

    if (instaCommentsToggle && instaCommentsList) {
        instaCommentsToggle.addEventListener("click", () => {
            const isVisible = instaCommentsList.style.display === "flex";
            if (isVisible) {
                instaCommentsList.style.display = "none";
                instaCommentsToggle.textContent = "Ver los 18 comentarios";
            } else {
                instaCommentsList.style.display = "flex";
                instaCommentsToggle.textContent = "Ocultar comentarios";
            }
        });
    }
});
