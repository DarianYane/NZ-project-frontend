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

    if (mode === 'opinion_only') {
        step2Title.textContent = 'If you wish, you can optionally attach your ticket to help the business.';
    }

    openCameraButton.addEventListener('click', () => cameraInput.click());
    selectFileButton.addEventListener('click', () => fileInput.click());
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `form_step1.html?mode=${mode || ''}`;
    });

    cameraInput.addEventListener('change', () => showImageInfo(cameraInput));
    fileInput.addEventListener('change', () => showImageInfo(fileInput));

    submitButton.addEventListener('click', () => {
        const imageFile = cameraInput.files[0] || fileInput.files[0];
        if (!imageFile && mode !== 'opinion_only') {
            alert('Please upload a ticket image to receive your prize.');
            return;
        }
        // In a real scenario, you would retrieve the stored audio data
        // and submit both the audio and the ticket image to the server.
        alert('Submitting opinion and ticket...');
        // uploadFiles(storedAudio, imageFile, metadata);
    });

    skipButton.addEventListener('click', () => {
        alert('Submitting opinion without ticket...');
        // In a real scenario, you would retrieve the stored audio data
        // and submit it to the server without a ticket image.
        // uploadFiles(storedAudio, null, metadata);
    });
});

function showImageInfo() {
    const imageInput = document.getElementById('ticketImage');
    const imageInfo = document.getElementById('ticketImageInfo');
    const imagePreview = document.getElementById('ticketImagePreview');
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        imageInfo.style.display = 'block';
        imageInfo.innerHTML = `Name: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imageInfo.style.display = 'none';
        imagePreview.style.display = 'none';
    }
}
