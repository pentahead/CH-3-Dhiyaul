const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

testImageKitConnection = async () => {
  try {
    const result = await imagekit.getAuthenticationParameters();
    console.log("ImageKit connection successful:", result);
  } catch (error) {
    console.error("ImageKit connection failed:", error);
  }
};

testImageKitConnection();

exports.imageUpload = async (file) => {
  if (!file) {
    console.error("No file provided for upload");
    throw new Error("No file uploaded");
  }

  console.log("File received for upload:", file);

  if (!file.name || !file.data) {
    console.error("File missing required properties");
    throw new Error("Invalid file format");
  }

  try {
    console.log("Attempting to upload file to ImageKit");
    const result = await imagekit.upload({
      file: file.data,
      fileName: file.name,
    });
    console.log("ImageKit upload result:", result);
    return result?.url;
  } catch (error) {
    console.error("Detailed error from ImageKit:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};
