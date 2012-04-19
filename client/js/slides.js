var slidesManager = {
   socket : null,
   translateAmount : null,
   currentSlide : null,
   container : $('#container'),
   index : 0, 
   slides : [0],
   init : function(markdownFile) {
      this.slides = this.splitContent(markdownFile);
      //this.setSlideWidth();
      this.loadContent(this.slides[this.index]);
   },
   sendMsg : function(msg){
      this.socket = clientManager.getSocket();
      this.clientID = clientManager.getClientID();
      var payload = {
         type : "SLIDE_UPDATE",
         clientID : this.clientID,
         data : msg,
         date : Date.now()
      };
      this.socket.send(JSON.stringify(payload));
   },
   //split the content of the markdown document
   //into slides
   splitContent : function (text) {
      var parsedSlides = text.split('==');
      return parsedSlides;
   },
   //convert the markdown file to html
   convertMarkdown : function(text){
      return (new (Showdown.converter)).makeHtml(text);
   },
   loadContent : function(slide) {
      $("#content").html(this.convertMarkdown(slide));
   },
   setSlideWidth : function() {
      var each = this.container.children('div');
      this.slideWidth = each.width() + ( parseInt( each.css('margin-right'), 10 ) );
   },
   keyPress : function() {
      //use that to refer to slidesManager
      that = this;
      $(document).keydown(function(event) {
         if ( event.keyCode === 39 ) {
            that.nextSlide();
         }
         else if ( event.keyCode === 37 ){
            that.prevSlide();
         }
      });
   },
   nextSlide : function () {
      var slide = this.slides[++this.index];
      if (!slide){
         this.index--;
         return;
      }
      this.sendMsg(this.convertMarkdown(slide));
      //this.loadContent(slide);
   },
   prevSlide : function () {
      var slide = this.slides[--this.index];
      if (!slide){
         this.index++;
         return;
      }
      this.sendMsg(this.convertMarkdown(slide));
      //this.loadContent(slide);
   },
   getCurrentSlide : function () {
      return currentSlide = this.slides[this.index];
   },
   goto : function(  ) {
      this.translateAmount = -this.slideWidth * this.currentSlide;  
      this.animate();
   },
   animate : function() {
      this 
      .container
      .children()
      .css('-webkit-transform', 'translateX(' + Slides.translateAmount + 'px)')
      .css('-moz-transform', 'translateX(' + Slides.translateAmount + 'px)')
      .css('-o-transform', 'translateX(' + Slides.translateAmount + 'px)');
   },
};