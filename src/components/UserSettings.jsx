import { useState } from "react";
import Select from "./Select";
import { updateUserSettings } from "../services/api.service";

function UserSettings() {
  const [selectedForm, setSelectedForm] = useState("Form 1");

  // const handleUpdateSettings = async () => {

  //     const response = await updateUserSettings({
  //       userId: //need to get user id from authState
  //       settings: { selectedForm },
  //     });
  //     console.log("Response:", response);
  //   } catch (error) {
  //     console.error("Error updating settings:", error);
  //   }
  // };
  return (
    <div>
      {/* <form onSubmit={handleUpdateSettings}> */}
      <form>
        <h3>Default Selected Form</h3>
        <Select
          options={["Form 1", "Form 2", "Form 3"]}
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
