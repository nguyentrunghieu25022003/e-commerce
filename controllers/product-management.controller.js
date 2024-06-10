const Product = require("../models/product.model");

module.exports.create = async (req, res) => {
  try {
    const uniqueCategories = await Product.distinct("category");
    res.render("pages/product-management/create", {
      pageTitle: "Create Product",
      uniqueCategories: uniqueCategories,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.createNewProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      category,
      thumbnail,
    } = req.body;
    const images = req.file.path || null;
    const data = {
      title: title,
      description: description,
      price: parseInt(price) || 0,
      discountPercentage: parseFloat(discountPercentage) || 0,
      rating: parseFloat(rating) || 0,
      stock: parseInt(stock) || 0,
      brand: brand,
      category: category,
      thumbnail: thumbnail,
      images: images,
    };

    const products = new Product(data);
    await products.save();
    res.redirect("back");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.productList = async (req, res) => {
  try {
    let find = {}
    let objectPagination = {
      limitItems: 8,
      currentPages: 1,
    };
  
    if (req.query.page) {
      objectPagination.currentPages = parseInt(req.query.page);
    }
  
    if (objectPagination.currentPages < 1) {
      objectPagination.currentPages = 1;
    }
  
    if (req.query.category) {
      find.category = req.query.category;
    }
  
    objectPagination.skip = (objectPagination.currentPages - 1) * objectPagination.limitItems;
    const countProducts = await Product.countDocuments(find);
    const totalPages = Math.ceil(countProducts / objectPagination.limitItems);
    objectPagination.totalPages = totalPages;
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    const countProduct = await Product.countDocuments({});
    res.render("pages/product-management/index", {
      pageTitle: "Product List",
      products: products,
      countProduct: countProduct,
      pagination: objectPagination,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.deleteOne({ _id: productId });
    res.redirect("back");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.edit = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const uniqueCategories = await Product.distinct("category");
    const data = {
      ...product.toObject(),
      discountPercentage: product.discountPercentage.toString(),
      rating: product.rating.toString(),
    };
    res.render("pages/product-management/edit", {
      pageTitle: "Edit Product",
      product: data,
      category: uniqueCategories,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      category,
      thumbnail,
    } = req.body;
    const images = req.file.path || null;
    const updateData = {
      title: title,
      description: description,
      price: parseInt(price) || 0,
      discountPercentage: parseFloat(discountPercentage) || 0,
      rating: parseFloat(rating) || 0,
      stock: parseInt(stock) || 0,
      brand: brand,
      category: category,
      thumbnail: thumbnail,
      images: images,
    };
    await Product.updateOne({ _id: productId }, updateData);
    res.redirect("/admin/products");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
