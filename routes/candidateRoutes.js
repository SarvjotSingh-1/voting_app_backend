const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { jwtAuthMiddleware } = require("../middleware/jwt.js");

// post route to add candidate
router.post("/", jwtAuthMiddleware, candidateController.addCandidate);
router.put(
  "/:CandidateID",
  jwtAuthMiddleware,
  candidateController.updateCandidate,
);
router.delete(
  "/:CandidateID",
  jwtAuthMiddleware,
  candidateController.deleteCandidate,
);

router.post(
  "/vote/:candidateID",
  jwtAuthMiddleware,
  candidateController.voteCandidate,
);

router.get("/vote/count", candidateController.getVoteCounts);

router.get("/candidate", candidateController.getAllCandidates);
module.exports = router;
