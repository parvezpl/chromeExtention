
// switch ..............
const toggleSwitch = document.getElementById("toggleSwitch");
const statusText = document.getElementById("status");



toggleSwitch.addEventListener("change", function() {
    statusText.textContent = this.checked ? "ON" : "OFF";
    chrome.runtime.sendMessage({ isEngen:"popup", action:"switch", isChecked:this.checked, isSwitch:this.checked, setWindow:true  })
});


// for new windows creating 
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn");
    button.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openPopup" }, (response) => {
        })
    });
});


// for set counter numbers
let num = 0
document.addEventListener("DOMContentLoaded", () => {
    const minus = document.getElementById("minus");
    const plus = document.getElementById("plus");
    const set = document.getElementById("set");
    const rest = document.getElementById("rest");
    const setdesplay = document.getElementById("setdesplay");
    const setnum = document.getElementById("setnum");
    // add or decreac value num 
    plus.addEventListener('click', (event) => {
        event.preventDefault()
        num = num + 1``
        if (num <= 5000) {
            setnum.value = num
        }
    })

    minus.addEventListener('click', (event) => {
        event.preventDefault()
        num = num - 1
        if (num >= 0) {
            setnum.value = num
        }
    })

    //set the num for auto click 
    set.addEventListener('click', () => {
        const val = Number(setnum.value)
        if (val >= 0 & val <= 5000) {
            const setnum1 = document.getElementById("setnum");
            setnum1.value=setnum.value
            setdesplay.innerHTML = setnum.value + "  :  time set auto click"
            chrome.runtime.sendMessage({ isEngen:"popup",  action: "set", setValue:setnum.value })

        }
    })

    // rest section 
    rest.addEventListener('click', () => {
        setnum.value = null
        const countbox = document.getElementById("countbox");
        const remainbox = document.getElementById("remainbox");
        countbox.innerHTML = 0
        remainbox.innerHTML = 0
        chrome.runtime.sendMessage({ isEngen:"popup", action: "rest" })
        chrome.storage.local.set({ totalcount: 0 })
        chrome.storage.local.get('data', (res)=>{
            chrome.storage.local.set({ data: {...res.data, count:{...res.data.count, total:0}} })
            console.log(res)
        })
    })

    // s tart click section ............

    const data = {
        hostname: 'yes',
        runStatus: false,
        isSwitch:false,
        isChecked:false,
        isStart:false,
        setValue:0,
        count: {
            total: 0,
            remain: 0,
            last: 0
        }
    }
    const hardrest = document.getElementById("hardrest");
    const stop = document.getElementById("stop");
    hardrest.addEventListener("click", () => {
        chrome.storage.local.set({ data:  data })
        chrome.runtime.sendMessage({ isEngen:"popup", action: "hardrest" })
    });
    stop.addEventListener("click", () => {
        chrome.runtime.sendMessage({ isEngen:"popup", action: "stop" })
    });

})

// receive sms 


const countbox = document.getElementById("countbox");
const remainbox = document.getElementById("remainbox");
const lastcount = document.getElementById("lastcount");
chrome.storage.local.get("data", (res)=>{
    countbox.innerHTML = res.data.count.total
    remainbox.innerHTML = res.data.count.remain
    lastcount.innerHTML = res.data.count.last
})
chrome.runtime.onMessage.addListener((message) => {
    if (message.isEngen === "counter") {
        console.log(message)
            countbox.innerHTML = message.data.count.total
            remainbox.innerHTML = message.data.count.remain
            lastcount.innerHTML = message.data.count.last
    }
})