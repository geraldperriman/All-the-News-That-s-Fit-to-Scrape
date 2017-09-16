
// grab the articles as a json
$.getJSON("/news", function(data) {
    // loop through all the data
    for (var i = 0; i < data.length; i++) {
        // display the data on the page
        $("#newsBody").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
    }
});


// saveNoteBtn click function
$(document).on('click', '#saveNoteBtn', function(){

    // send a POST request
    $.ajax({
        method: 'POST',
        url: '/news/note/',
        data: {
            body: $('#noteForm').val()
        }
    })
    .done(function(data){
        // log the response
        console.log(data);
        // empty the notes section
        $('#noteForm').empty();
        // copy the note into the deleteNoteForm
        newFormMovedToDeleteForm();
    });
});

function newFormMovedToDeleteForm() {
    $(document).on('click', '#saveNoteBtn', function(){
        $ajax({
            method: 'GET',
            url: '/news/note/',
            data: {
                body: $('#noteForm').val()
            }
        })
        .done(function(data){
            data.appendTo('deleteNoteForm');
        });
    });
}
