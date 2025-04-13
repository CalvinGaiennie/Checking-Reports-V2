import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  questionResponses: {
    type: Map,
    of: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export const FormResponse = mongoose.model("FormResponse", formResponseSchema);
