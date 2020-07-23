/**
 * Render Pages on TalentPool
 * @param {object} res - response object
 * @param {String} page - Path to ejs file
 * @param {String} pathRoute - request path found in routes
 * @param {String} title - Page title, defaults to empty string
 * @param {Object} rest - Additional object to be passed to the page
 * @returns {Object} - Page rendered
 */
exports.renderPage = (res, page, pathRoute, title='', rest) => res.render(page, {
      path: pathRoute,
      title,
      ...rest
    });
