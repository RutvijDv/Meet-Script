chrome.storage.sync.get(["ON_CALL"], function (result) {
    console.log(result);
    if (result.ON_CALL) $("#meet-start").html("Meet - Started");
    else $("#meet-start").html("Meet - Not - Started");
})

$("#download").on('click', function () {
    chrome.storage.sync.get(["script","meet_code"], function (output) {

        var blob = new Blob(output.script, {
            type: "text/plain;charset=utf-8"
        });

        var name = output.meet_code + ".txt";

        saveAs(blob, name);
    })
})