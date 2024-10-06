document.addEventListener('DOMContentLoaded', function() {
    const openSettingsButton = document.getElementById('openSettings');
    const stopErrorsAlertsButton = document.getElementById('stopErrorsAlertsButton');

    openSettingsButton.addEventListener('click', openSettings);
    stopErrorsAlertsButton.addEventListener('click', stopErrorsAlerts);

    // Load the webhook button title from storage and update the button text
    chrome.storage.sync.get('webhookButtonTitle', function(data) {
        const webhookButtonTitle = data.webhookButtonTitle || 'Stop Errors Alerts (Alt+M)'; // Default title if not set
        stopErrorsAlertsButton.textContent = webhookButtonTitle; // Update button text
    });

    // Listen for keyboard shortcut to trigger the webhook
    chrome.commands.onCommand.addListener(function(command) {
        if (command === "triggerWebhook") {
            stopErrorsAlerts(); // Call the function to simulate clicking the button
        }
    });
});

// Function to open settings
function openSettings() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('settings.html'));
    }
}

// Function to stop errors alerts
function stopErrorsAlerts() {
    console.log("Clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        const scenarioIdMatch = url.match(/scenarios\/(\d+)/);

        if (scenarioIdMatch) {
            const scenarioId = scenarioIdMatch[1];

            // Get the webhook URL and button title from storage
            chrome.storage.sync.get(['webhookUrl', 'webhookButtonTitle'], function(data) {
                const webhookUrl = data.webhookUrl || ''; // Fallback if not set
                const webhookButtonTitle = data.webhookButtonTitle || 'Webhook Button'; // Fallback title

                console.log(webhookUrl, webhookButtonTitle);

                // Check if the webhookUrl is valid
                if (webhookUrl) {
                    const finalWebhookUrl = `${webhookUrl}&auto_id=${scenarioId}`;
                    fetch(finalWebhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        alert(data.data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Error triggering webhook. Check console for details.');
                    });
                } else {
                    alert('Webhook URL is not set in settings.');
                }
            });
        } else {
            alert('No scenario ID found in the current URL.');
        }
    });
}
