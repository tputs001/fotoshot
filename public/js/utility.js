var utility = (function(){

  function clearDom(clearId){
    while(clearId.hasChildNodes()){
      clearId.removeChild(clearId.lastChild)
    }
  }

  function hasClass(e, value){
    var classes = e.target.classList;
    for(var i = 0; i<classes.length; i++){
      if(classes[i] == value){ return true; }
    }
    return false;
  }

  return {
    clearDom : clearDom,
    hasClass : hasClass
  }
})()
