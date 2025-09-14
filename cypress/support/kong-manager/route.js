/**
 * Kong Manager Route Commands
 */

Cypress.Commands.add("createRoute", (type = "default") => {
  cy.createRouteSimple().then(() => {
    cy.interceptSimple(`/${Cypress.env("routeId")}*`, "GET")
    cy.interceptSimple(`/${Cypress.env("routeId")}`, "GET")

    cy.waitSimple(`/${Cypress.env("routeId")}*`, 200).then((api) => {
      expect(api.response.body, `api should response with the body we expect`).to.deep.eq(Cypress.env("routeData"))
    })
    cy.waitSimple(`/${Cypress.env("routeId")}`, 200).then((api) => {
      expect(api.response.body, `api should response with the body we expect`).to.deep.eq(Cypress.env("routeData"))
    })

    cy.checkRouteDefaultProperties(type)
  })

  cy.checkTextFromCopy(Cypress.env("SELECTORS").UUID_COPY, "routeId")
})

Cypress.Commands.add("createRouteSimple", () => {
  const path = Cypress.env("PATHS").ROUTES
  cy.interceptSimple(path, "POST", false)

  cy.clickDataTestIdAndWaitApi(Cypress.env("SELECTORS").ROUTE_FORM_SUBMIT, Cypress.env("PATHS").ROUTES, "POST", 201, false).then((api) => {
    expect(api.response.body.name, `api should response with name: ${Cypress.env("routeName") || null}`).to.eq(Cypress.env("routeName") || null)
    const routeData = api.response.body
    Cypress.env("routeData", routeData)
    expect(api.response.body.service?.id || null, `api should response with service: ${Cypress.env("serviceId") || null}`).to.eq(
      Cypress.env("serviceId") || null
    )

    const routeId = routeData.id
    Cypress.env("routeId", routeId)
  })
})

Cypress.Commands.add("checkRouteDefaultProperties", (type) => {
  let fileName
  switch (type) {
    case "default":
      fileName = "routeDefaultProp"
      cy.log("Check default properties for base case")
      break
    case "full":
      fileName = "routeFullProp"
      cy.log("Check default properties for full case")
      break
    case "advanced":
      fileName = "routeAdvancedProp"
      cy.log("Check default properties for advanced case")
      break
    default:
      throw new Error(`type: ${type} is not supported`)
  }
  cy.fixture(fileName).then((defaultProps) => {
    const routeData = Cypress.env("routeData")

    Object.keys(defaultProps).forEach((key) => {
      expect(routeData, `Route should contain property "${key}"`).to.have.property(key)
      expect(routeData[key], `Property "${key}" should have value ${JSON.stringify(defaultProps[key])}`).to.deep.eq(defaultProps[key])
    })
  })
})

Cypress.Commands.add("fillBasicRouteFields", (routeData) => {
  cy.selectInputFromWrapper(Cypress.env("SELECTORS").ROUTE_FORM_SERVICE_ID, Cypress.env("serviceId"))
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_NAME).type(Cypress.env("routeName"))
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_TAGS).type(routeData.tags.join(","))

  cy.getDataTestId(Cypress.env("SELECTORS").MULTISELECT_TRIGGER).click()
  cy.wrap(routeData.methods).each((method) => {
    cy.getDataTestId(`${Cypress.env("SELECTORS").MULTISELECT_ITEM_PREFIX}${method}`, false).click()
  })
  cy.getDataTestId(Cypress.env("SELECTORS").MULTISELECT_DROPDOWN_INPUT).type("{esc}")

  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_HOST).type(routeData.hosts[0])
})

Cypress.Commands.add("fillAdditionalHosts", (hosts) => {
  if (hosts.length > 1) {
    cy.wrap(hosts).each((host, index) => {
      if (index === 0) return
      cy.getDataTestId(Cypress.env("SELECTORS").ADD_HOSTS).click()
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_HOST.slice(0, -1) + (index + 1)).type(host)
    })
  }
})

Cypress.Commands.add("fillRouteHeaders", (headers) => {
  if (headers != null) {
    const headerKeys = Object.keys(headers)
    cy.wrap(headerKeys).each((headerName, index) => {
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_HEADERS_NAME.slice(0, -1) + (index + 1)).type(headerName)
      cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_HEADERS_VALUES.slice(0, -1) + (index + 1)).type(headers[headerName][0])
      cy.getDataTestId(Cypress.env("SELECTORS").ADD_HEADERS).click()
    })
  }
})

Cypress.Commands.add("fillAdvancedRouteFields", (routeData) => {
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_SNI).type(routeData.snis[0])
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_REGEX_PRIORITY).type(routeData.regex_priority)
  cy.selectInputFromWrapper(Cypress.env("SELECTORS").ROUTE_FORM_PROTOCOLS, routeData.protocols.join(","))
})

Cypress.Commands.add("compileBasicRouteForm", (type = "default") => {
  cy.getDataTestId(Cypress.env("SELECTORS").ROUTE_FORM_PATH).type(Cypress.env("ROUTE_PATH"))

  if (type !== "default") {
    Cypress.env("routeName", `new-routes-${Date.now()}`)
    const fixtureName = type === "full" ? "routeFullProp" : "routeAdvancedProp"

    cy.fixture(fixtureName).then((routeData) => {
      cy.fillBasicRouteFields(routeData)

      if (type === "advanced") {
        cy.fillAdditionalHosts(routeData.hosts)
        cy.fillRouteHeaders(routeData.headers)
        cy.fillAdvancedRouteFields(routeData)
      }
    })
  }
})

Cypress.Commands.add("checkRouteCreated", () => {
  const path = Cypress.env("PATHS").ROUTES

  cy.interceptSimple(`${path}*`, "GET", false)

  cy.visit(`/${Cypress.env("WORKSPACE_NAME")}${Cypress.env("PATHS").ROUTES}`).then(() => {
    cy.waitSimple(`${path}*`, 200).then((api) => {
      const foundRoute = api.response.body.data.find((route) => route.name === Cypress.env("routeName") && route.id === Cypress.env("routeId"))

      expect(foundRoute, `Route with name "${Cypress.env("routeName")}" and id "${Cypress.env("routeId")}" should exist in the response`).to.exist
    })
    // If routeName is null, the frontend displays a dash (-)
    const displayName = Cypress.env("routeName") || "-"
    cy.contains(displayName).should("be.visible")
  })
})
