(function () {
  "use strict";

  const WHATSAPP_NUMBER = "995557746238";
  const TOMAN_PER_USD = 230000;

  const STRINGS = {
    fa: {
      brand: "پارسیان سرام",
      topbarSub: "کاتالوگ محصولات (حالت نمایشی آفلاین)",
      all: "همه",
      back: "بازگشت",
      backArrow: "→",
      whatsapp: "خرید از طریق واتساپ",
      specBrand: "برند",
      specSize: "سایز",
      specColor: "رنگ",
      specMaterial: "جنس",
      specUsage: "کاربرد",
      specAntiSlip: "ضدلغزش",
      yes: "دارد",
      no: "ندارد",
      offlineNote: "این نسخه نمایشی است و به اینترنت یا سرور نیاز ندارد. برای سفارش، از دکمه «خرید از طریق واتساپ» روی هر محصول استفاده کنید.",
      waGreeting: "سلام، می‌خواستم درباره این محصول سفارش بدم:",
      waBrand: "برند",
      waSize: "سایز",
      waPrice: "قیمت",
      perUnit: "به ازای هر",
      filters: "فیلترها",
      filterType: "نوع محصول",
      filterBrand: "برند",
      filterSize: "اندازه",
      filterClear: "پاک کردن",
      filterApply: "اعمال فیلتر",
      resultCount: (n) => `${toPersianDigits(n)} محصول`,
      mainMenu: "منو",
      menuBrands: "برندها",
      menuProducts: "محصولات",
      menuAbout: "درباره ما",
      menuContact: "ارتباط با ما",
      aboutTitle: "درباره پارسیان سرام",
      aboutText: "پارسیان سرام، عرضه‌کننده تخصصی انواع کاشی و سرامیک از برترین برندهای ایرانی است. ما با گردآوری محصولات باکیفیت از کارخانه‌های معتبر کشور، امکان انتخاب و سفارش آسان را برای مشتریان فراهم می‌کنیم. این اپلیکیشن نسخه نمایشی آفلاین کاتالوگ محصولات ماست.",
      contactTitle: "ارتباط با ما",
      contactText: "برای مشاوره، استعلام قیمت و ثبت سفارش می‌توانید از طریق واتساپ با ما در ارتباط باشید.",
      contactPhoneLabel: "شماره تماس",
      contactWaBtn: "گفتگو در واتساپ",
      contactWaGreeting: "سلام، می‌خواستم درباره محصولات پارسیان سرام سوال بپرسم.",
    },
    az: {
      brand: "Parsian Ceram",
      topbarSub: "Məhsul kataloqu (oflayn nümayiş rejimi)",
      all: "Hamısı",
      back: "Geri",
      backArrow: "←",
      whatsapp: "WhatsApp vasitəsilə sifariş",
      specBrand: "Brend",
      specSize: "Ölçü",
      specColor: "Rəng",
      specMaterial: "Material",
      specUsage: "İstifadə",
      specAntiSlip: "Sürüşməyə qarşı",
      yes: "Var",
      no: "Yoxdur",
      offlineNote: "Bu nümayiş versiyasıdır və internetə və ya serverə ehtiyac duymur. Sifariş üçün hər məhsulda “WhatsApp vasitəsilə sifariş” düyməsindən istifadə edin.",
      waGreeting: "Salam, bu məhsulu sifariş etmək istəyirdim:",
      waBrand: "Brend",
      waSize: "Ölçü",
      waPrice: "Qiymət",
      perUnit: "hər",
      filters: "Filtrlər",
      filterType: "Məhsul növü",
      filterBrand: "Brend",
      filterSize: "Ölçü",
      filterClear: "Təmizlə",
      filterApply: "Filtrləri tətbiq et",
      resultCount: (n) => `${n} məhsul`,
      mainMenu: "Menyu",
      menuBrands: "Brendlər",
      menuProducts: "Məhsullar",
      menuAbout: "Haqqımızda",
      menuContact: "Əlaqə",
      aboutTitle: "Parsian Ceram haqqında",
      aboutText: "Parsian Ceram, İranın aparıcı brendlərindən keyfiyyətli kafel və keramika məhsulları təqdim edən ixtisaslaşmış platformadır. Bu tətbiq məhsul kataloqumuzun oflayn nümayiş versiyasıdır.",
      contactTitle: "Əlaqə",
      contactText: "Məsləhət, qiymət sorğusu və sifariş üçün WhatsApp vasitəsilə bizimlə əlaqə saxlaya bilərsiniz.",
      contactPhoneLabel: "Telefon nömrəsi",
      contactWaBtn: "WhatsApp-da yazın",
      contactWaGreeting: "Salam, Parsian Ceram məhsulları haqqında sual vermək istəyirdim.",
    },
  };

  const UNIT_LABEL = {
    fa: { SQUARE_METER: "متر مربع", CARTON: "کارتن", PIECE: "عدد" },
    az: { SQUARE_METER: "kvadratmetr", CARTON: "karton", PIECE: "ədəd" },
  };

  const CATEGORY_LABEL_AZ = {
    "کاشی دیوار": "Divar kafeli",
    "کاشی کف": "Döşəmə kafeli",
    "سرامیک": "Keramika",
    "پرسلان": "Farfor",
  };

  const COLOR_LABEL_AZ = {
    "سفید": "Ağ", "بژ": "Bej", "بژ روشن": "Açıq bej", "طوسی": "Boz",
    "طوسی تیره": "Tünd boz", "طوسی روشن": "Açıq boz", "خاکستری روشن": "Açıq boz",
    "مشکی": "Qara", "سفید و مشکی": "Ağ-qara", "قرمز": "Qırmızı", "کرم": "Krem",
    "کرم طلایی": "Qızılı krem", "آبی": "Mavi", "صورتی روشن": "Açıq çəhrayı",
    "قهوه‌ای": "Qəhvəyi", "قهوه‌ای روشن": "Açıq qəhvəyi", "قهوه‌ای تیره": "Tünd qəhvəyi",
    "چندرنگ": "Rəngbərəng", "نقره‌ای": "Gümüşü", "سبز": "Yaşıl", "استخوانی": "Sümük rəngi",
    "طلایی": "Qızılı",
  };

  const MATERIAL_LABEL_AZ = { "سرامیک": "Keramika", "پرسلان": "Farfor" };
  const USAGE_LABEL_AZ = { "دیوار": "Divar", "کف": "Döşəmə", "کف و دیوار": "Döşəmə və divar" };

  const BRAND_LABEL_AZ = {
    "الوند": "Alvand", "تبریز": "Təbriz", "مرجان": "Mərcan", "پرسپولیس": "Persepolis",
    "نیلو": "Nilu", "سینا": "Sina", "گلدیس": "Goldis", "نوین‌سرام": "Novin Ceram",
    "پاسارگاد": "Pasarqad", "تک‌سرام": "Tak Ceram",
  };

  let locale = localStorage.getItem("locale") || "fa";

  const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
  function toPersianDigits(value) {
    return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[+d]);
  }
  function formatPrice(amount) {
    if (locale === "fa") return toPersianDigits(amount.toLocaleString("en-US")) + " تومان";
    const usd = amount / TOMAN_PER_USD;
    const formatted = usd.toLocaleString("en-US", {
      minimumFractionDigits: usd < 100 ? 2 : 0,
      maximumFractionDigits: usd < 100 ? 2 : 0,
    });
    return "$" + formatted;
  }
  function t(key) {
    return STRINGS[locale][key];
  }
  function localizedName(p) {
    if (locale === "az") return p.nameAz || p.name;
    return p.name;
  }
  function localizedDesc(p) {
    if (locale === "az") return p.descriptionAz || p.description;
    return p.description;
  }
  function localizedBrand(brand) {
    if (!brand) return "";
    return locale === "az" ? BRAND_LABEL_AZ[brand] || brand : brand;
  }
  function localizedCategory(name) {
    return locale === "az" ? CATEGORY_LABEL_AZ[name] || name : name;
  }
  function localizedColor(v) {
    if (!v) return "";
    return locale === "az" ? COLOR_LABEL_AZ[v] || v : v;
  }
  function localizedMaterial(v) {
    if (!v) return "";
    return locale === "az" ? MATERIAL_LABEL_AZ[v] || v : v;
  }
  function localizedUsage(v) {
    if (!v) return "";
    return locale === "az" ? USAGE_LABEL_AZ[v] || v : v;
  }

  const gridEl = document.getElementById("grid");
  const detailEl = document.getElementById("detail");
  const backBtn = document.getElementById("backBtn");
  const langBtn = document.getElementById("langBtn");
  const resultCountEl = document.getElementById("resultCount");
  const filterBtn = document.getElementById("filterBtn");
  const filterBadge = document.getElementById("filterBadge");
  const filterOverlay = document.getElementById("filterOverlay");
  const filterDrawer = document.getElementById("filterDrawer");
  const filterCloseBtn = document.getElementById("filterCloseBtn");
  const filterClearBtn = document.getElementById("filterClearBtn");
  const filterApplyBtn = document.getElementById("filterApplyBtn");
  const infoEl = document.getElementById("infoView");
  const menuBtn = document.getElementById("menuBtn");
  const mainMenuOverlay = document.getElementById("mainMenuOverlay");
  const mainMenuDrawer = document.getElementById("mainMenuDrawer");
  const mainMenuCloseBtn = document.getElementById("mainMenuCloseBtn");
  const menuBrandsBtn = document.getElementById("menuBrandsBtn");
  const menuProductsBtn = document.getElementById("menuProductsBtn");
  const menuAboutBtn = document.getElementById("menuAboutBtn");
  const menuContactBtn = document.getElementById("menuContactBtn");

  let lastInfo = null;

  let catalog = { categories: [], products: [] };

  // Applied filters (drive the grid) vs draft filters (edited inside the open drawer)
  let applied = { category: "all", brands: new Set(), sizes: new Set() };
  let draft = { category: "all", brands: new Set(), sizes: new Set() };

  function applyChrome() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.getElementById("brandName").textContent = t("brand");
    document.getElementById("topbarSub").textContent = t("topbarSub");
    document.getElementById("backArrow").textContent = t("backArrow");
    document.getElementById("backLabel").textContent = t("back");
    document.getElementById("whatsappLabel").textContent = t("whatsapp");
    document.getElementById("offlineNote").textContent = t("offlineNote");
    document.getElementById("filterBtnLabel").textContent = t("filters");
    document.getElementById("filterTitle").textContent = t("filters");
    document.getElementById("filterTypeTitle").textContent = t("filterType");
    document.getElementById("filterBrandTitle").textContent = t("filterBrand");
    document.getElementById("filterSizeTitle").textContent = t("filterSize");
    filterClearBtn.textContent = t("filterClear");
    filterApplyBtn.textContent = t("filterApply");
    langBtn.textContent = locale === "fa" ? "AZ" : "FA";
    document.getElementById("mainMenuTitle").textContent = t("mainMenu");
    document.getElementById("menuBrandsLabel").textContent = t("menuBrands");
    document.getElementById("menuProductsLabel").textContent = t("menuProducts");
    document.getElementById("menuAboutLabel").textContent = t("menuAbout");
    document.getElementById("menuContactLabel").textContent = t("menuContact");
    document.getElementById("infoBackArrow").textContent = t("backArrow");
    document.getElementById("infoBackLabel").textContent = t("back");
  }

  function whatsappLink(p) {
    const lines = [
      t("waGreeting"),
      localizedName(p),
      p.brand ? `${t("waBrand")}: ${localizedBrand(p.brand)}` : null,
      p.size ? `${t("waSize")}: ${p.size}` : null,
      `${t("waPrice")}: ${formatPrice(p.price)}`,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  function matchesApplied(p) {
    if (applied.category !== "all" && p.category !== applied.category) return false;
    if (applied.brands.size > 0 && !applied.brands.has(p.brand)) return false;
    if (applied.sizes.size > 0 && !applied.sizes.has(p.size)) return false;
    return true;
  }

  function renderGrid() {
    const products = catalog.products.filter(matchesApplied);
    resultCountEl.textContent = t("resultCount")(products.length);

    gridEl.classList.add("fading");
    window.setTimeout(() => {
      gridEl.innerHTML = "";
      if (products.length === 0) {
        gridEl.innerHTML = `<p class="empty-state">—</p>`;
      }
      products.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.animationDelay = Math.min(i, 12) * 35 + "ms";
        const img = p.images[0] ? `images/${p.images[0].split("/").pop()}` : "";
        card.innerHTML = `
          <div class="card-img-wrap"><img src="${img}" alt="${localizedName(p)}" loading="lazy" /></div>
          <div class="card-body">
            <div class="card-brand">${localizedBrand(p.brand)}</div>
            <div class="card-name">${localizedName(p)}</div>
            <div class="card-price">${formatPrice(p.price)}</div>
          </div>`;
        card.onclick = () => showDetail(p);
        gridEl.appendChild(card);
      });
      gridEl.classList.remove("fading");
    }, 120);
  }

  function updateFilterBadge() {
    const count = (applied.category !== "all" ? 1 : 0) + applied.brands.size + applied.sizes.size;
    filterBadge.textContent = String(count);
    filterBadge.classList.toggle("hidden", count === 0);
  }

  function buildFilterOptions() {
    const brandSet = new Set();
    const sizeSet = new Set();
    for (const p of catalog.products) {
      if (p.brand) brandSet.add(p.brand);
      if (p.size) sizeSet.add(p.size);
    }
    const brands = [...brandSet].sort();
    const sizes = [...sizeSet].sort();

    const typeChipsEl = document.getElementById("filterTypeChips");
    const types = [{ slug: "all", name: t("all") }, ...catalog.categories.map((c) => ({ slug: c.slug, name: localizedCategory(c.name) }))];
    typeChipsEl.innerHTML = types
      .map((ty) => `<button type="button" class="chip" data-slug="${ty.slug}">${ty.name}</button>`)
      .join("");
    typeChipsEl.querySelectorAll(".chip").forEach((chip) => {
      chip.onclick = () => {
        draft.category = chip.dataset.slug;
        syncDrawerUI();
      };
    });

    const brandListEl = document.getElementById("filterBrandList");
    brandListEl.innerHTML = brands
      .map((b) => `<label class="check-row"><input type="checkbox" data-brand="${b}" /><span>${localizedBrand(b)}</span></label>`)
      .join("");
    brandListEl.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.onchange = () => {
        const val = cb.dataset.brand;
        if (cb.checked) draft.brands.add(val);
        else draft.brands.delete(val);
      };
    });

    const sizeListEl = document.getElementById("filterSizeList");
    sizeListEl.innerHTML = sizes
      .map((s) => `<label class="check-row"><input type="checkbox" data-size="${s}" /><span>${s}</span></label>`)
      .join("");
    sizeListEl.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.onchange = () => {
        const val = cb.dataset.size;
        if (cb.checked) draft.sizes.add(val);
        else draft.sizes.delete(val);
      };
    });
  }

  function syncDrawerUI() {
    document.querySelectorAll("#filterTypeChips .chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.slug === draft.category);
    });
    document.querySelectorAll("#filterBrandList input[type=checkbox]").forEach((cb) => {
      cb.checked = draft.brands.has(cb.dataset.brand);
    });
    document.querySelectorAll("#filterSizeList input[type=checkbox]").forEach((cb) => {
      cb.checked = draft.sizes.has(cb.dataset.size);
    });
  }

  function openDrawer() {
    draft = { category: applied.category, brands: new Set(applied.brands), sizes: new Set(applied.sizes) };
    syncDrawerUI();
    filterOverlay.classList.remove("hidden");
    requestAnimationFrame(() => {
      filterOverlay.classList.add("visible");
      filterDrawer.classList.add("open");
    });
  }
  function closeDrawer() {
    filterOverlay.classList.remove("visible");
    filterDrawer.classList.remove("open");
    window.setTimeout(() => filterOverlay.classList.add("hidden"), 250);
  }

  filterBtn.onclick = openDrawer;
  filterCloseBtn.onclick = closeDrawer;
  filterOverlay.onclick = closeDrawer;
  filterClearBtn.onclick = () => {
    draft = { category: "all", brands: new Set(), sizes: new Set() };
    syncDrawerUI();
  };
  filterApplyBtn.onclick = () => {
    applied = { category: draft.category, brands: new Set(draft.brands), sizes: new Set(draft.sizes) };
    updateFilterBadge();
    renderGrid();
    closeDrawer();
  };

  function openMainMenu() {
    mainMenuOverlay.classList.remove("hidden");
    requestAnimationFrame(() => {
      mainMenuOverlay.classList.add("visible");
      mainMenuDrawer.classList.add("open");
    });
  }
  function closeMainMenu() {
    mainMenuOverlay.classList.remove("visible");
    mainMenuDrawer.classList.remove("open");
    window.setTimeout(() => mainMenuOverlay.classList.add("hidden"), 250);
  }
  menuBtn.onclick = openMainMenu;
  mainMenuCloseBtn.onclick = closeMainMenu;
  mainMenuOverlay.onclick = closeMainMenu;

  function showPanel(el) {
    [detailEl, infoEl].forEach((p) => p.classList.add("hidden"));
    gridEl.classList.add("hidden");
    document.querySelector(".toolbar").classList.add("hidden");
    el.classList.remove("hidden");
    el.classList.remove("slide-in");
    void el.offsetWidth;
    el.classList.add("slide-in");
    el.scrollTop = 0;
  }
  function showGridView() {
    lastInfo = null;
    detailEl.classList.add("hidden");
    infoEl.classList.add("hidden");
    gridEl.classList.remove("hidden");
    document.querySelector(".toolbar").classList.remove("hidden");
  }

  const WHATSAPP_SVG = `<svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.71-.7 1.96-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34z"/>
    <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.86.51 3.62 1.4 5.12L2 22l5.03-1.38A9.94 9.94 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.14c-1.66 0-3.2-.48-4.5-1.31l-.32-.2-3.02.83.83-2.94-.21-.33a8.14 8.14 0 0 1-1.28-4.19c0-4.5 3.66-8.16 8.16-8.16S20.18 7.5 20.18 12s-3.66 8.14-8.16 8.14z"/>
  </svg>`;

  function showAbout() {
    lastInfo = "about";
    document.getElementById("infoTitle").textContent = t("aboutTitle");
    document.getElementById("infoText").textContent = t("aboutText");
    const c = document.getElementById("infoContact");
    c.classList.add("hidden");
    c.innerHTML = "";
    showPanel(infoEl);
  }
  function showContact() {
    lastInfo = "contact";
    document.getElementById("infoTitle").textContent = t("contactTitle");
    document.getElementById("infoText").textContent = t("contactText");
    const c = document.getElementById("infoContact");
    c.classList.remove("hidden");
    c.innerHTML = `
      <div class="contact-row"><span class="contact-label">${t("contactPhoneLabel")}</span><a class="contact-value" href="tel:+995557746238" dir="ltr">+995 55 774 6238</a></div>
      <a class="whatsapp-btn" style="margin-top:14px" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("contactWaGreeting"))}">
        ${WHATSAPP_SVG}
        <span>${t("contactWaBtn")}</span>
      </a>`;
    showPanel(infoEl);
  }

  menuBrandsBtn.onclick = () => { closeMainMenu(); window.setTimeout(openDrawer, 260); };
  menuProductsBtn.onclick = () => { closeMainMenu(); showGridView(); };
  menuAboutBtn.onclick = () => { closeMainMenu(); showAbout(); };
  menuContactBtn.onclick = () => { closeMainMenu(); showContact(); };
  document.getElementById("infoBackBtn").onclick = showGridView;

  let dotsScrollHandler = null;

  function showDetail(p) {
    const gallery = document.getElementById("detailGallery");
    gallery.innerHTML = p.images.map((src) => `<img src="images/${src.split("/").pop()}" alt="${localizedName(p)}" />`).join("");

    const dotsWrap = document.getElementById("galleryDots");
    dotsWrap.innerHTML = p.images.map((_, i) => `<span class="dot${i === 0 ? " active" : ""}"></span>`).join("");
    if (dotsScrollHandler) gallery.removeEventListener("scroll", dotsScrollHandler);
    dotsScrollHandler = () => {
      const idx = Math.round(gallery.scrollLeft / gallery.clientWidth);
      dotsWrap.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === Math.abs(idx)));
    };
    gallery.addEventListener("scroll", dotsScrollHandler, { passive: true });

    document.getElementById("detailBrand").textContent = localizedBrand(p.brand);
    document.getElementById("detailName").textContent = localizedName(p);
    document.getElementById("detailPrice").textContent =
      formatPrice(p.price) + " / " + t("perUnit") + " " + (UNIT_LABEL[locale][p.unit] ?? p.unit);
    document.getElementById("whatsappBtn").href = whatsappLink(p);
    document.getElementById("detailDesc").textContent = localizedDesc(p);

    const specs = [
      [t("specBrand"), localizedBrand(p.brand)],
      [t("specSize"), p.size],
      [t("specColor"), localizedColor(p.color)],
      [t("specMaterial"), localizedMaterial(p.material)],
      [t("specUsage"), localizedUsage(p.usage)],
      [t("specAntiSlip"), p.antiSlip ? t("yes") : t("no")],
    ].filter(([, v]) => v != null && v !== "");

    document.getElementById("detailSpecs").innerHTML = specs
      .map(([label, value]) => `<div class="spec-label">${label}</div><div class="spec-value">${value}</div>`)
      .join("");

    lastInfo = null;
    showPanel(detailEl);
  }

  backBtn.onclick = showGridView;

  langBtn.onclick = () => {
    locale = locale === "fa" ? "az" : "fa";
    localStorage.setItem("locale", locale);
    applyChrome();
    buildFilterOptions();
    syncDrawerUI();
    renderGrid();
    if (lastInfo === "about") showAbout();
    else if (lastInfo === "contact") showContact();
  };

  function renderSkeleton() {
    gridEl.innerHTML = Array.from({ length: 6 })
      .map(() => `<div class="card skeleton"><div class="card-img-wrap"></div><div class="card-body"><div class="skel-line w60"></div><div class="skel-line w90"></div><div class="skel-line w40"></div></div></div>`)
      .join("");
  }

  applyChrome();
  renderSkeleton();

  fetch("data/catalog.json")
    .then((r) => r.json())
    .then((data) => {
      catalog = data;
      buildFilterOptions();
      updateFilterBadge();
      renderGrid();
    })
    .catch((err) => {
      gridEl.innerHTML = `<p style="padding:20px;color:#94a3b8">${err.message}</p>`;
    });
})();
