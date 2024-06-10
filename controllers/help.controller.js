module.exports.index = async (req, res) => {
  res.render("pages/help/index", {
    pageTitle: "Help"
  });
};