/**Function to read content of the uploaded file and store it in browser sync storage..
 * It also displays the uploaded template content in the bottom text area.
 */

function saveOptions(e) {
    e.preventDefault();
    let filepath = document.querySelector("#template_file_path").value;
    let file = document.querySelector("#template_file_path").files[0];
    let fileTemp = null;
    if(file) {
        var reader = new FileReader();
        reader.readAsText(file,"UTF-8");
        reader.onload = function(evt) {
            fileTemp = evt.target.result;
            //console.log(evt.target.result);
            //console.log(evt);
            console.log(filepath);
        var fileContent =  fileTemp //readFile(filepath,(result)=> {return result})
        console.log(`fileContent: ${fileContent}`);
        document.getElementById("uploaded_file_content").value=fileContent;
        browser.storage.sync.set({
            file_content: fileContent
        }).then(()=>{console.log("store set successful")})
        .catch(()=> {console.log("store set failed")});
        console.log(`Storage set for content of: ${filepath}`)
        }
        reader.onerror = function(evt) {
            console.error(`Error while reading file content: ${evt}`);
        }
    }
}

/** helper function to read content of the uploaded file. Uses FileReader API */
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

/** a helper function to fetch template from the storage */
function restoreOptions() {
    function setTemplate(result) {
        document.querySelector("#uploaded_file_content").value = result.file_content || "No content present";
    }
    function onError(error) {
        console.error(`Error: ${error}`);
    }
    let getting = browser.storage.sync.get("file_content");
    getting.then(setTemplate,onError);
}

/**an event listener to remove content from storage which was set by the extension. */
document.querySelector("#clear_storage").addEventListener("click",function() {
    browser.storage.sync.remove("file_content").then(function(){
        console.log("Cleared all data!");
        document.querySelector("#uploaded_file_content").value= "NO TEMPLATE LOADED!!";
    },function(error){console.log(`Error while clearing storage:${error}`);});

});

/**Event at the start of DOM page to display previously uploaded content */
document.addEventListener("DOMContentLoaded",restoreOptions);

/** listener for the saveOptions method. */
document.querySelector("#template_file_upload").addEventListener("click",saveOptions);