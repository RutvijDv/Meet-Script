chrome.storage.sync.get(["ON_CALL"], function (result) {
    console.log(result);
    if (result.ON_CALL) $("#meet-start").html("Meet - Started");
    else $("#meet-start").html("Meet - Not - Started");
})