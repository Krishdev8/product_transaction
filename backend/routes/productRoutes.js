const express = require("express");
const {
  seedDatabase,
  listTransactions,
  getStatistics,
} = require("../controllers/productController");
const router = express.Router();

router.get("/seed", seedDatabase);
router.get("/transactions", listTransactions);
router.get("/statistics", getStatistics);

module.exports = router;
