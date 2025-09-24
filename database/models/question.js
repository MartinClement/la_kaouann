import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({ dialect: "mysql" });

const Question = sequelize.define("Question", {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

// Question.hasMany(Answer, { foreignKey: 'question_id'});

export default Question;