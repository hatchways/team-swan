const router = require("express").Router();
const requireAuth = require('../middleware/require-auth')
const CSVController = require('../controllers/csv')


router.post("/api/upload", requireAuth, CSVController.uploadCSV);
router.post("/api/prospect", requireAuth, CSVController.addProspects);

module.exports = router;
