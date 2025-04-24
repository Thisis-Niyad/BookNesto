const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const switchinput = document.getElementById("switchinput");

if (mediaQuery.matches) {
    switchinput.checked = true;
    theme();
} else {
    console.log('☀️ Light mode is enabled');
    switchinput.checked = false;
    theme();
}

mediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
        console.log('🔄 Switched to dark mode');
        switchinput.checked = true;
        localStorage.setItem('checkboxState', switchinput.checked);
        theme();
    } else {
        console.log('🔄 Switched to light mode');
        switchinput.checked = false;
        localStorage.setItem('checkboxState', switchinput.checked);
        theme();
    }
});


const savedState = localStorage.getItem('checkboxState');
if (savedState === 'true') {
    switchinput.checked = true;
    theme();
} else {
    switchinput.checked = false;
    theme();
}
switchinput.addEventListener("change", function () {
    localStorage.setItem('checkboxState', switchinput.checked);
    theme();
})
document.querySelector('body').classList.remove('system-mode');
document.querySelector('.navbar').classList.remove('system-navbar');

function showsidebar() {
    const sidebar = document.querySelector('.sideBar');
    sidebar.style.display = 'flex';

}
function closesidebar() {
    const sidebar = document.querySelector('.sideBar');
    sidebar.style.display = 'none';

}