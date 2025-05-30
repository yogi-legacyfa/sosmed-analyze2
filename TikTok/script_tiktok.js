let isSortingSessionActive = !1;
const inMemoryFeedData = { items: [] };
function save_data_locally_again(t) {
  return inMemoryFeedData.items.push(t), inMemoryFeedData.items;
}
function reset_in_memory_feed_data() {
  inMemoryFeedData.items = [];
}
function createMetadataJsonTikTok(t) {
  let e = {},
    o = t?.createTime,
    s = o ? o * 1e3 : null;
  (e.createDate = s ? new Date(s).toISOString() : ""),
    (e.code = t?.id || ""),
    (e.userName = t?.author?.uniqueId || ""),
    (e.viewCount = t?.stats?.playCount ?? null),
    (e.likesCount = t?.stats?.diggCount ?? null),
    (e.commentsCount = t?.stats?.commentCount ?? null),
    (e.shareCount = t?.stats?.shareCount ?? null),
    (e.savesCount = t?.stats?.collectCount ?? null);
  const l = typeof t?.desc == "string" && t.desc.trim() !== "" ? t.desc : " ";
  return (e.caption = l), e;
}
function save_data_locally_tiktok(t) {
  if (sessionStorage.getItem("sortFeedData") !== null) {
    let e = JSON.parse(sessionStorage.getItem("sortFeedData"));
    return (
      e.push(t), sessionStorage.setItem("sortFeedData", JSON.stringify(e)), e
    );
  } else {
    let e = [];
    return (
      e.push(t), sessionStorage.setItem("sortFeedData", JSON.stringify(e)), e
    );
  }
}
function startSmartScroll() {
  let t = 0,
    e = 0;
  const o = 15,
    s = 100;
  let l = null,
    r = !1;
  function n() {
    if (r) return;
    const i = document.body.scrollHeight;
    i > t
      ? (window.scrollTo(0, i), (t = i), (e = 0))
      : (window.scrollBy(0, 200), e++),
      e < o
        ? (l = setTimeout(n, s))
        : console.log("No more content to load or hit max attempts.");
  }
  return (
    n(),
    function () {
      (r = !0),
        l && clearTimeout(l),
        console.log("Smart scroll manually stopped.");
    }
  );
}
function send_items_collected_no(t) {
  if (t !== null)
    try {
      let e = t.length;
      window.postMessage({ item_collected_no: !0, number_items: e }, "*");
    } catch (e) {
      console.error("Error sending message", e);
    }
}
function insta_banner_notification(t) {
  if (t !== null)
    try {
      let e = t.length;
      window.postMessage({ insta_banner_notification: !0, count: e }, "*");
    } catch (e) {
      console.error("Error sending message", e);
    }
}
function removeSortFeedBannerMessage() {
  window.postMessage({ insta_banner_notification_remove: !0 }, "*");
}
function find_element_tiktok(t, e = 30, o = 200) {
  return new Promise((s) => {
    const l = () => {
      const r = document.querySelector(`a[href*="${t}"]`);
      if (r) {
        const n = r.closest('div[data-e2e="user-post-item"]');
        if (!n) return s(null);
        n.scrollIntoView({ behavior: "smooth", block: "center" });
        const i = () => {
          const m = n.querySelector("img")?.getAttribute("src") || "";
          m && !m.startsWith("data:image/gif")
            ? s(n)
            : e > 0
            ? (e--, setTimeout(i, o))
            : s(n);
        };
        setTimeout(i, 300);
      } else e > 0 ? (e--, setTimeout(l, o)) : s(null);
    };
    l();
  });
}
function update_data_object_with_element_tiktok(t, e) {
  return (t.element = e.outerHTML), t;
}
function scrollLikeHumanToBottom(t = 5, e = 50) {
  const o = () => {
    const s = document.body.scrollHeight - window.innerHeight;
    window.scrollY < s && (window.scrollBy(0, e), setTimeout(o, t));
  };
  o();
}
async function sort_videos_tiktok(t, e, o, s) {
  return new Promise(async (l) => {
    for (let r = 0; r < t; r++) {
      let n = e[r],
        i = createMetadataJsonTikTok(n),
        d = await find_element_tiktok(i.code),
        m = update_data_object_with_element_tiktok(i, d),
        a = save_data_locally_again(m);
      send_items_collected_no(a), insta_banner_notification(a);
      let c = sessionStorage.getItem("sortFeedStopSorting");
      if (c === "on") {
        console.log("Case 0"),
          console.log(c),
          console.log(a.length),
          removeSortFeedBannerMessage(),
          l({ itemsCleaned: a });
        return;
      } else if (a.length === o) {
        console.log("Case 01"),
          console.log(c),
          console.log(a.length),
          sessionStorage.removeItem("sortFeedStatusTikTok"),
          l({ itemsCleaned: a });
        return;
      } else if (r === t - 1 && s === !1) {
        console.log("Case 02"),
          console.log(c),
          console.log(a.length),
          sessionStorage.removeItem("sortFeedStatusTikTok"),
          l({ itemsCleaned: a });
        return;
      } else if (r === t - 1 && s === !0) {
        console.log("Case 03"), console.log(c), console.log(a.length);
        return;
      }
    }
  });
}
function return_sort_selection() {
  const t = sessionStorage.getItem("sortFeedNoItems");
  if (t === "all_reels") return 1e4;
  const e = t.match(/^(\d+)_reels$/);
  return e ? parseInt(e[1], 10) : null;
}
function sort_items_tiktok(t, e) {
  return e === "views"
    ? [...t].sort((o, s) => s.viewCount - o.viewCount)
    : e === "likes"
    ? [...t].sort((o, s) => s.likesCount - o.likesCount)
    : e === "comments"
    ? [...t].sort((o, s) => s.commentsCount - o.commentsCount)
    : e === "saves"
    ? [...t].sort((o, s) => s.savesCount - o.savesCount)
    : e === "shares"
    ? [...t].sort((o, s) => s.shareCount - o.shareCount)
    : e === "oldest"
    ? [...t].reverse()
    : 0;
}
function return_date_range(t) {
  let e = new Date(),
    o = new Date();
  if (t === "1_week") return e.setDate(o.getDate() - 7), [e, o];
  if (t === "1_month") return e.setDate(o.getDate() - 30), [e, o];
  if (t === "3_month") return e.setDate(o.getDate() - 90), [e, o];
  if (t === "6_month") return e.setDate(o.getDate() - 180), [e, o];
  if (t === "1_year") return e.setDate(o.getDate() - 360), [e, o];
  if (t === "all_reels") return e.setDate(o.getDate() - 3600), [e, o];
}
function is_create_date_in_range(t, e, o) {
  const s = new Date(t);
  if (isNaN(s) || isNaN(e) || isNaN(o)) throw new Error("Invalid date format");
  return s >= e && s < o;
}
async function sort_videos_tiktok_dates(t, e, o, s, l, r) {
  return new Promise(async (n) => {
    for (let i = 0; i < t; i++) {
      let d = e[i],
        m = createMetadataJsonTikTok(d),
        a = await find_element_tiktok(m.code),
        c = update_data_object_with_element_tiktok(m, a),
        g = c.createDate;
      if (is_create_date_in_range(g, l, r) && i !== t - 1) {
        let u = save_data_locally_again(c);
        send_items_collected_no(u);
      } else if (is_create_date_in_range(g, l, r) && i === t - 1 && s === !1) {
        let u = save_data_locally_again(c);
        send_items_collected_no(u), n(u);
      } else if (is_create_date_in_range(g, l, r) && i === t - 1 && s === !0) {
        let u = save_data_locally_again(c);
        send_items_collected_no(u);
      } else if (!is_create_date_in_range(g, l, r)) {
        if (d.isPinnedItem) continue;
        {
          let u = inMemoryFeedData.items;
          n(u);
          break;
        }
      }
    }
  });
}
function remove_overlay() {
  document.getElementById("overlay_sort_reels").remove();
}
function send_add_overlay_msg() {
  document.getElementById("overlay_sort_reels") ||
    window.postMessage({ overlay_on: !0 }, "*");
}
(function () {
  const t = window.fetch;
  window.fetch = async function (...e) {
    try {
      let o = e[0],
        s =
          o instanceof Request ? o.url : new URL(o, window.location.href).href;
      if (
        s.includes("api/post/item_list/") &&
        sessionStorage.getItem("sortFeedStatusTikTok") &&
        sessionStorage.getItem("sortItemsVsDates") === "items"
      ) {
        send_add_overlay_msg();
        const n = await (await t.apply(this, e)).clone().json();
        let i = n.itemList.length,
          d = n.itemList,
          m = n.hasMore,
          a = return_sort_selection();
        sort_videos_tiktok(i, d, a, m).then(({ itemsCleaned: c }) => {
          let g = sessionStorage.getItem("sortFeedSortBy"),
            u = sort_items_tiktok(c, g);
          removeSortFeedBannerMessage(),
            remove_overlay(),
            window.postMessage(
              { logo_animate_off_tiktok: !0, payload: u },
              "*"
            );
        });
      } else if (
        s.includes("api/post/item_list/") &&
        sessionStorage.getItem("sortFeedStatusTikTok") &&
        sessionStorage.getItem("sortItemsVsDates") === "dates"
      ) {
        send_add_overlay_msg();
        const n = await (await t.apply(this, e)).clone().json();
        let i = n.itemList.length,
          d = n.itemList,
          m = n.hasMore,
          a = sessionStorage.getItem("sortFeedNoItems"),
          [c, g] = return_date_range(a);
        sort_videos_tiktok_dates(i, d, a, m, c, g).then((u) => {
          if (u === null)
            remove_overlay(),
              window.postMessage(
                { logo_animate_off_zero_tiktok_time_period: !0 },
                "*"
              );
          else {
            let f = sessionStorage.getItem("sortFeedSortBy"),
              _ = sort_items_tiktok(u, f);
            remove_overlay(),
              window.postMessage(
                { logo_animate_off_tiktok: !0, payload: _ },
                "*"
              );
          }
        });
      }
    } catch (o) {
      console.log("\u26A0\uFE0F Error intercepting fetch:", o);
    }
    return t.apply(this, e);
  };
})();
