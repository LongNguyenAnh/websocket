$(function(){
   clientManager.connect();
   $.ajax({
      url: 'sample.md',
      dataType: 'text',
      success : function(data){
         slidesManager.init(data);
         slidesManager.keyPress();
      }
   });
   chatManager.keyPress();
});