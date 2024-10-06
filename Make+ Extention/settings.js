document.addEventListener('DOMContentLoaded', function() {
    const userName = document.getElementById('userName');
    const webhookUrl = document.getElementById('webhookUrl');
    const webhookButtonTitle = document.getElementById('webhookButtonTitle');
    const redInactiveToggle = document.getElementById('redInactiveToggle');
    const saveButton = document.getElementById('saveButton');

    // Load saved settings
    chrome.storage.sync.get(['userName', 'webhookUrl', 'webhookButtonTitle', 'redInactive'], function(data) {
        userName.value = data.userName || '';
        webhookUrl.value = data.webhookUrl || '';
        webhookButtonTitle.value = data.webhookButtonTitle || ''; // Load button title
        redInactiveToggle.checked = data.redInactive || false;
    });

    // Save settings when the save button is clicked
    saveButton.addEventListener('click', function() {
        chrome.storage.sync.set({
            userName: userName.value,
            webhookUrl: webhookUrl.value,
            webhookButtonTitle: webhookButtonTitle.value, // Save button title
            redInactive: redInactiveToggle.checked
        }, function() {
            console.log('Settings saved');
            alert('Settings saved successfully!');
        });
    });
});
