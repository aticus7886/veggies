@http_api @fixtures @offline
Feature: Using fixtures with http API extension

  @yaml
  Scenario: Setting json body from .yaml fixture file
    Given I mock http call to forward request body for path /users/yaml
    And set request json body from yaml_00
    When I POST http://fake.io/users/yaml
    Then I should receive a 200 HTTP status code
    And response should match snapshot yaml_00

  @yaml
  Scenario: Setting form body from .yaml fixture file
    Given I mock http call to forward request body for path /users/yaml
    And set request form body from yaml_00
    When I POST http://fake.io/users/yaml
    Then I should receive a 200 HTTP status code
    And response should match url encoded snapshot yaml_00

  @yaml
  Scenario: Setting json body from .yml fixture file
    Given I mock http call to forward request body for path /users/yml
    And set request json body from yaml_01
    When I POST http://fake.io/users/yml
    Then I should receive a 200 HTTP status code
    And response should match snapshot yaml_01

  @yaml
  Scenario: Setting form body from .yml fixture file
    Given I mock http call to forward request body for path /users/yml
    And set request form body from yaml_01
    When I POST http://fake.io/users/yml
    Then I should receive a 200 HTTP status code
    And response should match url encoded snapshot yaml_01

  @text
  Scenario: Setting json body from .txt fixture file
    Given I mock http call to forward request body for path /users/txt
    And set request json body from text_00
    When I POST http://fake.io/users/txt
    Then I should receive a 200 HTTP status code
    And response should match snapshot text_00

  @text
  Scenario: Setting form body from .txt fixture file
    Given I mock http call to forward request body for path /users/txt
    And set request form body from text_00
    When I POST http://fake.io/users/txt
    Then I should receive a 200 HTTP status code
    And response should match snapshot text_00

  @js
  Scenario: Setting json body from .js fixture file
    Given I mock http call to forward request body for path /users/js
    And set request json body from module_00
    When I POST http://fake.io/users/js
    Then I should receive a 200 HTTP status code
    And response should match snapshot module_00

  @js
  Scenario: Setting form body from .js fixture file
    Given I mock http call to forward request body for path /users/js
    And set request form body from module_00
    When I POST http://fake.io/users/js
    Then I should receive a 200 HTTP status code
    And response should match url encoded snapshot module_00

  @json
  Scenario: Setting json body from .json fixture file
    Given I mock http call to forward request body for path /users/json
    And set request json body from json_00
    When I POST http://fake.io/users/json
    Then I should receive a 200 HTTP status code
    And response should match snapshot json_00

  @json
  Scenario: Setting form body from .json fixture file
    Given I mock http call to forward request body for path /users/json
    And set request form body from json_00
    When I POST http://fake.io/users/json
    Then I should receive a 200 HTTP status code
    And response should match url encoded snapshot json_00
