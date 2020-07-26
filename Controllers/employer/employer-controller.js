const cloud = require('cloudinary').v2;
const { uuid } = require('uuidv4');
const db = require('../../Models');
const { renderPage } = require('../../Utils/render-page');

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
    return false;
  }
};
/**
 * @param {*} res response object
 * @param {*} imageFile image file to be verify
 * @param {*} size size of the image
 */
const imageVerification = (res, imageFile, size) => {
  try {
    if (
      !(
        imageFile.mimetype === 'image/png' ||
        imageFile.mimetype === 'image/jpeg'
      )
    ) {
      displayMessage(res, 400, 'File is not an image');
    }

    if (imageFile.size > size) {
      displayMessage(res, 400, `upload lower file size`);
    }
  } catch (error) {
    return false;
  }
  return false;
};

class Employer {
  static async create(req, res) {
    /**
     * creating new employer company profile
     * verify the company logo before upload
     */
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
    if (!req.files) {
      return displayMessage(res, 400, 'No files selected');
    }
    try {
      await employerModel.create(employer);
      /**
       * update company logo after profile creation
       * update the profile if already created
       * on duplicate error, update the profile
       */
      Employer.updateEmployerLogo(req, res);
      return displayMessage(res, 201, 'Profile successfully created');
    } catch (err) {
      Employer.updateEmployerDetails(req, res);
    }
    return true;
  }

  static async updateEmployerLogo(req, res) {
    const { userId } = req.session;
    /**
     * validate company logo
     * update company logo
     */
    const file = req.files.photo;
    try {
      imageVerification(res, file, 100000);
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
      return false;
    }
  }

  static async updateEmployerDetails(req, res) {
    const { userId } = req.session;
    const {
      employerName,
      companyCategoryId,
      // employerType,
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
    } = req.body;

    const employerInfoUpdate = {
      employerName,
      companyCategoryId,
      // employerType,
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
      return displayMessage(res, 500, '!oops an error occured');
    }
    // return true;
  }

  static async updateEmployerBasicInfo(req, res) {
    const { userId } = req.session;
    const { firstName, lastName, phone } = req.body;
    const employerBasicInfo = {
      firstName,
      lastName,
      phone,
    };
    try {
      const result = await user.update(employerBasicInfo, {
        where: { userId },
        returning: true,
        plain: true,
      });
      if (result[1] === 1) {
        return displayMessage(res, 200, 'Profile info updated successfully');
      }
      return displayMessage(res, 400, 'Unable to update profile');
    } catch (err) {
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

      return renderPage(
        res,
        'employer/employerProfileSettings',
        employerInfo,
        'employer profile page',
        'employer/profile',
      );
      // return false;
    } catch (err) {
      return res.status('!oops an error occured ');
    }
  }

  static async employerDocumentUpload(req, res) {
    const { userId } = req.session;
    const { documentName, documentNumber } = req.body;
    /**
     * check if a user selected a file
     * validate file
     * upload document for review
     */
    if (!req.files) {
      return displayMessage(res, 400, 'No files selected');
    }
    const { imageDocument } = req.files;
    imageVerification(res, imageDocument, 500000);

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
