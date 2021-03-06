const { v4: uuid } = require("uuid");

/**
 * Generate a UUID (v4)
 * @returns {String} The new UUID
 */
function generateUUID() {
    return uuid();
}

module.exports = {
    generateUUID
};
