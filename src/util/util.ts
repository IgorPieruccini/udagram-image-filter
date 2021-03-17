import fs from "fs";
import Jimp = require("jimp");

interface FilterImageFromURLResponse {
  url: string;
  img: Jimp;
}
export async function filterImageFromURL(
  inputURL: string
): Promise<FilterImageFromURLResponse> {
  return new Promise(async (resolve) => {
    try {
      const photo = await Jimp.read(inputURL);
      const name = `filtered.${Math.floor(Math.random() * 2000)}.jpg`;
      const outpath = `/tmp/${name}`;
      photo
        .resize(256, 256)
        .quality(60)
        .greyscale()
        .write(__dirname + outpath, (_, img: Jimp) => {
          resolve({ url: __dirname + outpath, img });
        });
    } catch (e) {
      throw e;
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
