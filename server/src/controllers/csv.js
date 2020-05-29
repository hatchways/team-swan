const axios = require("axios").default;
const multer = require("multer");
const uuid = require("uuid").v1;
const fs = require("fs");
const db = require("../../database/models/index");
const csv = require("csv-parser");
const BadRequestError = require('../errors/bad-request-error')

class CSVController {
  // The uploadcsv route controller
  static uploadCSV(req, res) {
    // Define storage area for multer
    const storage = multer.diskStorage({
      destination: "./prospects/",
      filename: (req, file, cb) => {
        cb(null, "prospects" + uuid() + ".csv");
      },
    });

    // Define File type and data restrictions for Multer
    const upload = multer({
      storage,
      fileFilter: function (req, file, cb) {
        file.mimetype === "text/csv" ||
          file.mimetype === "application/vnd.ms-excel"
          ? cb(null, true)
          : cb(null, false);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, //5MB
      },
    }).single("prospects");

    // Perform upload to server
    upload(req, res, async (err) => {
      // Check if there were any filetype error or data storage restriction error
      if (err) {
        console.log("MULTER ERROR: ", err.message);
        return res.status(401).send({ errors: [{ message: err.message }] });
      } else {
        try {
          if (!req.file) {
            return res
              .status(401)
              .send({ errors: [{ message: "Invalid file" }] });
          }

          const filename = req.file.filename;
          const results = [];

          // Attempt upload to cloud 
          try {
            const url = (
              await axios.post(
                process.env.GOOGLE_CLOUD_SIGN_URL,
                {
                  filename: filename,
                  contentType: req.file.mimetype,
                },
                { headers: { "Content-type": "application/json" } }
              )
            ).data.url;

            await axios.put(url, req.file, {
              headers: {
                "Content-Type": req.file.mimetype,
              },
            });
          } catch (err) {
            // console.log("Error happened");
            console.log("Error uploading to cloud:", err);
          }

          // Create a new entry in Files table to manage all files a user has uploaded
          await db.Files.create({
            name: filename,
            userId: req.currentUser.id,
            type: req.file.mimetype,
          });

          // Parse through the csv and find what fields does it contain
          fs.createReadStream(`./prospects/${filename}`)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
              // Check if the csv is empty
              if (!(results.length > 0)) {
                return res
                  .status(400)
                  .send({ errors: [{ message: "Empty CSV file" }] });
              }

              const properties = Object.keys(results[0]);

              // Get the attributes of the Prospect Table 
              const attributes = (Object.keys(db.sequelize.models.Prospect.rawAttributes))
                .filter(attr => {
                  return ['createdAt', 'updatedAt', 'status', 'id', 'userId'].indexOf(attr) === -1
                })
              console.log(attributes)

              // Send message to client
              return res.send({
                message: "Files uploaded successfully!",
                properties,
                attributes,
                filename
              });
            });
        } catch (err) {
          console.log("Caught:", err);
          return res
            .status(401)
            .send({ errors: [{ message: "Error analyzing files, try again later" }] });
        }
      }
    });
  }

  // The controller that handles adding prospects to the DB
  static addProspects = async (req, res) => {
    // Name of the file in which the data is stored
    const filename = req.body.filename

    // The mapped attributes that the user selected
    const mappedAttributes = req.body.mappedAttributes
    const results = []

    // Read the csv and create new prospects
    try {
      fs.createReadStream(`./prospects/${filename}`)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          if (!(results.length > 0)) {
            return res.send(400).send({ errors: [{ message: "Empty csv file" }] })
          } else {
            await db.Prospect.bulkCreate(results.map((result) => {
              return {
                email: result[mappedAttributes["email"]],
                status: "unsubscribed",
                firstName: result[mappedAttributes["firstName"]],
                lastName: result[mappedAttributes["lastName"]],
                userId: req.currentUser.id
              }
            }))
          }

          // Once added prospects delete the file from local server
          fs.unlink(`./prospects/${filename}`, (err) => {
            if (err) {
              console.log(err)
            }
          })
        })
    } catch (err) {
      res.status(400).send({ "errors": [{ "message": "Error adding prospects to DB" }] })
    }

    // Set the filename cookie to null
    req.session.filename = null

    // Send a success message
    return res.send({ "message": "Prospects added" })

  }
}

module.exports = CSVController;
