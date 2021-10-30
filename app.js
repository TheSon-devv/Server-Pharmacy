const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
// const cookieSession = require('cookie-session')
const session = require("express-session");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();

require("./passport");

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "keyboard cat", key: "sid" })); //Save user login
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require("./routers/auth");
const customerRouter = require("./routers/customer");
const staffRouter = require("./routers/staff");
const pharmacyRouter = require("./routers/pharmacy");
const checkoutRouter = require("./routers/checkout");
const blogRouter = require("./routers/blog");
const adminRouter = require("./routers/admin");
const typePharmacyRouter = require("./routers/typePharmacy");
const doctorRouter = require("./routers/doctor");
const messageRouter = require("./routers/message");
const cartRouter = require("./routers/cart");
const statisticalRouter = require("./routers/statistical");

//Middlewares

//Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pharmacy",
      version: "1.0.0",
      description: "API Pharmacy",
    },
  },
  apis: ["./routers/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));
app.get("/", (req, res) => {
  return res.json("Vui lòng truy cập /api");
});

//Router
app.use("/auth", authRouter);
app.use("/customer", customerRouter);
app.use("/staff", staffRouter);
app.use("/pharmacy", pharmacyRouter);
app.use("/checkout", checkoutRouter);
app.use("/blog", blogRouter);
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);
app.use("/message", messageRouter);
app.use("/cart", cartRouter);
app.use("/typePharmacy", typePharmacyRouter);
app.use("/statistical", statisticalRouter);
app.use("/uploads", express.static("uploads"));

//Connect Database
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  () => console.log("connected")
);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
