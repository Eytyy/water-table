function seekVideo(point) {
  var vid = video, 
  ticks = 50,
  frms = 10,
  to = config[point] * 60;
  var tdelta = (to - vid.currentTime)/ticks; 
  var startTime = vid.currentTime;
for ( var i = 0; i < ticks; ++i ){
   (function(j){
    setTimeout(function() {
      vid.currentTime = startTime+tdelta * j;
    }, j * frms);
   })(i);
  }
}