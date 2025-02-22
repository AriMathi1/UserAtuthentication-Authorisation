const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();

const app = express();

const URL = process.env.DB || "mongodb://127.0.0.1:27017";
mongoose.connect(URL);

const { User } = require("./models/users");
const {product} = require("./models/product");

app.use(express.json());
app.use(cors({ origin: "*", }));

function authorizer(req, res, next) {
    try {
        const token= req.header("Authorization")?.split(" ")[1];
        if(!token) {
            res.status(401).json({message: "Not Authorized"});
        }
    console.log(token)
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        if(payload){
            next();
        } else {
            res.status(401).json({message: "Not Authorized"});
        }
    } catch (error) {
        res.status(500).json({message: "something went wrong"});
    }
}

app.post("/register", async (req, res) => {
    try {
        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hashSync(req.body.password, salt)
        console.log(hash)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
        });

        await user.save();

        res.json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/login", async (req, res) => {
    try {
        //find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "Email or Password is incorrect" });
        }
        //hash the password and compare with user password
        const isPasswordSame = bcryptjs.compareSync(req.body.password, user.password);

        if (isPasswordSame) {
            let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: "1h"
            });
            return res.json({ message: "success", token });
        } else {
            return res.status(401).json({ message: "Email or Password is incorrect" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" });
    }
});

app.get("/products", authorizer, async (req, res) => {
    let products = await product.find()
    res.status(200).json(products)
});

app.post("/product", authorizer, async(req, res) => {
    try {
        let products = new product({
            name: req.body.name,
            role: req.body.role,
        });
        await products.save();
        res.json({ message: "product added successfully"});
    } catch (error) {
        console.log(error)
        res.status(400).json({message: "validation Error"});
    }
});

app.listen(3002)