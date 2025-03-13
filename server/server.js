import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv to look for .env in the server directory
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cgcheckingreports.netlify.app",
      "https://www.cgcheckingreports.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Add this to debug
console.log("MongoDB URI:", process.env.MONGODB_URI);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error details:", err);
    process.exit(1);
  });

/////////////////////////

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

itemSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Item = mongoose.model("Item", itemSchema);

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String, // In production, ensure this is properly hashed
  permissions: { type: String, default: "user" }, // Add permissions with default value 'user'
});

const User = mongoose.model("User", userSchema);

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" },
      type: { type: String, required: true },
      options: { type: [String], default: [] },
      required: { type: Boolean, default: false },
    },
  ],
});

const chartSchema = new mongoose.Schema({
  type: String,
  name: String,
  input: String,
  metric: String,
});

const Chart = mongoose.model("Chart", chartSchema);

const Form = mongoose.model("Form", formSchema);

// Routes
/////////////////////////
//Item Routes
app.get("/api/items", async (req, res) => {
  try {
    console.log("Attempting to fetch items...");
    const items = await Item.find();
    console.log("Found items in database:", items);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/////////////////////////
//User Routes
// Add this new endpoint to fetch users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords from the response
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
});

// User routes
app.post("/api/users", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({
      name,
      username,
      password, // Note: In production, you should hash this password
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt for:", username);

    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found:", username);
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    if (user.password === password) {
      console.log("Login successful for:", username);
      return res.json({
        success: true,
        message: "Login successful",
        username: user.username,
        permissions: user.permissions || "user",
      });
    } else {
      console.log("Invalid password for:", username);
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add this route to handle permission updates
app.patch("/api/users/:userId/permissions", async (req, res) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.permissions = permissions;
    await user.save();

    res.json({ success: true, message: "Permissions updated successfully" });
  } catch (error) {
    console.error("Error updating permissions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update permissions" });
  }
});

///////////////////////////
// Form Routes

app.get("/api/forms", async (req, res) => {
  try {
    console.log("[Server] GET /api/forms - Fetching all forms");
    console.log(
      "[Server] MongoDB connection state:",
      mongoose.connection.readyState
    );
    const forms = await Form.find();
    console.log("[Server] Found forms:", forms);
    res.json(forms);
  } catch (error) {
    console.error("[Server] Error fetching forms:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/forms", async (req, res) => {
  try {
    const { name, fields } = req.body;
    console.log("[Server] POST /api/forms - Creating new form");
    console.log(
      "[Server] MongoDB connection state:",
      mongoose.connection.readyState
    );
    console.log("[Server] Received form data:", { name, fields });

    const existingForm = await Form.findOne({ name });
    if (existingForm) {
      console.log("[Server] Form name already exists:", name);
      return res.status(400).json({ message: "Form name already exists." });
    }

    const form = new Form({
      name,
      fields: fields.map((field) => ({
        name: field.name,
        description: field.description || "",
        type: field.type,
        options: field.options || [],
        required: field.required || false,
      })),
    });

    console.log("[Server] Form object before save:", form);
    const savedForm = await form.save();
    console.log("[Server] Successfully saved form:", savedForm);
    res.status(201).json(savedForm);
  } catch (error) {
    console.error("[Server] Error creating form:", error);
    console.error("[Server] Error stack trace:", error.stack);
    res.status(500).json({ message: error.message });
  }
});

///////////////////////////
// Chart Routes

app.get("/api/charts", async (req, res) => {
  try {
    console.log("Attempting to fetch charts...");
    const charts = await Chart.find();
    console.log("Found charts in database:", charts);
    res.json(charts);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/charts", async (req, res) => {
  try {
    const { type, name, input, metric } = req.body;

    // Check if chart name already exists
    const existingChart = await Chart.findOne({ name });
    if (existingChart) {
      return res.status(400).json({ message: "Chart name already exists." });
    }

    const chart = new Chart({
      type,
      name,
      input,
      metric,
    });

    const savedChart = await chart.save();
    res.status(201).json(savedChart);
  } catch (error) {
    console.error("Error creating chart:", error);
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/charts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChart = await Chart.findByIdAndDelete(id);

    if (!deletedChart) {
      return res.status(404).json({ message: "Chart not found" });
    }

    res.status(200).json({ message: "Chart deleted successfully" });
  } catch (error) {
    console.error("Error deleting chart:", error);
    res.status(500).json({ message: error.message });
  }
});

// Test route for basic server
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Test route for MongoDB connection
app.get("/api/db-test", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const status = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    res.json({
      status: status[dbStatus],
      database: mongoose.connection.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
