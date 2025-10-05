import { DataTypes, Model } from "sequelize";


class QuestionModel extends Model {
  constructor(engine) {
    this.__instance = null;
    this.__namespace = "question_model";
    this.__engine    = engine;
  }

  __define() {
    try {
      this.__log("Define model...", "success");

      this.__instance = this.engine.define("Question", {
        number: {
          type: DataTypes.INTEGER,
          allowNull: false
        },

        text: {
          type: DataTypes.STRING,
          allowNull: false
        }
      });
    } catch(error) {
      this.__log("Error", "error");
      this.__log(error)
    }

    return this.__instance;
  }

  __define_dependencies(models) {
    return;
  }
}

export default new QuestionModel();