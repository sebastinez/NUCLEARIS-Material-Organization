document.addEventListener('DOMContentLoaded', function() {
	bsCustomFileInput.init();
	var file = document.getElementById('hashFile');
	var sendbtn = document.getElementById('sendHashButton');
	var findbtn = document.getElementById('findHashButton');
	$('#hashform').submit(function(e) {
		sendbtn.setAttribute('disabled', '');
		findbtn.setAttribute('disabled', '');
		document.getElementById('loader').style = 'display: block';
	});
	file.addEventListener('change', function() {
		$('#responseText').html('');
		document.querySelector('form').className = 'was-validated';
		var imgVal = $('#hashFile').val();
		if (imgVal == '') {
			sendbtn.setAttribute('disabled', '');
			findbtn.setAttribute('disabled', '');
		} else {
			sendbtn.removeAttribute('disabled', '');
			findbtn.removeAttribute('disabled', '');
		}
	});
});
