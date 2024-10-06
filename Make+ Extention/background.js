chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const regex = /make\.com.*edit/;
    if (changeInfo.status === 'complete' && regex.test(tab.url)) {
      chrome.tabs.sendMessage(tabId, { action: "checkForNotes" });
      
      
      chrome.storage.sync.get(['redInactive'], function(result) {
        if (result.redInactive) {
          chrome.tabs.sendMessage(tabId, { action: "redInactive" });
        }
      });
    }
  }); 