const demo = (req, res) => {
  res.render('index', { title: 'Express' });
};

module.exports.demo = demo;
