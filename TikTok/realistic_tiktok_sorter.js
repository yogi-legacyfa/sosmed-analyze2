// Enhanced TikTok Sorter with Auto-Scroll Support
// File: TikTok/realistic_tiktok_sorter.js
//
// Replace the content of TikTok/realistic_tiktok_sorter.js with this code

console.log("🚀 Enhanced TikTok Sorter Loading...");

let sortedVideos = null;
let isScrolling = false;
let scrollStopTimer = null;

// Initialize the extension
function initTikTokSorter() {
  console.log("🔧 Initializing TikTok sorter...");

  if (typeof chrome !== "undefined" && chrome.runtime) {
    setupChromeListener();
  }

  checkForPendingSort();
  setupManualFunctions();

  console.log("✅ TikTok sorter initialized");
}

// Chrome message listener
function setupChromeListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refreshPageTikTok") {
      console.log(
        "🎯 Sort requested:",
        message.sort_by,
        "| Amount:",
        message.no_items
      );

      if (validatePage()) {
        storeSortRequest(message.sort_by, message.no_items);
        window.location.reload();
      }
    }
  });
}

// Validate we're on the right page
function validatePage() {
  const videosTab = document.querySelector('[data-e2e="videos-tab"]');

  if (!videosTab) {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        sort_feed_error: true,
        error_type: "profile_page_tiktok",
      });
    }
    return false;
  }

  if (videosTab.getAttribute("aria-selected") !== "true") {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        sort_feed_error: true,
        error_type: "video_tab_tiktok",
      });
    }
    return false;
  }

  return true;
}

// Store sort request
function storeSortRequest(sortBy, noItems) {
  sessionStorage.setItem("tiktokSortPending", "true");
  sessionStorage.setItem("tiktokSortType", sortBy);
  sessionStorage.setItem("tiktokSortAmount", noItems);
}

// Check for pending sort
function checkForPendingSort() {
  if (sessionStorage.getItem("tiktokSortPending") === "true") {
    const sortType = sessionStorage.getItem("tiktokSortType") || "views";
    const sortAmount = sessionStorage.getItem("tiktokSortAmount") || "25_reels";

    sessionStorage.removeItem("tiktokSortPending");
    sessionStorage.removeItem("tiktokSortType");
    sessionStorage.removeItem("tiktokSortAmount");

    setTimeout(() => {
      performSort(sortType, sortAmount);
    }, 2000);
  }
}

// Get requested video count from selection
function getRequestedCount(noItems) {
  if (noItems === "all_reels") return 999999; // Large number for "all"

  const match = noItems.match(/^(\d+)_reels$/);
  return match ? parseInt(match[1], 10) : 25;
}

