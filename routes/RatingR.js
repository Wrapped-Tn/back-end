const express = require("express");
const RatingC = require("../controllers/RatingC")

const router = express.Router();

router.post("/rate/:userId", RatingC.updateBrandRate);
router.get("/brandRate/:brandId", RatingC.getAverageRating);
router.get("/userRate/:brandId/:userId", RatingC.getUserRating);

module.exports = router;
