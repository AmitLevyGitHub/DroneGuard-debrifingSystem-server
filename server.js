const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

const Middleware = require("./middleware/validator");
const userCtl = require("./controllers/user.ctl");
const beachCtl = require("./controllers/beach.ctl");
const lifeGuardCtl = require("./controllers/lifeGuard.ctl");

app
  .use(express.json())
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.post("/sign-up", Middleware.validateRegistrationDetails, userCtl.signUp);
app.post("/login", userCtl.login);
app.post("/addBeach", Middleware.validateToken, beachCtl.addBeach);

// each route should include Middleware.validateToken
app.get("/secret-route", Middleware.validateToken, (req, res, next) => {
  res.send("This is the secret content. Only logged in users can see that!");
});
app.get("/beaches", Middleware.validateToken, beachCtl.getBeaches);
app.get("/lifeGuards", Middleware.validateToken, lifeGuardCtl.getLifeGuards);

app.listen(port, () => console.log("server running on port:" + port));
