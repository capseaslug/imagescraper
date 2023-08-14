const fs = require('fs');
const axios = require('axios');
const azureml = require('azureml-sdk');

async function scrapeImages(searchTerm, numImages, includeTags, excludeTags) {
  // Create a list to store the images that we have downloaded.
  const images = [];

  // Create an Azure ML service client.
  const client = new azureml.ServiceClient();

  // Set the include and exclude tags.
  const includeTagFilters = includeTags ? [includeTags] : [];
  const excludeTagFilters = excludeTags ? [excludeTags] : [];

  // Start scraping images.
  for (let i = 0; i < numImages; i++) {
    // Get the next image URL.
    const imageUrl = await getImageUrl(searchTerm);

    // Check if the image is valid.
    const imageMetadata = await client.predictImage(imageUrl, includeTagFilters, excludeTagFilters);
    if (imageMetadata.isImageValid) {
      // Download the image.
      const imagePath = await downloadImage(imageUrl, i);

      // Add the image to the list.
      images.push({
        url: imageUrl,
        path: imagePath,
      });
    }
  }

  // Save the images to a file.
  const json = JSON.stringify(images);
  fs.writeFileSync('images.json', json);
}

async function getImageUrl(searchTerm) {
  // Make a request to the Google Images API.
  const response = await axios.get(`https://www.google.com/search?q=${searchTerm}&tbm=isch`);

  // Extract the image URL from the response.
  const imageUrl = response.data.results[0].url;

  return imageUrl;
}

async function downloadImage(imageUrl, i) {
  // Make a request to the image URL and save the response to a file.
  const response = await axios.get(imageUrl, { responseType: 'stream' });
  const filepath = `image-${i}.png`;
  fs.createWriteStream(filepath).end(response.data);

  return filepath;
}

module.exports = scrapeImages;
