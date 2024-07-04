console.log("Content script loaded");

function clickExportButton() {
  console.log("Executing clickExportButton");
  const exportButton = document.getElementById("export-button");
  if (exportButton) {
    console.log("Export button found:", exportButton);
    exportButton.focus();
    exportButton.click();
    console.log("Export button clicked");

    setTimeout(clickDownloadLink, 5000); // Wait for export to complete, adjust the delay as needed
  } else {
    console.error("Export button not found.");
  }
}

function clickDownloadLink() {
  console.log("Executing clickDownloadLink");
  const targetElement = document.querySelector(
    "#text-item-1 > ytcp-ve > tp-yt-paper-item-body > div > div > div > yt-formatted-string"
  );
  if (targetElement) {
    console.log("Target element found:", targetElement);
    targetElement.focus();
    targetElement.click();
    console.log("Target element clicked");
  } else {
    console.error("Target element not found.");
  }
  chrome.runtime.sendMessage({ action: "downloadComplete" });
}

// Listen for clickDownloadButton message from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clickDownloadButton") {
    clickExportButton();
    sendResponse({ success: true }); // Acknowledge the message
  }
  return true; // Indicates that we will send a response asynchronously
});
