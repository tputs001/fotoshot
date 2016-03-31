var utility = (function(){

  function clearDom(clearId){
    while(clearId.hasChildNodes()){
      clearId.removeChild(clearId.lastChild)
    }
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    clearDom : clearDom,
    capitalize : capitalize
  }
})()
