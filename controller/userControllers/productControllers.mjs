import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import ProteinHubContent from "../../model/ProteinHub.mjs";
import Categories from "../../model/CategorySchema.mjs";
import Rattings from "../../model/ratting.mjs";

export const allProduct = async (req, res) => {

  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 6; 
  const skip = (page - 1) * limit;
      
      const ratting=await Rattings.find();
  try {
    const user = await User.findOne({ _id: req.session._id });
    const totalProducts = await Product.countDocuments(); 
    const totalPages = Math.ceil(totalProducts / limit);  

    const products = await Product.find({ status: "active" }).skip(skip)
    .limit(limit); // Fetch product
    const Category = await Categories.find(
      { status: "active" },
      { category_name: 1 }
    );
    res.render("user/allProducts.ejs", { user, products, Category,ratting,totalPages,
      currentPage: page, // Add currentPage here
      limit});
  } catch (error) {}
};

export const viewdetail = async (req, res) => {
  try {
    const ratting=await Rattings.find();
    const user = await User.findOne({ _id: req.session._id });
    const productId = req.query.productId; // Get productId from query parameter
    const product = await Product.findOne({ _id: productId }); // Fetch product by _id
    const products = await Product.find();

    res.render("user/product_details.ejs", { user, product, products,ratting });
  } catch (error) {
    console.log(error);
  }
};

export const sortproducts = async (req, res) => {
  const sortOrder = req.query.order === "asc" ? 1 : -1; // Ascending if 'asc', descending if 'desc'
  try {
    const { category, flavour, price, sort } = req.query;
    console.log(category, flavour, price, sort);
    let query = {};

    if (category) {
      const categoryArray = category.split(","); // Split the categories into an array
      query.categories = { $in: categoryArray };
    }

    if (flavour) {
      const flavourArray = flavour.split(","); // Split the flavours into an array
      query.Flavor = { $in: flavourArray };
    }

    let sortCriteria = {};

    if (sort) {
      sortCriteria.product_name = sort === "asc" ? 1 : -1;
    }

    if (price) {
      sortCriteria.price = price === "asc" ? 1 : -1;
    }

    const products = await Product.find(query).sort(sortCriteria);

    res.json({ products });
  } catch (error) {
    console.error("Error sorting products:", error);
    res.status(500).json({ error: "Failed to sort products" });
  }
};

export const addRatting = async (req, res) => {

  const userId = req.session._id;
  const User = req.query.user;
  const productID = req.query.productId;
  const ratting = req.query.rating;
  const description = req.query.review;

  try {
    const userRatting = await Rattings.findOne({
        productID: productID, 
        "products.userId": userId 
      });
    if(userRatting)
    {
        console.log("You has already rated this product")
        return res.status(409).json({ message: "You have already rated this product" });
    }
    if(!userRatting){
       const productRating = new Rattings({ 
        productID,
            products: [
                {
                    User,
                    userId,
                    ratting,
                    description 
                }
            ]
        });
        await productRating.save().then(()=>{
            return res.status(200).json({ message: "Response added" });
        }); 
    }else{
        userRatting.products.push({
          User,
          userId,
          ratting,
          description 
        });
        const result=await userRatting.save();
        
    }
  } catch (error) {
    console.log(error);
  } 
};


