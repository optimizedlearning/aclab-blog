function switchDarkMode() {
	// var wrapper = document.getElementsByClassName('theme')[0];
	var wrapper = document.documentElement;
	// var wrapper = document.body;
	if (wrapper.classList.contains('theme-light')) {
		// light to dark
		wrapper.classList.remove('theme-light');
		wrapper.classList.add('theme-dark');
		localStorage.setItem('theme', 'theme-dark');
	} else {
		// dark to light
		wrapper.classList.remove('theme-dark');
		wrapper.classList.add('theme-light');
		localStorage.setItem('theme', 'theme-light');
	}
}