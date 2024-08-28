# Youtube Community Search - Chrome Extension for YouTube Creators

This is my first browser extension. 

## Overview
YouTube Community Search is a Chrome extension that allows you to search community posts. You can quickly find any post, no matter how long ago you created it. 

## Features
- Search community posts seamlessly. 
- Filter by impressions, likes, date, like rate, and response rate
- Easy to use interface.

## Why I Created this Extension

I've been a YouTuber for about 6 years, and I conduct a lot of polls and question posts on my YT community page. The problem is, if I want to get access to a poll or post older than a few months or years, there's no way to do that without sitting there scrolling for an hour.

I had originally planned on using the YT data API for this project, but YT does not provide post data through their API, so I had to find a workaround. This workaround involved finding the exact url for post information in YT analytics, and programmatically selecting the option "download to csv." After the zip file is downloaded, the extension unzips it, parses the data into JSON, and stores it into web storage for future access.

Now, I can search and find any post I want. I don't know how useful this will be to other YT creators, as I'm known to use the community page more than most, but I hope some people find it as useful as me.

## Installation

To install this extension, follow these steps:

1. Once downloaded, you will have no post data loaded. Click the "update" button to the right.

2. This will request your YouTube Channel Id. This can be found in the web url after navigating to your youtube channel in the browser. It starts with a 'U' and should be right after "youtube.com/channel/".

3. After entering your ID, your will be taken to your post information in YT analytics. Wait a few seconds for the page to fully load, as there's often a lot of data to load, then click "download data."

4. Wait for the counter to count all the way down, and you will be notified when your zip file is downloaded.

5. Click "Select File" and select the zip file that was just downloaded. It should have the word "Post" in the file name. This will unzip the file in the background, and parse the data for use in your extension. It will also show a preview of the raw data downloaded.  

6. Click "Go to Home." This will load your posts into your main extension popup.

7. After you complete this process, your posts should load automatically after opening the extension from now on.

8. If you ever want to update your post data, simply click Update -> "Get Latest Data" again. 

9. You can also upload your own zip file with Update --> "Upload Zip File" if you want to get your posts zip file yourself (some may want to select a different time period than 'lifetime,' like 'last 90 days,' or 'past year.').

## Usage

To use this project, follow these steps:

1. Follow steps 7-8 above

## Support
If you encounter any issues or have questions, please reach out to us:
- **Email**: mike@lionhartweb.com
- **GitHub Issues**: [Submit an issue](https://github.com/mlionhart/yt-chrome-extension-v1/issues)

## Changelog
- **v1.1.1**: UI Improvements and bug fixes
- **v1.1**:
  - Added refresh button to main popup
  - Bug fixes
  - Improved UI for better user experience.
- **v1.0**: Initial release.

## License
This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. Created by Mike Hart. For more information, see the [LICENSE](LICENSE.md) file.


