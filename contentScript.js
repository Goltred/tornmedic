function hideLi(statusElement, hidden=true)
{
    let li = statusElement.closest('li');
    li.hidden = hidden;
}

// //Add the HTML element to the page
// var xmlHttp = null;

// xmlHttp = new XMLHttpRequest();
// xmlHttp.open( "GET", chrome.extension.getURL ("status.html"), false );
// xmlHttp.send( null );

// var statusElement = document.createElement("div");
// statusElement.innerHTML = xmlHttp.responseText;
// var highLowWrap = document.querySelector(".highlow-main-wrap");
// highLowWrap.parentNode.insertBefore(statusElement, highLowWrap.nextSibling);

let members = document.querySelectorAll('ul.member-list > li');
members.forEach(function(m) {
    //Hide if its offline
    let connectionStatus = m.querySelector("div.member.icons > ul > li");
    if (connectionStatus.title.includes('Offline'))
    {
        hideLi(m);
        return;
    }

    //Hide if its Okay
    let status = m.querySelector('div.acc-wrap > div.info-wrap > div.status > span.t-green');
    if (status) {
        hideLi(m);
        return;
    }

    //Hide if its travelling
    let redStatus = m.querySelector('div.acc-wrap > div.info-wrap > div.status > span.t-red');
    if (redStatus.innerText === 'Traveling' || redStatus.innerText === 'Jail')
    {
        hideLi(m);
        return;
    }
})