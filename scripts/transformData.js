import { config as configDotenv } from "dotenv";
import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Brand } from "../model/Brand.js";
import { Category } from "../model/Category.js";
import { Product } from "../model/Product.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (mybackend)
configDotenv({ path: path.resolve(__dirname, "../.env") });

// Verify environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the .env file");
  console.error(
    "Please make sure your .env file exists in the mybackend directory and contains MONGO_URI"
  );
  process.exit(1);
}

const DUMMYJSON_API = {
  products: "https://dummyjson.com/products?limit=194",
};

// Test data storage
let testData = {
  products: [],
  categories: [],
  brands: [],
};

async function fetchData(endpoint) {
  try {
    console.log(`Fetching data from ${endpoint}...`);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(`Successfully fetched data from ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

function isValidProduct(product) {
  // Check if product meets all required criteria
  return (
    product.title &&
    product.description &&
    product.price >= 1 &&
    product.price <= 10000 &&
    product.discountPercentage >= 1 &&
    product.discountPercentage <= 99 &&
    product.brand &&
    product.category &&
    product.thumbnail &&
    Array.isArray(product.images) &&
    product.images.length > 0
  );
}

function transformProduct(product) {
  return {
    title: product.title,
    description: product.description,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand,
    category: product.category,
    thumbnail: product.thumbnail,
    images: product.images,
    colors: [],
    sizes: [],
    highlights: [],
    discountPrice: product.price * (1 - product.discountPercentage / 100),
    deleted: false,
  };
}

function isValidCategory(category) {
  // Check if category meets all required criteria
  return typeof category === "string" && category.trim().length > 0;
}

function transformCategory(categoryName) {
  return {
    value: categoryName,
    label: categoryName,
  };
}

function isValidBrand(brand) {
  // Check if brand meets all required criteria
  return typeof brand === "string" && brand.trim().length > 0;
}

function transformBrand(brandName) {
  return {
    value: brandName,
    label: brandName,
  };
}

async function fetchAndTransformAllData() {
  try {
    console.log("Fetching all data from dummyjson...");

    // Fetch and transform products
    const productsData = await fetchData(DUMMYJSON_API.products);
    console.log(`Found ${productsData.products.length} products`);

    // Filter out invalid products
    const validProducts = productsData.products.filter(isValidProduct);
    console.log(`Found ${validProducts.length} valid products`);

    testData.products = validProducts.map(transformProduct);
    console.log(`Transformed ${testData.products.length} products`);

    // Fetch and transform categories
    const categoriesData = [...new Set(validProducts.map((p) => p.category))];
    console.log(`Found ${categoriesData.length} categories`);

    // Filter out invalid categories
    const validCategories = categoriesData.filter(isValidCategory);
    console.log(`Found ${validCategories.length} valid categories`);

    testData.categories = validCategories.map(transformCategory);
    console.log(`Transformed ${testData.categories.length} categories`);

    // Extract unique brands from valid products
    const uniqueBrands = [...new Set(validProducts.map((p) => p.brand))];
    console.log(`Found ${uniqueBrands.length} unique brands`);

    // Filter out invalid brands
    const validBrands = uniqueBrands.filter(isValidBrand);
    console.log(`Found ${validBrands.length} valid brands`);

    testData.brands = validBrands.map(transformBrand);
    console.log(`Transformed ${testData.brands.length} brands`);

    return testData;
  } catch (error) {
    console.error("Error in data transformation:", error);
    throw error;
  }
}

async function saveTestData() {
  try {
    await fs.writeFile("test_data.json", JSON.stringify(testData, null, 2));
    console.log("Test data saved to test_data.json");
  } catch (error) {
    console.error("Error saving test data:", error);
    throw error;
  }
}

async function updateMongoDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data from MongoDB...");
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
    console.log("Cleared existing data from MongoDB");

    // Insert new data
    console.log(`Inserting ${testData.products.length} products...`);
    const insertedProducts = await Product.insertMany(testData.products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    console.log(`Inserting ${testData.brands.length} brands...`);
    const insertedBrands = await Brand.insertMany(testData.brands);
    console.log(`Successfully inserted ${insertedBrands.length} brands`);

    console.log(`Inserting ${testData.categories.length} categories...`);
    const insertedCategories = await Category.insertMany(testData.categories);
    console.log(
      `Successfully inserted ${insertedCategories.length} categories`
    );

    console.log("Successfully updated MongoDB with new data");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error updating MongoDB:", error);
    throw error;
  }
}

async function main() {
  try {
    // Fetch and transform all data
    await fetchAndTransformAllData();

    // Save test data for review
    await saveTestData();

    console.log("\nTest data has been saved to test_data.json");
    console.log(
      "Please review the data before proceeding with MongoDB update."
    );
    console.log(
      "\nTo update MongoDB, run: node transformData.js --update-mongodb"
    );
  } catch (error) {
    console.error("Error in main process:", error);
  }
}

// Check if script is run with --update-mongodb flag
if (process.argv.includes("--update-mongodb")) {
  // First fetch and transform the data, then update MongoDB
  fetchAndTransformAllData()
    .then(() => updateMongoDB())
    .then(() => console.log("MongoDB update completed"))
    .catch(console.error)
    .finally(() => process.exit());
} else {
  main()
    .catch(console.error)
    .finally(() => process.exit());
}
