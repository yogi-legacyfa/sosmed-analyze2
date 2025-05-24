function handle_errors_tiktok(e, r) {
  if (document.getElementById("banner_most_viewed_reels") !== null)
    return (
      chrome.runtime.sendMessage({
        sort_feed_error: !0,
        error_type: "back_to_back_sorting",
      }),
      !1
    );

  // Check if we're on the videos tab
  let videosTab = document.querySelector('[data-e2e="videos-tab"]');
  if (videosTab === null) {
    console.log("VIDEOS TAB NOT FOUND ON TIKTOK");
    chrome.runtime.sendMessage({
      sort_feed_error: !0,
      error_type: "profile_page_tiktok",
    });
    return !1;
  }

  if (videosTab.getAttribute("aria-selected") !== "true") {
    chrome.runtime.sendMessage({
      sort_feed_error: !0,
      error_type: "video_tab_tiktok",
    });
    return !1;
  }

  // TikTok has removed the Latest/Popular toggle buttons
  // If we're on the Videos tab, we can proceed with sorting
  console.log("TikTok Videos tab confirmed - proceeding with sort");
  return true;
}

chrome.runtime.onMessage.addListener((e, r, t) => {
  e.action === "refreshPageTikTok" &&
    (console.log("It's working!"),
    handle_errors_tiktok(e.sort_by, e.dates_items) &&
      (sessionStorage.removeItem("sortFeedSortBy"),
      sessionStorage.removeItem("sortFeedNoItems"),
      sessionStorage.removeItem("sortFeedStatus"),
      sessionStorage.removeItem("sortItemsVsDates"),
      sessionStorage.removeItem("sortFeedStatusTikTok"),
      sessionStorage.removeItem("sortFeedData"),
      sessionStorage.removeItem("sortFeedStopSorting"),
      sessionStorage.setItem("sortFeedSortBy", e.sort_by),
      sessionStorage.setItem("sortFeedNoItems", e.no_items),
      sessionStorage.setItem("sortItemsVsDates", e.dates_items),
      window.location.reload()));
});
