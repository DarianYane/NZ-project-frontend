document.addEventListener('DOMContentLoaded', function () {
    const opinionAudio = document.getElementById('opinionAudio');
    const opinionText = document.getElementById('opinionText');
    const ticketImagePreview = document.getElementById('ticketImagePreview');
    const noTicketImageMessage = document.getElementById('noTicketImageMessage');
    const editOpinionButton = document.getElementById('editOpinionButton');
    const editTicketButton = document.getElementById('editTicketButton');
    const submitButton = document.getElementById('submitButton');

    // Load data from localStorage
    const storedOpinion = localStorage.getItem('opinion');
    const storedAudio = localStorage.getItem('audio'); // Assuming you save audio blob URL
    const storedTicketImage = localStorage.getItem('ticketImage');

    if (storedAudio) {
        opinionAudio.src = storedAudio;
        opinionAudio.style.display = 'block';
        opinionText.style.display = 'none';
    } else if (storedOpinion) {
        opinionText.textContent = storedOpinion;
        opinionAudio.style.display = 'none';
        opinionText.style.display = 'block';
    } else {
        // Handle case where there is no opinion
        opinionText.textContent = 'No opinion provided.';
    }

    if (storedTicketImage) {
        ticketImagePreview.src = storedTicketImage;
        ticketImagePreview.style.display = 'block';
        noTicketImageMessage.style.display = 'none';
    } else {
        // If there is no ticket image, hide the entire ticket section
        const ticketSection = document.querySelector('.verification-section:nth-of-type(2)');
        if (ticketSection) {
            ticketSection.style.display = 'none';
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    editOpinionButton.addEventListener('click', () => {
        let targetUrl = APP_CONFIG.pages.uploadOpinion;
        if (mode) {
            targetUrl += `?mode=${mode}`;
        }
        window.location.href = targetUrl;
    });

    editTicketButton.addEventListener('click', () => {
        let targetUrl = APP_CONFIG.pages.uploadTicket;
        if (mode) {
            targetUrl += `?mode=${mode}`;
        }
        window.location.href = targetUrl;
    });

    submitButton.addEventListener('click', () => {
        // Here you would typically send the data to a server
        // For now, we'll just clear localStorage and go to the thank you page
        localStorage.removeItem('opinion');
        localStorage.removeItem('audio');
        localStorage.removeItem('ticketImage');
        window.location.href = APP_CONFIG.pages.thankYou;
    });
});