function switchDarkMode() {
    var wrapper = document.getElementsByClassName('theme')[0];
    if (wrapper.classList.contains('theme-light')) {
        wrapper.classList.remove('theme-light');
        wrapper.classList.add('theme-dark');
    } else {
        wrapper.classList.remove('theme-dark');
        wrapper.classList.add('theme-light');
    }
}