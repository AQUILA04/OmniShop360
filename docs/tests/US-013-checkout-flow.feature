Feature: Flux de Vente et Mise à jour de Stock
  As a Cashier
  I want to process a sale
  So that the customer gets their receipt and the inventory is updated

  Background:
    Given the shop "Boutique Centre" has 10 units of "Café Arabica" in stock
    And I am logged in as a cashier for "Boutique Centre"

  Scenario: Vente réussie avec décrémentation de stock
    When I add 2 units of "Café Arabica" to the cart
    And I validate the payment with "CARD"
    Then the sale should be recorded successfully
    And the stock for "Café Arabica" in "Boutique Centre" should be 8 units
    And a stock entry of type "OUT" should be created for this sale

  Scenario: Échec de la vente si stock insuffisant
    When I try to add 15 units of "Café Arabica" to the cart
    Then the system should show an alert "INSUFFICIENT_STOCK"
    And the sale should not be processed