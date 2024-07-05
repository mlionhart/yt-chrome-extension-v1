let tabCreated = false;
let tabId = null;
let channelId = null;

function getLink(channelId) {
  const link = `https://studio.youtube.com/channel/${channelId}/analytics/tab-overview/period-4_weeks/explore?entity_type=CHANNEL&entity_id=${channelId}&time_period=lifetime&explore_type=TABLE_AND_CHART&metrics_computation_type=DELTA&metric=POST_IMPRESSIONS&granularity=DAY&t_metrics=POST_IMPRESSIONS&t_metrics=POST_LIKES&t_metrics=POST_VOTES&t_metrics=POST_LIKES_PER_IMPRESSIONS&t_metrics=POST_VOTES_PER_IMPRESSIONS&v_metrics=VIEWS&v_metrics=WATCH_TIME&v_metrics=SUBSCRIBERS_NET_CHANGE&v_metrics=TOTAL_ESTIMATED_EARNINGS&v_metrics=VIDEO_THUMBNAIL_IMPRESSIONS&v_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&dimension=POST&o_column=POST_IMPRESSIONS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC`;
  return link;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getChannelId") {
    if (!tabCreated) {
      const channelId = request.channelId; // Retrieve channel ID from the message

      try {
        const link = getLink(channelId);
        chrome.tabs.create({ url: link }, (tab) => {
          tabId = tab.id;
          tabCreated = true;
          sendResponse({ success: true, tabId: tab.id });

          // Open the extension's popup once the tab is created
          chrome.windows.create({
            url: chrome.runtime.getURL("popup2.html"),
            type: "popup",
            width: 250,
            height: 300,
          });
        });
      } catch (error) {
        console.error("Error in getChannelId:", error);
        sendResponse({ error: error.message });
      }
      return true; // Keep the message channel open for sendResponse
    }
  } else if (request.action === "clickDownloadButton") {
    if (tabId) {
      chrome.tabs.sendMessage(
        tabId,
        { action: "clickDownloadButton" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending clickDownloadButton message:",
              chrome.runtime.lastError.message
            );
            sendResponse({ error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        }
      );
    } else {
      console.error("No tabId available for clickDownloadButton action");
      sendResponse({ error: "No tabId available" });
    }
    return true; // Keep the message channel open for sendResponse
  }
});

// Listen for tab removal to reset tabCreated and tabId
chrome.tabs.onRemoved.addListener((removedTabId) => {
  if (removedTabId === tabId) {
    tabCreated = false;
    tabId = null;
  }
});

// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "justZip") {

    // Create popup2.html window
    chrome.windows.create({
      url: chrome.runtime.getURL("popup2.html"),
      type: "popup",
      width: 250,
      height: 300,
    }, (popupWindow) => {
      // Wait for popup2.html to finish loading
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === popupWindow.tabs[0].id && changeInfo.status === "complete") {
          // Send message to popup2.js that zip upload is complete
          chrome.tabs.sendMessage(tabId, { action: "justZipComplete" }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to popup2.js:", chrome.runtime.lastError.message);
            } else {
              console.log("Message sent to popup2.js:", response);
            }
          });

          // Remove the listener after sending the message
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    });

    // Example: Responding with a success message
    sendResponse({ success: true });
    return true;
  }

  // Add more conditions for other actions if needed

  // Ensure to return true to keep the message channel open for sendResponse
  
});



// listen for openMainPopup message from popup2.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "openMainPopup") {
    // Close popup2.html window
    chrome.windows.remove(sender.tab.windowId, () => {
      // Open the extension's main popup
      chrome.windows.create(
        {
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 530,
          height: 650,
        },
        (window) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error opening main popup:",
              chrome.runtime.lastError.message
            );
            sendResponse({
              success: false,
              error: chrome.runtime.lastError.message,
            });
          } else {
            sendResponse({ success: true });
          }
        }
      );
    });

    return true; // Keep the message channel open for sendResponse
  } else if (request.action === "closeWindowOnly") {
    // Close popup2.html window
    chrome.windows.remove(sender.tab.windowId, () => {
      sendResponse({ success: true });
    });
  }
});


// Listen for download complete message from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadComplete") {
    // Ensure sendResponse is called asynchronously to prevent message channel closure
    setTimeout(() => {
      sendResponse({ success: true });
    }, 0);
    return true; // Keep the message channel open for sendResponse
  }
});

