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
function restoreOptions() {
    function setTemplatePath(result) {
        document.querySelector("#uploaded_file_content").value = result.file_content || "NO content present";
    }
    function onError(error) {
        console.error(`Error: ${error}`);
    }
    let getting = browser.storage.sync.get("file_content");
    getting.then(setTemplatePath,onError);
}

document.addEventListener("DOMContentLoaded",restoreOptions);
document.querySelector("#template_file_upload").addEventListener("click",saveOptions);