/**
 * Email regex
 */
export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/**
 * Alpha numeric, underscore, and hyphen regex
 */
export const alphaNumericUnderscoreRegex = /^[a-zA-Z0-9_]+$/;

/**
 * URL regex
 */
export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

/**
 * Image URL regex
 */
export const imageUrlRegex = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg|webp))/;
