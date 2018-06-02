/*
USE THIS FILE FOR ALL YOUR JAVASCRIPT CODE.
*/

$(document).ready(function() {
  /* SLIDER ============================================================================================ */
  $(".homeSlider .flexslider").flexslider({
    animation:"fade", slideshowSpeed:5000, animationSpeed:700, controlNav:true, 
    directionNav:false, slideshow:true, pauseOnAction:false, pauseOnHover:true, nextText:">", prevText:"<",
    start: function(slider){
      /*var controlNavWidth = $(slider).children(".flex-control-nav").width();
      $(slider).find(".flex-direction-nav li a.flex-next").css("left", controlNavWidth+35);*/
    }
  });
  /* =================================================================================================== */
});