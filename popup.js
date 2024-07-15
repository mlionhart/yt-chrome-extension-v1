document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector("input");
  const container = document.querySelector(".container");
  const postCount = document.querySelector(".post-count");
  const sortSelect = document.querySelector("#sort");
  const sortBy = document.querySelector("#sortDir");
  const updateLink = document.querySelector(".update-link");
  const updateLinkZip = document.querySelector(".update-link-zip");
  const dropbtn = document.querySelector(".dropbtn");
  const message = document.querySelector(".message");
  const refreshButton = document.querySelector("#refresh");
  let currentData = [];

  // listen to popup2 for signal to reload
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "reload") {
      location.reload();
    }
  });

  /* Toggle between hiding and showing the dropdown content */
  dropbtn.addEventListener("click", () => {
    document.getElementById("myDropdown").classList.toggle("show");
  });

  // Close the dropdown if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };

  // Function to handle the main process
  function handleProcess(channelId) {
    chrome.runtime.sendMessage(
      { action: "getChannelId", channelId: channelId },
      (response) => {
        if (response.success) {
          message.textContent = "Analytics page opened successfully.";
        } else {
          message.textContent = "Error opening analytics page.";
        }
      }
    );
  }

  refreshButton.addEventListener("click", () => {
    location.reload();
    // fetchData();
  });

  // Added event listener for update link
  updateLink.addEventListener("click", () => {
    // Check if channel ID is in local storage
    chrome.storage.local.get("channel-id", (result) => {
      let channelId = result["channel-id"];
      if (channelId) {
        handleProcess(channelId);
      } else {
        // Prompt the user to enter the channel ID
        channelId = prompt("Enter your YT Channel Id");
        if (channelId) {
          // Store the channel ID in local storage
          chrome.storage.local.set({ "channel-id": channelId }, () => {
            console.log("Stored Channel ID:", channelId); // Debug statement
            handleProcess(channelId);
          });
        } else {
          message.textContent = "Channel ID is required to proceed.";
        }
      }
    });
  });

  // Added event listener for update link
  updateLinkZip.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "justZip" }, (response) => {
      if (response.success) {
        console.log("Zip upload operation successful");
        // Optionally, you can perform actions specific to your extension here
      } else {
        console.error("Error during zip upload:", response.error);
      }
    });
    return true;
  });

  function highlight(p, word) {
    const lowerCaseWord = word.toLowerCase();
    const upperCaseWord = word[0].toUpperCase() + word.slice(1).toLowerCase();

    let newStr = p.replaceAll(word, `<mark>${word}</mark>`);
    newStr = newStr.replaceAll(lowerCaseWord, `<mark>${lowerCaseWord}</mark>`);
    newStr = newStr.replaceAll(upperCaseWord, `<mark>${upperCaseWord}</mark>`);

    return newStr;
  }

  function printItems(res, inp) {
    let output = "";

    if (inp !== "") {
      res.forEach((item) => {
        let postLink = "";
        let postText = "";
        let postTime = "";
        let postImpressions = "";
        let postLikes = "";
        let postResponses = "";
        let postLikeRate = "";
        let postResponseRate = "";

        Object.entries(item).forEach(([key, value]) => {
          postCount.innerHTML = res.length;

          if (
            typeof value === "string" &&
            value.toLowerCase().includes(inp.toLowerCase())
          ) {
            value = highlight(value, inp);
          }

          if (key === "Post") {
            postLink = `https://www.youtube.com/post/${value}`;
          } else if (key === "Post text") {
            postText = value;
          } else if (key === "Post publish time") {
            postTime = value;
          } else if (key === "Post impressions") {
            postImpressions = value;
          } else if (key === "Post likes") {
            postLikes = value;
          } else if (key === "Post responses") {
            postResponses = value;
          } else if (key === "Post like rate (%)") {
            postLikeRate = value;
          } else if (key === "Post response rate (%)") {
            postResponseRate = value;
          }
        });

        output += `
          <div class="card w-100 mb-3 p-0">
            <div class="card-body p-0">
              <p class="time">${postTime}</p>
              <a class="card-title-link" href=${postLink} target="_blank" style="text-decoration: none; color: inherit;">
                <h6 class="card-title" title="Click to View Post">${postText}</h6>
              </a>
              <div class="info-bar">
                <span class="card-text likes">
                  <i class="bi bi-suit-heart-fill" style="color: red;"></i>
                  <span class="post-likes">${postLikes}<sup title="Like Rate (LR)" style="color:red;"> ${postLikeRate}%</sup></span>
                </span>
                <span class="card-text impressions" title="Post Impressions (Number of times your post was seen)">
                  <i class="bi bi-bar-chart-line-fill" style="color:#333;"></i>
                  <span class="post-impressions">${postImpressions}</span>
                </span>
                <span class="card-text comments">
                  <i class="bi bi-chat"></i>
                  <span class="post-comments">${postResponses}<sup title="Response Rate (Comment Rate)" style="color:red;"> ${postResponseRate}%</sup></span>
                </span>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      res.forEach((item) => {
        let postLink = "";
        let postText = "";
        let postTime = "";
        let postImpressions = "";
        let postLikes = "";
        let postResponses = "";
        let postLikeRate = "";
        let postResponseRate = "";

        Object.entries(item).forEach(([key, value]) => {
          postCount.innerHTML = res.length;

          if (key === "Post") {
            postLink = `https://www.youtube.com/post/${value}`;
          } else if (key === "Post text") {
            postText = value;
          } else if (key === "Post publish time") {
            postTime = value;
          } else if (key === "Post impressions") {
            postImpressions = value;
          } else if (key === "Post likes") {
            postLikes = value;
          } else if (key === "Post responses") {
            postResponses = value;
          } else if (key === "Post like rate (%)") {
            postLikeRate = value;
          } else if (key === "Post response rate (%)") {
            postResponseRate = value;
          }
        });

        output += `
          <div class="card w-100 mb-3 p-0">
            <div class="card-body p-0">
              <p class="time">${postTime}</p>
              <a class="card-title-link" href=${postLink} target="_blank" style="text-decoration: none; color: inherit;">
                <h6 class="card-title" title="Click to View Post">${postText}</h6>
              </a>
              <div class="info-bar">
                <span class="card-text likes">
                  <i class="bi bi-suit-heart-fill" style="color: red;"></i>
                  <span class="post-likes">${postLikes}<sup title="Like Rate (LR)" style="color:red;"> ${postLikeRate}%</sup></span>
                </span>
                <span class="card-text impressions" title="Post Impressions (Number of times your post was seen)">
                  <i class="bi bi-bar-chart-line-fill" style="color:#333;"></i>
                  <span class="post-impressions">${postImpressions}</span>
                </span>
                <span class="card-text comments">
                  <i class="bi bi-chat"></i>
                  <span class="post-comments">${postResponses}<sup title="Response Rate (Comment Rate)" style="color:red;"> ${postResponseRate}%</sup></span>
                </span>
              </div>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = output;
  }

  function sortData(data, sortBy, order) {
    return data.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Check if the value is a date string in the format "MMM DD, YYYY"
      if (
        isNaN(Date.parse(aValue)) === false &&
        isNaN(Date.parse(bValue)) === false
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (order === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

  function eventHelper() {
    container.innerHTML = "";
    let input = inputField.value;
    let order = sortBy.value;
    let sortField;

    switch (sortSelect.value) {
      case "impressions":
        sortField = "Post impressions";
        break;
      case "likes":
        sortField = "Post likes";
        break;
      case "date":
        sortField = "Post publish time";
        break;
      case "comments":
        sortField = "Post responses";
        break;
      case "response-rate":
        sortField = "Post response rate (%)";
        break;
      case "like-rate":
        sortField = "Post like rate (%)";
        break;
      default:
        sortField = "Post publish time";
        break;
    }

    currentData = sortData(currentData, sortField, order);

    printItems(currentData, input);
  }

  // Function to fetch data from chrome.storage.local
  function fetchDataFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("tableDataJson", (data) => {
        if (data.tableDataJson) {
          resolve(JSON.parse(data.tableDataJson));
        } else {
          console.error("No data found in storage");
          reject("No data found in storage");
        }
      });
    });
  }

  // Function to fetch data and set up event listeners
  async function fetchData() {
    try {
      const data = await fetchDataFromStorage();
      currentData = data;

      currentData.shift();

      let input = "";
      printItems(data, input);

      // Trigger sorting after fetching data
      eventHelper();

      inputField.addEventListener("input", (e) => {
        if (container !== "" && e.key !== "Backspace") {
          container.innerHTML = "";
          postCount.innerHTML = 0;
        }

        let input = e.target.value;
        currentData = data.filter((i) =>
          JSON.stringify(i).toLowerCase().includes(input)
        );

        printItems(currentData, input);
      });

      // Filter result
      sortSelect.addEventListener("change", () => {
        eventHelper();
      });

      sortBy.addEventListener("change", () => {
        eventHelper();
      });

      message.innerHTML = "Data Loaded";
      refreshButton.style.display = "none";

      // Clear the message after 5 seconds (5000 milliseconds)
      setTimeout(() => {
        message.innerHTML = "";
        refreshButton.style.display = "inline-block";
      }, 5000);
    } catch (error) {
      console.error("Could not load data from storage:", error);
      message.innerHTML =
        "No data loaded. Click the Blue Update button --> Get Latest Data";
    }
  }

  // Call fetchData to load the data
  fetchData();
});
