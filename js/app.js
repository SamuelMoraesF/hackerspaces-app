document.webL10n.setLanguage(navigator.language);

var hackerspaces = [];

jaload = false;

function loadhackers(){
  var zero = 0;
  $.getJSON("http://spaceapi.net/directory.json" )
    .done(function( json ) {
      var items = [];
      $.each( json, function( key, val ) {
        //Add hackerspace to the select list
        $('#labs').append('<option value="'+zero+'">'+key+'</option>');
        hackerspaces.push([zero, key, val]);
        zero++;
      });
    })
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
  //urls contains the json url and the cache to avoid CORS error.
  var urls = [hackerspaces[hacknum][2], "http://spaceapi.net/cache/" + hackerspaces[hacknum][1]];
  var count = 0;
  var done = false;
  while(count < urls.length && !done) {
    var url = urls[count];
    ++count;
    $.getJSON(url)
    .done(function( json ) {
      //Parse JSON
      done = true;
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
      var errorText = (count == 2)? 
      '(CORS error, contact the lab) Load cache':
      'You should check your connection';
      //Show error message
      $( '.errorarea' ).html('<div id="alerta" class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></button><strong>' + document.webL10n.get("error") + '</strong> '+ errorText +'</div>');
    });
  }
}

loadhackers();
