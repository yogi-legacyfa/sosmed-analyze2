function handle_errors_tiktok(e, r) {
  if (document.getElementById("banner_most_viewed_reels") !== null)
    return (
      chrome.runtime.sendMessage({
        sort_feed_error: !0,
        error_type: "back_to_back_sorting",
      }),
      !1
    );
  {
    let t = document.querySelector('[data-e2e="videos-tab"]');
    if (t !== null)
      if (t.getAttribute("aria-selected") === "true") {
        let o = document.querySelector('div[data-compact="true"]');
        return Array.from(o.querySelectorAll("button")).findIndex(
          (s) => s.getAttribute("data-active") === "true"
        ) === 0
          ? !0
          : (chrome.runtime.sendMessage({
              sort_feed_error: !0,
              error_type: "latest_tab_tiktok",
            }),
            !1);
      } else
        return (
          chrome.runtime.sendMessage({
            sort_feed_error: !0,
            error_type: "video_tab_tiktok",
          }),
          !1
        );
    else
      return (
        console.log("PROFILE PAGE ERROR ON TIKTOK"),
        chrome.runtime.sendMessage({
          sort_feed_error: !0,
          error_type: "profile_page_tiktok",
        }),
        !1
      );
  }
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
      sessionStorage.setItem("sortFeedStatusTikTok", !0),
      sessionStorage.setItem("sortItemsVsDates", e.dates_items),
      window.location.reload()));
});
