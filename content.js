let ON_CALL = false;
let IS_SUBTITLE_ON = false;

chrome.storage.sync.set({
    ON_CALL: false,
})

chrome.storage.sync.set({
    subtitleWarning: false,
});

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
    }
});

docObserver.observe(document.body, {
    childList: true
});


function whenSubtitleOff() {
    chrome.storage.sync.set({
        subtitleWarning: true,
    });
};


function callStarts() {
    const subtitleDiv = document.querySelector("div[jscontroller='TEjq6e']");

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


function whenSubtitleOn(){


    chrome.storage.sync.set({
        subtitleWarning: false,
    });
    
    // DOM element containing all subtitles
    const subtitleDiv = document.querySelector("div[jscontroller='TEjq6e']");

    const subtitleObserver = new MutationObserver((mutations) => {
     
      mutations.forEach((mutation) => {
        if(mutation.target.classList && mutation.target.classList.contains("iTTPOb")){
            if(mutation.addedNodes.length){
                var newNodes = mutation.addedNodes;
                var speaker = newNodes["0"]?.parentNode?.parentNode?.parentNode?.querySelector(".zs7s8d.jxFHg")?.textContent;
                setTimeout(function () {
                    if(newNodes.length){
                        console.log(speaker + " : " + newNodes["0"].innerText);
                    }
                }, 10000);
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