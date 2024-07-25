/**
 * This file contains utility functions and helper methods that are used throughout the project.
 * These functions perform common operations or transformations that are not tied to a specific
 * component or module but are needed in multiple places across the codebase.
 *
 * By centralizing these functions in this file, we promote code reusability and maintainability,
 * avoiding duplication and keeping helper logic organized in one place.
 *
 * Example:
 * - `formatDate`: A function to format date strings consistently.
 * - `calculateTotal`: A function to calculate totals from an array of values.
 *
 * All functions exported from this file should be generic and reusable to support various parts of the application.
 * -------------------------------------------------------------------------------------------------------------------
 */

/**
 * You can place your imports here
 * -------------------------------------------------------------------------------------------------------------------
 */
import he from "he";

/**
 * Generates a URL for displaying images stored in the storage folder that is linked to the public directory.
 *
 * @param {string} path - The relative path of the image within the storage folder.
 * @returns {string} - The full URL to access the image.
 */
export const asset = (path) => {
    return `/storage/images/${path}`;
};

/**
 * Decodes HTML entities in a string, ensuring proper conversion of nested or doubly-encoded entities.
 *
 * @param {string} str - The string containing HTML entities to be decoded.
 * @returns {string} - The decoded string with HTML entities converted to their respective characters.
 */
export const decodeHtmlEntities = (str) => {
    return he.decode(he.decode(str));
};
