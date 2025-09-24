import { Sequelize, DataTypes } from "sequelize";
import { readFileSync, readdirSync } from "fs";

import { Question, Answer } from "../models/index.js";

import CONFIG from "../config.js";

const sequelize = new Sequelize(
  CONFIG.MYSQL.DATABASE,
  CONFIG.MYSQL.USER,
  CONFIG.MYSQL.PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    models: [
      Question,
      Answer
    ]
  }
)

// TEST PURPOSE
(async () => {
  await sequelize.sync({ force: true })
  console.log("✅ Database synced");


  // Fetch all chunks files
  const chunkFiles = readdirSync("../src/questions");
  console.log("Chunks to be synced:");
  console.log(JSON.stringify(chunkFiles));
  

  console.log("DONE ✅");
  process.exit(0);
})()