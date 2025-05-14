const express = require("express");
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
require("./config/db");
require("dotenv").config();
projectRouter = require("./routes/projectRoutes")
userRouter = require("./routes/userRoutes")
 

const cors = require("cors");
app.use(cors());

// Routers
app.use("/api/project", projectRouter);
app.use("/api/user", userRouter);
 


// app.all("*", (req, res) => {
//   res.send("Page not found");
// });

// Error handler middleware
// app.use(errorHandler);

app.listen(process.env.PORT || 2001, () => console.log(`Server running `));

module.exports = app;
