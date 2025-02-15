function ItemCard({ data }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">OrderNumber: {data.OrderNumber}</h5>
        <p className="card-text">Date: {data.Date}</p>
        <p className="card-text">Order Content: {data.OrderContent}</p>
        <p className="card-text">Order Puller: {data.OrderPuller}</p>
        <p className="card-text">Order Checker: {data.OrderStatus}</p>
        <p className="card-text">Mistake Type: {data.OrderChecker}</p>
        <p className="card-text">Order Type: {data.mistakeType}</p>
      </div>
    </div>
  );
}

export default ItemCard;