// Auto-scroll functionality to load more videos
function autoScrollToLoadVideos(targetCount, maxScrollTime = 60000) {
  return new Promise((resolve) => {
    console.log(`🔄 Auto-scrolling to load ${targetCount} videos...`);

    let lastVideoCount = 0;
    let stableCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 100;
    const scrollInterval = 1500; // Increased interval for TikTok's loading
    const maxStableCount = 3; // Stop after 3 stable counts

    isScrolling = true;
    showLoadingBanner(0, targetCount);

    const scrollTimer = setTimeout(() => {
      console.log("⏱️ Max scroll time reached, stopping...");
      stopScrolling();
    }, maxScrollTime);

    function stopScrolling() {
      isScrolling = false;
      clearTimeout(scrollTimer);
      clearInterval(scrollIntervalId);
      hideLoadingBanner();

      const finalCount = document.querySelectorAll(
        'div[data-e2e="user-post-item"]'
      ).length;
      console.log(`✅ Auto-scroll completed. Final video count: ${finalCount}`);
      resolve(finalCount);
    }

    function performScroll() {
      if (!isScrolling) return;

      const currentVideoCount = document.querySelectorAll(
        'div[data-e2e="user-post-item"]'
      ).length;
      console.log(
        `📊 Current videos: ${currentVideoCount}, Target: ${targetCount}, Attempts: ${scrollAttempts}`
      );

      updateLoadingBanner(currentVideoCount, targetCount);

      // Check if we've reached our target
      if (currentVideoCount >= targetCount) {
        console.log("🎯 Target count reached!");
        stopScrolling();
        return;
      }

      // Check if no new videos loaded
      if (currentVideoCount === lastVideoCount) {
        stableCount++;
        console.log(`⚠️ No new videos loaded (stable count: ${stableCount})`);

        if (stableCount >= maxStableCount) {
          console.log("🛑 No more videos loading, stopping scroll");
          stopScrolling();
          return;
        }
      } else {
        stableCount = 0; // Reset stable count when new videos load
        lastVideoCount = currentVideoCount;
      }

      // Check max attempts
      if (scrollAttempts >= maxScrollAttempts) {
        console.log("🛑 Max scroll attempts reached");
        stopScrolling();
        return;
      }

      // Perform the scroll
      const scrollHeight = document.body.scrollHeight;
      const currentScroll = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Scroll to bottom
      window.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });

      scrollAttempts++;

      // Also try scrolling by viewport height if we're not at the bottom
      setTimeout(() => {
        if (isScrolling && currentScroll + windowHeight < scrollHeight) {
          window.scrollBy({
            top: windowHeight * 0.8,
            behavior: "smooth",
          });
        }
      }, 500);
    }

    // Start scrolling
    const scrollIntervalId = setInterval(performScroll, scrollInterval);
    performScroll(); // Initial scroll
  });
}

// Show loading banner during auto-scroll
function showLoadingBanner(current, target) {
  const existingBanner = document.getElementById("tiktok-loading-banner");
  if (existingBanner) existingBanner.remove();

  const banner = document.createElement("div");
  banner.id = "tiktok-loading-banner";

  Object.assign(banner.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #ff0050, #00f2ea)",
    color: "white",
    padding: "15px 25px",
    borderRadius: "12px",
    zIndex: "10002",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    minWidth: "300px",
    textAlign: "center",
  });

  updateLoadingBannerContent(banner, current, target);
  document.body.appendChild(banner);
}

// Update loading banner content
function updateLoadingBannerContent(banner, current, target) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  banner.innerHTML = `
    <div style="margin-bottom: 8px;">🔄 Loading TikTok Videos...</div>
    <div style="font-size: 12px; opacity: 0.9;">
      ${current} / ${
    target === 999999 ? "All" : target
  } videos loaded (${Math.round(percentage)}%)
    </div>
    <div style="background: rgba(255,255,255,0.3); height: 4px; border-radius: 2px; margin-top: 8px; overflow: hidden;">
      <div style="background: white; height: 100%; width: ${percentage}%; transition: width 0.3s ease; border-radius: 2px;"></div>
    </div>
  `;
}

// Update loading banner
function updateLoadingBanner(current, target) {
  const banner = document.getElementById("tiktok-loading-banner");
  if (banner) {
    updateLoadingBannerContent(banner, current, target);
  }
}

// Hide loading banner
function hideLoadingBanner() {
  const banner = document.getElementById("tiktok-loading-banner");
  if (banner) {
    banner.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => banner.remove(), 300);
  }
}

