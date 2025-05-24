function exportToCSV(n = null, d = null, o = null) {
  if (o === "Posts") {
    const c = ["Profile", "Post", "Create Date", "Likes", "Comments"],
      r = d.map((e) => {
        const a = [1, 8].includes(e.mediaType)
            ? `https://www.instagram.com/${e.userName}/p/${e.code}/`
            : `https://www.instagram.com/${e.userName}/reel/${e.code}/`,
          i = new Date(e.createDate).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: !0,
          });
        return [e.userName, a, `"${i}"`, e.likesCount, e.commentsCount];
      }),
      s = [c, ...r].map((e) => e.join(",")).join(`
`),
      l = new Blob([s], { type: "text/csv;charset=utf-8;" }),
      t = document.createElement("a");
    if (t.download !== void 0) {
      const e = URL.createObjectURL(l);
      t.setAttribute("href", e),
        t.setAttribute("download", `${n} ${o}.csv`),
        (t.style.visibility = "hidden"),
        document.body.appendChild(t),
        t.click(),
        document.body.removeChild(t);
    }
  } else if (o === "Reels") {
    const c = ["Profile", "Reel", "Views", "Likes", "Comments"],
      r = d.map((e) => {
        const a = `https://www.instagram.com/${e.userName}/reel/${e.code}/`;
        return [e.userName, a, e.viewCount, e.likesCount, e.commentsCount];
      }),
      s = [c, ...r].map((e) => e.join(",")).join(`
`),
      l = new Blob([s], { type: "text/csv;charset=utf-8;" }),
      t = document.createElement("a");
    if (t.download !== void 0) {
      const e = URL.createObjectURL(l);
      t.setAttribute("href", e),
        t.setAttribute("download", `${n} ${o}.csv`),
        (t.style.visibility = "hidden"),
        document.body.appendChild(t),
        t.click(),
        document.body.removeChild(t);
    }
  }
}
chrome.runtime.onMessage.addListener((n, d, o) => {
  if (n.export_click_background && n.export_format === "csv") {
    console.log("export_click_background");
    let c = n.sorted_data[0].userName,
      r = n.sorted_data,
      s = n.posts_vs_reels;
    exportToCSV(c, r, s);
  }
});
