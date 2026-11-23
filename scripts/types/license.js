const formatCurrency = (amount) => new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR"
}).format(amount);

const categoryIcons = {
  "Oficina": "icon-office",
  "Sistema operativo": "icon-system",
  "Seguridad": "icon-security",
  "Creatividad": "icon-creative",
  "Utilidades": "icon-utilities"
};

export class License {
  constructor({ id, software, version, price, key, featured, discount, category, color, symbol }) {
    this.id = id;
    this.software = software;
    this.version = version;
    this.price = price;
    this.key = key;
    this.featured = featured;
    this.discount = discount;
    this.category = category;
    this.color = color;
    this.symbol = symbol;
  }

  get discountedPrice() {
    return this.price * (1 - this.discount);
  }

  Render(parent) {
    const article = document.createElement("article");
    article.className = "product-card";
    article.innerHTML = `
      <div class="product-card-top">
        <svg class="product-icon product-art icon-${this.color}" role="img" aria-label="${this.category}">
          <use href="./assets/software-icons.svg#${categoryIcons[this.category]}"></use>
        </svg>
        <span class="discount-badge">-${Math.round(this.discount * 100)}%</span>
      </div>
      <p class="product-category">${this.category}</p>
      <h3>${this.software}</h3>
      <p class="product-version">${this.version}</p>
      <div class="product-card-bottom">
        <div class="price-block"><strong>${formatCurrency(this.discountedPrice)}</strong><del>${formatCurrency(this.price)}</del></div>
        <button class="buy-button" type="button" aria-label="Comprar ${this.software} ${this.version}">Comprar <span aria-hidden="true">↗</span></button>
      </div>`;
    article.querySelector(".buy-button").addEventListener("click", () => this.comprar());
    parent.append(article);
  }

  comprar() {
    const dialog = document.querySelector("#purchase-dialog");
    dialog.querySelector(".dialog-product").textContent = `${this.software} · ${this.version}`;
    dialog.querySelector(".license-key").textContent = this.key;
    dialog.querySelector(".copy-feedback").textContent = "";
    dialog.showModal();
  }
}
