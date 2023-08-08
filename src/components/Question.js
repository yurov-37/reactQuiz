import { Options } from './Options';

export const Question = ({ question, onAnswer, answer }) => {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} onAnswer={onAnswer} answer={answer} />
    </div>
  );
};
