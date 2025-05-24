function handle_lock_emojis() {
  const n = document.getElementById("no_reels_selected"),
    t = document.getElementById("dates_selected"),
    e = document.getElementById("no_reels_selected_tiktok");
  function o(a, s) {
    for (let i of a.options)
      i.text !== s
        ? ((i.text = "\u{1F512} " + i.text.replace(/^🔓 |^🔒 /, "")),
          (i.disabled = !0))
        : ((i.disabled = !1), (i.text = s));
  }
  o(n, "Latest 25 Items"),
    o(t, "Posts from 1 Week Back"),
    o(e, "Latest 25 TikToks");
}
function unlock_all_options() {
  const n = document.getElementById("no_reels_selected"),
    t = document.getElementById("dates_selected"),
    e = document.getElementById("no_reels_selected_tiktok");
  function o(a) {
    for (let s of a.options)
      (s.text = s.text.replace(/^🔒 |^🔓 /, "")), (s.disabled = !1);
  }
  o(n), o(t), o(e);
}
function add_activate_pro_footer() {
  document.getElementById("subFooter").style.display = "flex";
}
document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage({ command: "checkProStatus" }, (n) => {
    n?.isPro
      ? (pro_tag_added(), show_join_discord_banner())
      : (handle_lock_emojis(), add_activate_pro_footer());
  });
});
function first_time_pro() {
  pro_tag_added(), show_join_discord_banner(), unlock_all_options();
}
function save_locally_user_pro() {
  chrome.runtime.sendMessage({ command: "activatePro" });
}
function show_join_discord_banner() {
  (document.getElementById("sendEmailFooter").style.display = "none"),
    (document.getElementById("subFooter").style.display = "none"),
    (document.getElementById("joinDiscord").style.display = "flex");
}
function show_error_banner(n) {
  let t = document.getElementsByClassName("main_div")[0],
    e = document.createElement("div");
  (e.className = "warning_message animate__animated animate__bounceInRight"),
    e.style.setProperty("--animate-duration", ".5s"),
    (e.style.cssText =
      "z-index: 100; position: relative; background-color: #fbe8ea; position: absolute; width:100%;"),
    (e.id = "error_message"),
    (e.innerHTML = `
    <p class="warning_text">
    <img src="Icons/ButtonIcons/errorIcon.svg" alt="Error Icon" style="width: 13px; vertical-align: middle; margin-right: 5px;margin-top: -0.1rem;">
    ${n}
    </p>
    `),
    t.insertBefore(e, t.firstChild),
    setTimeout(() => {
      e.style.display = "none";
    }, 4500);
}
function show_sucess_banner() {
  let n = document.getElementsByClassName("main_div")[0],
    t = document.createElement("div");
  (t.className = "sucess_message animate__animated animate__bounceInRight"),
    t.style.setProperty("--animate-duration", ".5s"),
    (t.style.cssText =
      "z-index: 100; position: relative; background-color: #F7FFF8; position: absolute; width:100%;"),
    (t.id = "error_message"),
    (t.innerHTML = `
    <p class="sucess_text">
    <img src="Icons/ZeroStateIcons/Party.png" alt="Error Icon" style="width: 13px; vertical-align: middle; margin-right: 5px;margin-top: -0.1rem;">
    Sort Feed Pro activated!
    </p>
    `),
    n.insertBefore(t, n.firstChild),
    setTimeout(() => {
      t.remove();
    }, 4500);
}
function slide_pro_ui() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (n) {
    var t = n[0].url || "";
    if (t.includes("tiktok.com")) {
      const e = document.querySelector(".TikTokMain");
      e &&
        ((e.style.display = "flex"), e.classList.add("slide-left-animation")),
        (document.getElementsByClassName(
          "main_nav_div_zero_state_sub"
        )[0].style.display = "none");
    } else if (t.includes("instagram.com")) {
      const e = document.querySelector(".InstaMain");
      e &&
        ((e.style.display = "flex"), e.classList.add("slide-left-animation")),
        (document.getElementsByClassName(
          "main_nav_div_zero_state_sub"
        )[0].style.display = "none");
    } else {
      const e = document.querySelector(".main_nav_div_zero_state");
      e &&
        ((e.style.display = "flex"), e.classList.add("slide-left-animation")),
        (document.getElementsByClassName(
          "main_nav_div_zero_state_sub"
        )[0].style.display = "none");
    }
  });
}
function pro_tag_added() {
  const n = document.querySelector(".beta");
  if (n) {
    n.innerHTML = "";
    const t = document.createElement("img");
    (t.src = "Icons/ZeroStateIcons/black_star.svg"),
      (t.style.width = "5px"),
      (t.style.marginRight = "2px");
    const e = document.createTextNode("Pro");
    (n.style.backgroundColor = "#fde082"),
      (n.style.color = "black"),
      (n.style.display = "inline-flex"),
      (n.style.alignItems = "center"),
      n.appendChild(t),
      n.appendChild(e);
  }
}
function active_button_loading_on() {
  const t = document.getElementById("activiatePro").querySelector("img");
  (t.src = "Icons/ZeroStateIcons/loading.png"),
    (t.style.animation = "spin 0.5s linear infinite");
}
function active_button_loading_off() {
  const t = document.getElementById("activiatePro").querySelector("img");
  (t.src = "Icons/ZeroStateIcons/black_star.svg"), (t.style.animation = "none");
}
function add_confetti() {
  confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
}
function cloudflare_activate(licenseKey) {
  const isDevelopment = true; // Set to false for production

  if (isDevelopment) {
    // Mock successful activation for any key in development
    console.log("Development mode: Mocking license activation");

    // Simulate API delay
    setTimeout(() => {
      if (licenseKey === "dev-key" || licenseKey.length > 5) {
        // Mock successful response
        confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
        show_sucess_banner();
        slide_pro_ui();
        save_locally_user_pro();
        first_time_pro();
      } else {
        show_error_banner("Use 'dev-key' or any key longer than 5 characters");
      }
      active_button_loading_off();
    }, 1000);
    return;
  }

  // Original code for production
  let response;
  fetch("https://sortfeedtest.taher-el-sheikh.workers.dev/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ license_key: licenseKey }),
  })
    .then((e) => e.json())
    .then((e) => {
      response = e;
      if (response.activated) {
        confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
        show_sucess_banner();
        slide_pro_ui();
        save_locally_user_pro();
        first_time_pro();
      } else if (
        response.error === "This license key has reached the activation limit."
      ) {
        show_error_banner("Oops! Key was already used 3 times");
      } else {
        show_error_banner("Oops! Invalid license key");
      }
      active_button_loading_off();
    })
    .catch(console.error);
}
var activiatePro = document.getElementById("activiatePro"),
  licenseInputField = document.querySelector(".license-input_sub");
