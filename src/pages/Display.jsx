import { useState, useEffect } from "react";
import Chart from "../components/Chart";
import NavBar from "../components/NavBar";
import { getData } from "../services/api.service";
import ItemCard from "../components/ItemCard";
import Order from "../components/Order";
function Display() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [legacyData, setLegacyData] = useState([]);
  const [cardSelection, setCardSelection] = useState("input");
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

  useEffect(() => {
    fetch("/output.json")
      .then((response) => response.json())
      .then((json) => {
        setLegacyData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, []);

  function handleCardChange(e) {
    setCardSelection(e.target.value);
  }
  return (
    <div className="container mt-4">
      <NavBar />
      <h1>User Input Data</h1>
      <h2></h2>
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Display</h1>
        {items.length > 0 && <Chart inputData={items} chartType="bar" />}
      </div>
      <h1>Legacy Data</h1>
      <h2>Orders Checked per Checker</h2>
      <div className="container mt-5">
        {legacyData.length > 0 && <Chart inputData={legacyData} />}
      </div>
      <div>
        <h2>Which data would you like to see here?</h2>
        <select onChange={handleCardChange}>
          <option value="input">Input</option>
          <option value="legacy">Legacy</option>
        </select>
        {cardSelection === "legacy"
          ? legacyData.length > 0 &&
            legacyData.map((entry, index) => (
              <Order key={`order${index}`} data={entry} />
            ))
          : items.length > 0 &&
            items.map((entry, index) => (
              <ItemCard key={`order${index}`} data={entry} />
            ))}
      </div>
    </div>
  );
}

export default Display;
