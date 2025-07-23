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
        ticketImagePreview.alt = 'Ticket Preview';
    } else {
        ticketImagePreview.src = ''; // Explicitly set src to empty string
        ticketImagePreview.style.display = 'none';
        noTicketImageMessage.style.display = 'block';
        ticketImagePreview.alt = ''; // Explicitly set alt to empty string
    }

    editOpinionButton.addEventListener('click', () => {
        window.location.href = APP_CONFIG.pages.uploadOpinion;
    });

    editTicketButton.addEventListener('click', () => {
        window.location.href = APP_CONFIG.pages.uploadTicket;
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