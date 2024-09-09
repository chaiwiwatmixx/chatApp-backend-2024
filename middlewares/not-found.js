module.exports = (req, res, next) => {
  res.status(404).json({ msg: "path not found" });
};
