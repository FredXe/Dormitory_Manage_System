window.onload = () => {
	var dormitory_info = document.getElementById('dormitory_info');
	// var boarder_position = document.getElementById('boarder_position');
	var dormitory_application = document.getElementById('dormitory_application')
	var violation = document.getElementById('violation');

	var information = document.getElementById('information');
	var application = document.getElementById('application');
	var boarder = document.getElementById('boarder');
	var violation_record = document.getElementById('violation_record');
	// console.log(document);

	violation_record.addEventListener('click' , function(){
		console.log('suc');
		violation.style.display = 'block';
	});
	
	information.addEventListener('click', function () {
		console.log('suc');
		dormitory_info.style.display = 'block';
		information.style.color = '#bd504d';
		information.style.fontWeight = 'bold';
		
		dormitory_application.style.display = 'none';
		application.style.color = 'white';
		application.style.fontWeight = 'bold';

		// boarder_position.style.display = 'none';
		boarder.style.color = 'white';
		boarder.style.fontWeight = 'normal';
	})

	application.addEventListener('click' , function(){
		console.log('suc');

		dormitory_info.style.display = 'none';
		information.style.color = 'white';
		information.style.fontWeight = 'normal';

		dormitory_application.style.display = 'block';
		application.style.color = '#bd504d';
		application.style.fontWeight = 'bold';

		// boarder_position.style.display = 'none';
		boarder.style.color = 'white';
		boarder.style.fontWeight = 'normal';
	})
	boarder.addEventListener('click', function () {
		console.log('suc')

		dormitory_info.style.display = 'none';
		information.style.color = 'white';
		information.style.fontWeight = 'normal';

		dormitory_application.style.display = 'none';
		application.style.color = 'white';
		application.style.fontWeight = 'bold';

		// boarder_position.style.display = 'block';
		boarder.style.color = '#bd504d';
		boarder.style.fontWeight = 'bold';
	})

}
