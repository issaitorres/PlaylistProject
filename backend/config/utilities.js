const environment = `${process.env.NODE_ENV === "development" ? process.env.DEV_FRONTEND : process.env.PROD_FRONTEND}`

module.exports = {
    environment
}
