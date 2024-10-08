import { useState } from "react";

const useImageUpload = () => {
  const [fileData, setFileData] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File is too large. Please select a file smaller than 5MB.");
        return;
      }

      if (file.type.startsWith("image/")) {
        setFileData(file);
        uploadImage(file);
      } else {
        setError("Please select a valid image file.");
      }
    }
  };

  const openFileExplorer = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleFileChange;
    input.click();
  };

  const uploadImage = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgur.com/3/image`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setUploadUrl(data.data.link);
      } else {
        setError("Image upload failed.");
      }
    } catch (error) {
      setError(error.message || "An error occurred during image upload.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setUploadUrl(null);
    setFileData(null);
  };

  return {
    fileData,
    openFileExplorer,
    uploadUrl,
    loading,
    error,
    clearImage,
  };
};

export default useImageUpload;
