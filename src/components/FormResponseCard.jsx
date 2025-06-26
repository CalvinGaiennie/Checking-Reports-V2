function FormResponseCard({ data }) {
  const formattedResponses = Object.entries(data.questionResponses).map(
    ([question, answer]) => ({
      question: question,
      answer: answer,
    })
  );

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Form Name: {data.formName}</h5>
        <p className="text-secondary">Date: {data.submittedAt}</p>
        {formattedResponses.map((response, index) => (
          <p key={index} className="card-text">
            {response.question}: {response.answer}
          </p>
        ))}
      </div>
    </div>
  );
}

export default FormResponseCard;
