if (
  location.hostname === "www.instagram.com" ||
  location.hostname === "instagram.com"
) {
  var s = document.createElement("script");
  (s.src = chrome.runtime.getURL("Instagram/script_instagram.js")),
    (s.onload = function () {
      this.remove();
    }),
    (document.head || document.documentElement).appendChild(s);
}
