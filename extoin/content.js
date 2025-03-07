console.log("content.jss");



let input_ids = []
function getInputFild(params) {
    document.querySelectorAll('input[type="text"]:not([type="hidden"]').forEach((input) => {
        if (!input.value) {
            input.value = ""
            input_ids.push(input.id)
        }
    });
    return input_ids
}
getInputFild()

let submitbnt = []
document.querySelectorAll('input[type="submit"]').forEach((input) => {
    submitbnt.push(input.id)
});



chrome.runtime.onMessage.addListener(function (request) {
    console.log(request);
    if (request.isEngen === "datasender") {
        console.log("input id", input_ids)
        let namefild = document.getElementById(input_ids[0])
        let fatherNamefild = document.getElementById(input_ids[1])
        namefild.value = request.data.AplicantName
        fatherNamefild.value = request.data.fatherName
        let sumbbtn = document.getElementById(submitbnt[0])
        sumbbtn.click()
    }

    if (request.isEngen === "syncHendler") {
        console.log(request)
        let inputbox = document.getElementById(request.data.element_id)
        inputbox.value = request.data.accname
    }

});

document.addEventListener("click", (event) => {
    if (event.target.id) {
        let id = event.target.id
        let namefild = document.getElementById(id)
        namefild.addEventListener("input", async (event) => {
            let accname = event.target.value
            let hostname =window.location.hostname
            console.log(accname)
            await chrome.runtime.sendMessage({ engen: "for_win_conection", data: { accname: accname, element_id: id, hostname } });
        })
    }
})


document.addEventListener("click", () => {
    const res = getTableColumn()
    if (res.class) {

        const table = document.querySelector(`.${res.class}`)
        const rows = table.querySelectorAll('tbody tr')
        let tableData = [];

        rows.forEach((row) => {
            let rowData = [];
            const columns = row.querySelectorAll('td, th')
            columns.forEach((col, index) => {
                console.log(col, index)
                if (res.colIndex===index) {
                    let text = col.querySelector('span') ? col.querySelector('span').textContent.trim() : col.textContent.trim();
                    rowData.push(text);
                    let elemnts = col.querySelector('span') ? col.querySelector('span') : col;
                    elemnts.style.background="red"
                }
                // // console.log(elemnts)
            });
        
            tableData.push(rowData);
            if (!rowData.length) {
            }
        })
        console.log(tableData);
    }
})


