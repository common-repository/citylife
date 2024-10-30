/**
 * Core CityLife WP
 *
 * @author  Tom Claus <tom@mobilevikings.com>
 */
$ = jQuery;

var citylife = {

    popup: undefined,
    darness: undefined,

    channelView: function(wrapper, id){
        // Loading
        $(wrapper).html($("<p>").text("Loading..."));

        // Do Ajax Call to channel list
        $.ajax({
            type: 'GET',
            url: "https://www.vikingspots.com/citylife/channels/"+id+"/entries/",
            dataType: 'json',
        }).done(function(response) {

            $(wrapper).html("");

            if(response.count == 0){
                $(wrapper).append($("<p>").text("Sorry, There where no results in this channel."));
            }

            // Loop trough results
            $.each(response.results, function(index, entry){
                if(entry.discover_card_type == "generic"){
                    $(wrapper).append(
                        citylife.drawGenericDiscover(wrapper, entry)
                    );
                }else{
                    console.error("discover_card_type not known.", entry.discover_card_type);
                }

            });
        });
    },

    drawGenericDiscover: function(wrapper, entry){
        // Create SPOT <div> wrapper
        var spot = $("<div>")
            .addClass("spot")
            .addClass("span3");

        // Create IMG <div>
        if(entry.discover_card_data.image_url){
            var spot_img = $("<div>")
                .addClass("spot-img has-img")
                .css("background-image", "url('"+entry.discover_card_data.image_url+"')");
            spot.append(spot_img)
        }

        // Create NAME <div>
        var spot_name = $("<div>")
            .addClass("spot-name")
            .css("border-color", "#F00")
            .text(entry.discover_card_data.title);
        spot.append(spot_name);

        // Spot Detail Popup
        spot.on("click", function(e){
             e.preventDefault();
             if(entry.detail_type == "generic"){
                citylife.drawGenericDetail(wrapper, entry);
             }else{
                console.error("detail_type not known.", entry.detail_type);
             }
        });

        // Return spot
        return spot
    },


    drawGenericDetail: function(wrapper, entry){
        // Remove other popups
        $(".spot-detail").remove();

        // Generate new popup
        var modal = $("<div>")
            .addClass("modal spot-detail")
            .attr("role", "dialog")
            .attr("aria-labelledby", "myModalLabel");

        var modal_header = $("<div>")
            .addClass("modal-header")
            .append($("<button>").attr("type", "button").addClass("close").data("dismiss", "modal").attr("aria-hidden", "true").html("&times;"))
            .append($("<h1>").text(entry.detail_data.title));
        modal.append(modal_header);

        var modal_body = $("<div>").addClass("modal-body");

        var media = $("<div>")
            .addClass("media")
            .append($("<img>").addClass("media-object pull-left").attr("src", entry.detail_data.image_url))
            .append($("<div>").addClass("media-body").text(entry.detail_data.description));
        modal_body.append(media);

        var contact = $("<div>")
            .addClass("contact")
            .html("<b>Tel:</b> 011 35 30 30<br><b>Adres:</b> Professor van Overstraetenplein 1, 3000 Leuven<br><a href='#'>E-mail</a> – <a href='#'>Website</a>");
        modal_body.append(contact);

        var contact = $("<div>")
            .addClass("openinghours")
            .html("<table><tr><th>Mon-Fri</th><td>10u00 - 18u00</td></tr><tr><th>Sat</th><td>10u00 - 13u00</td></tr><tr><th>Sun</th><td>Closed</td></tr></table>");
        modal_body.append(contact);

        modal.append(modal_body);

        $(wrapper).append(modal);
    },

    buttonView: function(wrapper, id, url){

        $.ajax({
            type: 'GET',
            url: "https://www.vikingspots.com/citylife/channels/"+id,
            dataType: 'json'
        }).done(function(response) {

            var link = $("<a>")
                .attr("href", url)
                .addClass("btn-channel")
                // .text(response.name)

            var icon = $("<span>")
                .addClass("channel-icon")
                .css("background-color", "#"+response.color)
                .css("background-image", "url('"+response.icon_url+"')");
            link.prepend(icon);

            var title = $("<span>")
                .addClass("channel-name")
                .text(response.name);
            link.append(title);

            $(wrapper).append(link);
        });
    },

    /**
     * Get a Table of all channels
     * This view is uses in the Wordpress Admin
     */
    getChannels: function(wrapper){

        // Loading...
        $(wrapper).html($("<p>").text("Loading..."));

        // Do Ajax Call to get a list of all enabled channels
        $.ajax({
            type: 'GET',
            url: "https://www.vikingspots.com/citylife/channels/",
            dataType: 'json'
        }).done(function(response) {
            console.log(response);

            // Reset Layout
            $(wrapper).html("");

            // Create Table
            var table = $("<table>").addClass("wp-list-table widefat fixed")
                .append($("<thead>")
                    .append($("<tr>")
                        .append($("<th>").text("").width("40"))
                        .append($("<th>").text("Name"))
                        .append($("<th>").text("Channel Content"))
                        .append($("<th>").text("Button"))
                    )
                );

            // Loop trough channels and add to table
            $.each(response.results, function(index, channel){

                var channel_field = $("<input>").val("[cl-channel id='"+channel.id+"']")
                    .width("90%")
                    .css("border", "none")
                    .css("outline","none")
                    .on("click", function(){
                        this.select();
                });                

                var button_field = $("<input>").val("[cl-button id='"+channel.id+"' url='http://google.com']")
                    .width("90%")
                    .css("border", "none")
                    .css("outline","none")
                    .on("click", function(){
                        this.select();
                });

                var icon 
                table.append($("<tr>")
                    .append($("<td>").html("<img src='"+channel.icon_url+"' height='36' width='36' alt='"+channel.name+"' />").css("background", "#"+channel.color))
                    .append($("<td>").html("<strong><big>"+channel.name+"</big></strong>"))
                    .append($("<td>").append(channel_field))
                    .append($("<td>").append(button_field))
                );
            });

            // Draw table
            $(wrapper).append(table);
        });
    }
};

// Close popup on ESC-button
$(document).keyup(function(e) {
    if (e.keyCode == 27) { 
        citylife.closePopup();
    } 
});