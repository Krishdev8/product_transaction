const axios = require("axios");
const ProductTransaction = require("../models/ProductTransaction");

// Seed Data
// Modified seeding function with better error handling and logging
const seedDatabase = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    
    console.log('Fetched data length:', data.length); // Log fetched data
    
    await ProductTransaction.deleteMany();
    const inserted = await ProductTransaction.insertMany(data);
    
    console.log('Inserted documents:', inserted.length); // Log inserted count
    
    res.status(200).json({
      message: "Database seeded successfully",
      count: inserted.length
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({
      message: "Error seeding database",
      error: error.message
    });
  }
};


const listTransactions = async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "" } = req.query;

    // First, let's check total documents without any query
    const totalDocuments = await ProductTransaction.countDocuments();
    console.log("Total documents in collection:", totalDocuments);

    // Build query based on search term
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };

      const numberSearch = parseFloat(search);
      if (!isNaN(numberSearch)) {
        query.$or.push({ price: numberSearch });
      }
    }

    console.log("Query:", JSON.stringify(query)); // Log the query being used

    const pageNum = parseInt(page);
    const limit = parseInt(perPage);

    const transactions = await ProductTransaction.find(query)
      .skip((pageNum - 1) * limit)
      .limit(limit);

    const total = await ProductTransaction.countDocuments(query);

    res.status(200).json({
      total,
      transactions,
      page: pageNum,
      perPage: limit,
      query: query, // Include query in response for debugging
    });
  } catch (error) {
    console.error("Transaction listing error:", error);
    res.status(500).json({
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate month input
    console.log("month:", month)
    console.log("year: ", year)
    const monthNum = parseInt(month);
    const yearNum = parseInt(year)
    console.log("monthNum: ", monthNum)
    console.log("yearNum: ", yearNum)
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        message: "Invalid month. Please provide a number between 1 and 12",
      });
    }

    // Format month to ensure two digits
    const monthStr = monthNum.toString().padStart(2, "0");
    console.log("monthStr: ", monthStr)
    // Create date range
    const startDate = new Date(`${yearNum}-${monthStr}-01T00:00:00.000Z`);
    const endDate = new Date(yearNum, monthNum, 0); // Last day of the month

    console.log("Date range:", {
      start: startDate,
      end: endDate,
    });

    // Get statistics
    const statistics = await ProductTransaction.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
          totalSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] },
          },
          totalNotSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: { $round: ["$totalAmount", 2] },
          totalSoldItems: 1,
          totalNotSoldItems: 1,
        },
      },
    ]);

    // If no data found for the month, return zeros
    const response =
      statistics.length > 0
        ? statistics[0]
        : {
            totalAmount: 0,
            totalSoldItems: 0,
            totalNotSoldItems: 0,
          };

    res.status(200).json({
      month: monthStr,
      statistics: response,
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

module.exports = { seedDatabase, listTransactions, getStatistics };

