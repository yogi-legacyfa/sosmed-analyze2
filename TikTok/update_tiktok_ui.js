function remove_items_local_storage_tiktok(){sessionStorage.removeItem("sortFeedSortBy"),sessionStorage.removeItem("sortFeedNoItems"),sessionStorage.removeItem("sortFeedStatus"),sessionStorage.removeItem("sortFeedStatusTikTok"),sessionStorage.removeItem("sortFeedData"),sessionStorage.removeItem("sortItemsVsDates")}function handle_empty_slots(t,e){const o=t.length,n=t[o-1].element;function i(r){let s=document.createElement("div");e.appendChild(s)}if(o===1)i(n),i(n),i(n);else if(o===2)i(n),i(n);else if(o===3)i(n);else return}async function add_sorted_items_tiktok(t){return new Promise(e=>{const o=t,n=document.querySelector('div[data-e2e="user-post-item-list"]');n||console.error("Original container not found.");const i=n.cloneNode(!1);o.forEach(r=>{const s=document.createElement("div");s.innerHTML=r.element;const d=s.firstElementChild;d&&i.appendChild(d)}),handle_empty_slots(o,i),n.replaceWith(i),e(!0)})}function handle_header(t,e){if(t==="views")return`Most Viewed ${e}`;if(t==="comments")return`Most Commented ${e}`;if(t==="likes")return`Most Liked ${e}`;if(t==="oldest")return`Oldest ${e}`;if(t==="shares")return`Most Shared ${e}`;if(t==="saves")return`Most Saved ${e}`}function handle_sub_header(t,e,o,n){if(o==="items")return`Latest ${t} ${e}`;if(o==="dates"&&n==="1_week")return`${t} ${e} from 1 Week Back`;if(o==="dates"&&n==="1_month")return`${t} ${e} from 1 Month Back`;if(o==="dates"&&n==="3_month")return`${t} ${e} from 3 Months Back`;if(o==="dates"&&n==="6_month")return`${t} ${e} from 6 Months Back`;if(o==="dates"&&n==="1_year")return`${t} ${e} from 1 Year Back`;if(o==="dates"&&n==="all_reels")return`${t} ${e}`}function remove_default_banner(){const t=document.querySelector('[data-e2e="user-post-item-list"]');if(t){const e=t.parentElement;if(e){const o=e.parentElement;if(o){const n=Array.from(o.children);for(const i of n){if(i===e)break;i.tagName.toLowerCase()==="div"&&o.removeChild(i)}}}}}function tiktok_tiktoks(t){return t===1?"TikTok":"TikToks"}function add_banner(t,e,o,n,i){const r=tiktok_tiktoks(e),s=handle_header(o,r),d=handle_sub_header(e,r,n,i),f=document.querySelector('[data-e2e="user-post-item-list"]')?.parentElement,a=document.createElement("div");a.id="banner_most_viewed_reels",a.style=`
    display: flex;
    align-items: center;
    background-color: #000;
    color: #fff;
    padding: 20px 40px;
    justify-content: space-between;
    margin-bottom: 0.2em;
  `,a.className="animate__animated animate__bounce",f.insertBefore(a,f.firstChild),remove_default_banner(),a.innerHTML=`
    <div class="text_section" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
      <div class="metrics_section">
        <div id="reels_number_section" style="display: flex; flex-direction: row; margin-bottom: -2px;">
          <h2 style="color: white; margin: 0; font-size: 0.7rem; line-height: 1.1666666667; font-weight: 600; letter-spacing: -0.05em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
            ${d}
          </h2>
        </div>
        <h1 style="color: white; margin: 0; font-size: 1.6rem; line-height: 1.1666666667; font-weight: 600; letter-spacing: -0.05em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
          ${s}
        </h1>
      </div>
      <div class="button_section" style="display: flex; flex-direction: column; justify-content: center;">
        <div id="export-native" style="
          margin-left: auto;
          background-color: white;
          color: #000;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
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
  `;const c=document.getElementById("reels_number_section"),m=document.createElement("img");m.src=chrome.runtime.getURL("Icons/128 Sort Feed.png"),m.style=`
    width: 0.7rem;
    position: relative;
    top: -0.01rem;
    margin-right: 0.2rem;
    height: 0.7rem;
    gap: 10px;
  `,c.insertBefore(m,c.firstChild);const l=document.getElementById("export-native");l.addEventListener("mouseover",()=>l.style.opacity="0.95"),l.addEventListener("mouseout",()=>l.style.opacity="1"),document.getElementById("export-select").addEventListener("change",function(){this.value!==""&&(chrome.runtime.sendMessage({export_click_tiktok:!0,export_format:this.value,sorted_data:t}),this.selectedIndex=0)})}function add_banner_v2(t,e,o,n,i){let r=tiktok_tiktoks(e),s=handle_header(o,r),d=handle_sub_header(e,r,n,i);const f=document.querySelector('[data-e2e="user-post-item-list"]')?.parentElement;let a=document.createElement("div");a.id="banner_most_viewed_reels",a.style=`
    display: flex;
    align-items: center;
    background-color: #000;
    color: #fff;
    padding: 20px 40px;
    justify-content: space-between;
    margin-bottom: 0.2em;
    border-top: 2px solid white;
    border-bottom: 2px solid white;
    `,a.className="animate__animated animate__bounce",f.insertBefore(a,f.firstChild),remove_default_banner(),document.getElementById("banner_most_viewed_reels").innerHTML=`
    <div class="text_section" style="display: flex;flex-direction: row;width: 100%;justify-content: space-between;">
    <div class="metrics_section">
      <div id="reels_number_section" style="display: flex;flex-direction: row;margin-bottom: -2px;">
        <h2 style="color: white;margin: 0;font-size: 0.7rem;line-height: 1.1666666667;font-weight: 600;letter-spacing: -0.05em;font-family: SF Pro Display,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif;">
         ${d}
        </h2>
      </div>
      <h1 style="color: white;margin: 0;font-size: 1.6rem;line-height: 1.1666666667;font-weight: 600;letter-spacing: -0.05em;font-family: SF Pro Display,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif;">`+s+`</h1>
      </div>
      <div class="button_section" style="display: flex;flex-direction: column; justify-content: center; width: 50%;">
        <a href="#" class="export-btn" id='export-btn-sort-reels'>
        <label style="font-size: 1rem; color: black; font-size: 1rem;">Export</label>
        </a>
      </div>
    </div>
    `;let c=document.getElementById("export-btn-sort-reels");c.style=`
    margin-left: auto;
    background-color: white;
    color: #000;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: -0.01em;
    font-family: SF Pro Display,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif;
    font-size: 1rem;
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    gap: 2px;
    width: 35%;
    height: 2rem;
    `;let m=document.getElementById("reels_number_section"),l=document.createElement("img"),g=chrome.runtime.getURL("Icons/128 Sort Feed.png");l.src=g,l.style=`width: 0.7rem;
    position: 1rem;
    position: relative;
    top: -0.01rem;
    margin-right: 0.2rem;
    height: 0.7rem;
    gap: 10px;
    `,m.insertBefore(l,m.firstChild);function h(){let u=document.getElementById("export-btn-sort-reels");u.style=`
      margin-left: auto;
      background-color: #f5f5f5;
      color: #000;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: -0.01em;
      font-family: SF Pro Display,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif;
      font-size: 1rem;
      align-items: center;
      display: flex;
      justify-content: space-evenly;
      gap: 2px;
      width: 35%;
      height: 2rem;
      `}function y(){let u=document.getElementById("export-btn-sort-reels");u.style=`
      margin-left: auto;
      background-color: white;
      color: #000;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: -0.01em;
      font-family: SF Pro Display,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif;
      font-size: 1rem;
      align-items: center;
      display: flex;
      justify-content: space-evenly;
      gap: 2px;
      width: 35%;
      height: 2rem;
      `}c.addEventListener("mouseover",h,!1),c.addEventListener("mouseout",y,!1),c.addEventListener("click",function(){chrome.runtime.sendMessage({export_click_tiktok:!0,sorted_data:t})})}function remove_unneeded_elements(){document.querySelector('div[data-e2e="user-post-item-list"]').replaceWith(""),document.getElementById("export-btn-sort-reels").replaceWith("")}function add_overlay(){const t=document.getElementsByTagName("body")[0];let e=document.createElement("div");e.id="overlay_sort_reels",e.style=`
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
  `,e.class="animate__animated animate__zoomIn",t.append(e)}window.addEventListener("message",t=>{if(t.source===window){if(t.data.logo_animate_off_tiktok){let e=t.data.payload;add_sorted_items_tiktok(e).then(()=>{let o=e.length,n=sessionStorage.getItem("sortFeedSortBy"),i=sessionStorage.getItem("sortFeedPostsVSReels"),r=sessionStorage.getItem("sortItemsVsDates"),s=sessionStorage.getItem("sortFeedNoItems");window.scrollTo({top:0,behavior:"smooth"}),add_banner(e,o,n,r,s),remove_items_local_storage_tiktok(),chrome.runtime.sendMessage({logo_animate_off:!0})})}else if(t.data.logo_animate_off_zero_tiktok_time_period){let e=null,o=sessionStorage.getItem("sortFeedSortBy"),n=0,i=sessionStorage.getItem("sortItemsVsDates"),r=sessionStorage.getItem("sortFeedNoItems");window.scrollTo({top:0,behavior:"smooth"}),add_banner(e,n,o,i,r),remove_unneeded_elements(),remove_items_local_storage_tiktok(),chrome.runtime.sendMessage({logo_animate_off:!0})}else if(t.data.overlay_on)add_overlay(),chrome.runtime.sendMessage({logo_animate_on:!0});else if(t.data.item_collected_no){let e=t.data.number_items;chrome.runtime.sendMessage({item_collected_no:!0,number_items:e})}}});
