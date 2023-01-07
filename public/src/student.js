window.onload = () => {
	var dormitory_info = document.getElementById('dormitory_info');
	var boarder_position = document.getElementById('boarder_position');

	var information = document.getElementById('information');
	var boarder = document.getElementById('boarder');

	// console.log(document);

	information.addEventListener('click', function () {
		console.log('suc')
		information.style.color = '#bd504d';
		information.style.fontWeight = 'bold';
		dormitory_info.style.display = 'block';

		boarder.style.color = 'white';
		boarder.style.fontWeight = 'normal';
		boarder_position.style.display = 'none';
	})

	boarder.addEventListener('click', function () {
		console.log('suc')

		dormitory_info.style.display = 'none';
		information.style.color = 'white';
		information.style.fontWeight = 'normal';

		boarder.style.color = '#bd504d';
		boarder.style.fontWeight = 'bold';
		boarder_position.style.display = 'block';
	})

}
