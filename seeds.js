const mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var myData = [
    {
        name: "Salmon Creek",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/12/44/8e/8d/incredible-camping-sites.jpg",
        description: "Free primitive camp site with town water & access to power for a donation to the hall committee to cover costs."
    },
    {
        name: "Granite Hill",
        image: "https://static1.squarespace.com/static/5a577574d0e628a6394c4795/t/5ae03c82758d461f5dbb3ff3/1524645009458/camping.jpg",
        description: "Lovely tranquil spot on a working mango and cattle farm in the Whitsundays."
    },
    {
        name: "Mountain View",
        image: "https://www.grampiansparadise.com.au/jpg/home-gp/20131016-072--l3--wedding-guests-camping-on-lakeside-sites--at-grampians-paradise-camping-and-caravan-parkland--cropped-939px.jpg",
        description: "Very large and well established beach side camping, suitable for caravans."
    },
    {
        name: "Boulder On The Hill",
        image: "https://cdn-blog.queensland.com/wp-content/uploads/2017/02/v2-escape_your_life-fraser-island.jpg",
        description: "Basic bush camping in Mount Royal National Park with drop toilets, electric barbecues and picnic tables."
    },
    {
        name: "Damned Forest",
        image: "https://www.lonelyplanet.com/travel-blog/tip-article/wordpress_uploads/2016/08/shutterstock_116105287-780d4794d174.jpg",
        description: "Large, grassy and fairly open camping area in Hanging Rock State Forest."
    },
    {
        name: "Ocean View",
        image: "https://idsb.tmgrup.com.tr/2015/07/10/HaberDetay/1436552118171.jpg",
        description: "Just behind the sand dunes and with sites suitable for caravans, tents and camper trailers."
    },
    {
        name: "Waterfall Front",
        image: "https://www.discoverlosangeles.com/sites/default/files/styles/listography_image/public/Activities/Parks/saddleback-butte-tent.jpg",
        description: "Set among ancient rainforests and eucalyptus forests, this is a perfect base camp for exploring Tapin Tops National Park."
    },
    {
        name: "Purple Plains",
        image: "http://www.ontarioparks.com/parksblog/wp-content/uploads/2017/01/Wabakimi_3904-825x510.jpg",
        description: "Tamworth and Gunnedahs most popular water based recreation area."
    },
    {
        name: "Grassy Rock",
        image: "https://cdn.shopify.com/s/files/1/2468/4011/products/campsite_1_600x.png?v=1524622915",
        description: "A beautiful free campground on the banks of Sheba Dam, surrounded by natural bush in the hills above Nundle."
    },
    {
        name: "Wooden Huts Forest",
        image: "http://www.clearwatervalley.com/uploads/pics/IMG_1516.JPG",
        description: "Well constructed wooden huts, ideal for camping in the middle of bushy forest."
    }
];

function seedDB() {
    Comment.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all comments");
              // Remove all campgrounds
            Campground.remove({}, function(err) {
                // if (err) {
                //     console.log(err);
                // } else {
                //     console.log("Removed all campgrounds");
                //     myData.forEach(function(seed) {
                //         Campground.create(seed, function(err, campground){
                //             if (err) {
                //                 console.log(err);
                //             } else {
                //                 console.log("Added campground");
                //                 Comment.create(
                //                     {
                //                         text: "This place is great, but I wish it had running water.",
                //                         author: "Homer"
                //                     }, function(err, comment) {
                //                         if (err) {
                //                             console.log(err);
                //                         } else {
                //                             console.log("Added comment");
                //                             campground.comments.push(comment);
                //                             campground.save();
                //                         }
                //                     });
                //             };
                //         });
                //     });
                // };
            }); 
        }
    })
};

module.exports = seedDB;