const demo = (req, res) => {
  res.render('index', { title: 'Express Eleam' });
};

module.exports.demo = demo;
