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
  const [selectedFormName, setSelectedFormName] = useState("");
  const [formNames, setFormNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormResponses();
        setFormResponses(data);
        const formNames = [
          ...new Set(data.map((response) => response.formName)),
        ];
        console.log(formNames);
        setFormNames(formNames);
        setSelectedFormName(formNames[0]);
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

  function getInputData(chart) {
    //Input data is an array
    //I need to get question responses from each array item
    //I really only need to get the quest that matches the metric from each response
    const inputData = formResponses
      .filter((response) => response.formName === chart.input)
      .map((response) => {
        return {
          [chart.metric]: response.questionResponses[chart.metric],
        };
      });

    return inputData;
  }

  function handleFormChange(e) {
    setSelectedFormName(e.target.value);
  }

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
            inputData={getInputData(chart)}
            chartType={chart.type}
            metric={chart.metric}
          />
        ))}
      <div style={{ marginBottom: "300px" }}>
        <h2>Which data would you like to see here?</h2>
        {/* <select onChange={handleCardChange}>
          <option value="input">Input</option>
          <option value="legacy">Legacy</option>
        </select> */}
        <select
          onChange={handleFormChange}
          value={selectedFormName}
          style={{ marginBottom: "20px" }}
        >
          {formNames.map((name, index) => (
            <option key={`${name}-${index}`} value={name}>
              {name}
            </option>
          ))}
        </select>
        {formResponses.length > 0 &&
          formResponses.map((entry, index) => {
            if (entry.formName == selectedFormName) {
              return <FormResponseCard key={`order${index}`} data={entry} />;
            }
          })}
        {/* {cardSelection === "legacy"
          ? legacyData.length > 0 &&
            legacyData.map((entry, index) => (
              <Order key={`order${index}`} data={entry} />
            ))
          : formResponses.length > 0 &&
            formResponses.map((entry, index) => (
              <FormResponseCard key={`order${index}`} data={entry} />
            ))} */}
      </div>
    </div>
  );
}

export default Display;
