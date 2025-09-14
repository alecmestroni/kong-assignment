/**
 * Kong Manager Support File
 */

import "./kong-manager/route";
import "./kong-manager/service";
import "./kong-manager/admin";
import "./common";

before("clean environment", () => {
  cy.cleanEnvironment();
});
