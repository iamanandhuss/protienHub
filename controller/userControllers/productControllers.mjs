import session from "express-session";
import User from "../../model/userSchema.mjs";
import Product from "../../model/productSchema.mjs";
import ProteinHubContent from "../../model/ProteinHub.mjs";
import Categories from "../../model/CategorySchema.mjs";
import Rattings from "../../model/ratting.mjs";
import Carts from '../../model/cartSchema.js'
 

export const allProduct = async (req, res) => {
  console.log(req.query);
  const { orderStatus, orderTime, price, sort, flavour } = req.query;

  let filter = {}; 

  if (orderStatus) {
    filter.orderStatus = { $in: orderStatus.split(',') };
  }
  if (orderTime) {
    if (orderTime.includes('Last 30 days')) {
      filter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    } else if (orderTime.includes('Last 1 week')) {
      filter.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (orderTime.includes('Today')) {
      filter.createdAt = { $gte: new Date().setHours(0, 0, 0, 0) };
    }
  }

  if (flavour) {
    filter.Flavor = { $in: flavour.split(',') };
  }

  let sortOptions = {};
  if (price === 'asc' || price === 'desc') {
    sortOptions.price = price === 'asc' ? 1 : -1;
  }
  if (sort === 'asc' || sort === 'desc') {
    sortOptions.product_name = sort === 'asc' ? 1 : -1;
  }

  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const user = await User.findOne({ _id: req.session._id });
    const totalProducts = await Product.countDocuments({ status: "active" });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ status: "active", ...filter })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const Category = await Categories.find(
      { status: "active" },
      { category_name: 1 }
    );

    const ratting = await Rattings.find();

    const cart = await Carts.findOne({ userId: req.session._id });

    res.render("user/allProducts.ejs", {
      user,
      products,
      Category,
      ratting,
      orderStatus,
      orderTime,
      cart,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
};


export const viewdetail = async (req, res) => {
  try {
    const ratting=await Rattings.find();
    const user = await User.findOne({ _id: req.session._id });
    const productId = req.query.productId; 
    const product = await Product.findOne({ _id: productId }); 
    const products = await Product.find();
    const cart=await Carts.findOne({userId:req.session._id}) ;



    res.render("user/product_details.ejs", { user, product, products,ratting,cart });
  } catch (error) {
    console.log(error);
  }
};

export const sortproducts = async (req, res) => {
  const sortOrder = req.query.order === "asc" ? 1 : -1; 
  try {
    const { category, flavour, price, sort } = req.query;
    console.log(category, flavour, price, sort);
    let query = {};

    if (category) {
      const categoryArray = category.split(","); 
      query.categories = { $in: categoryArray };
    }

    if (flavour) {
      const flavourArray = flavour.split(","); 
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



export const searchProducts=async(req,res)=>{
  try {
    const query = req.query.query;
  try {
    const results = await Product.find({ 
      $or: [
        { product_name: { $regex: query, $options: 'i' } },
        { product_brand: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  } catch (error) {
    console.log(error);
  }
}



export const searchedProducts=async(req,res)=>{
  const totalProducts =  req.query.ids.split(',').length;
  let  cart=await Carts.findOne({userId:req.session._id}) ;
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 8; 
  const skip = (page - 1) * limit;
      
      const ratting=await Rattings.find();
      const ids=req.query.ids.split(',');
  try {
    const user = await User.findOne({ _id: req.session._id });
    const totalPages = Math.ceil(totalProducts / limit);  

    const products = await Product.find({ _id: { $in: ids } }).skip(skip)
    .limit(limit); 
    const Category = await Categories.find(
      { status: "active" },
      { category_name: 1 }
    );
    res.render("user/searchProduct.ejs", { user, products, Category,ratting,cart,totalPages,
      currentPage: page, 
      limit});
  } catch (error) {}
} 