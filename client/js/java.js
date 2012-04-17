$(function(){
  $.ajax({
      url: 'sample.md',
      dataType: 'text',
      success : function(data){
      	            $(document).keyup(function(e){
                var code = e.keyCode;
        		if (code == 39)
        			Slides.nextSlide();
        		if (code == 37)
        			Slides.prevSlide();
            }),
         Slides.init(data);
      }
   });
});