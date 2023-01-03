const express = require("express");
const router = express.Router();
// const { checkIfAuthenticatedJWT } = require("../../middlewares");
const cartServices = require("../../services/cart");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const orderDataLayer = require("../../dal/orders");
const productDataLayer = require("../../dal/products");

