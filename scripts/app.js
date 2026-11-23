import { LicenseController } from "./controllers/licenseController.js";

class App {
  constructor() {
    this.controller = null;
    this.activeCategory = "Todos";
    this.searchInput = document.querySelector("#license-search");
    this.sortSelect = document.querySelector("#sort-products");
    this.priceSelect = document.querySelector("#price-range");
    this.dealsToggle = document.querySelector("#deals-only");
    this.catalogGrid = document.querySelector("#catalog-products");
    this.emptyState = document.querySelector("#empty-state");
    this.resetButton = document.querySelector("#reset-filters");
  }

  async init() {
    try {
      const response = await fetch("./data/licenses.json");
      if (!response.ok) {
        throw new Error(`No se pudo cargar el catálogo (${response.status}).`);
      }

      const licenses = await response.json();
      this.controller = new LicenseController(licenses);
      this.renderSections();
      this.bindEvents();
    } catch (error) {
      console.error("Error al iniciar la tienda:", error);
      document.querySelector("main").innerHTML = `
        <section class="load-error">
          <h1>No se pudo cargar el catálogo.</h1>
          <p>Abre esta página desde un servidor local para que el navegador pueda leer el archivo de datos.</p>
        </section>`;
    }
  }

  renderSections() {
    this.controller.renderFeatured(document.querySelector("#featured-products"));
    this.controller.renderDiscounts(document.querySelector("#offer-products"), 0.35);
    this.renderCatalog();
    document.querySelector("#all-count").textContent = this.controller.licenses.length;
  }

  renderCatalog() {
    const count = this.controller.renderCatalog(this.catalogGrid, {
      search: this.searchInput.value,
      category: this.activeCategory,
      sort: this.sortSelect.value,
      priceRange: this.priceSelect.value,
      dealsOnly: this.dealsToggle.checked
    });
    this.emptyState.hidden = count !== 0;
    document.querySelector("#results-count").textContent =
      `${count} ${count === 1 ? "licencia" : "licencias"}`;
  }

  bindEvents() {
    this.searchInput.addEventListener("input", () => this.renderCatalog());
    this.sortSelect.addEventListener("change", () => this.renderCatalog());
    this.priceSelect.addEventListener("change", () => this.renderCatalog());
    this.dealsToggle.addEventListener("change", () => this.renderCatalog());
    this.resetButton.addEventListener("click", () => this.resetFilters());

    document.querySelectorAll(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        this.activeCategory = button.dataset.category;
        document.querySelector(".filter-chip.is-active").classList.remove("is-active");
        button.classList.add("is-active");
        this.renderCatalog();
      });
    });

    document.querySelector(".dialog-close").addEventListener("click", () => {
      document.querySelector("#purchase-dialog").close();
    });
    document.querySelector(".copy-key").addEventListener("click", () => this.copyKey());
    document.querySelector("#purchase-dialog").addEventListener("click", (event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });

    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        this.searchInput.focus();
        document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  resetFilters() {
    this.searchInput.value = "";
    this.sortSelect.value = "featured";
    this.priceSelect.value = "all";
    this.dealsToggle.checked = false;
    this.activeCategory = "Todos";
    document.querySelector(".filter-chip.is-active").classList.remove("is-active");
    document.querySelector('[data-category="Todos"]').classList.add("is-active");
    this.renderCatalog();
  }

  async copyKey() {
    const key = document.querySelector(".license-key").textContent;
    const feedback = document.querySelector(".copy-feedback");
    try {
      await navigator.clipboard.writeText(key);
      feedback.textContent = "Clave copiada al portapapeles.";
    } catch (error) {
      console.error("No se pudo copiar la clave:", error);
      feedback.textContent = "No se pudo copiar. Selecciona la clave para copiarla manualmente.";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
