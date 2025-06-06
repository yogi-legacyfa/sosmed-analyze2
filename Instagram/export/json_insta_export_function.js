function exportToJSON(t = null, u = null, o = null) {
  const r = `${t} ${o}.json`,
    s = u.map((e) => {
      if (o === "Posts") {
        const c = [1, 8].includes(e.mediaType)
            ? `https://www.instagram.com/${e.userName}/p/${e.code}/`
            : `https://www.instagram.com/${e.userName}/reel/${e.code}/`,
          d = new Date(e.createDate).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: !0,
          });
        return {
          Profile: e.userName,
          Post: c,
          "Create Date": d,
          Likes: e.likesCount,
          Comments: e.commentsCount,
          Captions: e.caption,
        };
      }
      if (o === "Reels") {
        const c = `https://www.instagram.com/${e.userName}/reel/${e.code}/`;
        return {
          Profile: e.userName,
          Reel: c,
          Views: e.viewCount,
          Likes: e.likesCount,
          Comments: e.commentsCount,
        };
      }
      return {};
    }),
    a = new Blob([JSON.stringify(s, null, 2)], {
      type: "application/json;charset=utf-8;",
    }),
    n = document.createElement("a"),
    l = URL.createObjectURL(a);
  n.setAttribute("href", l),
    n.setAttribute("download", r),
    (n.style.visibility = "hidden"),
    document.body.appendChild(n),
    n.click(),
    document.body.removeChild(n);
}
chrome.runtime.onMessage.addListener((t, u, o) => {
  if (t.export_click_background && t.export_format === "json") {
    const r = t.sorted_data[0].userName,
      s = t.sorted_data,
      a = t.posts_vs_reels;
    exportToJSON(r, s, a);
  }
});
