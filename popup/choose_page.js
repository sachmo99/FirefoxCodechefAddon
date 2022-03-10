function copyToClipboard(e) {
    console.log("inside copytoclipboard");
    return navigator.clipboard.writeText(e.target.value)
        .then(() => true)
        .catch(() => false);
    
}
function handleMessageResponse(message) {
    var question_link = document.getElementById("codechef_question_link").value.split("/");
    var question_code = question_link[question_link.length -1];
    var textToSave = message.response + "\n\n";
    console.log(`Message from the content script:  ${message.response}`);
    //console.log(textToSave);
    var hiddenElement = document.createElement('a');
    var blob = new Blob([textToSave],{type:"text/*"});

    hiddenElement.href = window.URL.createObjectURL(blob);
    hiddenElement.target = '_blank';
    hiddenElement.download = `${question_code}.cpp`;
    hiddenElement.onclick = function(e) {
        var that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        },1500);
    }
    hiddenElement.click();
    hiddenElement.remove();
    //var template = browser.storage.sync.get("file_content");
    // template.then((resu) =>{ 
    //     if(resu.file_content)
    //         {
    //             textToSave+= resu.file_content;
    //             console.log(textToSave);
    //             var hiddenElement = document.createElement('a');

    //             hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    //             hiddenElement.target = '_blank';
    //             hiddenElement.download = `${question_code}.cpp`;
    //             hiddenElement.click();
    //             return resu.file_content
    //         }
    //     else{
    //         textToSave+= "NO TEMPLATE FOUND!!!";
    //         console.log(textToSave);
    //         var hiddenElement = document.createElement('a');

    //         hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    //         hiddenElement.target = '_blank';
    //         hiddenElement.download = `${question_code}.cpp`;
    //         hiddenElement.click();
    //         return "NO TEMPLATE FOUND!!!";
    //     } })
    //     .catch((err)=> {console.log(`Error while reading storage: ${err};`)});
    
    
  }
  
  function handleMessageError(error) {
    console.log(`Error: ${error}`);
  }
  function send(tab) {
    console.log("after button click:"+tab);
    console.log("final button (sublime) is clicked");
    // send a message to content script to gather the content of the codechef page.
    browser.tabs.sendMessage(tab,{
        message:"COPY"
    }).then(handleMessageResponse,handleMessageError);
}
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
document.getElementById('options_button').addEventListener("click", function() {
    console.log("inside openAddonSettings function");
    console.log("creating a new tab");
    browser.runtime.openOptionsPage();
} );

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


window.addEventListener("load", function(e) {
    var activeUrl = null;
   
    browser.tabs.query({currentWindow: true, active: true})
                                    .then((tabs) => {
                                        activeUrl = tabs[0].url;
                                        console.error(tabs[0].url);
                                        
                                        document.getElementById("codechef_question_link").value = tabs[0].url;
                                        urlCheck(activeUrl);
                                        
                                      });
    
  
  });
  document.getElementById('codechef_question_link').addEventListener("click",function(e) {
      copyToClipboard(e).then(res => {console.log("copied",res)});
  })

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

  function copyTemplate() {
      console.log("Template copy function");
      let template_file = document.getElementById("template_file_link").file;
      let reader = new FileReader();
      console.log(file);
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