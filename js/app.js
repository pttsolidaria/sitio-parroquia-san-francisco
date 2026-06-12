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
    // 6. DYNAMIC & INTERACTIVE INSTAGRAM PROFILE FEED GRID WITH LIGHTBOX VISOR
    // Define 6 slides representing different parish activities
    const instaSlides = [
        {
            img: "img/insta_real_1.jpg",
            caption: "En el marco del #díadelpatrimonio. Nuestro Templo abrió sus puertas como parte del recorrido de la ruta histórica #iglesiascatólicas de la ciudad de #temuco. Gracias por visitarnos. 🏛️❤️",
            likes: 115,
            comments: [
                { user: "comunidad_sfa", text: "¡Paz y Bien! Excelente publicación. 🙏" },
                { user: "vecino_temuco", text: "Muchas bendiciones por compartir esto." }
            ]
        },
        {
            img: "img/insta_real_2.jpg",
            caption: "#díadelpatrimonio #temuco #cultura #iglesiaspatrimoniales ⛪✨",
            likes: 110,
            comments: [
                { user: "comunidad_sfa", text: "¡Paz y Bien! Excelente publicación. 🙏" },
                { user: "vecino_temuco", text: "Muchas bendiciones por compartir esto." }
            ]
        },
        {
            img: "img/insta_real_3.jpg",
            caption: "Jóvenes, Jesús está aquí. ¿Te detienes un rato con Él? Te invitamos a la Misa Universitaria de Corpus Christi en la Parroquia San Francisco de Asís. Corpus Christi es la fiesta en la que celebramos que Jesús se queda realmente presente en la Eucaristía. No es un símbolo, es Él. Vivo, real, esperándote. Antes de la Misa vamos a tener un momento de adoración al Santísimo. Un espacio sin apuro, solo tú y el Señor, para frenar el ritmo de la U, poner el corazón en orden y hablar con Él cara a cara. Ven aunque vengas cansado, con dudas o sin saber qué decir. Él te recibe así como estás. Trae a tus amigos, a tu grupo de pastoral, al compañero de la U. Que este día sea una pausa para encontrarnos con Aquel que se hace Pan por nosotros. Te esperamos. Todos son bienvenidos/as. 🍞🍷❤️",
            likes: 105,
            comments: [
                { user: "comunidad_sfa", text: "¡Paz y Bien! Excelente publicación. 🙏" },
                { user: "vecino_temuco", text: "Muchas bendiciones por compartir esto." }
            ]
        },
        {
            img: "img/insta_real_4.jpg",
            caption: "Nuestra Madre.... #madredejesús #católicos #santamaría #madredelaiglesia 🌹🙏",
            likes: 100,
            comments: [
                { user: "comunidad_sfa", text: "¡Paz y Bien! Excelente publicación. 🙏" },
                { user: "vecino_temuco", text: "Muchas bendiciones por compartir esto." }
            ]
        },
        {
            img: "img/insta_real_5.jpg",
            caption: "⛪❤️ Hito Diocesano: Pintura Fachada Parroquia San Francisco. Con la Santa Eucaristía, la comunidad San Francisco de Asís de Temuco agradeció a los benefactores que aportaron en la pintura del icónico templo parroquial ubicado en Manuel Montt, y que este 2026 cumple su primer centenario. Agradecemos profundamente a Luis Felipe Braithwaite, Mauricio Mardones y Pedro Elias, que en su representación asistió Anita Elias, por ayudar a concretar un anhelo que la comunidad parroquial y los temuquenses llevaban desde hace años. 🏛️✨ Recemos por la comunidad parroquial que también contribuyó significativamente para la renovación de la fachada #diocesisdetemuco #iglesia #catolicos #pazybien",
            likes: 95,
            comments: [
                { user: "comunidad_sfa", text: "¡Paz y Bien! Excelente publicación. 🙏" },
                { user: "vecino_temuco", text: "Muchas bendiciones por compartir esto." }
            ]
        },
        {
            img: "img/insta_real_6.jpg",
            caption: "#catolicos #niñosyniñas #temuco #pentecostes 🔥👶👧⛪",
            likes: 90,
            comments: [
                { user: "comunidad_sfa", text: "¡Paz y Bien! Excelente publicación. 🙏" },
                { user: "vecino_temuco", text: "Muchas bendiciones por compartir esto." }
            ]
        }
    ];

    // Track states
    let currentSlide = 0;
    let slideLikedState = Array(instaSlides.length).fill(false);
    let slideLikesCount = instaSlides.map(s => s.likes);

    // Modal elements
    const instaLightboxModal = document.getElementById("insta-lightbox-modal");
    const instaLightboxClose = document.getElementById("insta-lightbox-close");
    const instaModalImg = document.getElementById("insta-modal-img");
    const instaModalPrevBtn = document.getElementById("insta-modal-prev-btn");
    const instaModalNextBtn = document.getElementById("insta-modal-next-btn");
    const instaModalDoubletapHeart = document.getElementById("insta-modal-doubletap-heart");
    const instaModalCaptionText = document.getElementById("insta-modal-caption-text");
    const instaModalCommentsList = document.getElementById("insta-modal-comments-list");
    const instaModalLikeBtn = document.getElementById("insta-modal-like-btn");
    const instaModalHeartIcon = document.getElementById("insta-modal-heart-icon");
    const instaModalLikesCount = document.getElementById("insta-modal-likes-count");
    const instaModalCommentForm = document.getElementById("insta-modal-comment-form");
    const instaModalCommentInput = document.getElementById("insta-modal-comment-input");
    const instaModalImgContainer = document.getElementById("insta-modal-img-container");

    // Grid items click handlers
    const instaGridItems = document.querySelectorAll(".insta-grid-item");
    instaGridItems.forEach(item => {
        item.addEventListener("click", () => {
            const index = parseInt(item.getAttribute("data-slide-index"), 10);
            openInstaModal(index);
        });
    });

    function openInstaModal(index) {
        if (!instaLightboxModal) return;
        currentSlide = index;
        instaLightboxModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Lock scroll
        updateModalSlide();
    }

    function closeInstaModal() {
        if (!instaLightboxModal) return;
        instaLightboxModal.style.display = "none";
        document.body.style.overflow = ""; // Restore scroll
    }

    function updateModalSlide() {
        if (!instaModalImg || !instaModalCaptionText || !instaModalLikesCount || !instaModalCommentsList) return;
        const slide = instaSlides[currentSlide];

        // Smooth image fade-in transition
        instaModalImg.style.opacity = "0.3";
        setTimeout(() => {
            instaModalImg.src = slide.img;
            instaModalImg.style.opacity = "1";
        }, 150);

        // Caption
        instaModalCaptionText.innerHTML = slide.caption;

        // Likes and Like Button
        const isLiked = slideLikedState[currentSlide];
        instaModalLikesCount.textContent = slideLikesCount[currentSlide];
        if (isLiked) {
            instaModalHeartIcon.style.fill = "#e1306c";
            instaModalHeartIcon.style.stroke = "#e1306c";
        } else {
            instaModalHeartIcon.style.fill = "none";
            instaModalHeartIcon.style.stroke = "var(--text-normal)";
        }

        // Comments List
        renderModalComments();
    }

    function renderModalComments() {
        if (!instaModalCommentsList) return;
        const slide = instaSlides[currentSlide];
        
        instaModalCommentsList.innerHTML = slide.comments.map(c => 
            `<div style="display: flex; gap: var(--space-xs); align-items: start; margin-bottom: var(--space-2xs);">
                <div style="width: 24px; height: 24px; border-radius: var(--radius-full); background-color: var(--border-color); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 700; color: var(--text-normal); text-transform: uppercase;">
                    ${c.user.substring(0, 2)}
                </div>
                <div>
                    <span style="font-weight: 700; margin-right: 4px; color: var(--text-normal);">${c.user}</span>
                    <span style="color: var(--text-normal);">${c.text}</span>
                </div>
            </div>`
        ).join('');
    }

    function toggleModalLike() {
        const isLiked = !slideLikedState[currentSlide];
        slideLikedState[currentSlide] = isLiked;

        if (isLiked) {
            slideLikesCount[currentSlide]++;
            instaModalHeartIcon.style.fill = "#e1306c";
            instaModalHeartIcon.style.stroke = "#e1306c";
            instaModalLikeBtn.style.transform = "scale(1.2)";
            setTimeout(() => {
                instaModalLikeBtn.style.transform = "scale(1)";
            }, 100);
        } else {
            slideLikesCount[currentSlide]--;
            instaModalHeartIcon.style.fill = "none";
            instaModalHeartIcon.style.stroke = "var(--text-normal)";
        }
        instaModalLikesCount.textContent = slideLikesCount[currentSlide];

        // Sincronizar la cantidad de me gustas en la cuadrícula principal
        const gridItem = document.querySelector(`.insta-grid-item[data-slide-index="${currentSlide}"]`);
        if (gridItem) {
            const likesText = gridItem.querySelector(".insta-grid-overlay span:first-child");
            if (likesText) {
                likesText.textContent = `❤️ ${slideLikesCount[currentSlide]}`;
            }
        }
    }

    // Like button handler
    if (instaModalLikeBtn) {
        instaModalLikeBtn.addEventListener("click", toggleModalLike);
    }

    // Double-tap to like inside modal
    if (instaModalImgContainer && instaModalDoubletapHeart) {
        instaModalImgContainer.addEventListener("dblclick", (e) => {
            if (e.target.closest("button")) return;
            
            if (!slideLikedState[currentSlide]) {
                toggleModalLike();
            }

            instaModalDoubletapHeart.style.opacity = "1";
            instaModalDoubletapHeart.style.transform = "scale(1.2) translate(-50%, -50%)";

            setTimeout(() => {
                instaModalDoubletapHeart.style.opacity = "0";
                instaModalDoubletapHeart.style.transform = "scale(0) translate(-50%, -50%)";
            }, 800);
        });
    }

    // Comments submission handler
    if (instaModalCommentForm && instaModalCommentInput) {
        instaModalCommentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = instaModalCommentInput.value.trim();
            if (text === "") return;

            // Add comment to slide data
            instaSlides[currentSlide].comments.push({
                user: "tú",
                text: text
            });

            // Update comment count on main grid item
            const gridItem = document.querySelector(`.insta-grid-item[data-slide-index="${currentSlide}"]`);
            if (gridItem) {
                const commentsText = gridItem.querySelector(".insta-grid-overlay span:last-child");
                if (commentsText) {
                    commentsText.textContent = `💬 ${instaSlides[currentSlide].comments.length}`;
                }
            }

            instaModalCommentInput.value = "";
            renderModalComments();
        });
    }

    // Navigation arrows in modal
    if (instaModalPrevBtn) {
        instaModalPrevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSlide = (currentSlide - 1 + instaSlides.length) % instaSlides.length;
            updateModalSlide();
        });
    }

    if (instaModalNextBtn) {
        instaModalNextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentSlide = (currentSlide + 1) % instaSlides.length;
            updateModalSlide();
        });
    }

    // Close button & backdrop handlers
    if (instaLightboxClose) {
        instaLightboxClose.addEventListener("click", closeInstaModal);
    }

    if (instaLightboxModal) {
        instaLightboxModal.addEventListener("click", (e) => {
            if (e.target === instaLightboxModal) {
                closeInstaModal();
            }
        });
    }

    // Listen to Escape key to close modal
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && instaLightboxModal && instaLightboxModal.style.display === "flex") {
            closeInstaModal();
        }
    });
});
