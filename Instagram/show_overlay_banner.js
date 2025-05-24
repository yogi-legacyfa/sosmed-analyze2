function add_overlay() {
  const e = document.getElementsByTagName("body")[0];
  let t = document.createElement("div");
  (t.id = "overlay_sort_reels"),
    (t.style = `
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //background-color: rgba(0,0,0,0.5);
  background-color: rgba(255,215,112,0.4);
  z-index: 2;
  cursor: pointer;
  `),
    (t.class = "animate__animated animate__zoomIn"),
    e.append(t);
}
function formatNumber(e) {
  if (e === null || e === 0 || (e >= 1 && e <= 999)) return e;
  if (e >= 1e3 && e < 1e6) return (e / 1e3).toFixed(1) + "K";
  if (e >= 1e6) return (e / 1e6).toFixed(1) + "M";
}
function createItem(e = "", t = null, o = null) {
  const i = document.createElement("div");
  (i.innerHTML = e), (i.style = "position: relative;");
  const n = document.createElement("div");
  if (
    ((n.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  `),
    t !== null && o !== null)
  ) {
    const s = document.createElement("div");
    s.style = `
      display: flex;
      gap: 20px; /* Space between KPIs */
    `;
    const a = document.createElement("span");
    a.innerHTML = `\u2764\uFE0F ${t}`;
    const l = document.createElement("span");
    (l.innerHTML = `\u{1F4AC} ${o}`),
      s.appendChild(a),
      s.appendChild(l),
      n.appendChild(s);
  }
  return (
    i.addEventListener("mouseenter", () => {
      n.style.opacity = "1";
    }),
    i.addEventListener("mouseleave", () => {
      n.style.opacity = "0";
    }),
    i.appendChild(n),
    i
  );
}
function createItemReels(e = "", t = null, o = null, i = null) {
  const n = document.createElement("div");
  (n.innerHTML = e), (n.style = "position: relative;");
  const s = document.createElement("div");
  if (
    ((s.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  `),
    t !== null && o !== null)
  ) {
    const a = document.createElement("div");
    a.style = `
      display: flex;
      gap: 20px; /* Space between KPIs */
    `;
    const l = document.createElement("span");
    l.innerHTML = `\u2764\uFE0F ${t}`;
    const r = document.createElement("span");
    (r.innerHTML = `\u{1F4AC} ${o}`),
      a.appendChild(l),
      a.appendChild(r),
      s.appendChild(a);
  }
  return (
    n.addEventListener("mouseenter", () => {
      s.style.opacity = "1";
    }),
    n.addEventListener("mouseleave", () => {
      s.style.opacity = "0";
    }),
    n.appendChild(s),
    n
  );
}
function remove_items_local_storage() {
  sessionStorage.removeItem("sortFeedSortBy"),
    sessionStorage.removeItem("sortFeedNoItems"),
    sessionStorage.removeItem("sortFeedStatus"),
    sessionStorage.removeItem("sortFeedData"),
    sessionStorage.removeItem("sortFeedDataSorted"),
    sessionStorage.removeItem("sortFeedPostsVSReels"),
    sessionStorage.removeItem("sortFeedProfileName"),
    sessionStorage.removeItem("sortItemsVsDates"),
    console.log("items removed!");
}
function add_sorted_items(e, t) {
  return new Promise((o) => {
    if (t === "Posts") {
      const n = document
        .getElementsByTagName("main")[0]
        .getElementsByTagName("div")[0].lastChild.firstChild.firstChild;
      let s = document.createElement("div");
      (s.id = "div_most_viewed_reels"),
        (s.style =
          "display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;"),
        n.replaceWith(s);
      let a = document.getElementById("div_most_viewed_reels");
      for (let l = 0; l < e.length; l += 3) {
        let r = document.createElement("div");
        for (
          r.className = "_ac7v xat24cr x1f01sob xcghwft xzboxd6",
            e.slice(l, l + 3).forEach((d) => {
              let c = createItem(
                d.element,
                formatNumber(d.likesCount),
                formatNumber(d.commentsCount)
              );
              r.appendChild(c);
            });
          r.children.length < 3;

        ) {
          let d = document.createElement("div");
          (d.className = "x11i5rnm x1ntc13c x9i3mqj x2pgyrj"), r.appendChild(d);
        }
        a.appendChild(r);
      }
      o(!0);
    } else if (t === "Reels") {
      const n = document
        .getElementsByTagName("main")[0]
        .getElementsByTagName("div")[0].lastChild.firstChild.firstChild;
      let s = document.createElement("div");
      (s.id = "div_most_viewed_reels"),
        (s.style =
          "display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;"),
        n.replaceWith(s);
      let a = document.getElementById("div_most_viewed_reels");
      for (let l = 0; l < e.length; l += 4) {
        let r = document.createElement("div");
        for (
          r.className = "_ac7v xat24cr x1f01sob xcghwft xzboxd6",
            e.slice(l, l + 4).forEach((d) => {
              let c = createItemReels(
                d.element,
                formatNumber(d.likesCount),
                formatNumber(d.commentsCount),
                formatNumber(d.viewCount)
              );
              c.querySelectorAll("li").forEach((u) => {
                const m = u.querySelectorAll("span");
                m.length >= 2 && (m[0].remove(), m[1].remove(), m[2].remove());
              }),
                r.appendChild(c);
            });
          r.children.length < 4;

        ) {
          let d = document.createElement("div");
          (d.className = "x11i5rnm x1ntc13c x9i3mqj x2pgyrj"), r.appendChild(d);
        }
        a.appendChild(r);
      }
      o(!0);
    }
  });
}
function handle_sub_header(e, t, o, i) {
  if (o === "items") return `Latest ${e} ${t}`;
  if (o === "dates" && i === "1_week") return `${e} ${t} from 1 Week Back`;
  if (o === "dates" && i === "1_month") return `${e} ${t} from 1 Month Back`;
  if (o === "dates" && i === "3_month") return `${e} ${t} from 3 Months Back`;
  if (o === "dates" && i === "6_month") return `${e} ${t} from 6 Months Back`;
  if (o === "dates" && i === "1_year") return `${e} ${t} from 1 Year Back`;
  if (o === "dates" && i === "all_reels") return `${e} ${t}`;
}
function handle_header(e, t) {
  if (e === "views") return `Most Viewed ${t}`;
  if (e === "comments") return `Most Commented ${t}`;
  if (e === "likes") return `Most Liked ${t}`;
  if (e === "oldest") return `Oldest ${t}`;
}
function posts_reels_label(e, t) {
  return e === 1 ? t.slice(0, -1) : t;
}
function add_banner(
  e = null,
  t = null,
  o = null,
  i = null,
  n = null,
  s = null
) {
  let a = posts_reels_label(e, t),
    l = handle_header(o, a),
    r = handle_sub_header(e, a, n, s);
  const d = document
    .getElementsByTagName("main")[0]
    .getElementsByTagName("div")[0]
    .querySelectorAll('[role="tablist"]')[0];
  let c = document.createElement("div");
  (c.id = "banner_most_viewed_reels"),
    (c.style = `
    display: flex;
    align-items: center;
    background-color: #000;
    color: #fff;
    padding: 20px 40px;
    justify-content: space-between;
    margin-bottom: 0.2em;
  `),
    (c.className = "animate__animated animate__bounce"),
    d.replaceWith(c),
    (document.getElementById("banner_most_viewed_reels").innerHTML = `
    <div class="text_section" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
      <div class="metrics_section">
        <div id="reels_number_section" style="display: flex; flex-direction: row; margin-bottom: -2px;">
          <h2 style="color: white; margin: 0; font-size: 0.7rem; line-height: 1.1666666667; font-weight: 600; letter-spacing: -0.05em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
            ${r}
          </h2>
        </div>
        <h1 style="color: white; margin: 0; font-size: 1.6rem; line-height: 1.1666666667; font-weight: 600; letter-spacing: -0.05em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
          ${l}
        </h1>
      </div>
      <div class="button_section" style="display: flex; flex-direction: column; justify-content: center;">
        <div id="export-native" style="
          margin-left: auto;
          background-color: white;
          color: #000;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          letter-spacing: -0.01em;
          font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 3rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        ">
          <span style="z-index: 1; pointer-events: none;">Export</span>
          <img src="${chrome.runtime.getURL("Icons/drop_down.png")}" style="
            width: 0.7rem;
            margin-left: 0.4rem;
            z-index: 1;
            pointer-events: none;
          "/>
          <select id="export-select" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            font-size: 1rem;
            font-weight: 600;
            color: transparent;
            font-family: inherit;
            cursor: pointer;
            appearance: none;
            z-index: 2;
          ">
          <option value="" disabled selected style="color: #888;">Export as</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>
    </div>
  `);
  let u = document.getElementById("reels_number_section"),
    m = document.createElement("img");
  (m.src = chrome.runtime.getURL("Icons/128 Sort Feed.png")),
    (m.style = `
    width: 0.7rem;
    position: relative;
    top: -0.01rem;
    margin-right: 0.2rem;
    height: 0.7rem;
    gap: 10px;
  `),
    u.insertBefore(m, u.firstChild);
  const p = document.getElementById("export-native");
  p.addEventListener("mouseover", () => {
    p.style.opacity = "0.95";
  }),
    p.addEventListener("mouseout", () => {
      p.style.opacity = "1";
    }),
    document
      .getElementById("export-select")
      .addEventListener("change", function () {
        this.value !== "" &&
          (chrome.runtime.sendMessage({
            export_click: !0,
            export_format: this.value,
            posts_vs_reels: t,
            sorted_data: i,
          }),
          (this.selectedIndex = 0));
      });
}
function unhide_all_images() {
  document.querySelectorAll('img[style*="visibility: hidden"]').forEach((e) => {
    e.style.visibility = "visible";
  });
}
function remove_unneeded_elements() {
  let e = document.querySelector('[role="tablist"]');
  if (e) {
    const t = e.parentElement,
      o = Array.from(t.children),
      i = o.indexOf(e),
      n = o[i + 1];
    n && (n.remove(), console.log("Next sibling removed:", n));
  }
}
window.addEventListener("message", (e) => {
  if (e.source === window) {
    if (e.data.logo_animate_off) {
      let t = e.data.payload,
        o = sessionStorage.getItem("sortFeedPostsVSReels");
      add_sorted_items(t, o).then(() => {
        let i = t.length,
          n = sessionStorage.getItem("sortFeedSortBy"),
          s = sessionStorage.getItem("sortFeedPostsVSReels"),
          a = sessionStorage.getItem("sortItemsVsDates"),
          l = sessionStorage.getItem("sortFeedNoItems");
        window.scrollTo({ top: 0, behavior: "smooth" }), unhide_all_images();
        const r = () => {
          window.scrollY === 0
            ? add_banner(i, s, n, t, a, l)
            : requestAnimationFrame(r);
        };
        requestAnimationFrame(r),
          remove_items_local_storage(),
          chrome.runtime.sendMessage({ logo_animate_off: !0 });
      });
    } else if (e.data.logo_animate_off_zero_insta_time_period) {
      let t = null,
        o = sessionStorage.getItem("sortFeedSortBy"),
        i = 0,
        n = sessionStorage.getItem("sortItemsVsDates"),
        s = sessionStorage.getItem("sortFeedNoItems");
      window.scrollTo({ top: 0, behavior: "smooth" }),
        remove_unneeded_elements(),
        add_banner(i, "Posts", o, t, n, s),
        remove_items_local_storage(),
        chrome.runtime.sendMessage({ logo_animate_off: !0 });
    } else if (e.data.item_collected_no) {
      let t = e.data.number_items;
      chrome.runtime.sendMessage({ item_collected_no: !0, number_items: t });
    }
  }
}),
  window.addEventListener("load", function () {
    sessionStorage.getItem("sortFeedStatus") &&
      (add_overlay(), chrome.runtime.sendMessage({ logo_animate_on: !0 }));
  });
