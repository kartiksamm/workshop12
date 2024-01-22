const apifeatures = require("./../utils/apiFeature");
const User = require("./../models/userModel");
exports.signup = async (req, res) => {
  try {
    // Extract user data from the request body
    const userData = req.body;

    // Create a new user instance
    const newUser = new User(userData);

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
//exports.getSorted = async (req, res) => {
//   try {
//     const queryObj = { ...req.query };
//     console.log(req.query, queryObj);
//     let query = User.find(queryObj);
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page - 1) * limit;
//     query = query.skip(skip).limit(limit);
//     if (req.query.page) {
//       const numusers = await User.countDocuments();
//       console.log("number of documents" + numusers);
//       if (skip >= numusers) {
//         throw new Error("This page doesn't exist");
//       }
//     }
//     //execute query
//     const users = await query;
//     res.status(200).json({
//       status: "success",
//       results: users.length,
//       data: {
//         users,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// const features = new apifeatures(User.find(), req.query)
//   .filter()
//   .sort()
//   .limitFields()
//   .paginate();
// const users = await features.query;
// res.status(200).json(users);
//};
