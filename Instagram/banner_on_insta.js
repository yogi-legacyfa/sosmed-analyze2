window.addEventListener("message",e=>{if(e.data.insta_banner_notification){let t=e.data.count,n=e.data.type;injectSortFeedBanner(t,n)}});function injectSortFeedBanner(e=25,t="Posts"){const n=document.querySelector(".sort-banner");if(n){const r=n.querySelector(".message");r&&(r.innerHTML=`<span style="font-weight: 600;">${e} ${t}</span> Collected! Please don\u2019t scroll`);return}const a=document.createElement("style");a.textContent=`
  @keyframes slideBounceDown {
    0% {
      transform: translate(-50%, -120%);
      opacity: 0;
    }
    60% {
      transform: translate(-50%, 10px);
      opacity: 1;
    }
    80% {
      transform: translate(-50%, -5px);
    }
    100% {
      transform: translate(-50%, 0);
    }
  }

  @keyframes slideBounceUp {
    0% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    20% {
      transform: translate(-50%, -10px);
    }
    100% {
      transform: translate(-50%, -120%);
      opacity: 0;
    }
  }
  
  @keyframes bounceLogo {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }

  .sort-banner .icon {
    padding: 4px;
    width: 1.5rem !important;
    height: auto !important;
    margin-right: 8px;
    animation: bounceLogo 1s infinite;
  }

  .sort-banner {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    width: 90%;
    max-width: 600px;
    z-index: 9999;
    animation: slideBounceDown 0.25s ease;
    border-radius: 0.7rem;
    border: 2px solid #525252;
  }

    .sort-banner .stop-btn:hover {
      opacity: 0.7;
    }

    .sort-banner .message {
      font-size: 16px;
      font-weight: 400;
      color: #000;
      flex-grow: 1;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    }

    .sort-banner .stop-btn {
      font-size: 15px;
      color: #d63c3c;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    }

    @media (max-width: 400px) {
      .sort-banner {
        padding: 10px 12px;
      }
      .sort-banner .message,
      .sort-banner .stop-btn {
        font-size: 14px;
      }
    }
  `,document.head.appendChild(a);const o=document.createElement("div");o.className="sort-banner",o.innerHTML=`
  <img class="icon" src="${chrome.runtime.getURL("Icons/16 Sort Feed.png")}" />
  <div class="message">
    <span style="font-weight: 600;">${e} ${t}</span> Collected! Please don\u2019t scroll
  </div>
  <button class="stop-btn">Stop Sorting</button>
`,o.querySelector(".stop-btn").addEventListener("click",()=>{sessionStorage.setItem("sortFeedStopSorting","on")}),document.body.appendChild(o)}function removeSortFeedBanner(){const e=document.querySelector(".sort-banner");e&&(e.style.animation="slideBounceUp 0.25s ease forwards",setTimeout(()=>{e.remove()},250))}window.addEventListener("message",e=>{e.data.insta_banner_notification_remove&&removeSortFeedBanner()});