activiatePro.addEventListener("click", function () {
  triggerActivation();
}),
  licenseInputField.addEventListener("keydown", function (n) {
    n.key === "Enter" && triggerActivation();
  });
function triggerActivation() {
  const n = licenseInputField.value.trim();
  n
    ? (active_button_loading_on(), cloudflare_activate(n))
    : show_error_banner("Please enter your license key!");
}
var getProButton = document.getElementById("get_pro_button");
getProButton.addEventListener("click", function () {
  window.open(
    "https://sortfeed.lemonsqueezy.com/buy/e70c209c-4358-45fd-ba75-17a31a4fd896",
    "_blank"
  );
});
var EnterLicenseKey = document.getElementById("EnterLicenseKey");
EnterLicenseKey.addEventListener("click", function () {
  (document.querySelector(".main_nav_div_zero_state").style.display = "none"),
    (document.querySelector(".TikTokMain").style.display = "none"),
    (document.querySelector(".InstaMain").style.display = "none"),
    (document.getElementById("subFooter").style.display = "none");
  const n = document.querySelector(".main_nav_div_zero_state_sub");
  (n.style.display = "flex"),
    n.classList.add("slide-left-animation"),
    (document.getElementById("sendEmailFooter").style.display = "flex");
});
var backButton = document.getElementById("BackFromLicensePage");
backButton.addEventListener("click", function () {
  (document.querySelector(".main_nav_div_zero_state_sub").style.display =
    "none"),
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (n) {
      var t = n[0].url || "";
      if (t.includes("tiktok.com")) {
        const e = document.querySelector(".TikTokMain");
        (e.style.display = "flex"),
          e.classList.add("slide-right-animation"),
          (document.getElementById("sendEmailFooter").style.display = "none"),
          (document.getElementById("subFooter").style.display = "flex");
      } else if (t.includes("instagram.com")) {
        const e = document.querySelector(".InstaMain");
        (e.style.display = "flex"),
          e.classList.add("slide-right-animation"),
          (document.getElementById("sendEmailFooter").style.display = "none"),
          (document.getElementById("subFooter").style.display = "flex");
      } else {
        const e = document.querySelector(".main_nav_div_zero_state");
        (e.style.display = "flex"),
          e.classList.add("slide-right-animation"),
          (document.getElementById("sendEmailFooter").style.display = "none"),
          (document.getElementById("subFooter").style.display = "flex");
      }
    });
});
