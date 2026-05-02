Feature: Sécurité des Prix et Gouvernance de Marge
  As a Tenant Admin
  I want to manage sensitive price data
  So that I can control my profitability without exposing costs to shop staff

  Background:
    Given a product "Croissant" exists in the catalog
    And the purchase price is set to 0.50
    And the sale price is set to 1.50

  Scenario: Un Tenant Admin peut voir le prix d'achat
    Given I am logged in as "boss@tenant.com" with role "ROLE_TENANT_ADMIN"
    When I request the details of product "Croissant"
    Then the response should contain a purchase price of 0.50
    And the calculated margin should be 66.67%

  Scenario: Un Shop Admin ne peut PAS voir le prix d'achat (Sécurité)
    Given I am logged in as "manager@shop1.com" with role "ROLE_SHOP_ADMIN"
    When I request the details of product "Croissant"
    Then the response should not contain the field "purchase_price"
    And the response should contain the sale price of 1.50

  Scenario: Changement de politique de prix imposé
    Given I am logged in as "boss@tenant.com" with role "ROLE_TENANT_ADMIN"
    When I set the price policy to "GLOBAL_ENFORCED"
    Then all shops should receive a notification of price freeze
    And any attempt by a Shop Admin to modify the local price should be denied