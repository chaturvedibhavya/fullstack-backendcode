const User = require("../model/user");

/**
 * User controller
 * ---------------
 * Handles managing users (list, view, update, delete).
 * These are separate from auth (register/login).
 * The password field is always excluded from responses because the
 * model has `select: false` on it.
 */

/**
 * GET all users
 * Route: GET /api/users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET a single user by id
 * Route: GET /api/users/:id
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid id: " + err.message });
  }
};

/**
 * UPDATE a user by id
 * Route: PUT /api/users/:id
 * Body:  any of { name, email, role }
 *
 * Note: we intentionally do NOT update the password here. Password
 * changes should go through a dedicated flow so the hashing hook runs
 * correctly and so you can require the old password, etc.
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      {
        new: true, // return the updated document
        runValidators: true, // enforce schema rules
        omitUndefined: true, // ignore fields that weren't provided
      }
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * DELETE a user by id
 * Route: DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted", id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: "Invalid id: " + err.message });
  }
};
