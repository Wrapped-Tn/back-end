const express = require("express");
const RatingC = require("../controllers/RatingC")

const router = express.Router();

router.post("/rate", RatingC.rateBrand);
router.get("/brand/:brandId", RatingC.getBrandRating);
router.get("/user/:brandId", RatingC.getUserRating);
router.delete("/delete/:brandId", RatingC.deleteRating);

module.exports = router;
