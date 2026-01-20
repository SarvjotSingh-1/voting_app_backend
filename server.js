require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connect_DB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

const PORT = process.env.PORT || 3000;
connect_DB;
app.use(express.json());
app.use(bodyParser.json()); //req.body

//  middleware
const logRequestDetails = (req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} request made to: ${req.originalUrl} `,
  );
  next(); //move to next middleware or route handler
};

app.use(logRequestDetails);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
