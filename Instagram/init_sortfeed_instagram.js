function post_tab_check(e) {
  let s = e.replace(/^\/|\/$/g, "").split("/");
  const t = e.includes("reels") || e.includes("tagged");
  if (s.length >= 1 && !t) return !0;
}
function reels_tab_check(e) {
  return e.includes("reels");
}
function handle_errors_instagram(e, s) {
  if (
    (console.log("handle_errors HAPPENED"),
    document.getElementById("banner_most_viewed_reels") !== null)
  )
    return (
      chrome.runtime.sendMessage({
        sort_feed_error: !0,
        error_type: "back_to_back_sorting",
      }),
      !1
    );
  {
    let t = document.querySelectorAll('[role="tablist"]')[0];
    if (typeof t < "u") {
      let r = t
        .querySelectorAll('[aria-selected="true"]')[0]
        .getAttribute("href");
      return post_tab_check(r)
        ? e === "views"
          ? (chrome.runtime.sendMessage({
              sort_feed_error: !0,
              error_type: "post_views",
            }),
            !1)
          : (sessionStorage.setItem("sortFeedPostsVSReels", "Posts"), !0)
        : reels_tab_check(r)
        ? s === "dates"
          ? (chrome.runtime.sendMessage({
              sort_feed_error: !0,
              error_type: "dates_on_reels",
            }),
            !1)
          : (sessionStorage.setItem("sortFeedPostsVSReels", "Reels"), !0)
        : (console.log("SEND ERROR"),
          chrome.runtime.sendMessage({
            sort_feed_error: !0,
            error_type: "no_posts_reels",
          }),
          !1);
    } else
      return (
        console.log("PROFILE PAGE ERROR ON INSTA"),
        chrome.runtime.sendMessage({
          sort_feed_error: !0,
          error_type: "profile_pages",
        }),
        !1
      );
  }
}
async function clear_db() {
  const e = await openDB(),
    s = e.transaction("TabData", "readwrite");
  await s.objectStore("TabData").clear(),
    await s.done,
    e.close(),
    console.log("Cleaned up all data in TabData store");
}
chrome.runtime.onMessage.addListener((e, s, t) => {
  e.action === "refreshPage" &&
    (console.log("refreshPage HAPPENED"),
    handle_errors_instagram(e.sort_by, e.dates_items) &&
      (sessionStorage.removeItem("sortFeedSortBy"),
      sessionStorage.removeItem("sortFeedNoItems"),
      sessionStorage.removeItem("sortFeedStatus"),
      sessionStorage.removeItem("sortItemsVsDates"),
      sessionStorage.removeItem("sortFeedData"),
      clear_db(),
      sessionStorage.setItem("sortFeedSortBy", e.sort_by),
      sessionStorage.setItem("sortFeedNoItems", e.no_items),
      sessionStorage.setItem("sortFeedStatus", !0),
      sessionStorage.setItem("sortItemsVsDates", e.dates_items),
      window.location.reload(),
      setTimeout(() => {
        chrome.runtime.sendMessage({ overlay: !0 });
      }, 500)));
});
