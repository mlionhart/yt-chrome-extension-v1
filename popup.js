document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector("input");
  const container = document.querySelector(".container");
  const postCount = document.querySelector(".post-count");
  const sortSelect = document.querySelector("#sort");
  const sortBy = document.querySelector("#sortDir");
  const updateLink = document.querySelector(".update-link");
  const updateLinkZip = document.querySelector(".update-link-zip");
  const dropbtn = document.querySelector(".dropbtn");
  const message = document.getElementById("message");
  let currentData = [];

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
    console.log("Channel ID:", channelId);
    chrome.runtime.sendMessage(
      { action: "getChannelId", channelId: channelId },
      (response) => {
        if (response.success) {
          console.log("Analytics page opened, tab ID:", response.tabId);
          message.textContent = "Analytics page opened successfully.";
        } else {
          console.error("Error opening analytics page:", response.error);
          message.textContent = "Error opening analytics page.";
        }
      }
    );
  }

  // Added event listener for update link
  updateLink.addEventListener("click", () => {
    console.log("Open Analytics button clicked");

    // Check if channel ID is in local storage
    chrome.storage.local.get("channel-id", (result) => {
      let channelId = result["channel-id"];
      console.log("Retrieved Channel ID from storage:", channelId); // Debug statement
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
    console.log("Upload Zip button clicked");
    chrome.runtime.sendMessage({ action: "justZip" }, (response) => {
      if (response.success) {
        console.log("Zip upload operation successful");
        // Optionally, you can perform actions specific to your extension here
      } else {
        console.error("Error during zip upload:", response.error);
      }
    });
  });

  // function highlight(p, word) {
  //   // create word
  //   let newWord = `<mark>${word}</mark>`;

  //   let newStr = p.replaceAll(word, newWord);

  //   return newStr;
  // } 

  function highlight(p, word) {
    const lowerCaseWord = word.toLowerCase();
    const upperCaseWord = word[0].toUpperCase() + word.slice(1).toLowerCase();

    let newStr = p.replaceAll(word, `<mark>${word}</mark>`);
    newStr = newStr.replaceAll(lowerCaseWord, `<mark>${lowerCaseWord}</mark>`);
    newStr = newStr.replaceAll(upperCaseWord, `<mark>${upperCaseWord}</mark>`);

    return newStr;
  }

  
  function printItems(res, inp) {
    console.log("printItems Called");
    console.log("Data received:", res);
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
            postLink = `<a href="https://www.youtube.com/post/${value}" class="btn btn-primary" target="_blank">View Post</a>`;
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
          <div class="card w-100 mb-3">
            <div class="card-body">
              <h6 class="card-title">${postText}</h5>
              <p class="card-text">Published on: ${postTime}</p>
              <p class="card-text">Impressions: ${postImpressions}</p>
              <p class="card-text">Likes: ${postLikes}</p>
              <p class="card-text">Responses: ${postResponses}</p>
              <p class="card-text">Like Rate: ${postLikeRate}%</p>
              <p class="card-text">Response Rate: ${postResponseRate}%</p>
              ${postLink}
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
            postLink = `<a href="https://www.youtube.com/post/${value}" class="btn btn-primary" target="_blank">View Post</a>`;
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

          //  chrome.runtime.sendMessage(
          //    { action: "fetchPageContent", postLink },
          //    (response) => {
          //      if (response.success) {
          //        const html = response.html;
          //        const parser = new DOMParser();
          //        const doc = parser.parseFromString(html, "text/html");
          //        const img = doc.querySelector("img");
          //        if (img) {
          //          console.log("Image found:", img.src);
          //          // Store it to a variable or print it directly in the function
          //          imageTag = `<img src="${img.src}" />`;
          //        } else {
          //          console.log("No image found");
          //        }
          //      } else {
          //        console.error("Error fetching page content:", response.error);
          //      }
          //    }
          //  );
        });

        output += `
          <div class="card w-100 mb-3 p-0">
            <div class="card-body p-0">
              <h6 class="card-title">${postText}</h5>
              <p class="card-text">Published on: ${postTime}</p>
              <p class="card-text">Impressions: ${postImpressions}</p>
              <p class="card-text">Likes: ${postLikes}</p>
              <p class="card-text">Responses: ${postResponses}</p>
              <p class="card-text">Like Rate: ${postLikeRate}%</p>
              <p class="card-text">Response Rate: ${postResponseRate}%</p>
              ${postLink}
            </div>
          </div>
        `;
      });
    }

    console.log("Generated HTML:", output);
    container.innerHTML = output;
  }

  // function sortData(data, sortBy, order) {
  //   console.log(`Sorting by: ${sortBy}, Order: ${order}`);

  //   let res;

  //   if (order === "asc") {
  //     res = data.sort((a, b) => a[sortBy] - b[sortBy]);
  //   } else if (order === "desc") {
  //     res = data.sort((a, b) => b[sortBy] - a[sortBy]);
  //   }

  //   return res;
  // }

  function sortData(data, sortBy, order) {
    console.log(`Sorting by: ${sortBy}, Order: ${order}`);

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

    console.log("Before sorting:", JSON.stringify(currentData, null, 2));
    currentData = sortData(currentData, sortField, order);
    console.log("After sorting:", JSON.stringify(currentData, null, 2));

    printItems(currentData, input);
  }

  // // Fetch data
  // async function fetchData() {
  //   try {
  //     const res = await fetch("../json/table_data.json");
  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();

  //     let input = "";
  //     printItems(data, input);

  //     inputField.addEventListener("input", (e) => {
  //       if (container !== "" && e.key !== "Backspace") {
  //         container.innerHTML = "";
  //         postCount.innerHTML = 0;
  //       }

  //       let input = e.target.value;
  //       currentData = data.filter((i) => JSON.stringify(i).includes(input));

  //       printItems(currentData, input);
  //     });

  //     // filter result
  //     sortSelect.addEventListener("change", () => {
  //       eventHelper();
  //     });

  //     sortBy.addEventListener("change", () => {
  //       eventHelper();
  //     });
  //   } catch (error) {
  //     console.error("Could not load JSON data:", error);
  //   }
  // }

  // Function to fetch data from chrome.storage.local
  function fetchDataFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("tableDataJson", (data) => {
        if (data.tableDataJson) {
          console.log("Data fetched from storage:", data.tableDataJson);
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
        currentData = data.filter((i) => JSON.stringify(i).toLowerCase().includes(input));

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

      // Clear the message after 5 seconds (5000 milliseconds)
      setTimeout(() => {
        message.innerHTML = "";
      }, 5000);

    } catch (error) {
      console.error("Could not load data from storage:", error);
      message.innerHTML = "No data loaded. Click the Blue Update button";
    }
  }

  // Call fetchData to load the data
  fetchData();
});
