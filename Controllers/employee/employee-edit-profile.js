  const { uuid } = require('uuidv4');
  const cloudinary = require('cloudinary').v2;

  const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.TALENT_POOL_DEV_URL
    : process.env.TALENT_POOL_FRONT_END_URL;

    const models = require('../../Models');
    const { renderPage } = require('../../Utils/render-page')