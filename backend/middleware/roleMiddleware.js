const isSeller = (req, res, next) => {
  // protect middleware already ran before this
  // so req.user is available

  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: "Seller access only"
    });
  }

  next(); // allow seller to continue
};

export default isSeller;
