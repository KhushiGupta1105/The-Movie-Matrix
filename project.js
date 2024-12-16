function showpicture() {
    var file = logo.files[0]
    mp.width = 50;
    mp.src = URL.createObjectURL(file);
}

function displaypicture() {
    var fp = poster.files[0]
    ps.width = 135
    ps.height = 80
    ps.src = URL.createObjectURL(fp);
}

$(document).ready(function () {
    $.get('/movie/statefill', function (response) {
        response.data.map((item) => {
            $('#stateid').append($('<option>').text(item.statename).val(item.stateid))
        })
    })

    $('#stateid').change(function () {

        $.get('/movie/fillcity', { stateid: $('#stateid').val() }, function (response) {
            $('#cityid').empty()
            $('#cityid').append($('<option>').text('Select City'))
            response.data.map((item) => {
                $('#cityid').append($('<option>').text(item.cityname).val(item.cityid))
            })
        })
    })



})

$(document).ready(function () {

    $.get('/movie/get_all_movie', function (response) {
        var htm = ''
        response.data.map((item) => {
            htm += '<div style=margin:10px;>'
            htm += `<img src='/images/${item.poster}' width='300' height='400'>`
            htm += '</div>'
        })

        $('#result').html(htm)
    })

    $('#txt').keyup(function(){
        $.get('/movie/get_all_movies', {pattern:$('#txt').val()}, function (response) {
            var htm = ''
            response.data.map((item) => {
                htm += '<div style=margin:10px;>'
                htm += `<img src='/images/${item.poster}' width='300' height='400'>`
                htm += '</div>'
            })
    
            $('#result').html(htm)
        })
    })
})