$(document).ready(function () {

    $('a').click(function () {
        $('a').removeClass('active')
        $(this).addClass('active')
    })
    $('#profile').click(function () {
        $('#addressBody').hide()
        $('#orderBody').hide()
        $('#profileBody').show()
    })
    $('#order').click(function () {
        $('#addressBody').hide()
        $('#profileBody').hide()
        $('#orderBody').show()

    })
    $('#address').click(function () {
        $('#orderBody').hide()
        $('#profileBody').hide()
        $('#addressBody').show()

    })


    $('#edit').click(function () {
        $('.show').hide()
        $('.hide').show()
    })
    $('#cancel').click(function () {
        $('.show').show()
        $('.hide').hide()
    })


    $('#add').click(function () {
        $('#addressBody').hide()
        $('#addAddress').show()

    })

    $('#submit').click(function () {

        axios.post('', {
            state: document.getElementById('state').value,
            landMark: document.getElementById('landmark').value,
            city: document.getElementById('city').value,
            pin: document.getElementById('pin').value,
            address: document.getElementById('inputaddress').value,


        }).then(e => {

            window.location.reload()
        })

    })

})