import { useState, useEffect } from "react";
import Chart from "../components/Chart";
import NavBar from "../components/NavBar";
import { getData } from "../services/api.service";

function Display() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h1 className="mb-4">Display</h1>
        {items.map((item) => (
          <Chart key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

export default Display;
