const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

exports.imageUpload = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }
  if (!file.name || !file.data) {
    throw new Error("Invalid file format");
  }
  
  try {
    const result = await imagekit.upload({
      file: file.data,
      fileName: file.name,
    });
    return result?.url;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// testImageKitConnection = async () => {
//   try {
//     const result = await imagekit.getAuthenticationParameters();
//     console.log("ImageKit connection successful:", result);
//   } catch (error) {
//     console.error("ImageKit connection failed:", error);
//   }
// };

// testImageKitConnection();