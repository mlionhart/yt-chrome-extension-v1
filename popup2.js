const exportButton = document.querySelector("#startExportProcessButton");
// const fileMessage = document.querySelector("#file-message");
const fileSelect = document.querySelector("#selectFileButton");
const retrieveDataButton = document.querySelector("#retrieveDataButton");
const homeButton = document.querySelector("#homeButton");
const h1 = document.querySelector("h1");
const timerDiv = document.querySelector(".timer-div");
const message = document.querySelector(".message-popup2");
const customAlert = document.getElementById("customAlert");
const alertMessage = document.getElementById("alertMessage");
const closeCustomAlert = document.querySelector("#closeCustomAlert");
const progressBar = document.querySelector("#file");
let justZip = false;

document.addEventListener("DOMContentLoaded", function () {
  // alert("IMPORTANT: Wait for YT studio page to fully load before clicking \"download post data\"");

  // if (!h1.innerText.includes("Zip")) {

  // }

  alertMessage.textContent =
    'IMPORTANT: Wait for YT studio page to fully load before clicking "download post data"';
  customAlert.style.display = "flex";

  closeCustomAlert.addEventListener("click", () => {
    customAlert.style.display = "none";
  });

  // listen for justZipComplete from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "justZipComplete") {
      justZip = true;
      customAlert.style.display = "none";
      h1.innerText = "Select Zip File";
      exportButton.style.display = "none";
      // fileMessage.style.display = "block";
      fileSelect.style.display = "block";
      fileSelect.focus();

      sendResponse({ success: true });
      return true; // Indicate asynchronous response
    } 
  });

  // Listen for download complete message from background
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "downloadComplete") {
      // after file downloads, hide export button, show file select

      // Clear the countdown interval
      clearInterval(countdown);

      timerDiv.innerHTML = `<h1 style="text-align:center;color:red;">Download Complete!</h1><p style="text-align:center;">Click "Select File" and select the zip file that was just downloaded</p>`;
      window.resizeTo(270, 300);

      h1.innerText = "Select Zip File";
      h1.style.marginTop = 0;
      exportButton.style.display = "none";
      // fileMessage.style.display = "block";
      fileSelect.style.display = "block";
      fileSelect.focus();
    }
  });

  function timerDivCountdown() {
    let countdownValue = 0;

    countdown = setInterval(() => {
      if (countdownValue < 1500) {
        // timerDiv.innerHTML = `<h1 style="text-align:center;color:red;">${countdownValue}</h1>`;
        timerDiv.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;justify-content:center;align-items:center;margin:15px auto;text-align:center;"><label for="file">Downloading data:</label>
        <div>
        <progress id="file" max="100" value="${
          Math.ceil(countdownValue * 0.06666667) <= 100
            ? Math.ceil(countdownValue * 0.06666667)
            : 100
        }"></progress> &nbsp; <span style="color:blue;">${
          Math.ceil(countdownValue * 0.06666667) <= 100
            ? Math.ceil(countdownValue * 0.06666667)
            : 100
        }%</span>
        </div>
        </div>`;
        countdownValue++;
      } else {
        clearInterval(countdown);
      }
    }, 10);
  }

  // Start Export Process Button
  document
    .getElementById("startExportProcessButton")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage(
        { action: "clickDownloadButton" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending clickDownloadButton message:",
              chrome.runtime.lastError.message
            );
          }
        }
      );
      timerDiv.style.display = "block";
      timerDivCountdown();
    });

  // Home button
  document.getElementById("homeButton").addEventListener("click", () => {
    if (justZip === false) {
      // Send a message to background script to open the main popup
      chrome.runtime.sendMessage({ action: "openMainPopup" }, (response) => {
        if (response.success) {
          console.log("Main popup opened successfully");
        } else {
          console.error("Error opening main popup:", response.error);
        }
      });
    } else {
      chrome.runtime.sendMessage({ action: "closeWindowOnly" }, (response) => {
        if (response.success) {
          console.log("Window Closed");
        } else {
          console.error("Error closing window:", response.error);
        }
      });
    }
  });

  // Select File Button
  document.getElementById("selectFileButton").addEventListener("click", () => {
    document.getElementById("filePicker").click();
  });

  // File Picker Change Event
  document.getElementById("filePicker").addEventListener("change", (event) => {
    h1.innerText = "Raw File Data:";
    if (justZip) {
      // Create a new element
      const newElement = document.createElement("p");
      newElement.style.textAlign = "center";
      newElement.innerHTML =
        'Click "Finish" and the main extension will refresh -->';
      h1.insertAdjacentElement("afterend", newElement);
    }
    homeButton.style.display = "block";
    timerDiv.style.display = "none";
    fileSelect.style.display = "None";

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const zip = new JSZip();
        zip
          .loadAsync(reader.result)
          .then((zipContent) => {
            const csvFile = zipContent.file("Table data.csv");
            if (csvFile) {
              csvFile
                .async("string")
                .then((fileContent) => {
                  // Convert CSV content to JSON
                  const jsonData = Papa.parse(fileContent, {
                    header: true,
                    dynamicTyping: true,
                  }).data;

                  // Store the JSON data in local storage
                  chrome.storage.local.set(
                    { tableDataJson: JSON.stringify(jsonData) },
                    () => {
                      console.log(
                        "CSV data converted to JSON and stored successfully"
                      );
                      // Trigger retrieve data button click after data is stored
                      retrieveDataButton.click();
                    }
                  );
                })
                .catch((error) => {
                  console.error("Error reading file content:", error);
                });
            } else {
              console.error("Table data.csv not found in the ZIP file");
            }
          })
          .catch((error) => {
            console.error("Error loading ZIP content:", error);
          });
      };

      reader.onerror = function (error) {
        console.error("Error reading blob:", error);
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error("No file selected");
    }
  });

  // Retrieve Data Button
  document
    .getElementById("retrieveDataButton")
    .addEventListener("click", () => {
      chrome.storage.local.get("tableDataJson", (data) => {
        if (data.tableDataJson) {
          const jsonData = JSON.parse(data.tableDataJson);
          const fileContentDiv = document.createElement("div");
          fileContentDiv.innerHTML = `<h3>Table data.csv</h3><pre>${JSON.stringify(
            jsonData,
            null,
            2
          )}</pre>`;
          retrieveDataButton.style.display = "none";
          document.getElementById("file-contents").appendChild(fileContentDiv);
        } else {
          console.error("No JSON data found in storage");
        }
      });
    });
});
