import { useState, useEffect } from "react";
import Select from "./Select";
import { updateUserSettings, getForms } from "../services/api.service";
import { useAuth } from "../context/AuthContext";

function UserSettings() {
  const [selectedForm, setSelectedForm] = useState("");
  const [availableForms, setAvailableForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const userId = authState.userId;

  // Load available forms
  useEffect(() => {
    const loadForms = async () => {
      try {
        const forms = await getForms();
        const formNames = forms.map((form) => form.name);
        setAvailableForms(formNames);
        if (formNames.length > 0) {
          setSelectedForm(formNames[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading forms:", error);
        setLoading(false);
      }
    };
    loadForms();
  }, []);
  const handleUpdateSettings = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    console.log("update settings called");
    console.log("userId:", userId);
    console.log("selectedForm:", selectedForm);

    if (!userId) {
      console.error("No userId available");
      return;
    }

    try {
      const response = await updateUserSettings({
        userId: userId,
        settings: { defaultSelectedForm: selectedForm },
      });
      console.log("Response:", response);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };
  if (loading) {
    return <div>Loading forms...</div>;
  }

  return (
    <div>
      <form onSubmit={handleUpdateSettings}>
        <h3>Default Selected Form</h3>
        <Select
          options={availableForms}
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
        />
        <button className=" mt-3 btn btn-primary" type="submit">
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default UserSettings;
