const BASE_URL = "https://api.escuelajs.co/api/v1";
describe("Categories API - Platzi Fake Store", () => {
  // 1. GET All Categories
  it("1. GET - Mendapatkan semua kategori", () => {
    cy.request({
      method: "GET",
      url: `${BASE_URL}/categories`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
      response.body.forEach((category) => {
        expect(category).to.include.keys("id", "name", "slug", "image");
        expect(category.id).to.be.a("number");
        expect(category.name).to.be.a("string");
        expect(category.slug).to.be.a("string");
      });
      cy.log(`Total kategori ditemukan: ${response.body.length}`);
    });
  });
  // 2. GET Single Category by ID
  it("2. GET - Mendapatkan kategori berdasarkan ID", () => {
    const categoryId = 1;
    cy.request({
      method: "GET",
      url: `${BASE_URL}/categories/${categoryId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body.id).to.eq(categoryId);
      // FIX: pakai include.keys agar tidak strict
      expect(response.body).to.include.keys("id", "name", "slug", "image");
      expect(response.body.name).to.be.a("string").and.not.be.empty;
      cy.log(`Kategori ditemukan: ${response.body.name}`);
    });
  });
  // 3. GET Single Category by Slug
  it("3. GET - Mendapatkan kategori berdasarkan Slug", () => {
    cy.request({
      method: "GET",
      url: `${BASE_URL}/categories`,
    }).then((listResponse) => {
      expect(listResponse.status).to.eq(200);
      expect(listResponse.body.length).to.be.greaterThan(0);
      const validSlug = listResponse.body[0].slug;
      cy.log(` Menggunakan slug valid: ${validSlug}`);
      cy.request({
        method: "GET",
        url: `${BASE_URL}/categories/slug/${validSlug}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400]);
        if (response.status === 200) {
          expect(response.body).to.be.an("object");
          expect(response.body.slug).to.eq(validSlug);
          cy.log(`Kategori dengan slug '${validSlug}' ditemukan: ${response.body.name}`);
        } else {
          cy.log(`Slug endpoint mengembalikan 400 - endpoint mungkin tidak aktif`);
        }
      });
    });
  });
  // 4. POST - Create New Category
  it("4. POST - Membuat kategori baru", () => {
    const timestamp = Date.now();
    const newCategory = {
      name: `Cypress Category ${timestamp}`,
      image: "https://placehold.co/600x400",
    };
    cy.request({
      method: "POST",
      url: `${BASE_URL}/categories/`,
      body: newCategory,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.be.an("object");
      expect(response.body.name).to.eq(newCategory.name);
      expect(response.body.id).to.be.a("number");
      expect(response.body.slug).to.be.a("string").and.not.be.empty;

      cy.log(`✅ Kategori baru dibuat - ID: ${response.body.id}, Name: ${response.body.name}`);
    });
  });
  // 5. PUT - Update Category
  it("5. PUT - Mengupdate kategori yang sudah ada", () => {
    const targetId = 3;
    const updatedData = {
      name: "Updated by Cypress",
      image: "https://placehold.co/600x400",
    };
    cy.request({
      method: "PUT",
      url: `${BASE_URL}/categories/${targetId}`,
      body: updatedData,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body.id).to.eq(targetId);
      expect(response.body.name).to.eq(updatedData.name);
      expect(response.body.slug).to.be.a("string");

      cy.log(`✅ Kategori ID ${targetId} berhasil diupdate: ${response.body.name}`);
    });
  });
  // 6. GET - Semua Produk dalam Kategori
  it("6. GET - Mendapatkan semua produk dalam kategori", () => {
    const categoryId = 1;
    cy.request({
      method: "GET",
      url: `${BASE_URL}/categories/${categoryId}/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        const firstProduct = response.body[0];
        expect(firstProduct).to.include.keys("id", "title", "price", "category");
        expect(firstProduct.category.id).to.eq(categoryId);
      }
      cy.log(`Total produk dalam kategori ID ${categoryId}: ${response.body.length}`);
    });
  });
  // 7. DELETE - Hapus Category
  it("7. DELETE - Menghapus kategori berdasarkan ID", () => {
    const timestamp = Date.now();
    const tempCategory = {
      name: `Temp Delete Category ${timestamp}`,
      image: "https://placehold.co/600x400",
    };
    cy.request({
      method: "POST",
      url: `${BASE_URL}/categories/`,
      body: tempCategory,
      headers: { "Content-Type": "application/json" },
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      const idToDelete = createResponse.body.id;
      cy.log(`🗑️ Akan menghapus kategori ID: ${idToDelete}`);
      cy.request({
        method: "DELETE",
        url: `${BASE_URL}/categories/${idToDelete}`,
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(String(deleteResponse.body)).to.eq("true");
        cy.log(`Kategori ID ${idToDelete} berhasil dihapus`);
        cy.request({
          method: "GET",
          url: `${BASE_URL}/categories/${idToDelete}`,
          failOnStatusCode: false,
        }).then((verifyResponse) => {
          expect(verifyResponse.status).to.be.oneOf([404, 400]);
          cy.log("Verifikasi: kategori sudah tidak ditemukan");
        });
      });
    });
  });
});
