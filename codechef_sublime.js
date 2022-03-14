/* readPage(lang_type) function scrapes the codechef problem page and creates a commented multi-line text content */
async function readPage(lang_type) {
    try{
        console.log(lang_type);
    var cmt_start = ""
    var cmt_end = "";
    cmt_start = lang_type == "py" ? "\"\"\"" : "/**";
    cmt_end = lang_type == "py" ? "\"\"\"" : "**/";
    var problem = document.querySelectorAll("h1")[0].textContent.trim().split("\n");
    let problemName = problem[0];
    let problemCode=problem[1].trim();
    console.log("H1: " + problemName + "---" + problemCode);
    var result = `${cmt_start} \n`;
    result += "// ProblemName:" + problemName + " " + problemCode + "\n";
    var content = document.getElementById("problem-statement").children;
    //console.log(content.length);
    
    for(var i =0;i< content.length;i++) {
        if(content[i].tagName == "ASIDE") {
            continue;
        }
        result += " " + content[i].textContent.trim()  + "\n";
        
    }
    result += `${cmt_end}`;
    console.log(result);
  
    return result;
}catch(err) {
    console.error(err);
    return " 402 Error: " + err;

}
    
}

/*a handler function for reading browser storage content  */
function onGotFileContent(result) {
    console.log("on gotfilecontent:" +result);
    console.log(`onGotFileContent:---:${result.file_content}`);
    if(result.file_content){
        return result.file_content;
    }else{
        return "NO TEMPLATE FOUND!!";
    }
}
/** an error handler function for reading browser storage content */
function onErrorFileContent(error) {
    console.log(`Error:${error};`);
}

/** Starting point of the content-script .. It receives a message from the popup and 
 * responds with the content of readPage function and the browser storage content(only set by this extension*/
(function() {
    if(window.hasRun) {
        return;
    }
    window.hasRun = true;
    
    

    function handleMessage( request, sender, sendMessage) {
        
        console.log("Message from popup:" + request.message);
        if(request.message.length > 0){
            var res = readPage(request.message).then(function(result1) {

                var getting = browser.storage.sync.get("file_content");
                getting.then(function(result) {
                    console.log("on gotfilecontent:" +result);
                    console.log(`onGotFileContent:---:${result.file_content}`);
                    if(result.file_content){
                        sendMessage({response: result1 + "\n\n" + result.file_content})
                        return result.file_content;
                    }else{
                        sendMessage({response: result1 + "\n\n" + "NO TEMPLATE FOUND!"})
                        return "NO TEMPLATE FOUND!!";
                    }
                },onErrorFileContent);
                
            });
            return true;
            

        }
        
        
    }
    browser.runtime.onMessage.addListener(handleMessage);
})();






