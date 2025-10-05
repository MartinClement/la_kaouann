import Consolog from "../../helpers/logs";

import { Sequelize, DataTypes } from "sequelize";
import { readFileSync, readdirSync } from "fs";

import { Question, Answer } from "../models/index.js";

import CONFIG from "../config.js";

const logConfig = {
  default: { color: "white", mode: "text" },
  success: { color: "green" , mode: "text" },
  warning: { color: "yellow", mode: "background" },
  error:   { color: "red"   , mode: "background" }
};

const __log = (message, type = "default") => {
  const prefix = (type !== "default")
    ? `[${this.__namespace.toUpperCase().replace("_", " ")}] - `
    : "";

  const { color, mode } = this.__logConfig[type] || this.__logConfig.default;

  Consolog(`${prefix}${message}`, color, mode);
}

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
  // DEFINE MODELS
  const DEFINED_MODELS = [].map((model) => {
    try {
      __log("[DEFINE MODEL] - " + model.__namespace);
      model.__register();
    } catch (error) {
      __log("[ERROR] - " + model.__namespace + " cannot be defined", "error");
    }
  });

  // DEFINE DEPENDENCIES
  DEFINED_MODELS.forEach((model) => {
    try {
      __log("[DEFINE MODEL DEPENDENCIES] - " + model.__namespace);
          model.__define_dependencies();
    } catch (error) {
      __log("[ERROR] - " + model.__namespace + " dependencies cannot be defined", "warning");
    }
  })
  // await sequelize.sync({ force: true })
  // console.log("✅ Database synced");


  // // Fetch all chunks files
  // const chunkFiles = readdirSync("../src/questions");
  // console.log("Chunks to be synced:");
  // console.log(JSON.stringify(chunkFiles));
  

  // console.log("DONE ✅");
  // process.exit(0);
})()