document.webL10n.setLanguage(navigator.language);

var hackerspaces = [];

jaload = false;

function connection_error( fonclick ){
	$( '.errorarea' ).html('<div id="alerta" class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">' + document.webL10n.get("close") + '</span></button><strong>' + document.webL10n.get("error") + '</strong> ' + document.webL10n.get("unable-to-load-data") + ' <a href="#" onclick="' + fonclick + '">' + document.webL10n.get("try-again") + '</a>.</div>')
}

function loadhackers(){
	var zero = 0;
	$('.carregando-dados').fadeIn('slow');
	$.getJSON("http://spaceapi.net/directory.json" )
		.done(function( json ) {
			$('.carregando-dados').fadeOut('slow');
			var items = [];
			$.each( json, function( key, val ) {
				$('.navbarhackerspaces').append('<li><a href="#" onclick="hackmuda(' + zero + ')">' + key + '</a></li>');
				hackerspaces.push([zero, key, val]);
				zero++
			});
		})
		.fail(function( jqxhr, textStatus, error ) {
			$('.carregando-dados').fadeOut('slow');
			connection_error( 'loadhackers();$("#alerta").alert("close");' );
	});
}

function hackmuda(hacknum){
	if (jaload == false) {
			$('#hidefirst').fadeIn('slow');
			$('#showfirst').fadeOut('slow');
			jaload = true;
	} else {
			mapa.remove()
	}
	$('.panel-endereco').html('<div class="endereco"></div><div class="mapa" id="mapa"></div>')
	$('.carregando').fadeIn('slow');
	$('#menutopo').collapse('hide');
	$.getJSON( hackerspaces[hacknum][2] )
	//$.getJSON("http://spaceapi.net/cache/"+hackerspaces[hacknum][1])
	.done(function( json ) {
		$('.carregando').fadeOut('slow');
		$('.page-header h1').html(json['space']);
		$('.hacklogo').html('<img src="' + json['logo'] + '" alt="' + document.webL10n.get("loading-image") + '" style="max-width:100%;width:70%;">');
		if (json['state']['open'] == true) {
			$('.hackstatus').html('<span class="hackstatus label label-success">' + document.webL10n.get("open") + '</span>');
		} else if (json['state']['open'] == false) {
			$('.hackstatus').html('<span class="hackstatus label label-danger">' + document.webL10n.get("closed") + '</span');
		} else {
			$('.hackstatus').html('<span class="hackstatus label label-default">' + document.webL10n.get("unknown") + '</span>');
		}
		
		var map = L.map('mapa').setView([json['location']['lat'], json['location']['lon']], 13);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap </a> contributors'
		}).addTo(map);

		L.marker([json['location']['lat'], json['location']['lon']]).addTo(map)
			.bindPopup('<b>'+json['space']+'</b>')
			.openPopup();
		
		if (json['location']['address'] != undefined) {$('.endereco').html(json['location']['address'])} else {$('.endereco').html('')}
		
		if (json['contact']['phone'] != undefined) {$('.telefone').html('<div><b>' + document.webL10n.get("phone") + ':</b> <a>' + json['contact']['phone'] + '</a></div>')} else {$('.telefone').html('')}
		if (json['contact']['twitter'] != undefined) {$('.twitter').html('<div><b>' + document.webL10n.get("twitter") + ':</b> <a href="https://twitter.com/' + json['contact']['twitter'].replace(/^@+/i, '') + '" title="' + document.webL10n.get("twitter") + '">' + json['contact']['twitter'] + '</a></div>')} else {$('.twitter').html('')}
		if (json['contact']['facebook'] != undefined){$('.facebook').html('<div><b>' + document.webL10n.get("facebook") + ':</b> <a href="https://facebook.com/'+ json['contact']['facebook'].replace('https://', '').replace('http://', '').replace('www.', '').replace('facebook.com', '').replace('/', '') +'" title="' + document.webL10n.get("facebook") + '">'+ json['contact']['facebook'].replace('https://', '').replace('http://', '').replace('www.', '').replace('facebook.com', '').replace('/', '') +'</a></div>')} else {$('.facebook').html('')}
		if (json['contact']['email'] != undefined) {$('.email').html('<div><b>' + document.webL10n.get("email") + ':</b> <a title="' + document.webL10n.get("email") + '" href="mailto:' + json['contact']['email'] + '">' + json['contact']['email'] + '</a></div>')} else {$('.email').html('')}
		if (json['contact']['ml'] != undefined) {$('.ml').html('<div><b>' + document.webL10n.get("mailing-list") + ':</b> <a title="' + document.webL10n.get("mailing-list") + '" href="mailto:' + json['contact']['ml'] + '">' + json['contact']['ml'] + '</a></div>')} else {$('.ml').html('')}
		if (json['url'] != undefined) {$('.site').html('<div><b>' + document.webL10n.get("website") + ':</b> <a title="' + document.webL10n.get("website") + '" href="' + json['url'] + '">' + json['url'] + '</a></div>')} else {$('.site').html('')}
	})
	.fail(function( jqxhr, textStatus, error ) {
		$('.carregando').fadeOut('slow');
		connection_error( 'hackmuda('+ hacknum +');$("#alerta").alert("close");' );
	});
}

loadhackers();
