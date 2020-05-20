/**
 * A router that handles user signout process
 * It responds to POST requests on endpoint of "/api/auth/signout"
 * This router removes all the session objects
 */

const router = require("express").Router();

router.post("/api/auth/signout", (req, res) => {
  req.session = null;
  res.send({});
});

module.exports = router;
