let observer1;
let observer2;

console.log("initiateExtention");

function stopObservers() {
    if (observer1) {
        observer1.disconnect();
        console.log("observer1 disconnected");
    }
    if (observer2) {
        observer2.disconnect();
        console.log("observer2 disconnected");
    }
}

window.addEventListener('beforeunload', stopObservers);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkForNotes") {   
        // Watch for changes in the DOM
        const observer1 = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const noteInput = document.querySelector('textarea[rows="1"]:not([style])');
                    if (noteInput) {
                        console.log("noteInput");
                        const now = new Date();
                        const currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                        chrome.storage.sync.get('userName', function(data) {
                            const userName = data.userName || "Default Name"; // Use stored name or default
                            const text = `${userName} - ${currentDate}\n\n`;
                            // Only add if it's not already there
                            if (!noteInput.value.startsWith(userName)) {
                                console.log("!StartWith");
                                addNameAndDateTime(noteInput, text);
                            }
                        });
                    }
                }
            });
        });

        observer1.observe(document.body, { childList: true, subtree: true });
    } else if (message.action === "redInactive") {        
        console.log("redInactive");

        const observer2 = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const elementsToObserve = document.querySelectorAll('label.switch:not(.switch-sm)');
                    console.log(elementsToObserve);
                    if(elementsToObserve.length!=0){

                        elementsToObserve.forEach(element => {
                            if (element) {
                                console.log('element=' + element);
                                
                                if (!element.classList.contains('active')) {
                                    // Switch is off, change color to red
                                    console.log(`Element ${element} is off`);
                                    document.documentElement.style.setProperty('--imt-primary-gradient-from', '#ff0000'); // Red color
                                } 
                                else{
                                    // Switch is on, reset color to original
                                    console.log(`Element ${element} is on`);
                                    document.documentElement.style.setProperty('--imt-primary-gradient-from', '#b55dcd'); // Original color
                                }
                            }
                        });

                    
                    }}
            });
        });

        observer2.observe(document.body, { childList: true, subtree: true });

    }

});

function addNameAndDateTime(ni, tx) {
    console.log("AddNameandDate");
    ni.value = tx + ni.value;
}
