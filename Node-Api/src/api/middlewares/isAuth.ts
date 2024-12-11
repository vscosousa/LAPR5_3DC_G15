var { expressjwt: jwt } = require("express-jwt");
import config from '../../../config';

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */
const getTokenFromHeader = (req: { headers: { authorization: string | string[]; }; }) => {
  let authorizationHeader = req.headers.authorization;

  // Handle case where authorization header is an array
  if (Array.isArray(authorizationHeader)) {
    authorizationHeader = authorizationHeader[0];
  }

  if (authorizationHeader) {
    const parts = authorizationHeader.split(' ');
    if (parts[0] === 'Token' || parts[0] === 'Bearer') {
      return parts[1];
    }
  }
  return null;
};

const isAuth = jwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  userProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader, // How to extract the JWT from the request
  algorithms: ["HS256"],  // Added by JRT
});

export default isAuth;