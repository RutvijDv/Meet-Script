chrome.storage.sync.get(["subtitleWarning"], function (result) {
    if(result.subtitleWarning){
        $("#captions-off").css("display","block");
        $("#captions-on").css("display","none");
    }
    else{
        $("#captions-off").css("display","none");
        $("#captions-on").css("display","block");
    }
})

$("#download").on('click', function () {
    chrome.storage.sync.get(["script", "meet_code"], function (output) {
        const doc = new jsPDF();
        doc.setFillColor(221, 221, 221);
        doc.setLineWidth(1.5);
        doc.rect(0, 0, 220, 60, "F");

        doc.addImage(imgData, 'PNG', 20, 6, 46, 46);

        doc.setLineWidth(1);
        doc.setDrawColor(255, 113, 113);
        doc.line(10, 60, 200, 60);

        doc.setFontSize(37);

        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text("Meet Script", 190, 28, "right");

        doc.setFontSize(17);
        doc.setFont('times');
        doc.setFontType('italic');
        var today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        var width = doc.getTextWidth('options');
        width = 147 - width;
        doc.text(today.toLocaleDateString(undefined, options), 190, 38, "right");
        doc.text(output.meet_code, 190, 45, "right");



        doc.setFontSize(16);
        var splitText = doc.splitTextToSize(output.script, 170);

        var y = 70;

        for (var i = 0; i < splitText.length; i++) {
            if (y > 280) {
                y = 10;
                doc.addPage();
            }
            var res = splitText[i].split(":");

            if (res.length > 1) {
                y = y + 5;
                var name = res[0].concat(" :");
                var width = doc.getTextWidth(name);
                var conversation = res[1];

                doc.setFontType('bold');
                doc.text(10, y, name);
                doc.setFontType('normal');
                doc.text(15 + width, y, conversation);
            } else {
                doc.text(30, y, splitText[i]);
            }
            y = y + 7;
        }

        doc.save(output.meet_code + ".pdf");

    })
})