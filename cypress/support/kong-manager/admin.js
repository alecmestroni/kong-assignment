/**
 * Kong Manager Admin Commands
 */

if (!Cypress.env("KONG_ADMIN_URL")) {
  throw new Error("KONG_ADMIN_URL environment variable is not set")
}

/**
 * Helper function to get and validate API path for given item type
 * @param {string} itemType - The type of item (e.g., 'service', 'route')
 * @returns {string} The API path for the item type
 * @throws {Error} If item type is not found in PATHS configuration
 */
function getApiPath(itemType) {
  const paths = Cypress.env("PATHS")
  const path = paths[itemType.toUpperCase()]
  if (!path) {
    const availableTypes = Object.keys(paths)
      .map((key) => key.toLowerCase())
      .join(", ")
    throw new Error(`Unknown item type: ${itemType}. Available: ${availableTypes}`)
  }
  return path
}

Cypress.Commands.add("getAllItems", (itemType) => {
  const path = getApiPath(itemType)

  return cy
    .request({
      method: "GET",
      url: `${Cypress.env("KONG_ADMIN_URL")}${path}`,
      failOnStatusCode: false,
    })
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("data")
      cy.then(() => {
        return response.body.data
      })
    })
})

Cypress.Commands.add("deleteItem", (itemType, itemId) => {
  const path = getApiPath(itemType)

  cy.request({
    method: "DELETE",
    url: `${Cypress.env("KONG_ADMIN_URL")}${path}/${itemId}`,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(204)
  })
})

Cypress.Commands.add("createItem", (itemType, itemData, itemToSave = undefined) => {
  const path = getApiPath(itemType)

  cy.request({
    method: "POST",
    url: `${Cypress.env("KONG_ADMIN_URL")}${path}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: itemData,
    failOnStatusCode: false,
  }).then((response) => {
    if (itemToSave) Cypress.env(itemToSave.name, response.body[itemToSave.property])
    expect(response.status).to.eq(201)
  })
})

Cypress.Commands.add("deleteAllItems", (itemType) => {
  cy.getAllItems(itemType).then((items) => {
    if (items.length > 0) {
      cy.log(`Deleting ${items.length} ${itemType}...`)
      items.forEach((item) => {
        cy.deleteItem(itemType, item.id)
      })
    } else {
      cy.log(`No ${itemType} to delete`)
    }
  })
})

Cypress.Commands.add("createServiceAdmin", () => {
  cy.createItem(
    "services",
    {
      url: Cypress.env("SERVICE_URL"),
      name: `new-service-${Date.now()}`,
    },
    { name: "serviceId", property: "id" }
  )
})

Cypress.Commands.add("createRouteAdmin", () => {
  cy.createItem(
    "routes",
    {
      paths: ["/mock"],
      name: `new-route-${Date.now()}`,
    },
    { name: "routeId", property: "id" }
  )
})

Cypress.Commands.add("createPlugin", () => {
  cy.createItem("plugins", {
    name: "acl",
    config: {
      allow: ["dev", "admin"],
      hide_groups_header: false,
    },
  })
})

Cypress.Commands.add("cleanEnvironment", () => {
  // route should be deleted before service
  cy.deleteAllItems("routes")
  cy.deleteAllItems("services")
  cy.deleteAllItems("consumers")
  cy.deleteAllItems("plugins")

  // Clear temporary environment variables
  Cypress.env("TEMP").forEach((tempVar) => {
    Cypress.env(tempVar, null)
  })
})
