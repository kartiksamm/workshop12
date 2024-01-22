const usercontroller = require("./controllers/userController");
const User = require("./models/userModel");
const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("DB connection succesful");
  });
const port = 5000;
app.post("/users", usercontroller.signup);
app.get("/alldata", usercontroller.getAllUsers);
//app.get("/sortss", usercontroller.getSorted);
app.get("/userss", async (req, res) => {
  try {
    const {
      skip = 0,
      limit = 10,
      selectionKeys = [],
      searchKeys = [],
    } = req.query;

    const selectionKeysArray = Array.isArray(selectionKeys)
      ? selectionKeys
      : [selectionKeys];
    const searchKeysArray = Array.isArray(searchKeys)
      ? searchKeys
      : [searchKeys];

    const query = {};
    if (searchKeysArray.length > 0) {
      const orArray = [];
      for (const key of searchKeysArray) {
        const regex = new RegExp(`^${key}`, "i");
        orArray.push({ [key]: regex });
      }
      query.$or = orArray;
    }

    const users = await User.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select(selectionKeysArray.join(" "))
      .exec();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`server running on port no ${port}`);
});
