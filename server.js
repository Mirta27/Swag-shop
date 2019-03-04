var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/swag-shop", { useNewUrlParser: true });

var Product = require("./model/product");
var WishList = require("./model/wishlist");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/product", function(request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct) {
        if (err) {
            response.status(500).send({error:"Could not save product"});
        } else {
            response.send(savedProduct); //Status will be 200 if not specified (success status)
        }
    });
});

app.post("/wishlist", function(req, res) {
    var wishList = new WishList();
    wishList.title = req.body.title;
    
    wishList.save(function(err, savedWishList) {
        if (err) {
            res.status(500).send({error: "Could not create new wishlist"});
        } else {
            res.send(savedWishList);
        }
    });
});

app.put("/wishlist/product/add", function(req, res) {
    Product.findOne({_id: req.body.productId}, function(err, product) {
        if (err) {
            res.status(500).send({error: "Could not add item to wishlist"});
        } else {
            WishList.update({_id: req.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishList) {
                if (err) {
                    res.status(500).send({error: "Could not add item to wishlist"});
                } else {
                    res.send(wishList);
                }
            });
        }
    });
});

app.get("/", function(req, res) {
    res.send("Please visit /product or /wishlist to list the items of the corresponsing databases. You may visit /wishlist/product/add to add items to existing wishlists. For this you need the product and wishlist IDs presented in /product and /wishlist pages.");
});

app.get("/product", function(request, response) {
    Product.find({}, function(err, products) {
        if (err) {
            response.status(500).send({error: "Could not fetch products"});
        } else {
            response.send(products);
        }
    });
});

app.get("/wishlist", function(req, res) {
    WishList.find({}).populate({path: "products", model: "Product"}).exec(function(err, wishLists) {
        if (err) {
            res.status(500).send({error: "Could not fetch wishlists"});
        } else {
            res.send(wishLists);
        }
    });
});

app.listen(3000, function() {
    console.log("Swag Shop API running on port 3000...");
});