import FileService from "../services/FileServices.js";
import upload from "../middlewares/uploads.js";

const FileController = {
  uploadEbook: [
    upload.single("ebookFile"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Vui lòng chọn file" });
        }

        const result = await FileService.uploadEbook(
          req.params.bookId,
          req.file
        );

        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  ],

  deleteEbook: async (req, res) => {
    try {
      const result = await FileService.deleteEbook(
        req.params.bookId,
        req.params.assetId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export default FileController;