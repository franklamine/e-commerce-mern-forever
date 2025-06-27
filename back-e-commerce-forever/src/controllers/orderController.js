


//Placing orders using COD Method
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const placeOrder = async (req, res) => {
    try {

        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            address,
            items,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now(),
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId, {cartData: {}});

        res.json({success:true, message:"Order Placed"});

    }catch (e) {
        res.json({success: false, message: e.message});
    }
}



//Placing orders using using Stripe Method
const placeOrderStripe = async (req, res) => {

}



//Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}


//All Orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        if (!orders) {
            return res.json({success: false, message: `Order not found`});
        }
        res.json({success: true, orders});
    }catch (e) {
        res.json({success: false, message: e.message});
    }

}



//All Orders data for Frontend
const userOrders = async (req, res) => {
    try {

        const {userId} = req.body;
        const orders = await Order.find({userId});
        if (!orders) {
            return res.json({success: false, message:"No orders found."});
        }

        res.json({success:true, orders});

    }catch (e) {
        res.json({success: false, message: e.message});
    }

}


//Update order status from admin panel
const updateStatus = async (req, res) => {
    try {

        const {orderId, status} = req.body;
        await Order.findByIdAndUpdate(orderId, {status} );
        res.json({success:true, message:"Status updated"});

    }catch (e) {
        res.json({success: false, message: e.message});
    }

}


export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus};