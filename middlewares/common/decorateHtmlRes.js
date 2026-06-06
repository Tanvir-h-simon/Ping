function decorateHtmlRes(page_title) {
    return function (req, res, next) {
        res.locals.title = `${page_title} | ${process.env.APP_NAME}`;
        next();
    }
}

module.exports = decorateHtmlRes;