openNav = () => {
  document.getElementById("sidebar").style.width = "110px";
  document.getElementById("sidebar").style.left = "0";
  document.getElementById("main").style.paddingLeft = "110px";
  document.getElementById("header").style.paddingLeft = "110px";
  document.querySelector(".toggle-btn").style.display = "none";
};

closeNav = () => {
  document.getElementById("sidebar").removeAttribute("style");
  document.getElementById("main").removeAttribute("style");
  document.getElementById("header").removeAttribute("style");
  document.querySelector(".toggle-btn").style.display = "inline-block";
};

function myFunction(x) {
  if (x.matches) {
    // If media query matches
    document.getElementById("sidebar").removeAttribute("style");
    document.getElementById("main").removeAttribute("style");
    document.getElementById("header").removeAttribute("style");
    document.querySelector(".toggle-btn").style.display = "inline-block";
  }
}

var x = window.matchMedia("(min-width: 992px)");
myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changes
