import { License } from "../types/license.js";

export class LicenseController {
  constructor(licenses) {
    this.licenses = licenses.map((data) => new License(data));
  }

  renderFeatured(parent) {
    this.renderLicenses(
      this.licenses.filter((license) => license.featured),
      parent
    );
  }

  renderDiscounts(parent, minimumDiscount = 0.3) {
    this.renderLicenses(
      this.licenses.filter((license) => license.discount >= minimumDiscount),
      parent
    );
  }

  renderCatalog(parent, {
    search = "",
    category = "Todos",
    sort = "featured",
    priceRange = "all",
    dealsOnly = false
  } = {}) {
    const query = search.trim().toLocaleLowerCase("es");
    let filteredLicenses = this.licenses.filter((license) => {
      const searchableText = `${license.software} ${license.version} ${license.category}`
        .toLocaleLowerCase("es");
      const matchesSearch = searchableText.includes(query);
      const matchesCategory = category === "Todos" || license.category === category;
      const matchesPrice = this.matchesPriceRange(license.discountedPrice, priceRange);
      const matchesDeals = !dealsOnly || license.discount >= 0.3;
      return matchesSearch && matchesCategory && matchesPrice && matchesDeals;
    });

    if (sort === "price-asc") {
      filteredLicenses.sort((first, second) => first.discountedPrice - second.discountedPrice);
    } else if (sort === "price-desc") {
      filteredLicenses.sort((first, second) => second.discountedPrice - first.discountedPrice);
    } else if (sort === "discount") {
      filteredLicenses.sort((first, second) => second.discount - first.discount);
    } else if (sort === "name") {
      filteredLicenses.sort((first, second) => first.software.localeCompare(second.software, "es"));
    } else {
      filteredLicenses.sort((first, second) => Number(second.featured) - Number(first.featured));
    }

    this.renderLicenses(filteredLicenses, parent);
    return filteredLicenses.length;
  }

  matchesPriceRange(price, range) {
    if (range === "under-25") return price < 25;
    if (range === "25-50") return price >= 25 && price < 50;
    if (range === "over-50") return price >= 50;
    return true;
  }

  renderLicenses(licenses, parent) {
    parent.replaceChildren();
    licenses.forEach((license) => license.Render(parent));
  }
}
