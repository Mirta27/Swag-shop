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

app.get("/", function(req, res) {
    res.send("Please visit /product or /wishlist to list the items of the corresponsing databases.");
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
    WishList.find({}, function(err, wishLists) {
        if (err) {
           response.status(500).send({error: "Could not fetch wishlists"});
        } else {
            res.send(wishLists);
        }
    });
});

app.listen(3000, function() {
    console.log("Swag Shop API running on port 3000...");
});