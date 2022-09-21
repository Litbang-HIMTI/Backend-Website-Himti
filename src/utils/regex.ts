/* eslint-disable */
/**
 * Email regex
 */
export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/**
 * Alpha numeric, underscore, and hyphen regex
 */
export const urlSaferRegex = /^[a-zA-Z0-9_-]+$/;

/**
 *  Alpha numeric, underscore, hyphen, space, ', ", dot, comma, and @ regex
 */
export const urlSafeRegex = /^[a-zA-Z0-9_-\s'".,@]+$/;

/**
 * URL regex
 */
export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

/**
 * Image URL regex
 */
export const imageUrlRegex = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg|webp))/;
