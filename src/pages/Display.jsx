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
  const [cardSelection, setCardSelection] = useState("");
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
        console.log("Fetched legacy data:", json);
        setLegacyData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Display</h1>
        {items.length > 0 && <Chart inputData={items} />}
      </div>
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Display</h1>
        {legacyData.length > 0 && <Chart inputData={legacyData} />}
      </div>
      <div>
        {/* <select>
          <option value="input">Input</option>
          <option value="legacy">Legacy</option>
        </select> */}
        {legacyData.length > 0 &&
          legacyData.map((entry, index) => (
            <Order key={`order${index}`} data={entry} />
          ))}
      </div>
    </div>
  );
}

export default Display;
