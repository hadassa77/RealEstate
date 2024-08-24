const express = require("express");
const dotenv = require("dotenv").config();


const app = express();
const port = 8001;

app.use(express.json());

// app.use(errorHandler);
app.use("/api/users", require("./src/routes/userRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});