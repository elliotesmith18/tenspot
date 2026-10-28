/* Cookie consent, shared by the home page and every game.
   Essential storage (game progress, this choice itself) needs no consent. Advertising and analytics stay
   off until the visitor accepts. The choice is a cookie on the parent domain, so answering once covers every
   game subdomain. Pages listen with: window.siteConsent.onChange(choice => ...), choice is "accepted" | "rejected". */
(function () {
  "use strict";
  var PRIVACY_URL = "https://play2dgames.com/privacy.html";
  var NAME = "site_consent", MAX_AGE = 60 * 60 * 24 * 180, listeners = [];

  // Google Consent Mode v2 defaults: an ad or analytics tag added later starts denied until the visitor accepts.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 });

  function parentDomain() {
    var h = location.hostname;
    if (!/\./.test(h) || /(^|\.)github\.io$/.test(h) || /^[\d.]+$/.test(h)) return "";
    return "; Domain=." + h.split(".").slice(-2).join(".");
  }
  function read() {
    var m = document.cookie.match(new RegExp("(?:^|; )" + NAME + "=(accepted|rejected)"));
    if (m) return m[1];
    try { return localStorage.getItem(NAME); } catch (e) { return null; }
  }
  function write(v) {
    document.cookie = NAME + "=" + v + "; Max-Age=" + MAX_AGE + "; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "") + parentDomain();
    try { localStorage.setItem(NAME, v); } catch (e) {}
  }
  function apply(v) {
    var g = v === "accepted" ? "granted" : "denied";
    gtag("consent", "update", { ad_storage: g, ad_user_data: g, ad_personalization: g, analytics_storage: g });
    listeners.forEach(function (fn) { try { fn(v); } catch (e) {} });
  }

  var css = ".cc-bar{position:fixed;z-index:100;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(640px,calc(100% - 24px));box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding:12px 14px;background:#0e1a39;color:#f3ecdc;border:2px solid #5fb4c9;box-shadow:4px 4px 0 #030816;font:19px/1.15 VT323,ui-monospace,Menlo,monospace;-webkit-font-smoothing:none;animation:ccIn .35s steps(5)}" +
    "@keyframes ccIn{from{opacity:0;transform:translate(-50%,14px)}}" +
    ".cc-bar p{margin:0;flex:1 1 280px}.cc-bar a{color:#8fe3f0}" +
    ".cc-btns{display:flex;gap:8px;flex:0 0 auto}" +
    ".cc-bar button{height:38px;padding:0 14px;border:2px solid #141a2e;font:12px Silkscreen,ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;background:#f6d36b;color:#141a2e;box-shadow:inset -3px -3px 0 rgba(0,0,0,.18),3px 3px 0 #030816}" +
    ".cc-bar button:active{transform:translate(2px,2px)}.cc-bar button:focus-visible{outline:2px solid #8fe3f0;outline-offset:2px}" +
    "@media (prefers-reduced-motion:reduce){.cc-bar{animation:none}}";

  function show() {
    if (document.querySelector(".cc-bar")) return;
    if (!document.getElementById("cc-style")) { var st = document.createElement("style"); st.id = "cc-style"; st.textContent = css; document.head.appendChild(st); }
    var bar = document.createElement("div");
    bar.className = "cc-bar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Cookie choices");
    bar.innerHTML = '<p>We save your game progress on this device. With your OK we may also use cookies for ads and stats. <a href="' + PRIVACY_URL + '">Privacy policy</a></p>' +
      '<div class="cc-btns"><button type="button" data-v="rejected">Essential only</button><button type="button" data-v="accepted">Accept all</button></div>';
    bar.addEventListener("click", function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute("data-v");
      if (!v) return;
      write(v); bar.remove(); apply(v);
    });
    document.body.appendChild(bar);
  }

  window.siteConsent = {
    get: read,
    open: show,
    onChange: function (fn) { listeners.push(fn); var v = read(); if (v) fn(v); }
  };
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("[data-consent-open]");
    if (t) { e.preventDefault(); show(); }
  });

  var start = function () { var v = read(); if (v) apply(v); else show(); };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
