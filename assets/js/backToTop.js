function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('scroll', function () {
	var backToTopButton = document.getElementById('back-to-top');
	if (backToTopButton) {
		// Hide button at page start.
		if (window.scrollY > 300) {
			backToTopButton.classList.remove('hidden');
		} else {
			backToTopButton.classList.add('hidden');
		}
	}
});
