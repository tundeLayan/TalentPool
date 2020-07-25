const cloud = require('cloudinary').v2;
const { uuid } = require('uuidv4');
const db = require('../../Models');

const employerModel = db.Employer;
const documentUpload = db.EmployerDocument;
const companyType = db.CompanyCategory;
const user = db.User;

cloud.config({
  cloud_name: process.env.TALENT_POOL_CLOUD_NAME,
  api_key: process.env.TALENT_POOL_CLOUD_API,
  api_secret: process.env.TALENT_POOL_CLOUD_SECRET,
});

/**
 * @param {*} res response object
 * @param {*} statusCode type of header status code
 * @param {*} message return message after request
 */
const displayMessage = (res, statusCode, message) => {
  let statusMessage = 'sucess';
  try {
    if (statusCode === 200 || statusCode === 201) {
      statusMessage = 'success';
    } else {
      statusMessage = 'error';
    }
    return res.status(statusCode).send({
      status: statusMessage,
      message,
    });
  } catch (err) {
    return res.status(statusCode).send({
      status: statusMessage,
      message,
    });
  }
};

class Employer {
  static async create(req, res) {
    /**
     * creating new employer company profile
     * verify the company logo before upload
     */
    if (!req.files) {
      if (!res.finished) {
        res.status(404).json({
          status: 404,
          message: 'dont send twice',
        });
      }
    }
    const {
      employerName,
      companyCategoryId,
      employerType,
      description,
      employerPhoneNumber,
      employerEmail,
      employerAddress,
      employerCountry,
      website,
      sex,
      facebook,
      twitter,
      linkedin,
      instagram,
      userId,
    } = req.body;
    const employer = {
      employerName,
      companyCategoryId,
      employerType,
      description,
      employerPhoneNumber,
      employerEmail,
      employerAddress,
      employerCountry,
      website,
      sex,
      facebook,
      twitter,
      linkedin,
      instagram,
      userId,
    };
    try {
      await employerModel.create(employer);
      /**
       * update company logo after profile creation
       * update the profile if already created
       */
      Employer.updateEmployerLogo(req, res);
      return displayMessage(res, 201, 'Profile successfully created');
    } catch (err) {
      Employer.updateEmployerDetails(req, res);
    }
    return true;
  }

  static async updateEmployerLogo(req, res) {
    // const { userId } = req.session;
    /**
     * validate company logo
     * update company logo
     */
    const { userId } = req.body;
    const file = req.files.photo;
    try {
      if (!(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')) {
        return displayMessage(res, 400, 'File is not an image');
      }
      if (file.size > 100000) {
        return displayMessage(res, 400, `upload lower file size`);
      }
      const employerLogoUpload = await cloud.uploader.upload(file.tempFilePath);
      const { url } = employerLogoUpload;
      const photoupdate = await employerModel.update(
        { employerPhoto: url },
        {
          where: { userId },
        },
      );
      if (photoupdate[1] === 1) {
        return displayMessage(res, 200, 'Profile updated successfully');
      }
      return displayMessage(res, 400, 'Unable to update profile logo');
    } catch (err) {
      // return displayMessage(res, 500, '!oops, an error occured');
    }
    return true;
  }

  static async updateEmployerDetails(req, res) {
    // const { userId } = req.session;
    const {
      employerName,
      companyCategoryId,
      employerType,
      description,
      employerPhoneNumber,
      employerEmail,
      employerAddress,
      employerCountry,
      website,
      sex,
      facebook,
      twitter,
      linkedin,
      instagram,
      userId,
    } = req.body;

    const employerInfoUpdate = {
      employerName,
      companyCategoryId,
      employerType,
      description,
      employerPhoneNumber,
      employerEmail,
      employerAddress,
      employerCountry,
      website,
      sex,
      facebook,
      twitter,
      linkedin,
      instagram,
    };
    try {
      const result = await employerModel.update(employerInfoUpdate, {
        where: { userId },
        returning: true,
        plain: true,
      });
      if (result[1] === 1) {
        /**
         * call photo upload method
         * verify the file
         */
        if (!req.files)
          return displayMessage(
            res,
            200,
            'Profile info updated successfully, but logo not updated',
          );

        Employer.updateEmployerLogo(req, res);
        return displayMessage(res, 200, 'Profile info updated successfully');
      }
      return displayMessage(res, 400, 'Unable to update profile');
    } catch (err) {
      console.log(err);
      return displayMessage(res, 500, '!oops an error occured');
    }
    // return true;
  }

  static async getEmployerDetails(req, res) {
    const { userId } = req.session;
    const employerInfo = {};
    try {
      const employerDetails = await employerModel.findOne({
        where: {
          userId,
        },
        include: [companyType, user],
      });
      if (employerDetails.length <= 0) {
        return res.send('No record found');
      }

      employerInfo.data = employerDetails;
      res.render();
    } catch (err) 
    {
      return res.status('!oops an error occured ');
    }
    return false;
  }

  static async employerDocumentUpload(req, res) {
    const { userId } = req.session;
    const { documentName, documentNumber } = req.body;
    /**
     * check if a user selected a file
     * validate file
     * upload document for review
     */
    if (!req.files) return displayMessage(res, 400, 'No files selected');
    const { imageDocument } = req.files;
    if (
      !(
        imageDocument.mimetype === 'image/png' ||
        imageDocument.mimetype === 'image/jpeg'
      )
    )
      return displayMessage(res, 400, 'File is not an image');
    if (imageDocument.size > 50000)
      return displayMessage(res, 400, `upload lower file size`);

    const uploadDocument = await cloud.uploader.upload(
      imageDocument.tempFilePath,
    );
    const documentImage = uploadDocument.url;

    const documentObject = {
      userId,
      documentNumber,
      documentName,
      documentId: uuid(),
      fileLink: documentImage,
    };

    try {
      const employerUploadDocument = await documentUpload.create(
        documentObject,
      );
      if (!employerUploadDocument)
        return displayMessage(res, 400, 'Error uploading document');

      return displayMessage(res, 200, 'Document successfully uploaded');
    } catch (error) {
      return displayMessage(res, 500, '!oops, an error occured');
    }
  }

  static async getEmployerDocument(req, res) {
    const { userId } = req.session;
    const employerDocuments = {};
    try {
      const getEmployerDocuments = await documentUpload.findAll({
        where: {
          userId,
        },
      });

      if (getEmployerDocuments.length <= 0) {
        employerDocuments.data = getEmployerDocuments;
        // render ejs page with the information
        res.render();
      }
      employerDocuments.data = getEmployerDocuments;
      // render ejs page with the information
    } catch (err) {
      // render ejs page for !oops, error occured
      res.render();
    }
    return false;
  }
}
module.exports = Employer;
