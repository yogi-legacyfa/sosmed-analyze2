function handleWarningLabelTikTok() {
  const e = document.getElementById("itemButtonTikTok"),
    t = document.getElementById("dateRangeButtonTikTok"),
    n = document.getElementById("no_reels_selected_tiktok"),
    o = document.getElementById("dates_selected_tiktok"),
    a = document.getElementById("tiktokItemsWarning");
  let i = "item";
  function s() {}
  e.addEventListener("click", function () {
    i = "item";
  }),
    t.addEventListener("click", function () {
      i = "date";
    }),
    n.addEventListener("change", function () {
      i === "item" && void 0;
    }),
    o.addEventListener("change", function () {
      i === "date" && void 0;
    });
}
function handleWarningLabelInsta() {
  const e = document.getElementById("itemButton"),
    t = document.getElementById("dateRangeButton"),
    n = document.getElementById("no_reels_selected"),
    o = document.getElementById("dates_selected"),
    a = document.getElementById("instaItemsWarning"),
    i = document.getElementById("OnlyWorksPosts");
  let s = "item";
  function l() {
    s === "date" && ((i.style.display = "inline"), (a.style.display = "none"));
  }
  e.addEventListener("click", function () {
    (s = "item"), l();
  }),
    t.addEventListener("click", function () {
      (s = "date"), l();
    }),
    n.addEventListener("change", function () {
      s === "item" && l();
    }),
    o.addEventListener("change", function () {
      s === "date" && l();
    }),
    l();
}
document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    let n = e[0].url;
    n.startsWith("https://www.instagram.com")
      ? insta_mode_on()
      : n.startsWith("https://www.tiktok.com")
      ? tiktok_mode_on()
      : zero_state_on();
  });
});
var dateRangeButtonTikTok = document.getElementById("dateRangeButtonTikTok");
dateRangeButtonTikTok.addEventListener("click", function () {
  document.getElementById("dates_selected_tiktok").setAttribute("active", "on"),
    (dateRangeButtonTikTok.className = "itemButtonClassTikTok");
  var e = document.getElementById("itemButtonTikTok");
  (e.className = "dateRangeButtonClassTikTok"),
    document
      .getElementById("no_reels_selected_tiktok")
      .setAttribute("active", "off");
  let t = document.getElementById("no_reels_selected_tiktok");
  t.style.display = "none";
  var n = document.getElementById("dates_selected_tiktok");
  (n.style.display = "flex"),
    (n.className =
      "drop_down_dates_tiktok animate__animated animate__slideInRight"),
    n.style.setProperty("--animate-duration", ".2s");
});
var itemButtonTikTok = document.getElementById("itemButtonTikTok");
itemButtonTikTok.addEventListener("click", function () {
  if (
    document
      .getElementById("no_reels_selected_tiktok")
      .getAttribute("active") !== "on"
  ) {
    document
      .getElementById("no_reels_selected_tiktok")
      .setAttribute("active", "on"),
      (itemButtonTikTok.className = "itemButtonClassTikTok");
    var e = document.getElementById("dateRangeButtonTikTok");
    (e.className = "dateRangeButtonClassTikTok"),
      document
        .getElementById("dates_selected_tiktok")
        .setAttribute("active", "off");
    let n = document.getElementById("dates_selected_tiktok");
    n.style.display = "none";
    var t = document.getElementById("no_reels_selected_tiktok");
    (t.style.display = "flex"),
      (t.className =
        "drop_down_dates_tiktok animate__animated animate__slideInLeft"),
      t.style.setProperty("--animate-duration", ".2s");
  }
});
var dateRangeButton = document.getElementById("dateRangeButton");
dateRangeButton.addEventListener("click", function () {
  document.getElementById("dates_selected").setAttribute("active", "on"),
    (dateRangeButton.className = "itemButtonClass");
  var e = document.getElementById("itemButton");
  (e.className = "dateRangeButtonClass"),
    document.getElementById("no_reels_selected").setAttribute("active", "off");
  let t = document.getElementById("no_reels_selected");
  t.style.display = "none";
  var n = document.getElementById("dates_selected");
  (n.style.display = "flex"),
    (n.className = "drop_down_dates animate__animated animate__slideInRight"),
    n.style.setProperty("--animate-duration", ".2s");
  var o = document.getElementById("OnlyWorksPosts");
  o.style.display = "flex";
  var a = document.getElementsByClassName("TaherSolo")[0];
  a.style.top = "316px";
});
var itemsButton = document.getElementById("itemButton");
itemsButton.addEventListener("click", function () {
  if (
    document.getElementById("no_reels_selected").getAttribute("active") !== "on"
  ) {
    document.getElementById("no_reels_selected").setAttribute("active", "on"),
      (itemsButton.className = "itemButtonClass");
    var e = document.getElementById("dateRangeButton");
    (e.className = "dateRangeButtonClass"),
      document.getElementById("dates_selected").setAttribute("active", "off");
    let a = document.getElementById("dates_selected");
    a.style.display = "none";
    var t = document.getElementById("no_reels_selected");
    (t.style.display = "flex"),
      (t.className = "drop_down_dates animate__animated animate__slideInLeft"),
      t.style.setProperty("--animate-duration", ".2s");
    var n = document.getElementById("OnlyWorksPosts");
    n.style.display = "none";
    var o = document.getElementsByClassName("TaherSolo")[0];
    o.style.top = "298px";
  }
});
function handleTikTokSortClick(e) {
  const t = document.getElementById("no_reels_selected_tiktok"),
    n = document.getElementById("dates_selected_tiktok");
  if (t.getAttribute("active") === "on") {
    const o = t.value;
    chrome.runtime.sendMessage({
      refresh: "ON_TikTok",
      sort_by: e,
      no_items: o,
      dates_items: "items",
    });
  }
}
document
  .getElementById("sortViewsClickTikTok")
  ?.addEventListener("click", () => handleTikTokSortClick("views")),
  document
    .getElementById("sortLikesClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("likes")),
  document
    .getElementById("sortCommentsClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("comments")),
  document
    .getElementById("sortOldestClicksTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("oldest")),
  document
    .getElementById("sortSavesClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("saves")),
  document
    .getElementById("sortSharesClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("shares"));
function handleInstagramSortClick(e) {
  const t = document.getElementById("no_reels_selected"),
    n = document.getElementById("dates_selected");
  if (t.getAttribute("active") === "on") {
    const o = t.value;
    chrome.runtime.sendMessage({
      refresh: "ON",
      sort_by: e,
      no_items: o,
      dates_items: "items",
    });
  } else if (n.getAttribute("active") === "on") {
    const o = n.value;
    chrome.runtime.sendMessage({
      refresh: "ON",
      sort_by: e,
      no_items: o,
      dates_items: "dates",
    });
  }
}
document
  .getElementById("sortViewsClick")
  ?.addEventListener("click", () => handleInstagramSortClick("views")),
  document
    .getElementById("sortLikesClick")
    ?.addEventListener("click", () => handleInstagramSortClick("likes")),
  document
    .getElementById("sortCommentsClick")
    ?.addEventListener("click", () => handleInstagramSortClick("comments")),
  document
    .getElementById("sortOldestClicks")
    ?.addEventListener("click", () => handleInstagramSortClick("oldest"));
function checkUserStatus(e) {
  chrome.runtime.sendMessage({ command: "checkProStatus" }, (t) => {
    const n = t?.isPro;
    e(n);
  });
}
function insta_mode_off() {
  let e = document.getElementsByClassName("InstaMain")[0];
  e.style.display = "none";
}
function tiktok_mode_off() {
  let e = document.getElementsByClassName("TikTokMain")[0];
  e.style.display = "none";
}
function zero_state_off() {
  let e = document.getElementsByClassName("main_nav_div_zero_state")[0];
  e.style.display = "none";
}
function no_taher_image() {
  let e = document.getElementsByClassName("TaherSolo")[0];
  e.style.display = "none";
}
function zero_state_on() {
  insta_mode_off(), tiktok_mode_off();
  let e = document.getElementsByClassName("main_nav_div_zero_state")[0];
  e.style.display = "flex";
  let t = document.getElementById("yellowBox");
  t.style.display = "flex";
  let n = document.getElementsByClassName("TaherSolo")[0];
  n.style.top = "172px";
}
function insta_mode_on() {
  zero_state_off(), tiktok_mode_off();
  let e = document.getElementsByClassName("InstaMain")[0];
  e.style.display = "flex";
  let t = document.getElementById("yellowBox");
  t.style.display = "none";
  let n = document.getElementsByClassName("TaherSolo")[0];
  n.style.top = "298px";
}
function tiktok_mode_on() {
  zero_state_off(), insta_mode_off();
  let e = document.getElementsByClassName("TikTokMain")[0];
  e.style.display = "flex";
  let t = document.getElementById("yellowBox");
  (t.style.display = "none"), (beta_box.style.display = "");
  let n = document.getElementsByClassName("TaherSolo")[0];
  n.style.top = "371px";
}
var instaButton = document.getElementById("instaButton");
instaButton.addEventListener("click", function () {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    chrome.runtime.sendMessage({ zero_state: "instagram" });
  });
});
var tiktokButton = document.getElementById("tiktokButton");
tiktokButton.addEventListener("click", function () {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    chrome.runtime.sendMessage({ zero_state: "tiktok" });
  });
}),
  chrome.runtime.onMessage.addListener((e, t, n) => {
    if (e.sort_feed_error) {
      let o = "";
      if (
        (e.error_type === "back_to_back_sorting"
          ? (o = "Oops! Back-to-back sorting is not supported")
          : e.error_type === "post_views"
          ? (o = "Hmm! Posts don't have views data")
          : e.error_type === "no_posts_reels"
          ? (o = "Sort Feed works on the Posts & Reels tabs only")
          : e.error_type === "profile_pages"
          ? (o = "Oops! Sort Feed works on Profile pages only")
          : e.error_type === "dates_on_reels"
          ? (o = "Sorting by dates only works on Posts")
          : e.error_type === "latest_tab_tiktok"
          ? (o = "Sort Feed only works on Latest")
          : e.error_type === "video_tab_tiktok"
          ? (o = "Sort Feed only works on the Videos tab")
          : e.error_type === "profile_page_tiktok" &&
            (o = "Oops! Sort Feed works on Profile pages only"),
        document.getElementById("error_message") == null)
      ) {
        let i = document.getElementsByClassName("main_div")[0],
          s = document.createElement("div");
        (s.className =
          "warning_message animate__animated animate__bounceInRight"),
          s.style.setProperty("--animate-duration", ".5s"),
          (s.style.cssText =
            "z-index: 100; position: relative; background-color: #fbe8ea; position: absolute; width:100%;"),
          (s.id = "error_message"),
          (s.innerHTML = `
           <p class="warning_text">
           <img src="Icons/ButtonIcons/errorIcon.svg" alt="Error Icon" style="width: 13px; vertical-align: middle; margin-right: 5px;margin-top: -0.1rem;">
           ${o}
           </p>
           `),
          i.insertBefore(s, i.firstChild),
          setTimeout(() => {
            s.remove();
          }, 4500);
      }
    }
  });
