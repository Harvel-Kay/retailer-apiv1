const config = require("config");
const { Product } = require("../models/product");
const { paginate } = require("../utils/gen/paginator");
const newItemsApp = require("../utils/gen/miniApp")();

const pageSize = config.get("page_size");

newItemsApp.get("/:current_p", async (req, res) => {
  // validate user login
  const { current_p } = req.params;
  const total = await Product.countDocuments();
  const { startIndex, next, last_page } = paginate(current_p, total);

  const products = await Product.find()
    .sort({ added: -1 })
    .select(["-transactions", "-__v"])
    .skip(startIndex)
    .limit(pageSize);
  const response = {
    products,
    next,
    last_page,
  };

  if (products.length === 0) return res.send(response);
  if (!products || !total)
    return res.status(500).send("oops try again,Appologies..... ");

  res.send(response);
});

module.exports = newItemsApp;
