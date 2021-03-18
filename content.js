let ON_CALL = false;
let IS_SUBTITLE_ON = false;
let MEET_CODE;
let script = [];
let last_speaker = "";

chrome.storage.sync.set({
    ON_CALL: false,
    subtitleWarning: false
})




const docObserver = new MutationObserver(() => {
    if (document.body.querySelector("div[jscontroller='kAPMuc']")) {
        ON_CALL = true;
        // Remove observer
        docObserver.disconnect();

        chrome.runtime.sendMessage({
            todo: "activate"
        });

        chrome.storage.sync.set({
            ON_CALL: true,
        })

        callStarts();
    } else {
        ON_CALL = false;
        chrome.storage.sync.set({
            ON_CALL: false,
        })
    }
});

docObserver.observe(document.body, {
    childList: true,
    subtree: true,
});


function whenSubtitleOff() {
    chrome.storage.sync.set({
        subtitleWarning: true,
    });
};


function callStarts() {
    const subtitleDiv = document.querySelector("div[jscontroller='TEjq6e']");
    MEET_CODE = window.location.pathname;
    MEET_CODE = MEET_CODE.substr(1, MEET_CODE.length - 1);
    chrome.storage.sync.get(["meet_code", "script"], function (result) {

        if (result.meet_code && result.meet_code == MEET_CODE) {
            script = result.script;
        }
        chrome.storage.sync.set({
            script: script
        })
    })
    // To notify the first time
    IS_SUBTITLE_ON = subtitleDiv.style.display === "none" ? false : true;
    if (IS_SUBTITLE_ON) whenSubtitleOn();
    else whenSubtitleOff();

    const subtitleOnOff = new MutationObserver(() => {
        IS_SUBTITLE_ON = subtitleDiv.style.display === "none" ? false : true;
        if (IS_SUBTITLE_ON) whenSubtitleOn();
        else whenSubtitleOff();
    });

    subtitleOnOff.observe(subtitleDiv, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["style"],
    });
};


function whenSubtitleOn() {
    chrome.storage.sync.set({
        subtitleWarning: false,
        meet_code: MEET_CODE
    });
    // DOM element containing all subtitles
    const subtitleDiv = document.querySelector("div[jscontroller='TEjq6e']");


    const subtitleObserver = new MutationObserver((mutations) => {

        mutations.forEach((mutation) => {
            if (mutation.target.classList && mutation.target.classList.contains("iTTPOb")) {
                if (mutation.addedNodes.length) {
                    var newNodes = mutation.addedNodes;
                    var speaker = newNodes["0"]?.parentNode?.parentNode?.parentNode?.querySelector(".zs7s8d.jxFHg")?.textContent;
                    if (speaker) {
                        setTimeout(function () {
                            if (newNodes.length) {
                                if (last_speaker != speaker) {
                                    script.push(speaker + " : " + newNodes["0"].innerText + "\r\n");
                                    last_speaker = speaker;
                                } else {
                                    var lastText = script.pop();
                                    lastText = lastText.slice(0, -2);
                                    lastText = lastText + newNodes["0"].innerText + "\r\n";
                                    script.push(lastText);
                                }

                                chrome.storage.sync.set({
                                    script: script,
                                })
                            }
                        }, 10000);
                    }

                }
            }
        });
    });

    // Start observing subtitle div
    subtitleObserver.observe(subtitleDiv, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });
};