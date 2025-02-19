console.log("content.jss");
// let namefild = document.getElementsByName("ctl00$ContentPlaceHolder1$txtAccusedNameFirSearch")[0]
// namefild.value = "Rajesh"
document.querySelectorAll("input").forEach((input) => {
    if(!input.value){
        console.log("data", input);

    }
});


chrome.runtime.onMessage.addListener(function(request) {
    console.log(request);
    if (request.isEngen === "datasender") {
        let namefild = document.getElementsByName("ctl00$ContentPlaceHolder1$txtAccusedNameFirSearch")[0]
        let fatherNamefild = document.getElementsByName("ctl00$ContentPlaceHolder1$txtRelativeNameFirSearch")[0]
        let searchtbn = document.getElementsByName("ctl00$ContentPlaceHolder1$btnSearchFir")[0]
        // console.log(request.data);
        namefild.value = request.data.AplicantName
        fatherNamefild.value = request.data.fatherName
        searchtbn.click()
    }

});



