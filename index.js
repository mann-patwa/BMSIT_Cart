const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/contactFormDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Contact Schema <-- Added Mongoose schema for contact form data
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  message: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

allProducts = [
  {
    id: 1,
    name: "Lab Uniform Shirt",
    image: "/images/Screenshot 2024-01-05 003132.png",
    price: "₹210.00",
  },
  { id: 2, name: "Calculator", image: "/images/images.jpg", price: "₹145.00" },
  {
    id: 3,
    name: "Vistara T-Shirt",
    image: "/images/images_3.jpg.png",
    price: "₹210.00",
  },
  {
    id: 4,
    name: "Notebook",
    image: "/images/mypic1.jpg",
    price: "₹80.00",
  },
  {
    id: 5,
    name: "Pen",
    image: "/images/mypic6.avif",
    price: "₹20.00",
  },
  {
    id: 6,
    name: "Glue-Stick",
    image: "/images/mypic4.jpg",
    price: "₹50.00",
  },
  {
    id: 7,
    name: "Pencil",
    image: "/images/mypic7.avif",
    price: "₹10.00",
  },
  {
    id: 8,
    name: "Graph Paper",
    image: "/images/mypic8.jpeg",
    price: "₹5.00",
  },
  {
    id: 9,
    name: "Ruler",
    image: "/images/mypic9.jpeg",
    price: "₹10.00",
  },
];
var cartItemsCount = 0;
cartItemsId = [];
app.get("/", (req, res) => {
  res.render("index", { cartItemsCount });
});

app.get("/shop", (req, res) => {
  res.render("shop", { cartItemsCount, allProducts });
});

app.get("/shop/:productId", (req, res) => {
  var { productId } = req.params;
  var item = allProducts.find((product) => product.id === parseInt(productId));
  res.render("product", { item, cartItemsCount });
});

app.get("/cart", (req, res) => {
  cartItemsObjects = [];
  for (let i = 0; i < cartItemsId.length; i++) {
    cartObject = allProducts.find((product) => product.id === cartItemsId[i]);
    cartItemsObjects.push(cartObject);
  }
  remainingCartItems = parseInt(cartItemsCount / 3) * 3;
  console.log(cartItemsObjects);
  res.render("cart", { cartItemsObjects, cartItemsCount, remainingCartItems });

  // res.render("cart", { cartItemsCount });
});

app.get("/contactUs", (req, res) => {
  res.render("contactUs.ejs", { cartItemsCount });
});

app.post("/contactUs", async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.redirect("/"); // Redirect to homepage after successful submission
  } catch (error) {
    console.error("Error saving contact form data:", error);
    res.status(500).send("An error occurred while saving your details.");
  }
});

app.get("/addInCart/:productId", (req, res) => {
  var { productId: id } = req.params;
  cartItemsCount += 1;
  cartItemsId.push(parseInt(id));
  // res.redirect(`/shop/${id}`);
  res.redirect("/cart");
});

app.get("/removeItem/:productId", (req, res) => {
  var { productId: id } = req.params;
  id = parseInt(id);
  cartItemsCount -= 1;
  for (var i = 0; i < cartItemsId.length; i++) {
    if (cartItemsId[i] == id) {
      cartItemsId.splice(i, 1);
    }
  }
  res.redirect("/cart");
});

app.listen(8080, () => {
  console.log("Its working on port 8080");
});