// Main sorting function with auto-scroll support
async function performSort(sortType, noItems = "25_reels") {
  try {
    console.log("🎯 Starting sort:", sortType, "| Requested amount:", noItems);

    const requestedCount = getRequestedCount(noItems);

    // Step 1: Check current video count
    let currentVideoCount = document.querySelectorAll(
      'div[data-e2e="user-post-item"]'
    ).length;
    console.log("📊 Initial videos on page:", currentVideoCount);

    // Step 2: Auto-scroll if we need more videos
    if (currentVideoCount < requestedCount && requestedCount < 999999) {
      console.log(
        `🔄 Need to load more videos (have: ${currentVideoCount}, need: ${requestedCount})`
      );

      try {
        await autoScrollToLoadVideos(requestedCount);
        currentVideoCount = document.querySelectorAll(
          'div[data-e2e="user-post-item"]'
        ).length;
        console.log(`📊 After auto-scroll: ${currentVideoCount} videos loaded`);
      } catch (error) {
        console.error("❌ Auto-scroll error:", error);
        showMessage("Error during auto-scroll: " + error.message, "error");
      }
    } else if (requestedCount === 999999) {
      console.log("🔄 Loading all available videos...");
      try {
        await autoScrollToLoadVideos(999999, 120000); // 2 minutes max for "all"
        currentVideoCount = document.querySelectorAll(
          'div[data-e2e="user-post-item"]'
        ).length;
        console.log(`📊 After loading all: ${currentVideoCount} videos loaded`);
      } catch (error) {
        console.error("❌ Auto-scroll error:", error);
        showMessage("Error during auto-scroll: " + error.message, "error");
      }
    }

    // Step 3: Get final video elements
    const videoItems = document.querySelectorAll(
      'div[data-e2e="user-post-item"]'
    );

    if (videoItems.length === 0) {
      showMessage("No videos found to sort", "error");
      return;
    }

    // Step 4: Extract and sort video data
    const allVideoData = extractVideoData(videoItems);
    const limitedVideoData = allVideoData.slice(
      0,
      Math.min(requestedCount, allVideoData.length)
    );

    console.log(
      `🔢 Processing ${limitedVideoData.length} videos (requested: ${requestedCount})`
    );

    const sorted = sortVideoData(limitedVideoData, sortType);
    updateDisplay(sorted, sortType, requestedCount);

    sortedVideos = sorted;
    console.log("✅ Sort completed!");

    showMessage(
      `✅ Successfully sorted ${sorted.length} TikTok videos!`,
      "success"
    );
  } catch (error) {
    console.error("❌ Sort error:", error);
    showMessage("Error sorting videos: " + error.message, "error");
  }
}

// Extract video data (only views - the only real stat available)
function extractVideoData(videoItems) {
  return Array.from(videoItems).map((item, index) => {
    // Get views (the only stat TikTok shows in profile)
    const viewsElement = item.querySelector('[data-e2e="video-views"]');
    let views = 0;

    if (viewsElement) {
      const viewText = viewsElement.textContent.trim();
      views = parseViewCount(viewText);
    }

    // Get video URL for ID
    const linkEl = item.querySelector("a");
    const videoUrl = linkEl ? linkEl.href : "";
    const videoId =
      videoUrl.split("/video/")[1]?.split("?")[0] || `video_${index}`;

    return {
      element: item,
      videoId: videoId,
      views: views,
      originalIndex: index,
    };
  });
}

// Parse view count text to number
function parseViewCount(viewText) {
  if (!viewText) return 0;

  const cleanText = viewText.replace(/[,\s]/g, "");
  let num = parseFloat(cleanText.replace(/[KMB]/gi, ""));

  if (cleanText.toUpperCase().includes("K")) {
    num *= 1000;
  } else if (cleanText.toUpperCase().includes("M")) {
    num *= 1000000;
  } else if (cleanText.toUpperCase().includes("B")) {
    num *= 1000000000;
  }

  return Math.floor(num);
}

// Sort video data - SIMPLIFIED to views and date only
function sortVideoData(videoData, sortType) {
  const sorted = [...videoData];

  switch (sortType) {
    case "views":
      sorted.sort((a, b) => b.views - a.views);
      console.log(
        "📊 Sorted by views - Top 3:",
        sorted.slice(0, 3).map((v) => ({ id: v.videoId, views: v.views }))
      );
      break;

    case "oldest":
      sorted.sort((a, b) => a.originalIndex - b.originalIndex);
      console.log("📊 Sorted by oldest first");
      break;

    default:
      sorted.sort((a, b) => b.views - a.views);
      console.log("📊 Default: sorted by views");
  }

  return sorted;
}

