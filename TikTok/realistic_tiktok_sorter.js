// Simple TikTok Sorter - Views Only
// File: Tiktok/realistic_tiktok_sorter.js

console.log("🚀 Simple TikTok Sorter Loading...");

let sortedVideos = null;

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

// Main sorting function - FIXED BUG HERE
function performSort(sortType, noItems = "25_reels") {
  try {
    console.log("🎯 Starting sort:", sortType, "| Requested amount:", noItems);

    const videoItems = document.querySelectorAll(
      'div[data-e2e="user-post-item"]'
    );
    console.log("📊 Found videos on page:", videoItems.length);

    if (videoItems.length === 0) {
      showMessage("No videos found to sort", "error");
      return;
    }

    // Extract all video data
    const allVideoData = extractVideoData(videoItems);

    // 🔧 BUG FIX: Limit to requested amount
    const requestedCount = getRequestedCount(noItems);
    const limitedVideoData = allVideoData.slice(0, requestedCount);

    console.log(
      `🔢 Limited to ${limitedVideoData.length} videos (requested: ${requestedCount})`
    );

    // Sort the limited data
    const sorted = sortVideoData(limitedVideoData, sortType);
    updateDisplay(sorted, sortType, requestedCount);

    sortedVideos = sorted;
    console.log("✅ Sort completed!");
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
  let num = parseFloat(cleanText.replace(/[KM]/gi, ""));

  if (cleanText.toUpperCase().includes("K")) {
    num *= 1000;
  } else if (cleanText.toUpperCase().includes("M")) {
    num *= 1000000;
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

    // Remove all other sort types since TikTok only shows views
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

  // Scroll to top
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

// Export functionality - same as before
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
  showMessage(`✅ Exported ${videos.length} videos to CSV`, "info");
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
  showMessage(`✅ Exported ${videos.length} videos to JSON`, "info");
}

// Format view count for display
function formatViewCount(views) {
  if (views >= 1000000) {
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

  const bgColor =
    type === "error" ? "rgba(220, 38, 127, 0.9)" : "rgba(255, 193, 7, 0.9)";

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
  });

  message.textContent = text;
  document.body.appendChild(message);

  setTimeout(() => {
    if (message.parentElement) {
      message.remove();
    }
  }, 4000);
}

// Manual functions for testing
function setupManualFunctions() {
  window.sortTikTokByViews = () => performSort("views", "25_reels");
  window.sortTikTokByOldest = () => performSort("oldest", "25_reels");
  window.exportTikTokCSV = () => exportTikTokData("csv");
  window.exportTikTokJSON = () => exportTikTokData("json");

  window.debugTikTokSorter = () => {
    console.log("🔍 TikTok Sorter Debug:");
    console.log(
      "- Videos on page:",
      document.querySelectorAll('div[data-e2e="user-post-item"]').length
    );
    console.log("- Sorted videos:", sortedVideos ? sortedVideos.length : 0);
    console.log(
      "- Sample view counts:",
      sortedVideos
        ? sortedVideos.slice(0, 5).map((v) => `${v.videoId}: ${v.views}`)
        : []
    );
  };
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTikTokSorter);
} else {
  initTikTokSorter();
}

setTimeout(initTikTokSorter, 1000);

console.log("✅ Simple TikTok Sorter Loaded!");
console.log("💡 Available: Views sorting + CSV/JSON export");
console.log("💡 Manual test: sortTikTokByViews()");
