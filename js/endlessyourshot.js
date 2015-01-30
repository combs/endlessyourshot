 
var $data_photos = [];
var $base = "http://yourshot.nationalgeographic.com/";
var $api_key = "";


function begin() {
	if (! readCookie("api_key")) {
		getAPIKey();
	}
	$api_key=readCookie("api_key");

	$("#form_search").submit(formSearchSubmit);
	$("#button_close_modal_results").click(function() {$("#modal_results").hide();});
	setupPhotos("animal");
	
}
function getAPIKey() {

	while ($api_key=="") {
		$api_key = window.prompt("What's your API key? We'll save it in a cookie.");
	}
	saveCookie("api_key",$api_key,30);

}


function fetchPhotos($query) {

	var $page=1;
	
	var $url="http://yourshot.nationalgeographic.com/api/v1/photo/search/";
 
	$("#alert_search").hide();
	$.getJSON($url, { q: $query, page: $page, apikey: $api_key, page_size: 20, format: "json" } ).done(savePhotos).fail(function(){errorSearch("Couldn't fetch photos for " + $query ); });
	
} 

function setupPhotos($query) {

	destroyPhotos();
	fetchPhotos($query);	
	
}


function destroyPhotos() {
	$(".wrapper-photo").remove();
	
}

function displayPhotos(ids) {
	 
	
	//	$.each($data_photos, function(index) {
	$.each(ids, function(index) {
		var id=ids[index];
	
		$span = $("#container-photos").append($("<span>", {id: "photo-" + id, data_id_your_shot: id } ));
		$span.append($("<img>", {src: $base + $data_photos[id].sizes["medium-800"]}));
	} ) ;
	
	$("#table_questions tr").click(function(){displayQuestionAnswersModal($(this).data("questionid")) } ) ;
	 

} 

   
function savePhotos(data) {
 	var new_ids=[];
 	
	var $this_response = data.objects;

 	if ($this_response.length > 0){ 

		try {
			$.each($this_response, function(index) {
				if ($this_response[index].id) {
					$data_photos[$this_response[index].id]=$this_response[index];		
					new_ids.push($this_response[index].id);
					
				} 
			}) ;
			
			
		} catch(err) {
			
		};
		
	} else {
			 
		// No photos returned. 
	}	
	
	displayPhotos(new_ids); 
}





function errorSearch($message) {

$("#alert_search").html($message).show();

}


function formSearchSubmit() {
	var $query=$("#input_search_query").val();
		
	if ($query=="") {	

		errorSearch("<strong>Sorry!</strong> Could you please enter a word or two? Then I can fetch answers for you.");

	} else {
		fetchPhotos($query);	

		// TK: show status message

	}
	
	 	
}




$(document).ready(begin);







// http://stackoverflow.com/questions/1458724/how-to-set-unset-cookie-with-jquery

function saveCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    saveCookie(name, "", -1);
}

