/* LITURGICAL CALENDAR ENGINE - PARROQUIA SAN FRANCISCO DE ASÍS */

document.addEventListener("DOMContentLoaded", () => {
    // Current date state
    const today = new Date();
    let displayMonth = today.getMonth();
    let displayYear = today.getFullYear();
    
    // Month Names
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    // Core liturgical seasons list
    const seasons = {
        ordinary: { name: "Tiempo Ordinario", class: "season-green", desc: "Tiempo de crecimiento espiritual y contemplación de la vida pública de Jesús." },
        advent: { name: "Adviento", class: "season-violet", desc: "Tiempo de preparación espiritual para el nacimiento de Cristo." },
        christmas: { name: "Navidad", class: "season-white", desc: "Tiempo de gozo por la encarnación y venida de nuestro Señor." },
        lent: { name: "Cuaresma", class: "season-violet", desc: "Tiempo de penitencia, oración y conversión preparándonos para la Pascua." },
        easter: { name: "Pascua de Resurrección", class: "season-gold", desc: "¡Aleluya! Celebración del triunfo de Cristo sobre la muerte." },
        martyr: { name: "Fiesta Litúrgica", class: "season-red", desc: "Conmemoración de los mártires o solemnidad especial del Espíritu Santo." }
    };
    
    // Liturgical events mapping (mock/calculations for 2026)
    // In a real application, this can be fetched from a liturgical API.
    const getLiturgicalState = (year, month, day) => {
        // Simple and beautiful mapping for common dates in 2026
        // Cuaresma 2026: Feb 18 (Miércoles de Ceniza) to April 2 (Jueves Santo)
        // Pascua 2026: April 5 (Pascua de Resurrección) to May 24 (Pentecostés)
        // Adviento 2026: Nov 29 to Dec 24
        // Navidad: Dec 25 to Jan 10
        
        const dateObj = new Date(year, month, day);
        
        // Month indexes are 0-based
        if (month === 11) { // December
            if (day >= 25) return { season: seasons.christmas, name: "Natividad del Señor (Navidad)", readings: "Misa del Día: Is 52, 7-10; Heb 1, 1-6; Jn 1, 1-18" };
            return { season: seasons.advent, name: "Tiempo de Adviento", readings: "Evangelio del día de preparación al nacimiento de Jesús" };
        }
        
        if (month === 0) { // January
            if (day <= 10) return { season: seasons.christmas, name: "Tiempo de Navidad - Epifanía", readings: "Evangelio de Epifanía del Señor" };
            return { season: seasons.ordinary, name: "Tiempo Ordinario", readings: "Lecturas feriales semanales" };
        }
        
        if (month === 1) { // February
            if (day >= 18) return { season: seasons.lent, name: "Tiempo de Cuaresma (Ceniza)", readings: "Lecturas de conversión y oración" };
            return { season: seasons.ordinary, name: "Tiempo Ordinario", readings: "Lecturas feriales semanales" };
        }
        
        if (month === 2) { // March
            return { season: seasons.lent, name: "Tiempo de Cuaresma", readings: "Lectura cuaresmal de conversión" };
        }
        
        if (month === 3) { // April
            if (day <= 2) return { season: seasons.lent, name: "Semana Santa (Cuaresma)", readings: "Pasión de nuestro Señor Jesucristo" };
            if (day >= 3 && day <= 4) return { season: seasons.martyr, name: "Triduo Pascual (Viernes/Sábado Santo)", readings: "Pasión e iluminación" };
            return { season: seasons.easter, name: "Tiempo de Pascua de Resurrección", readings: "¡Cristo ha resucitado! Lecturas del Evangelio de la Resurrección" };
        }
        
        if (month === 4) { // May
            if (day <= 24) return { season: seasons.easter, name: "Tiempo de Pascua", readings: "Lecturas pascuales de los Hechos de los Apóstoles" };
            
            // Special local date (renovation of the church facade in May 2026!)
            if (day === 28) return { season: seasons.martyr, name: "Jueves de Acción de Gracias - Renovación del Templo", readings: "Salmo 121: 'Qué alegría cuando me dijeron: Vamos a la casa del Señor'" };
            
            return { season: seasons.ordinary, name: "Tiempo Ordinario", readings: "Lecturas feriales semanales" };
        }
        
        // October 4: San Francisco de Asís (Patrono de la parroquia)
        if (month === 9 && day === 4) {
            return { season: seasons.easter, name: "Solemnidad de San Francisco de Asís", readings: "Gál 6, 14-18; Mt 11, 25-30. Fiesta Patronal." };
        }
        
        return { season: seasons.ordinary, name: "Tiempo Ordinario", readings: "Lecturas feriales" };
    };

    // Render Calendar Function
    const renderCalendar = (month, year) => {
        const monthYearLabel = document.getElementById("calendar-month-year");
        const calendarDaysContainer = document.getElementById("calendar-days");
        const detailsContainer = document.getElementById("liturgical-details");
        
        if (!calendarDaysContainer || !monthYearLabel) return;
        
        // Set Header Label
        monthYearLabel.textContent = `${monthNames[month]} de ${year}`;
        
        // Clear past content
        calendarDaysContainer.innerHTML = "";
        
        // Get first day of the month and number of days in month
        const firstDayIndex = new Date(year, month, 1).getDay();
        // Convert to Monday start: (day + 6) % 7
        const startDayOffset = (firstDayIndex + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        // Render Empty Days for padding
        for (let i = 0; i < startDayOffset; i++) {
            const emptyDay = document.createElement("div");
            calendarDaysContainer.appendChild(emptyDay);
        }
        
        // Render Month Days
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("calendar-day");
            dayCell.textContent = day;
            
            // Add dynamic liturgical colors to borders or background indicator
            const state = getLiturgicalState(year, month, day);
            dayCell.classList.add(state.season.class);
            
            // Contrast color adjustment for white class
            if (state.season.class === "season-white") {
                dayCell.style.borderColor = "var(--border-color)";
            }
            
            // Highlight today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add("today");
            }
            
            // Selection event listener
            dayCell.addEventListener("click", () => {
                // Remove previous active status
                document.querySelectorAll(".calendar-day").forEach(c => c.classList.remove("active"));
                dayCell.classList.add("active");
                
                // Render Day Details in container
                if (detailsContainer) {
                    detailsContainer.innerHTML = `
                        <div class="animate-fade-in">
                            <span class="liturgical-badge ${state.season.class}">${state.season.name}</span>
                            <h4 style="margin-top: var(--space-xs); font-size: 1.15rem; color: var(--text-main);">${day} de ${monthNames[month]}</h4>
                            <p style="margin-top: var(--space-xs); font-size: 0.9rem; color: var(--text-muted); font-style: italic;">"${state.season.desc}"</p>
                            <div style="margin-top: var(--space-sm); border-top: 1px solid var(--border-color); padding-top: var(--space-xs);">
                                <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--primary);">Evangelio del día:</strong>
                                <p style="font-size: 0.9rem; margin-top: 2px;">${state.readings}</p>
                            </div>
                        </div>
                    `;
                }
            });
            
            calendarDaysContainer.appendChild(dayCell);
            
            // Trigger click for today as default display
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.click();
            }
        }
    };
    
    // Set up Calendar Navigation Buttons
    const prevBtn = document.getElementById("calendar-prev");
    const nextBtn = document.getElementById("calendar-next");
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            displayMonth--;
            if (displayMonth < 0) {
                displayMonth = 11;
                displayYear--;
            }
            renderCalendar(displayMonth, displayYear);
        });
        
        nextBtn.addEventListener("click", () => {
            displayMonth++;
            if (displayMonth > 11) {
                displayMonth = 0;
                displayYear++;
            }
            renderCalendar(displayMonth, displayYear);
        });
    }
    
    // Initialize Calendar on Load
    renderCalendar(displayMonth, displayYear);
});
