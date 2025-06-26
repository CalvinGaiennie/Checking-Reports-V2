import { useState, useEffect } from "react";
import ChartComponent from "../components/ChartComponent";
import NavBar from "../components/NavBar";
import { getFormResponses, getCharts } from "../services/api.service";
import FormResponseCard from "../components/FormResponseCard";
import Order from "../components/Order";

function Display() {
  const [loading, setLoading] = useState(true);
  const [formResponses, setFormResponses] = useState([]);
  const [legacyData, setLegacyData] = useState([]);
  const [charts, setCharts] = useState([]);
  const [cardSelection, setCardSelection] = useState("input");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormResponses();
        setFormResponses(data);
        console.log("formResponseData", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load form responses");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await getCharts();
        setCharts(data || []);
      } catch (error) {
        console.error("Error fetching charts:", error);
        setError("Failed to load charts");
        setCharts([]);
      }
    };
    loadCharts();
  }, []);

  useEffect(() => {
    const loadLegacyData = async () => {
      try {
        const response = await fetch("/output.json");
        if (!response.ok) {
          throw new Error("Failed to load legacy data");
        }
        const json = await response.json();
        setLegacyData(json);
      } catch (error) {
        console.error("Error loading JSON:", error);
        setError("Failed to load legacy data");
      } finally {
        setLoading(false);
      }
    };
    loadLegacyData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <NavBar />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <NavBar />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  function handleCardChange(e) {
    setCardSelection(e.target.value);
  }

  const dataSets = { formResponses: formResponses };
  //I need to filter the formResponses to only include the formResponses that have the same formName as the chart.input and figure out why the data is not being passed to the chart component

  return (
    <div className="container mt-4">
      <NavBar />
      {!loading &&
        charts &&
        charts.length > 0 &&
        charts.map(
          (chart) => (
            console.log("formResponses at chart", formResponses),
            console.log("chart at chart", chart),
            (
              <ChartComponent
                key={chart.name}
                title={chart.name}
                inputData={dataSets[chart.input]}
                chartType={chart.type}
                metric={chart.metric}
              />
            )
          )
        )}
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
          : formResponses.length > 0 &&
            formResponses.map((entry, index) => (
              <FormResponseCard key={`order${index}`} data={entry} />
            ))}
      </div>
    </div>
  );
}

export default Display;
