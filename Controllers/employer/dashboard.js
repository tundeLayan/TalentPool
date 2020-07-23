const dashboard = (req, res) => {
    
    res.render('index', { title: 'Express' });
  };
  
  module.exports.dashboard = dashboard;
  