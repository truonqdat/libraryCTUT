import mongoose from "mongoose";

const historyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details: { type: String, trim: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("HistoryLog", historyLogSchema);
