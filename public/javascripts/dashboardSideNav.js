openNav = () => {
  document.getElementById('sidebar').style.width = '110px';
  document.getElementById('sidebar').style.left = '0';
  document.getElementById('main').style.paddingLeft = '110px';
  document.getElementById('nav').style.width = 'calc(100% - 110px)';
  document.querySelector('.toggle-btn').style.display = 'none';
};

closeNav = () => {
  document.getElementById('sidebar').removeAttribute('style');
  document.getElementById('main').removeAttribute('style');
  document.getElementById('nav').removeAttribute('style');
  document.querySelector('.toggle-btn').style.display = 'inline-block';
};

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 992px)').matches) {
    // If media query matches
    document.getElementById('sidebar').removeAttribute('style');
    document.getElementById('main').removeAttribute('style');
    document.getElementById('nav').removeAttribute('style');
    document.querySelector('.toggle-btn').style.display = 'inline-block';
  }
});
