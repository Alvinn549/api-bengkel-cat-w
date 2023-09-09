const path = require('path');
const fs = require('fs');

const rootPath = './public';

async function imageFileUpload(req, image, destination) {
  try {
    const ext = path.extname(image.name);
    const fileSize = image.data.length;

    // Create a unique file name by combining the timestamp and removing spaces
    const fileName = `${Date.now()}-${image.name.replace(/\s/g, '')}`;

    // Generate the full file URL using the request's protocol and host
    const fileUrl = `${req.protocol}://${req.get(
      'host'
    )}${destination}${fileName}`;

    const allowedTypes = ['.png', '.jpeg', '.jpg'];

    // Check if the uploaded file type is allowed
    if (!allowedTypes.includes(ext.toLowerCase())) {
      throw new Error('Invalid image format!');
    }

    // Check if the file size exceeds 5MB (5,000,000 bytes = 5MB)
    if (fileSize > 5000000) {
      throw new Error('Image size must be less than 5MB!');
    }

    // Move the uploaded file to the specified upload path
    await image.mv(`${rootPath}${destination}${fileName}`);

    return { fileName, fileUrl };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteFile(destination, fileName) {
  try {
    const file = `${rootPath}${destination}${fileName}`;

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  imageFileUpload,
  deleteFile,
};
