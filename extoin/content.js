// console.log("content.jss");
let input_ids = []
function getInputFild(params) {
    document.querySelectorAll('input[type="text"]:not([type="hidden"]').forEach((input) => {
        // console.log(input.id)
        if (!input.value) {
            input.value = ""
            input_ids.push(input.id)
        }
    });
    return input_ids
}
getInputFild()


chrome.runtime.onMessage.addListener(function (request) {
    console.log(request);
    if (request.isEngen === "datasender") {
        console.log("input id", input_ids)
        let namefild = document.getElementById(input_ids[0])
        let fatherNamefild = document.getElementById(input_ids[1])
        namefild.value = request.data.AplicantName
        fatherNamefild.value = request.data.fatherName
        searchtbn.click()
    }

    if (request.isEngen === "syncHendler") {
        let inputbox = document.getElementById(request.data.element_id)
        inputbox.value = request.data.AplicantName
    }

});

document.addEventListener("click", (event) => {
    let id = event.target.id
    if (event.target.id) {
        let namefild = document.getElementById(id)
        namefild.addEventListener("input", (event) => {
            let accname = event.target.value
            chrome.runtime.sendMessage({ engen: "for_win_conection", data: { accname: accname, element_id: id } });
        })

    }

})
