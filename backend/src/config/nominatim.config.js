module.exports = {
    BASE_URL: process.env.NOMINATIM_BASE_URL,
    USER_AGENT: `${process.env.APP_NAME}/${process.env.APP_VERSION} (${process.env.APP_EMAIL})`
};