chrome.storage.sync.get(["ON_CALL"], function (result) {
    console.log(result);
    if (result.ON_CALL) $("#meet-start").html("Meet - Started");
    else $("#meet-start").html("Meet - Not - Started");
})

$("#download").on('click', function () {
    chrome.storage.sync.get(["script", "meet_code"], function (output) {

        var name = output.meet_code + ".txt";

        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text(55, 20, 'G-Note :' + name);

        doc.setFontSize(16);
        var splitText = doc.splitTextToSize(output.script, 180);
        var y = 30;

        for (var i = 0; i < splitText.length; i++) {
            if (y > 280) {
                y = 10;
                doc.addPage();
            }
            doc.text(15, y, splitText[i]);
            y = y + 7;
        }

        doc.save(name + ".pdf");

    })
})