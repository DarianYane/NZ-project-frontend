document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    const cameraInput = document.getElementById('cameraInput');
    const fileInput = document.getElementById('fileInput');
    const openCameraButton = document.getElementById('openCameraButton');
    const selectFileButton = document.getElementById('selectFileButton');
    const backButton = document.getElementById('backButton');

    const submitButton = document.getElementById('submitButton');
    const step2Title = document.getElementById('step2-title');

    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const ticketImagePreview = document.getElementById('ticketImagePreview');

    if (mode === 'opinion_only') {
        step2Title.textContent = 'If you wish, you can optionally attach your ticket to help the business.';
    }

    openCameraButton.addEventListener('click', () => cameraInput.click());
    selectFileButton.addEventListener('click', () => fileInput.click());
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `${APP_CONFIG.pages.uploadOpinion}?mode=${mode || ''}`;
    });

    cameraInput.addEventListener('change', () => handleImageSelection(cameraInput));
    fileInput.addEventListener('change', () => handleImageSelection(fileInput));

    submitButton.addEventListener('click', () => {
        const imageFile = cameraInput.files[0] || fileInput.files[0];
        if (!imageFile && mode !== 'opinion_only') {
            alert('Please upload a ticket image to receive your prize.');
            return;
        }

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('ticketImage', e.target.result);
                window.location.href = `${APP_CONFIG.pages.verification}?mode=${mode || ''}`;
            };
            reader.readAsDataURL(imageFile);
        } else {
            localStorage.removeItem('ticketImage');
            window.location.href = `${APP_CONFIG.pages.verification}?mode=${mode || ''}`;
        }
    });

    // Check if there's a stored image on page load and display it
    const storedTicketImage = localStorage.getItem('ticketImage');
    if (storedTicketImage) {
        ticketImagePreview.src = storedTicketImage;
        imagePreviewContainer.style.display = 'block';
    } else {
        imagePreviewContainer.style.display = 'none';
    }
});

function handleImageSelection(input) {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const ticketImagePreview = document.getElementById('ticketImagePreview');

    if (input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            ticketImagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        ticketImagePreview.src = ''; // Clear image
        imagePreviewContainer.style.display = 'none';
    }
}
