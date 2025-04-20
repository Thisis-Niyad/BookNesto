function theme() {
    console.log(switchinput.checked);

    let body = document.querySelector('.body')
    let navBar = document.querySelector('.navbar');
    let picSec = document.querySelector('.pic-sec');

    if (switchinput.checked) {
        body.classList.add('dark-mode');
        navBar.classList.add('dark-nav');
        picSec.classList.add('pic-sec-dark');
        picSec.classList.remove('pic-sec-light');


    } else {
        body.classList.remove('dark-mode');
        navBar.classList.remove('dark-nav');
        picSec.classList.remove('pic-sec-dark');
        picSec.classList.add('pic-sec-light');


    }
}