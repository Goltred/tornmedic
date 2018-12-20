function hideLi(statusElement, hidden=true)
{
    let li = statusElement.closest('li');
    li.hidden = hidden;
}

function updateElementInnerText(id, value)
{
    var el = document.getElementById(id);
    el.innerText = value;   
}

function isOffline(memberElement)
{
    let connectionStatus = memberElement.querySelector("div.member.icons > ul > li");
    if (connectionStatus.title.includes('Offline'))
    {
        return true;
    }

    return false;
}

function isTraveling(memberElement)
{
    if (memberElement.innerText === 'Traveling')
    {
        return true
    }
    return false;
}

function isInJail(memberElement)
{
    if (memberElement.innerText === 'Jail')
    {
        return true
    }
    return false;
}

//Add the HTML element to the page
var xmlHttp = null;

xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", chrome.extension.getURL("status.html"), false );
xmlHttp.send( null );

var statusElement = document.createElement("div");
statusElement.innerHTML = xmlHttp.responseText;
var factionWarInfo = document.querySelector("div.f-war-list").parentNode;
factionWarInfo.parentNode.insertBefore(statusElement, factionWarInfo);

//Add the icon
var iconDiv = document.getElementById("tchlogo");
var logoPath = chrome.runtime.getURL('images/icon48.png');
iconDiv.innerHTML = '<img src="' + logoPath + '"></img>';

let members = document.querySelectorAll('ul.member-list > li');
let totalCount = 0;
let okayCount = 0;
let offlineHospitalCount = 0;
let travelingCount = 0;
let hospitalCount = 0;
let jailCount = 0
members.forEach(function(m) {
    //Hide if its Okay
    let status = m.querySelector('div.acc-wrap > div.info-wrap > div.status > span.t-green');
    if (status) {
        hideLi(m);
        okayCount += 1;
        return;
    }

    //Hide if its travelling
    let redStatus = m.querySelector('div.acc-wrap > div.info-wrap > div.status > span.t-red');
    if (isTraveling(redStatus))
    {
        hideLi(m);
        travelingCount += 1;
        return;
    } 
    else if (isInJail(redStatus))
    {
        hideLi(m);
        jailCount += 1;
        return;
    }

    //Member is in hospital, hide if online
    hospitalCount += 1;
    if (isOffline(m))
    {
        hideLi(m);
        offlineHospitalCount += 1;
    }
})

totalCount = hospitalCount + okayCount + travelingCount + jailCount;
updateElementInnerText('tchmtargets', hospitalCount - offlineHospitalCount);
updateElementInnerText('tchmokay', okayCount);
updateElementInnerText('tchmtraveling', travelingCount);
updateElementInnerText('tchmjail', jailCount);
updateElementInnerText('tchmoffline', offlineHospitalCount);
updateElementInnerText('tchmtotal', totalCount);
