/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

/**
 * Converts an object of query paremeters to a valid query string
 *
 * @param {Object} query_parameters
 * @returns {string} The query string
 */
const parse_query_parameters = (query_parameters: object): string => {
  let query_string = "";
  query_string += "?";
  for (const [key, value] of Object.entries(query_parameters)) {
    if (Array.isArray(value)) {
      query_string += `${key}=${JSON.stringify(value)}&`;
    } else if (value != null) {
      query_string += `${key}=${value}&`;
    }
  }

  query_string = query_string.substring(0, query_string.length - 1);
  return query_string;
};

/**
 * Performs a POST request to an internal url. If the request succeeds,
 * it returns the message property from the response.
 *
 * @param {string} url The URL or endpoint to send the POST request to
 * @param {any} data Request body
 * @returns {Promise<any>} The response
 */
export const internal_axios_post = async (
  url: string,
  data: any
): Promise<any> => {
  try {
    const res = await axios.post(`/api${url}`, data);
    return res.data;
  } catch (error) {
    console.log("API Error:", error);
    throw new Error("Failed to get a response from the server.");
  }
};

/**
 * Performs a GET request to the specified url, optionally appending query parameters.
 * If the request succeeds, it returns the message property from the response.
 *
 * @param {string} url The base URL or endpoint to send the GET request to
 * @param {object} query_parameters An optional object of query parameters to append to the URL
 * @returns {Promise<any>} The response
 */
export const axios_get = async (
  url: string,
  query_parameters: object = {}
): Promise<any> => {
  try {
    const res = await axios.get(url + parse_query_parameters(query_parameters));
    return res.data;
  } catch (error) {
    console.log("API Error:", error);
    throw new Error("Failed to get a response from the server.");
  }
};
