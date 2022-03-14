/** The JS of popup HTML file.. */

/**Sets the file extension required for download */
var language_button = "txt"; // default to be kept as txt

/** functionto copy content present in the popup screen textbox onto clipboard */
function copyToClipboard(e) {
    console.log("inside copytoclipboard");
    return navigator.clipboard.writeText(e.target.value)
        .then(() => true)
        .catch(() => false);
    
}

/** a message response handler function
 * it receives the response from the content-script which is the complete content of the downloadable file
 * It then uses this response to create a downloadable file with the required extension.
 */
function handleMessageResponse(message) {
    
    var question_link = document.getElementById("codechef_question_link").value.split("/");
    var question_code = question_link[question_link.length -1];
    var textToSave = message.response + "\n\n";
    console.log(`Message from the content script:  ${message.response}`);
    //console.log(textToSave);
    if(message.response.indexOf("402 Error:") != -1) {
        console.error("Not a codechef problem page!!! Cannot find problem statement.");
        return;
    }
    var hiddenElement = document.createElement('a');
    var blob = new Blob([textToSave],{type:"text/*"});

    hiddenElement.href = window.URL.createObjectURL(blob);
    hiddenElement.target = '_blank';
    hiddenElement.download = `${question_code}.${language_button}`;
    hiddenElement.onclick = function(e) {
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        },1500);
    }
    hiddenElement.click();
    hiddenElement.remove();
    
  }
  
  function handleMessageError(error) {
    console.log(`Error: ${error}`);
  }
  function send(tab) {
    console.log("after button click:"+tab);
    console.log("final button (sublime) is clicked");
    var msg = "non-py";
    if(language_button == "py"){
        msg = language_button;
    }
    console.log(msg);
    // send a message to content script to gather the content of the codechef page.
    browser.tabs.sendMessage(tab,{
        message: msg
    }).then(handleMessageResponse,handleMessageError);
}

/** event to trigger a message to the content-script to scrape the problem statement from the active tab. */
try{
document.querySelector("#final_button").addEventListener("click",
function () {
    var query = browser.tabs.query({currentWindow: true, active : true});
    var activeTabId =  null;
    var tab = query.then((tabs) => {
        send(tabs[0].id);
    },onError);
    
    
    function onError(error) {
      console.log(`Error: ${error}`);
    }
});
}catch(err){
    console.error(err);   
}

/** event listener to fetch latest template from the browser storage and display condensed form in the text area. */
try{
document.querySelector("#templateloader").addEventListener("click",
function () {
    console.log("inside openAddonSettings function");
    console.log("Template copy function"); 
    function onError(error) {
        console.error(`Error: ${error}`);
    }
    function onGot(result) {
        console.log(`result: ${result}`)
        let defaultContent = "No template content set";
        if(result.file_content) {
            defaultContent = result.file_content;
        }
    
        document.querySelector("#file_sample").value = defaultContent.slice(0,200) + "...CNTD...";
    }
    let getting = browser.storage.sync.get("file_content");
    getting.then(onGot,onError);   
    
});
}
catch(err){
    console.log(err);
}

/**button group trigger listener to change global language variable of the template which
 * sets the extention of the downloadable file. */
document.querySelector("#language_group").addEventListener('click',function(e) {
    var btn =  e.target.id;
    console.log(btn);
    language_button = btn;
}); 
document.getElementById('options_button').addEventListener("click", function() {
    console.log("inside openAddonSettings function");
    console.log("creating a new tab");
    browser.runtime.openOptionsPage();
} );

/** a debug listener for noticing changes to the storage area of the extension. */
window.addEventListener('load',(event) => {
    function storageUpdate(changes,area) {
        console.log("Change in storage Area:" + area);
        let changedItems = Object.keys(changes);

        for (let item of changedItems) {
            console.log(item + " has changed:");
            console.log("Old value: ");
            console.log(changes[item].oldValue);
            console.log("New value: ");
            console.log(changes[item].newValue);
        }
        console.log(changedItems);
        
    }
    if(browser.storage.onChanged.hasListener(storageUpdate)) {
        browser.storage.onChanged.removeListener(storageUpdate);
       
    }
    browser.storage.onChanged.addListener(storageUpdate);
});

/**an event listener function which is important to control/disable features of extension outside the codechef website */
window.addEventListener("load", function(e) {
    var activeUrl = null;
   
    browser.tabs.query({currentWindow: true, active: true})
                                    .then((tabs) => {
                                        activeUrl = tabs[0].url;
                                        console.log(tabs[0].url);
                                        
                                        document.getElementById("codechef_question_link").value = tabs[0].url;
                                        urlCheck(activeUrl);
                                        
                                      });
  });
  /** event listener to handle clipboard copy option. */ 
  document.getElementById('codechef_question_link').addEventListener("click",function(e) {
      copyToClipboard(e).then(res => {console.log("copied",res)});
  })

  /** event listener function to show a slice of stored template in the popup text area.. */
  document.getElementById("file_sample").addEventListener("load",function() {
      
    console.log("Template copy function"); 
    function onError(error) {
        console.error(`Error: ${error}`);
    }
    function onGot(result) {
        let defaultContent = "No template content set";
        if(result.filepath) {
            defaultContent = result.file_content;
        }
    
        document.querySelector("#file_sample").value = defaultContent.slice(0,23);
    }
    let getting = browser.storage.sync.get("file_content");
    getting.then(onGot,onError);   
    
  },false);

  /** this function is used to disable the sublime button and other codechef specific HTML content and majorly helps 
   * against extension errors outside designated codechef pages.
   */
  function urlCheck(url) {
    if(url.indexOf("codechef.com")!== -1){
        //if(/^(https?:\/\/(.+?\.)?codechef\.com(\/[A-Za-z0-9\-\._~:\/\??#\[\]@!$&'\(\)\*\+,;\=]*)?]))$/.test(activeUrl)) {
            console.log("regex matches to codechef site");
            document.getElementById("input_box").style.visibility = "visible";
            document.getElementById("disabled_state").style.visibility = "hidden";
            document.getElementById("final_button").disabled= false;
        }else {
            console.warn("regex doesnt match to codechef site");
            document.getElementById("input_box").style.visibility = "hidden";
            document.getElementById("disabled_state").style.visibility = "visible";
            document.getElementById("final_button").disabled=true;
            //this.document.getElementsById("container").innerHTML = '<div class="disabled_state" ><button type="button" class="btn btn-lg btn-primary" disabled>This is not a codechef page!</button></div>'
        }
  }

  /**an alternate function to view the content of the template in a new tab ---- DEPRECATED function */
  function copyTemplate() {
      console.log("Template copy function");
      let template_file = document.getElementById("template_file_link").file;
      let reader = new FileReader();
      //console.log(file);
      reader.onload(function(thefile) {
          return function(e) {
              browser.tabs.create({
                  url: template_file.value
              }).then(() => {console.log("created a new tab")},() => {console.error("tab creation error")});
          }
      })
  }

  function readFile(_path, _cb) {
      fetch(_path, {mode: 'same-origin'})
      .then(function(_res) {
          return _res.blob();
      })
      .then(function(_blob) {
          var reader = new FileReader();
          reader.addEventListener("loadend",function() {
              _cb(this.result);
          });
          reader.readAsText(_blob);
      })
  }