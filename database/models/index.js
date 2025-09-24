import Question from "./question.js";
import Answer from "./answer.js";

// BIND ANSWERS TO QUESTION
Answer.belongsTo(Question, { foreignKey: "question_id"});
Question.hasMany(Answer, { foreignKey: 'question_id'});

export {
  Question,
  Answer
}
