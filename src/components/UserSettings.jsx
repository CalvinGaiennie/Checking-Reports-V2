import { useState } from "react";
import Select from "./Select";

function UserSettings() {
  const [selectedForm, setSelectedForm] = useState("Form 1");

  return (
    <div>
      <div>
        <h3>Default Selected Form</h3>
        <Select
          options={["Form 1", "Form 2", "Form 3"]}
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default UserSettings;
