import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  getValidatedUrl,
} from "./util/util";

(async () => {
  const app = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    try {
      const image_url = await getValidatedUrl(req);

      if (!image_url)
        throw "ERROR: image_url is missing, please add it to your request";

      const filteredImage = await filterImageFromURL(image_url);
      const file = await filteredImage.img.getBufferAsync("image/jpeg");
      res.send(file);
      deleteLocalFiles([filteredImage.url]);
    } catch (errMessage) {
      res.status(400);
      res.send(errMessage);
    }
  });

  app.get("/", async (_, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
