const User = require("../models/userModel");
const Candidate = require("../models/candidateModel");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};

exports.addCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user does not have admin role" });

    const data = req.body; // Assuming the request body contains the candidate data

    // Create a new User document using the Mongoose model
    const newCandidate = new Candidate(data);

    // Save the new user to the database
    const response = await newCandidate.save();
    console.log("data saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const CandidateID = req.params.CandidateID; //extract user id from url parameters
    const updatedCandidateData = req.body;

    const respose = await Candidate.findByIdAndUpdate(
      CandidateID,
      updatedCandidateData,
      {
        new: true, // return the updated document
        runValidators: true, // run schema validators on update
      },
    );

    if (!updatedCandidateData) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log(" Candidate Data Updated");
    res.status(200).json(respose);
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const CandidateID = req.params.CandidateID; //extract user id from url parameters
    const deletedCandidate = await Candidate.findByIdAndDelete(CandidateID);

    if (!deletedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log(" Candidate Data Deleted");
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};

// lets start voiting

exports.voteCandidate = async (req, res) => {
  // no admin can vote
  // user can only vote once
  const candidateID = req.params.candidateID;
  const userID = req.user.id;

  try {
    const cancidate = await Candidate.findById(candidateID);

    if (!cancidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Check if the user has already voted
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ error: "User(you)has already voted" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Admins are not allowed to vote" });
    }
    // Increment the vote count for the candidate
    // Candidate.votes.push({ user: userID });
    // Candidate.voteCount += 1;
    // await cancidate.save();

    cancidate.votes.push({ user: userID });
    cancidate.voteCount += 1;
    await cancidate.save();

    // update the user document
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getVoteCounts = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ voteCount: "desc" });
    // maop the candidates to get only name and voteCount
    const votRrecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(votRrecord);
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    // list of candidates
    const candidates = await Candidate.find({}, "name party -_id");
    res.status(200).json(candidates);
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};
