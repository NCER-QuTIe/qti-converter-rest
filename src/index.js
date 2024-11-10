import express from "express";
import bodyParser from "body-parser";
import { Buffer } from "buffer";
import { convertPackageStream } from "@citolab/qti-convert/qti-convert";
import { Readable } from "stream";
import unzipper from "unzipper";

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(bodyParser.json({ limit: "50mb" })); // Adjust limit as needed

app.post("/convert", async (req, res) => {
  try {
    const base64Zip = req.body.zipFile;
    if (!base64Zip) {
      res.status(400).json({ error: "No zip file provided" });
      return;
    }

    // Decode the base64-encoded zip file
    const zipBuffer = Buffer.from(base64Zip, "base64");
    console.log(zipBuffer);

    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(zipBuffer);
    readable.push(null);

    const inputZipStream = readable.pipe(unzipper.Parse({ forceStream: true }));

    const outputBuffer = await convertPackageStream(inputZipStream);

    // // Encode the processed zip file to base64
    const processedZipBase64 = outputBuffer.toString("base64");

    res.json({ zipFile: processedZipBase64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process zip file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
