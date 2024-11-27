import express from "express";
import bodyParser from "body-parser";
import { Buffer } from "buffer";
import { convertPackageStream } from "@citolab/qti-convert/qti-convert";
import { Readable } from "stream";
import JSZip from "jszip";
import unzipper from "unzipper";

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/convert", async (req, res) => {
  // Get the base64-encoded zip file from the request body
  const base64Zip = req.body.zipFile;
  if (!base64Zip) {
    res.status(400).json({ error: "No zip file provided" });
    return;
  }

  // Decode the base64-encoded zip file
  let zipBuffer;
  try {
    zipBuffer = Buffer.from(base64Zip, "base64");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to decode base64 zip file" });
  }

  // Create a readable stream from the zip buffer
  const readable = new Readable();
  readable._read = () => {};
  readable.push(zipBuffer);
  readable.push(null);

  // Unzip the stream
  let inputZipStream;
  try {
    inputZipStream = readable.pipe(unzipper.Parse({ forceStream: true }));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to parse zip file" });
  }

  // Convert the QTI package
  let outputBuffer;
  try {
    outputBuffer = await convertPackageStream(inputZipStream);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }

  // Get the base64-encoded zip file
  const processedZipBase64 = outputBuffer.toString("base64");

  // Load the zip buffer into JSZip
  let zip = new JSZip();
  try {
    await zip.loadAsync(base64Zip, { base64: true });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to parse zip file" });
    return;
  }

  // Recursively search for "qti.xml" files and modify their contents
  const processZip = async (zip) => {
    const files = Object.keys(zip.files);
    for (const filename of files) {
      const file = zip.files[filename];
      if (!file.dir && filename.endsWith("qti.xml")) {
        try {
          const content = await file.async("string");
          let modifiedContent;
          try {
            modifiedContent = splitStimulus(content);
          } catch (error) {
            modifiedContent = content;
          }
          zip.file(filename, modifiedContent);
        } catch (error) {
          console.error(`Error processing ${filename}:`, error);
          res.status(500).json({ error: `Failed to process ${filename}` });
          return;
        }
      }
    }
  };

  await processZip(zip);

  // Generate the modified zip buffer
  let modifiedZipBuffer;
  try {
    modifiedZipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    console.log(modifiedZipBuffer);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to generate modified zip file" });
    return;
  }

  res.json({ zipFile: processedZipBase64 });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
