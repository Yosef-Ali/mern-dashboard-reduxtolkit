// This file imports the mongoose, User, and Transaction models.
// The getAdmins function returns a list of all users with the role of "admin".
// The getUserPerformance function returns the performance of a user, including their affiliate sales.

import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// This function returns a list of all users with the role of "admin".
export const getAdmins = async (req, res) => {
  try {
    // Find all users with the role of "admin".
    const admins = await User.find({ role: "admin" }).select("-password");

    // Return the admins.
    res.status(200).json(admins);
  } catch (error) {
    // Return an error message if there is an error.
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ file: management.js:26 ~ getUserPerformance ~ id:", id);

    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);
    console.log(
      "🚀 ~ file: management.js:40 ~ getUserPerformance ~ userWithStats:",
      userWithStats
    );

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
