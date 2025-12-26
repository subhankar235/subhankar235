export const getProfile = async (req, res) => {
  res.json({
    message: "Profile accessed",
    userId: req.user.id
  });
};