// Update display
function updateDisplay(sortedData, sortType, requestedCount) {
  const container = document.querySelector(
    'div[data-e2e="user-post-item-list"]'
  );

  if (!container) {
    console.error("❌ Container not found");
    return;
  }

  // Clear and re-add sorted videos
  container.innerHTML = "";
  sortedData.forEach((video) => {
    container.appendChild(video.element);
  });

  // Add simple banner
  addSimpleBanner(sortedData.length, sortType, requestedCount);

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Simple banner - only title and export
function addSimpleBanner(actualCount, sortType, requestedCount) {
  const existingBanner = document.getElementById("tiktok-sort-banner");
  if (existingBanner) existingBanner.remove();

  const banner = document.createElement("div");
  banner.id = "tiktok-sort-banner";

  // Style the banner
  Object.assign(banner.style, {
    position: "sticky",
    top: "0",
    background: "linear-gradient(135deg, #ff0050, #00f2ea)",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: "10000",
    marginBottom: "15px",
    borderRadius: "8px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  // Left side - sort info
  const leftDiv = document.createElement("div");

  const titleDiv = document.createElement("div");
  titleDiv.style.fontSize = "16px";
  titleDiv.style.fontWeight = "600";
  titleDiv.textContent = getSortTitle(sortType);

  const subtitleDiv = document.createElement("div");
  subtitleDiv.style.fontSize = "12px";
  subtitleDiv.style.opacity = "0.9";

  // Show if we got less videos than requested
  if (actualCount < requestedCount && requestedCount < 999999) {
    subtitleDiv.textContent = `${actualCount} of ${requestedCount} requested TikToks • Sorted by Sort Feed`;
  } else {
    subtitleDiv.textContent = `${actualCount} TikTok videos • Sorted by Sort Feed`;
  }

  leftDiv.appendChild(titleDiv);
  leftDiv.appendChild(subtitleDiv);

  // Right side - export only
  const rightDiv = document.createElement("div");

  const exportSelect = document.createElement("select");
  exportSelect.style.cssText = `
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
  `;

  exportSelect.innerHTML = `
    <option value="">📤 Export</option>
    <option value="csv">CSV File</option>
    <option value="json">JSON File</option>
  `;

  exportSelect.addEventListener("change", function () {
    if (this.value) {
      exportTikTokData(this.value);
      this.selectedIndex = 0;
    }
  });

  rightDiv.appendChild(exportSelect);

  banner.appendChild(leftDiv);
  banner.appendChild(rightDiv);

  // Insert banner
  const container = document.querySelector(
    'div[data-e2e="user-post-item-list"]'
  );
  if (container && container.parentElement) {
    container.parentElement.insertBefore(banner, container);
  }
}

// Get title for sort type - SIMPLIFIED
function getSortTitle(sortType) {
  const titles = {
    views: "👀 Most Viewed TikToks",
    oldest: "🕐 Oldest TikToks",
  };
  return titles[sortType] || "👀 Most Viewed TikToks";
}

// Export functionality
function exportTikTokData(format = "csv") {
  if (!sortedVideos || sortedVideos.length === 0) {
    showMessage("No sorted videos to export. Please sort first!", "error");
    return;
  }

  console.log(
    `📤 Exporting ${sortedVideos.length} videos as ${format.toUpperCase()}`
  );

  const username = window.location.pathname.replace("/@", "").split("/")[0];

  if (format === "csv") {
    exportAsCSV(sortedVideos, username);
  } else if (format === "json") {
    exportAsJSON(sortedVideos, username);
  }
}

// Export as CSV
function exportAsCSV(videos, username) {
  const headers = [
    "Profile",
    "TikTok URL",
    "Video ID",
    "Views",
    "Views Formatted",
  ];

  const rows = videos.map((video) => [
    username,
    `https://www.tiktok.com/@${username}/video/${video.videoId}`,
    video.videoId,
    video.views,
    formatViewCount(video.views),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  downloadFile(csv, `${username}_tiktok_videos.csv`, "text/csv");
  showMessage(`✅ Exported ${videos.length} videos to CSV`, "success");
}

// Export as JSON
function exportAsJSON(videos, username) {
  const exportData = videos.map((video) => ({
    profile: username,
    tiktok_url: `https://www.tiktok.com/@${username}/video/${video.videoId}`,
    video_id: video.videoId,
    views: video.views,
    views_formatted: formatViewCount(video.views),
  }));

  const json = JSON.stringify(
    {
      profile: username,
      export_date: new Date().toISOString(),
      total_videos: videos.length,
      videos: exportData,
    },
    null,
    2
  );

  downloadFile(json, `${username}_tiktok_videos.json`, "application/json");
  showMessage(`✅ Exported ${videos.length} videos to JSON`, "success");
}

// Format view count for display
function formatViewCount(views) {
  if (views >= 1000000000) {
    return (views / 1000000000).toFixed(1) + "B";
  } else if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views.toString();
}

// Download file helper
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// Show message to user
function showMessage(text, type = "info") {
  const existingMsg = document.getElementById("tiktok-sort-message");
  if (existingMsg) existingMsg.remove();

  const message = document.createElement("div");
  message.id = "tiktok-sort-message";

  let bgColor;
  switch (type) {
    case "error":
      bgColor = "rgba(220, 38, 127, 0.95)";
      break;
    case "success":
      bgColor = "rgba(34, 197, 94, 0.95)";
      break;
    default:
      bgColor = "rgba(255, 193, 7, 0.95)";
  }

  Object.assign(message.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: bgColor,
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    zIndex: "10001",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    maxWidth: "400px",
    textAlign: "center",
  });

  message.textContent = text;
  document.body.appendChild(message);

  setTimeout(
    () => {
      if (message.parentElement) {
        message.remove();
      }
    },
    type === "success" ? 6000 : 4000
  );
}

// Manual functions for testing
function setupManualFunctions() {
  window.sortTikTokByViews = (amount = "25_reels") =>
    performSort("views", amount);
  window.sortTikTokByOldest = (amount = "25_reels") =>
    performSort("oldest", amount);
  window.sortTikTokAll = () => performSort("views", "all_reels");
  window.exportTikTokCSV = () => exportTikTokData("csv");
  window.exportTikTokJSON = () => exportTikTokData("json");
  window.stopTikTokScroll = () => {
    isScrolling = false;
    hideLoadingBanner();
  };

  window.debugTikTokSorter = () => {
    console.log("🔍 TikTok Sorter Debug:");
    console.log(
      "- Videos on page:",
      document.querySelectorAll('div[data-e2e="user-post-item"]').length
    );
    console.log("- Sorted videos:", sortedVideos ? sortedVideos.length : 0);
    console.log("- Is scrolling:", isScrolling);
    console.log(
      "- Sample view counts:",
      sortedVideos
        ? sortedVideos.slice(0, 5).map((v) => `${v.videoId}: ${v.views}`)
        : []
    );
  };
}

// Add CSS for animations
function addStyles() {
  if (document.getElementById("tiktok-sorter-styles")) return;

  const style = document.createElement("style");
  style.id = "tiktok-sorter-styles";
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: translateX(-50%) translateY(0); }
      to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    addStyles();
    initTikTokSorter();
  });
} else {
  addStyles();
  initTikTokSorter();
}

setTimeout(() => {
  addStyles();
  initTikTokSorter();
}, 1000);

console.log("✅ Enhanced TikTok Sorter Loaded!");
console.log("💡 Features: Auto-scroll + Views sorting + CSV/JSON export");
console.log(
  "💡 Manual test: sortTikTokByViews('100_reels') or sortTikTokAll()"
);
console.log("💡 Stop scrolling: stopTikTokScroll()");
