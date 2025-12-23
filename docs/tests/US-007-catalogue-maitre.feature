Feature: Gestion du Catalogue Maître
  As a Tenant Admin
  I want to create products in a master catalog
  So that all my shops share the same product definitions

  Background:
    Given a tenant named "Boulangerie Artisanale" exists
    And I am logged in as "admin@boulangerie.com" with role "ROLE_TENANT_ADMIN"

  Scenario: Création réussie d'un produit simple
    When I create a new product with:
      | name        | Baguette Tradition |
      | sku         | BAG-TRAD-001       |
      | category    | Pain               |
    Then the product "Baguette Tradition" should be saved in the master catalog
    And the product should be linked to the tenant "Boulangerie Artisanale"

  Scenario: Échec de création avec un SKU en doublon pour le même Tenant
    Given a product with SKU "BAG-TRAD-001" already exists for my tenant
    When I try to create a new product with:
      | name        | Baguette Classique |
      | sku         | BAG-TRAD-001       |
    Then I should receive an error "SKU_ALREADY_EXISTS"
    And the product should not be created

  Scenario: Gestion des variantes de produits
    When I create a product "T-Shirt" with variants:
      | Size | Color | SKU           |
      | L    | Blue  | TS-L-BLU-001  |
      | M    | Red   | TS-M-RED-001  |
    Then the product should have 2 variants in the database