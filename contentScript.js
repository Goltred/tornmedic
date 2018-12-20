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
    if (memberElement)
    {
        if (memberElement.innerText === 'Traveling')
        {
            return true;
        }
    }
    
    return false;
}

function isInJail(memberElement)
{
    if (memberElement)
    {
        if (memberElement.innerText === 'Jail')
        {
            return true;
        }
    }
    
    return false;
}

class Counters {
    constructor(){
        this.okay = 0;
        this.offlineHospital = 0;
        this.traveling = 0;
        this.hospital = 0;
        this.jail = 0;
    }

    getTotal()
    {
        return this.okay + this.offlineHospital + this.traveling + this.jail;
    }
}

function processMembers()
{
    //Define counters
    let hidden = new Counters();
    let displayed = new Counters();

    //Retrieve filter controls
    let showOkay = document.getElementById('chkOkay').checked;
    let showTraveling = document.getElementById('chkTraveling').checked;
    let showInJail = document.getElementById('chkInJail').checked;
    let showOffline = document.getElementById('chkOffline').checked;

    let members = document.querySelectorAll('ul.member-list > li');
    members.forEach(function(m) {
        //Hide if its Okay
        let status = m.querySelector('div.acc-wrap > div.info-wrap > div.status > span.t-green');
        if (status) {
            hideLi(m, !showOkay);
            !showOkay ? hidden.okay += 1 : displayed.okay += 1;
            return;
        }

        //Hide if its travelling
        let redStatus = m.querySelector('div.acc-wrap > div.info-wrap > div.status > span.t-red');
        if (isTraveling(redStatus))
        {
            hideLi(m, !showTraveling);
            !showTraveling ? hidden.traveling += 1 : displayed.traveling += 1;
            return;
        } 
        else if (isInJail(redStatus))
        {
            hideLi(m, !showInJail);
            !showInJail ? hidden.jail += 1 : displayed.jail += 1;
            return;
        }

        //Member is in hospital
        if (isOffline(m))
        {
            hideLi(m, !showOffline);
            !showOffline ? hidden.offlineHospital += 1 : displayed.offlineHospital += 1;
            hidden.hospital += 1;
        } else {
            displayed.hospital += 1;    
        }
    })

    let totals = new Counters();
    totals.okay = hidden.okay + displayed.okay;
    totals.offlineHospital = hidden.offlineHospital + displayed.offlineHospital;
    totals.traveling = hidden.traveling + displayed.traveling;
    totals.hospital = hidden.hospital + displayed.hospital;
    totals.jail = hidden.jail + displayed.jail;

    updateElementInnerText('tchmtargets', totals.hospital - totals.offlineHospital);
    updateElementInnerText('tchmokay', hidden.okay);
    updateElementInnerText('tchmtraveling', hidden.traveling);
    updateElementInnerText('tchmjail', hidden.jail);
    updateElementInnerText('tchmoffline', hidden.offlineHospital);
    updateElementInnerText('tchmhidden', hidden.getTotal());
    updateElementInnerText('tchmshown', displayed.getTotal());
    updateElementInnerText('tchmtotal', totals.getTotal());
}

//Add the HTML element to the page
let xmlHttp = null;

xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", chrome.extension.getURL("status.html"), false );
xmlHttp.send( null );

let statusElement = document.createElement("div");
statusElement.innerHTML = xmlHttp.responseText;
let factionWarInfo = document.querySelector("div.f-war-list").parentNode;
factionWarInfo.parentNode.insertBefore(statusElement, factionWarInfo);

//Add the icon
let iconDiv = document.getElementById("tchlogo");
let logoPath = chrome.runtime.getURL('images/icon48.png');
iconDiv.innerHTML = '<img src="' + logoPath + '"></img>';

processMembers();
