function ItemCard({ data }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{data.name}</h5>
        <p className="card-text">Value: {data.value}</p>
        <p className="card-text">Category: {data.category}</p>
      </div>
    </div>
  );
}

export default ItemCard;
