function downloadJson(jsonObj, fileName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonObj));
    var downElem = document.getElementById('download_results_rms');
    downElem.setAttribute("href", dataStr);
    downElem.setAttribute("download", fileName);
    downElem.click();
}

export {downloadJson as default};