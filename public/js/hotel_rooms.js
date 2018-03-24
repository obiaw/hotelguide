// getting room_types for hotel selected
$("#hotel").on('change', function () {
    var hotel = $(this).val();
    var hotel_data = {};
    hotel_data.hotel = hotel;

    $.ajax({
        url: "/get_hotel_rooms",
        type: "post",
        dataType:'json',
        data: hotel_data,
        success: function (response) {
            var res_arr = [];
            var res_prices = [];
            if (response.length < 1){
                $("#rooms").html(res_arr);
            }
            else {
                response.forEach(function (item) {
                   res_prices.push(item.price);
                    res_arr.push("<option value=\"+item.room+\">"+item.room+"</option>");
                });
                $("#room_price").val(res_prices[0]);
                $("#rooms").html(res_arr);
            }
        }
    });
});

// reaction due to room_type selected
$("#rooms").on('change', function () {
    var room = $("#rooms :selected").text();
    var hotel = $("#hotel").val();
    var room_data = {};
    room_data.room = room;
    room_data.hotel = hotel;

    $.ajax({
        url: "/get_room_price",
        type: "post",
        dataType:'json',
        data: room_data,
        success: function (response) {
            $("#room_price").val(response[0]);
        }
    });
});

$(document).ready(function(){

    var data = 
    $.ajax({

    });

});