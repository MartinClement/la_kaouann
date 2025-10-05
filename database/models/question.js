import { DataTypes, Model } from "sequelize";

class QuestionModel extends Model {
  static __define(engine) {
    this.init({
      number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize: engine,
      modelName: "Question",
      tableName: "Questions"
    }
  )
  }

  static __define_dependencies({ Question, Answer}) {
    Question.hasMany(Answer, { foreignKey: 'question_id'});
  }
}

export default QuestionModel;