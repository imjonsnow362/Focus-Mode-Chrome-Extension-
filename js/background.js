function isAccessingYoutube(changeInfo, tab) {
    // from other page to youtube
    if (changeInfo.status == 'loading' && changeInfo.url && isYoutubeURL(changeInfo.url)) {
        return true;
    }
    // refresh in youtube
    else if (changeInfo.status == 'loading' && isYoutubeURL(tab.url)) {
        return true;
    }
    return false;
}
//my function code starts here 
function isAccessingPrime(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isPrimeVideoURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isPrimeVideoURL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingNetflix(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isNetflixURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isNetflixURL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingDisney(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isDisneyHotstarURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isDisneyHotstarURL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingHulu(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isHuluURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isHuluURL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingHbo(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isHBOMaxURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isHBOMaxURL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingZee(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isZee5URL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isZee5URL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingSony(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isSonyLIVURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isSonyLIVURL(tab.url)){
            return true;
        }
        return false;
}

function isAccessingVoot(changeInfo, tab) {
    //from other page to prime 
    if (changeInfo.status == 'loading' && changeInfo.url && isVootURL(changeInfo.url)){
        return true;
    }
        //refresh in prime
        else if (changeInfo.status == 'loading' && isVootURL(tab.url)){
            return true;
        }
        return false;
}
//my function code ends here 

function isYoutubeURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?youtube.com\/.*/)
    return url.match(reg);
}
// my code starts here
function isPrimeVideoURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?primevideo.com\/.*/)
    return url.match(reg);
}

function isNetflixURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?netflix.com\/.*/)
    return url.match(reg);
}

function isDisneyHotstarURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?hotstar.com\/.*/)
    return url.match(reg);
}

function isHuluURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?hulu.com\/.*/)
    return url.match(reg);
}

function isHBOMaxURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?hbomax.com\/.*/)
    return url.match(reg);
}

function isZee5URL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?zee5.com\/.*/)
    return url.match(reg);
}

function isSonyLIVURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?sonyliv.com\/.*/)
    return url.match(reg);
}

function isVootURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?voot.com\/.*/)
    return url.match(reg);
}
//my code ends here

function isTimeOver(lastAcceptedDatetime, hourUnit) {
    if (lastAcceptedDatetime) {
        var lastAcceptedDate = new Date(lastAcceptedDatetime);
        var now = new Date();
        var diff = now - lastAcceptedDate;
        var diffInHours = Math.floor(diff / 3.6e6);
        console.log("diff :", diff, "diffInHours :", diffInHours, "hourUnit :", hourUnit);
        if (diffInHours < hourUnit) {
            return false; // can watch youtube
        }
    }
    return true;
}

function isLeetcodeSubmissionURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?leetcode.com\/problems\/.*\/submissions\/?/)
    return url.match(reg);
}

function checkSubmissionTable(tabId) {
    setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {message: 'check-submission-table'});
    }, 2000);
}

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (isAccessingYoutube(changeInfo, tab)) { // 1. if user access youtube
            chrome.storage.sync.get({
                features: {
                    autoRedirection: {
                        enabled: true,
                        hourUnit: 12
                    }
                },
                lastAcceptedDatetime: null
            }, function(option) {
                if (option.features.autoRedirection.enabled) { // 2. If nlny is enabled
                    if (isTimeOver(option.lastAcceptedDatetime, option.features.autoRedirection.hourUnit)) { // 3. If timeover
                        // red icon & redirect
                        chrome.browserAction.setIcon({path:'assets/icons/red_48.png'});
                        chrome.tabs.update(tabId, {url: chrome.extension.getURL('redirect_to_leetcode.html')});
                    }
                }
            });
        }
        else if (changeInfo.status == 'complete' && isLeetcodeSubmissionURL(tab.url)) {
            checkSubmissionTable(tabId);
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'mission-clear') {
            chrome.browserAction.setIcon({path:'assets/icons/blue_48.png'});
        }
    }
);
