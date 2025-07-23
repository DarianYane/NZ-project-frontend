// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Parse URL parameters to determine the operating mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    // If the mode is 'opinion_only', hide the discount-related fields
    if (mode === 'opinion_only') {
        // Create and add the "I want the prize" button
        const prizePromptContainer = document.getElementById('prize-prompt-container');
        if (prizePromptContainer) {
            const prizeButton = document.createElement('button');
            prizeButton.id = 'claimPrizeButton';
            prizeButton.className = 'btn fw-bold mb-3';
            prizeButton.textContent = 'I changed my mind, I want the prize!';
            prizeButton.onclick = function() {
                // Redirect to the login page to start the prize flow
                window.location.href = APP_CONFIG.pages.login;
            };
            prizePromptContainer.appendChild(prizeButton);
        }
    }

    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', () => {
        const opinionText = document.getElementById('opinionText').value;
        // In a real scenario, you would also handle the recorded audio file.
        // For now, we'll just store the text.
        localStorage.setItem('opinion', opinionText);
        
        window.location.href = `${APP_CONFIG.pages.uploadTicket}?mode=${mode || ''}`;
    });
});
