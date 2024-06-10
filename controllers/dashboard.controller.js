module.exports.index = async (req, res) => {
  res.render("pages/dashboard/index", {
    pageTitle: "Dashboard",
  });
};