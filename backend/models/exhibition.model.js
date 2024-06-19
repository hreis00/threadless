import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Exhibition = mongoose.model("Exhibition", exhibitionSchema);
export default Exhibition;
