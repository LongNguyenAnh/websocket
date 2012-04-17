var Slides = {
   translateAmount : null,
   currentSlide : null,
   container : $('#slides'),
   index : 0, 
   slides : [0],

   init : function(content) {
      this.slides = this.parseFile(content);
      this.loadContent(this.slides[this.index]);
      //Slides.setSlideWidth(); 
      this.keyPress();
   },

   parseFile : function (text) {
      var rawSlides = text.split('==');
      return rawSlides;
   },
   
   markDown : function(text){
      return (new (Showdown.converter)).makeHtml(text);
   },

   loadContent : function(slide) {
      var content = document.getElementById('content');
      content.innerHTML = this.markDown(slide);
   },

   setSlideWidth : function() {
      var each = this.container.children('div');
      this.slideWidth = each.width() + ( parseInt( each.css('margin-right'), 10 ) );
   },

   keyPress : function() {
      $( document.body ).keydown(function(e) {
         if ( e.keyCode === 37 || e.keyCode === 39 ) {
            e.preventDefault();
            ( e.keyCode === 39 ) ? this.nextSlide() : this.prevSlide();
         }
      });
   },

   nextSlide : function (){
      var slide = this.slides[++this.index];
      if (!slide){
         this.index--;
         return;
      }
      this.loadContent(slide);
   },

   prevSlide : function (){
      var slide = this.slides[--this.index];
      if (!slide){
         this.index++;
         return;
      }
      this.loadContent(slide);
   },

   goto : function(  ) {
      Slides.translateAmount = -Slides.slideWidth * Slides.currentSlide;  
      Slides.animate();
   },

   animate : function() {
      Slides 
      .container
      .children()
      .css('-webkit-transform', 'translateX(' + Slides.translateAmount + 'px)')
      .css('-moz-transform', 'translateX(' + Slides.translateAmount + 'px)')
      .css('-o-transform', 'translateX(' + Slides.translateAmount + 'px)');
   }

};
