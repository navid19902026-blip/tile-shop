(function () {
  "use strict";

  const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
  function toPersianDigits(value) {
    return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[+d]);
  }
  function formatPrice(amount) {
    return toPersianDigits(amount.toLocaleString("en-US")) + " تومان";
  }
  const UNIT_LABEL = { SQUARE_METER: "متر مربع", CARTON: "کارتن", PIECE: "عدد" };
  const WHATSAPP_NUMBER = "995557746238";

  function whatsappLink(p) {
    const lines = [
      "سلام، می‌خواستم درباره این محصول سفارش بدم:",
      p.name,
      p.brand ? `برند: ${p.brand}` : null,
      p.size ? `سایز: ${p.size}` : null,
      `قیمت: ${formatPrice(p.price)}`,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  const gridEl = document.getElementById("grid");
  const tabsEl = document.getElementById("categoryTabs");
  const detailEl = document.getElementById("detail");
  const backBtn = document.getElementById("backBtn");

  let catalog = { categories: [], products: [] };
  let activeCategory = "all";

  function renderTabs() {
    const tabs = [{ slug: "all", name: "همه" }, ...catalog.categories];
    tabsEl.innerHTML = "";
    for (const t of tabs) {
      const btn = document.createElement("button");
      btn.className = "tab" + (t.slug === activeCategory ? " active" : "");
      btn.textContent = t.name;
      btn.onclick = () => {
        activeCategory = t.slug;
        renderTabs();
        renderGrid();
      };
      tabsEl.appendChild(btn);
    }
  }

  function renderGrid() {
    const products =
      activeCategory === "all"
        ? catalog.products
        : catalog.products.filter((p) => p.category === activeCategory);

    gridEl.innerHTML = "";
    for (const p of products) {
      const card = document.createElement("div");
      card.className = "card";
      const img = p.images[0] ? `images/${p.images[0].split("/").pop()}` : "";
      card.innerHTML = `
        <img src="${img}" alt="${p.name}" loading="lazy" />
        <div class="card-body">
          <div class="card-brand">${p.brand ?? ""}</div>
          <div class="card-name">${p.name}</div>
          <div class="card-price">${formatPrice(p.price)}</div>
        </div>`;
      card.onclick = () => showDetail(p);
      gridEl.appendChild(card);
    }
  }

  function showDetail(p) {
    document.getElementById("detailGallery").innerHTML = p.images
      .map((src) => `<img src="images/${src.split("/").pop()}" alt="${p.name}" />`)
      .join("");
    document.getElementById("detailBrand").textContent = p.brand ?? "";
    document.getElementById("detailName").textContent = p.name;
    document.getElementById("detailPrice").textContent =
      formatPrice(p.price) + " / " + (UNIT_LABEL[p.unit] ?? p.unit);
    document.getElementById("whatsappBtn").href = whatsappLink(p);
    document.getElementById("detailDesc").textContent = p.description;

    const specs = [
      ["برند", p.brand],
      ["سایز", p.size],
      ["رنگ", p.color],
      ["جنس", p.material],
      ["کاربرد", p.usage],
      ["ضدلغزش", p.antiSlip ? "دارد" : "ندارد"],
    ].filter(([, v]) => v != null && v !== "");

    document.getElementById("detailSpecs").innerHTML = specs
      .map(([label, value]) => `<div class="spec-label">${label}</div><div class="spec-value">${value}</div>`)
      .join("");

    document.body.classList.add("detail-open");
    gridEl.classList.add("hidden");
    tabsEl.classList.add("hidden");
    detailEl.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  backBtn.onclick = () => {
    detailEl.classList.add("hidden");
    gridEl.classList.remove("hidden");
    tabsEl.classList.remove("hidden");
  };

  fetch("data/catalog.json")
    .then((r) => r.json())
    .then((data) => {
      catalog = data;
      renderTabs();
      renderGrid();
    })
    .catch((err) => {
      gridEl.innerHTML = `<p style="padding:20px;color:#94a3b8">خطا در بارگذاری اطلاعات: ${err.message}</p>`;
    });
})();
