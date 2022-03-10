
async function readPage() {
    var result = "/* \n";
    var problem = document.querySelectorAll("h1")[0].textContent.trim().split("\n");
    let problemName = problem[0];
    let problemCode=problem[1].trim();
    console.log("H1: " + problemName + "---" + problemCode);
    result += "// ProblemName:" + problemName + " " + problemCode + "\n";
    var content = document.getElementById("problem-statement").children;
    console.log(content.length);
    var bool = false;
    for(var i =0;i< content.length;i++) {
        if(content[i].tagName == "ASIDE") {
            continue;
        }
        result += " " + content[i].textContent.trim()  + "\n";
        
    }
    result += "*/";
    console.log(result);
    //alignContent(content);
    return result;
    
}
function onGotFileContent(result) {
    console.log("on gotfilecontent:" +result);
    console.log(`onGotFileContent:---:${result.file_content}`);
    if(result.file_content){
        return result.file_content;
    }else{
        return "NO TEMPLATE FOUND!!";
    }
}
function onErrorFileContent(error) {
    console.log(`Error:${error};`);
}

(function() {
    if(window.hasRun) {
        return;
    }
    window.hasRun = true;

    

    function handleMessage( request, sender, sendMessage) {
        
        console.log("Message from popup:" + request.message);
        if(request.message === "COPY"){
            var res = readPage().then(function(result1) {
                // browser.storage.sync.set({
                //     problemFile: result
                // }).then((res)=>{console.log(`The New Problem has been setup!`)})
                // .catch((err) => {console.log(`Error while setting problem!${err}`)});
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
                   
                    
                // return new Promise(resolve => {
                //     setTimeout( () => {
                //       resolve({response: result});
                //     }, 1000);
                //   });
                
            });
            return true;
            //return true;
            
            // setTimeout(() => {
            //     return Promise.resolve({response: res});
            //   }, 1000);
            //   return true;

        }
        
        
    }
    browser.runtime.onMessage.addListener(handleMessage);
})();




