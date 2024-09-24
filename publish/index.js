{
    const progress_bar_background_color = '#e3e3ef';
    const progress_bar_foreground_color = '#00a8ff';
    const message_digit = 1000000;
    const update_date_interval_time = 50;
    const isDebug = false;
    let progress_bar = document.querySelector("#progress_bar");
    let message_elem = document.querySelector("#progress_bar_message");
    let show_next_year_progress_bar_button = document.querySelector("#show_next_year_progress_bar_button");
    let update_date_interval = null;
    let old_year = new Date().getFullYear();
    let isUpdateRunning = false;

    let display_update = function(p, message) {
        progress_bar.style.background = `linear-gradient(to right, ${progress_bar_foreground_color} 0%, ${progress_bar_foreground_color} ${Math.floor(p * 10) / 10}%, ${progress_bar_background_color} ${Math.floor(p * 10) / 10}%, ${progress_bar_background_color} 100%)`
        message_elem.innerText = message;
        if(isDebug) {
            console.log(`complete: ${p}%`);
            console.log(`message: ${message}`);
            console.log(`progress_bar: ${Math.floor(p * 10) / 10}%`);
        }
    }
    
    let update_date = function() {
        if (isUpdateRunning) {
            return;
        }
        isUpdateRunning = true;
        let now_date = new Date();
        if(
            /*基本は年が変わったことを検知して100%にする*/
            old_year < now_date.getFullYear() ||
            /*もしold_yearの値がおかしくなった場合の対策コード*/
            (
                now_date.getMonth() == 0 &&
                now_date.getDate() == 1 &&
                now_date.getHours() == 0 &&
                now_date.getMinutes() == 0 &&
                (
                    now_date.getSeconds() == 0 ||
                    now_date.getSeconds() == 1
                )
            )
        ) {
            // 新年
            clearInterval(update_date_interval);
            let p = 100;
            let message = (now_date.getFullYear() - 1) + " is 100% complete!"; // old_yearの値がおかしくなった場合のことを考慮して (現在の年 - 1) する
            setTimeout(function () {
                show_next_year_progress_bar_button.style.display = "";
            }, 3000);
            display_update(p, message);
        } else {
            // 年が変わっていない
            let now_year = now_date.getFullYear();
            let oneyear_time = new Date(now_year + 1, 1 - 1, 1, 0, 0, 0).getTime() - new Date(now_year, 1 - 1, 1, 0, 0, 0).getTime(); // 1年の時間
            let until_next_year = new Date(now_year + 1, 1 - 1, 1, 0, 0, 0).getTime() - now_date.getTime(); // 次の年までの時間
            if(isDebug) {
                console.log(`now_year: ${now_year}`);
                console.log(`oneyear_time: ${oneyear_time}`);
                console.log(`until_next_year: ${until_next_year}`);
            }
            /*ここの問題点は、JSでの直接計算は構造上もちろん精度が低いので、間違った値が表示される可能性がある。*/
            let p = 100 - until_next_year / oneyear_time * 100; // 100 - 次の年までの時間 / 1年の時間 * 100 = 今年の完了度
            let message = now_date.getFullYear() + " is " + p.toFixed(6) + "% complete."; // パーセンテージを小数点以下6桁にフォーマットする
            display_update(p, message);
        }
        old_year = now_date.getFullYear();
        isUpdateRunning = false;
    }

    update_date();
    update_date_interval = setInterval(update_date, update_date_interval_time);

    show_next_year_progress_bar_button.addEventListener("click", function (e) {
        e.target.style.display = "none";
        isUpdateRunning = false;
        update_date_interval = setInterval(update_date, update_date_interval_time);
    })
}