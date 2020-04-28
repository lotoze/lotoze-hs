


export const getLocationSearchParameters = (search) => {
  if(!search || search.indexOf("?") == -1) {
    return;
  }
  var params = {};
  var paramStr = search.substring(1);
  var paramArr = paramStr.split("&");
  for(var i = 0; i < paramArr.length; i ++) {
    var temp = paramArr[i].split("=");
    params[temp[0]] = temp[1];
  }
  return params
}
