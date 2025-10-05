import Consolog from "../../helpers/logs.js";
import { readFileSync, readdirSync } from "fs";

import { Sequelize, DataTypes } from "sequelize";
import { Question, Answer } from "../models/index.js";

import CONFIG from "../config.js";

const logConfig = {
  default: { color: "white", mode: "text" },
  success: { color: "green" , mode: "text" },
  warning: { color: "yellow", mode: "background" },
  error:   { color: "red"   , mode: "background" }
};

const __log = (message, type = "default") => {
  const { color, mode } = logConfig[type] || logConfig.default;

  Consolog(message, color, mode);
}

// TEST PURPOSE
(async () => {
  // INIT SEQUELIZE CONNECTION
  const sequelize = new Sequelize(
    CONFIG.MYSQL.DATABASE,
    CONFIG.MYSQL.USER,
    CONFIG.MYSQL.PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql'
    }
  );

  const DEFINED_MODELS = [["Questions", Question], ["Answer"   , Answer]];

  // DEFINE MODELS
  DEFINED_MODELS.map(([name, model]) => {
    try {
      __log("[DEFINE MODEL] - " + name);
      model.__define(sequelize);

      return [name, model];
    } catch (error) {
      __log("[ERROR] - Model cannot be defined", "error");
      __log(error);
    }
  });
  
  // DEFINE MODELS DEPENDENCIES
  DEFINED_MODELS.forEach(([name, model]) => {
    try {
      __log("[DEFINE MODEL DEPENDENCIES] - " + name);
      model.__define_dependencies(sequelize.models);
    } catch (error) {
      __log("[ERROR] - Model dependencies cannot be defined", "warning");
      __log(error);
    }
  });

  // SYNC MODELS
  await sequelize.sync({ force: true });
  __log("✅ Database synced");

  // Fetch all chunks files
  const allChunkFiles = readdirSync("../src/questions");
  const chunkFiles = allChunkFiles.slice(0, 1);
  __log("Chunks to be synced:");
  __log(JSON.stringify(chunkFiles));

  await Promise.all(
    chunkFiles.map((filename) => {
      let data = readFileSync(`../src/questions/${filename}`);
      data = JSON.parse(data)

      return Promise.all(
        data.map(({ number, question, answers }) => {
          return sequelize.models.Question.create({
            number : number,
            text   : question
          })
            .then(({ id: questionId }) => {
              return Promise.all(
                answers.map(({ value, correct }) => {
                  return sequelize.models.Answer.create({
                    question_id : questionId,
                    text        : value,
                    correct     : correct
                  })
                })
              );
            });
        })
      )
    })
  );

  __log("✅ DONE");



  __log("TEST QUERY", "warning");
  const question = await sequelize.models.Question.findOne({
    where:   { number: 101 },
    include: [{ model: sequelize.models.Answer }]
  });

  console.log(question);

  process.exit(0);
})()