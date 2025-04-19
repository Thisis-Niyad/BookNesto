function theme() {
    console.log(switchinput.checked);

    let body = document.querySelector('.body')
    let navBar = document.querySelector('.navbar');
    // let bookForm = document.querySelector('.bookForm');
    // let txtField = document.querySelector('.txt-field');
    // let filepondpanelroot = document.querySelector('.filepond--panel-root');
    if (switchinput.checked) {
        body.classList.add('dark-mode');
        navBar.classList.add('dark-nav');
        // bookForm.classList.add('bookForm-dark');
        // bookForm.classList.remove('bookForm-light');
        // txtField.classList.add('txt-field-dark');
        // filepondpanelroot.classList.remove('fbg-violet');
        // filepondpanelroot.classList.add('fbg-grey');

    } else {
        body.classList.remove('dark-mode');
        navBar.classList.remove('dark-nav');
        // bookForm.classList.remove('bookForm-dark');
        // bookForm.classList.add('bookForm-light');
        // txtField.classList.remove('txt-field-dark');
        // filepondpanelroot.classList.add('fbg-violet');
        // filepondpanelroot.classList.remove('fbg-grey');

    }
}