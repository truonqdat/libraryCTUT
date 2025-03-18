import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
});

export default mongoose.model("Faculty", facultySchema);
