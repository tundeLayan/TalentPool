/**
 * Render Pages on TalentPool
 * @param {object} res - response object
 * @param {String} page - Path to ejs file
 * @param {String} path - path routes for the dashboard to have css selected for side nav
 * @param {String} title - Page title, defaults to empty string
 * @param {Object} rest - Additional object to be passed to the page
 * @returns {Object} - Page rendered
 */
exports.renderPage = (res, page, rest, title='', path = '') => res.render(page, {
      path,
      title,
      ...rest
    });
