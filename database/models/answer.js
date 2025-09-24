import { Sequelize, DataTypes } from "sequelize";

import { Question } from "./index.js";

const sequelize = new Sequelize({ dialect: "mysql" });

const Answer = sequelize.define("Answer", {
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  text: {
    type: DataTypes.STRING,
    allowNull: false
  },

  correct: {
    type: DataTypes.TINYINT(1),
    allowNull: false
  }
});

Answer.belongsTo(Question, { foreignKey: "question_id"});

export default Answer;