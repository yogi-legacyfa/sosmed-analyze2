function exportToExcel(o = null, s = null, t = null) {
  let n = [],
    r = [];
  t === "Posts"
    ? ((n = [
        "Profile",
        "Post",
        "Create Date",
        "Likes",
        "Comments",
        "Captions",
      ]),
      (r = s.map((e) => {
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
        return [e.userName, c, d, e.likesCount, e.commentsCount, e.caption];
      })))
    : t === "Reels" &&
      ((n = ["Profile", "Reel", "Views", "Likes", "Comments"]),
      (r = s.map((e) => {
        const c = `https://www.instagram.com/${e.userName}/reel/${e.code}/`;
        return [e.userName, c, e.viewCount, e.likesCount, e.commentsCount];
      })));
  const a = [n, ...r],
    l = XLSX.utils.aoa_to_sheet(a),
    u = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(u, l, t);
  const i = `${o} ${t}.xlsx`;
  XLSX.writeFile(u, i);
}
chrome.runtime.onMessage.addListener((o, s, t) => {
  if (o.export_click_background && o.export_format === "excel") {
    const n = o.sorted_data[0].userName,
      r = o.sorted_data,
      a = o.posts_vs_reels;
    exportToExcel(n, r, a);
  }
});
