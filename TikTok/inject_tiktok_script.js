if (
  location.hostname === "www.tiktok.com" ||
  location.hostname === "tiktok.com"
) {
  var s = document.createElement("script");
  (s.src = chrome.runtime.getURL("Tiktok/script_tiktok.js")),
    (s.onload = function () {
      this.remove();
    }),
    (document.head || document.documentElement).appendChild(s);
}
