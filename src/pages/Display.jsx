import { useState, useEffect } from "react";
import ChartComponent from "../components/ChartComponent";
import NavBar from "../components/NavBar";
import { getData, getCharts } from "../services/api.service";
import ItemCard from "../components/ItemCard";
import Order from "../components/Order";

function Display() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [legacyData, setLegacyData] = useState([]);
  const [charts, setCharts] = useState([]);
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
    const loadCharts = async () => {
      try {
        const data = await getCharts();
        console.log("data", data);
        setCharts(data || []);
      } catch (error) {
        console.error("Error fetching charts:", error);
        setCharts([]);
      }
    };
    loadCharts();
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

  const dataSets = {
    items: items,
    legacyData: legacyData,
  };
  return (
    <div className="container mt-4">
      <NavBar />
      {!loading &&
        charts &&
        charts.length > 0 &&
        charts.map((chart) => (
          <ChartComponent
            key={chart.name}
            title={chart.name}
            inputData={dataSets[chart.input]}
            chartType={chart.type}
            // defaultSettings={chart.defaultSettings}
          />
        ))}
      <div>
        <h2>Which data would you like to see here?</h2>
        <select onChange={handleCardChange}>
          <option value="input">Input</option>
          <option value="legacy">Legacy</option>
        </select>
        {/* I need to refactor the card component to be able to and data from any form so the user can dynamically put the cards for any user made form here from the admin page */}
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
