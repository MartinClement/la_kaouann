import { DataTypes, Model } from "sequelize";

class AnswerModel extends Model {
  static __define(engine) {
    this.init({
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
    }, {
      sequelize: engine,
      modelName: "Answer",
      tableName: "Answers"
    });
  }

  static __define_dependencies({ Question, Answer }) {
    Answer.belongsTo(Question, { foreignKey: "question_id"});
  }
}

export default AnswerModel;