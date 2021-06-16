const express = require('express');
const fetch = require('node-fetch');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const sw = require('stopword');
const { createReadStream } = require('fs');

const app = express();

app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const sanitizeString = (str) => {

  if (!str) {
    str = '';
  };
  //remove accents
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  //remove new line symbols
  str = str.replace(/\n/g, ' ');
  //To lower case
  str = str.toLowerCase(str);
  //Remove non alphabetical chars
  str = str.replace(/[^a-zA-Z]/g, ' ');
  //remove single letter words
  str = str.replace(/\b[a-zA-z]{1,2}\b/g,' ');
  //remove multiple spaces
  str = str.replace(/ {1,}/g,' ');
  //remove stopwords
  str = sw.removeStopwords(str.split(' '));

  const newString = sw.removeStopwords(str, ['doo', 'don', 'just', 'dont', 'aint', 'ive', 'its', '', 'ain']);

  return newString;
}

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

//   const wavFile = req.files.file;

//   wavFile.mv(`${__dirname}/hack.wav`);
    
  const stream = createReadStream("wavfile");

//   fetch("https://beta-amp.shazam.com/partner/recognise", {
//     body: stream,
//     headers: {
//       "Content-Type": "application/octet-stream",
//       "X-Shazam-Api-Key": "f01a8799-4c59-4790-9fa5-3bb7e53e8ad9",
//     },
//     method: "POST"
//   }).then(response => {
//             console.log(response);
//       }).catch(error => {
//         console.log(error);
//       });

    fetch("https://beta-amp.shazam.com/partner/recognise", {
        method: "POST",
        body: stream,
        headers: {
                  "Content-Type": "application/octet-stream",
                  "X-Shazam-Api-Key": "",
                },

      }).then(response => {
        response.json().then(json => {
            res.send(json);
          })
      }).catch(error => {
        console.log(error);
      });

  //res.json(fakeRecogniseAudio);
});

app.post('/topSongs', (req, res) => {
    const topSongs = {};
    fetch("https://beta-amp.shazam.com/discovery/v5/en/GB/iphone/-/track/" + req.body.id).then(function(response) {
    response.json().then(json => {
      const artistId = json.sections[3].id;
      console.log(artistId);

      fetch("https://beta-amp.shazam.com/discovery/v3/en/GB/hackathon/artist/" + artistId).then(function(response) {
        response.json().then(json => {
          const topSongsUrl = json.toptracks.url;
          console.log(topSongsUrl);

          fetch(topSongsUrl+ "5").then(function(response) {
            response.json().then(json => {
              const topSongIds = json.chart.map(function (songIds) {return songIds.key});
                console.log(topSongIds);
                //for each topSongId fetch https://beta-amp.shazam.com/discovery/v5/en/GB/iphone/-/track/ + the ID
                //the response.json().then(json => {const songLirics = json.message.body.input.sections[1].text; <----it's an array
                topSongIds.forEach(function(id) {
                    fetch("https://beta-amp.shazam.com/discovery/v5/en/GB/iphone/-/track/" + id).then(function(response) {
                        response.json().then(json => {
                            if (typeof(json.sections[1].text) == "undefined"){
                                topSongs[id]  = [];
                            } else {
                                topSongs[id]  = sanitizeString(json.sections[1].text.join());
                                //console.log("id:" + id)
                                //console.log("something" + topSongs[id])
                            }
                            })
                         }).then(function(myJson) {})
                    });
                });
            }).then(function(myJson) {})
        });
      }).then(function(myJson) {})
    });
  }).then(function(myJson) {
    console.log("TOP SONGS :" + topSongs["280286550"])
  })

  function function1() {
    // stuff you want to happen right away
        console.log(topSongs);
        res.json(topSongs);
    }


  setTimeout(function1, 5000);
  
});



app.listen(5000, () => console.log('Server Started...'));


const fakeTrackLookup =  {
  "layout": "5",
  "type": "MUSIC",
  "key": "357149366",
  "title": "New Rules",
  "subtitle": "Dua Lipa",
  "images": {
      "background": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg",
      "coverart": "https://images.shazam.com/coverart/t357149366-b1228739609_s400.jpg",
      "coverarthq": "https://images.shazam.com/coverart/t357149366-b1228739609_s800.jpg"
  },
  "share": {
      "subject": "New Rules - Dua Lipa",
      "text": "I used Shazam to discover New Rules by Dua Lipa.",
      "href": "https://www.shazam.com/track/357149366/new-rules",
      "image": "https://images.shazam.com/coverart/t357149366-i1228739609_s400.jpg",
      "twitter": "I used @Shazam to discover New Rules by Dua Lipa.",
      "html": "https://www.shazam.com/snippets/email-share/357149366?lang=en&country=GB",
      "avatar": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg"
  },
  "hub": {
      "type": "APPLEMUSIC",
      "image": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic_{scalefactor}.png",
      "actions": [
          {
              "name": "apple",
              "type": "applemusicplay",
              "id": "1228739609"
          },
          {
              "name": "apple",
              "type": "uri",
              "uri": "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview115/v4/8d/a2/0e/8da20e07-4509-ed6e-a482-e2f9d521c10c/mzaf_7874592249013239474.plus.aac.p.m4a"
          }
      ],
      "options": [
          {
              "caption": "OPEN",
              "actions": [
                  {
                      "name": "hub:applemusic:deeplink",
                      "type": "applemusicopen",
                      "uri": "https://itunes.apple.com/gb/album/new-rules/1228739599?i=1228739609&uo=5&at=1001l4DI&itscg=30201&ct=5348615A-616D-3235-3830-44754D6D5973&app=music&itsct=Shazam_1"
                  }
              ],
              "beacondata": {
                  "type": "open",
                  "providername": "applemusic"
              },
              "image": "https://images.shazam.com/static/icons/hub/ios/v5/overflow-open-option_{scalefactor}.png",
              "listcaption": "Listen on Apple Music",
              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic-overflow_{scalefactor}.png",
              "colouroverflowimage": false
          }
      ],
      "providers": [
          {
              "caption": "Open in Spotify",
              "images": {
                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/spotify-overflow_{scalefactor}.png",
                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/spotify_{scalefactor}.png"
              },
              "actions": [
                  {
                      "name": "hub:spotify:androidsearchdeeplink",
                      "type": "intent",
                      "uri": "intent:#Intent;action=android.media.action.MEDIA_PLAY_FROM_SEARCH;component=com.spotify.music/.MainActivity;S.referrer=Shazam;S.query=New%20Rules%20Dua%20Lipa;end"
                  }
              ],
              "type": "SPOTIFY"
          }
      ],
      "displayname": "APPLE MUSIC"
  },
  "sections": [
      {
          "type": "SONG",
          "metapages": [
              {
                  "image": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg",
                  "caption": "Dua Lipa"
              },
              {
                  "image": "https://images.shazam.com/coverart/t357149366-b1228739609_s800.jpg",
                  "caption": "New Rules"
              }
          ],
          "tabname": "Song",
          "metadata": [
              {
                  "title": "Album",
                  "text": "Dua Lipa (Deluxe)"
              },
              {
                  "title": "Label",
                  "text": "Warner Bros."
              },
              {
                  "title": "Released",
                  "text": "2017"
              }
          ]
      },
      {
          "type": "LYRICS",
          "text": [
              "One, one, one, one, one",
              "",
              "Talkin' in my sleep at night, makin' myself crazy",
              "(Out of my mind, out of my mind)",
              "Wrote it down and read it out, hopin' it would save me",
              "(Too many times, too many times)",
              ""
          ],
          "footer": "Writer(s): caroline ailin, emily warren, ian kirkpatrick\nLyrics powered by www.musixmatch.com",
          "tabname": "Lyrics",
          "beacondata": {
              "lyricsid": "19047928",
              "providername": "musixmatch",
              "commontrackid": "71579639"
          }
      },
      {
          "type": "VIDEO",
          "title": "New Rules - Dua Lipa",
          "image": {
              "dimensions": {
                  "width": 640,
                  "height": 360
              },
              "url": "https://beta-amp.shazam.com/video/v2/-/GB/-/youtube/redirect/image?q=Dua+Lipa+%22New+Rules%22&c=UC-J-KZfRV8c13fOCkhXdLiQ&playButton=false"
          },
          "actions": [
              {
                  "name": "section:youtube:redirect",
                  "type": "webview",
                  "share": {
                      "subject": "New Rules - Dua Lipa",
                      "text": "I used Shazam to discover New Rules by Dua Lipa.",
                      "href": "https://www.shazam.com/track/357149366/new-rules",
                      "image": "https://images.shazam.com/coverart/t357149366-i1228739609_s400.jpg",
                      "twitter": "I used @Shazam to discover New Rules by Dua Lipa.",
                      "html": "https://www.shazam.com/snippets/email-share/357149366?lang=en&country=GB",
                      "avatar": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg"
                  },
                  "uri": "https://beta-amp.shazam.com/video/v2/-/GB/-/youtube/redirect?q=Dua+Lipa+%22New+Rules%22&c=UC-J-KZfRV8c13fOCkhXdLiQ"
              }
          ],
          "tabname": "Video",
          "highlightsurl": "https://beta-amp.shazam.com/video/v3/en/GB/iphone/201886252/357149366/highlights",
          "relatedhighlightsurl": "https://beta-amp.shazam.com/video/v3/en/GB/iphone/201886252/recommendations_357149366/relatedhighlights"
      },
      {
          "type": "ARTIST",
          "avatar": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg",
          "id": "201886252",
          "name": "Dua Lipa",
          "verified": true,
          "url": "https://beta-amp.shazam.com/digest/v1/en/GB/iphone/artist/201886252/recentpost",
          "actions": [
              {
                  "type": "artistposts",
                  "id": "201886252"
              },
              {
                  "type": "artist",
                  "id": "201886252"
              }
          ],
          "tabname": "Artist",
          "toptracks": {
              "url": "https://beta-amp.shazam.com/shazam/v2/en/GB/iphone/-/tracks/artisttoptracks_201886252?startFrom=0&pageSize=20&connected=&channel="
          }
      },
      {
          "type": "RELATED",
          "url": "https://beta-amp.shazam.com/shazam/v2/en/GB/iphone/-/tracks/recommendations_357149366?startFrom=0&pageSize=20&connected=&channel=",
          "tabname": "Related"
      }
  ],
  "url": "https://www.shazam.com/track/357149366/new-rules",
  "artists": [
      {
          "id": "201886252"
      }
  ],
  "urlparams": {
      "{tracktitle}": "New+Rules",
      "{trackartist}": "Dua+Lipa"
  },
  "myshazam": {
      "apple": {
          "actions": [
              {
                  "name": "myshazam:apple",
                  "type": "uri",
                  "uri": "https://itunes.apple.com/gb/album/new-rules/1228739599?i=1228739609&uo=5&at=1001l4DI&itscg=30201&ct=5348615A-616D-3235-3830-44754D6D5973&app=music&itsct=Shazam_1"
              }
          ]
      }
  },
  "highlightsurls": {
      "artisthighlightsurl": "https://beta-amp.shazam.com/video/v3/en/GB/iphone/201886252/357149366/highlights?videoIdToFilter=1258705880",
      "trackhighlighturl": "https://beta-amp.shazam.com/video/v3/en/GB/iphone/highlights/1258705880",
      "relatedhighlightsurl": "https://beta-amp.shazam.com/video/v3/en/GB/iphone/201886252/recommendations_357149366/relatedhighlights"
  },
  "relatedtracksurl": "https://beta-amp.shazam.com/shazam/v2/en/GB/iphone/-/tracks/recommendations_357149366?startFrom=0&pageSize=20&connected=&channel="
}


const fakeRecogniseAudio = {
  "matches": [
    {
      "trackId": "56876959",
      "metadata": {
        "title": "Starships",
        "artist": "Nicki Minaj",
        "releasedate": "2012-02-14",
        "albumtitle": "Pink Friday: Roman Reloaded the Re-Up (Booklet Version)",
        "artistarthq": "https://images.shazam.com/artistart/a40748725_s800.jpg"
      },
      "type": "music"
    },
  ]
}


const fakeTopSongs = {
  "properties": {},
  "chart": [
      {
          "type": "MUSIC",
          "key": "414762648",
          "heading": {
              "title": "No Tears Left To Cry",
              "subtitle": "Ariana Grande"
          },
          "images": {
              "default": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg"
          },
          "stores": {
              "itunes": {
                  "actions": [
                      {
                          "type": "uri",
                          "uri": "https://itunes.apple.com/gb/album/no-tears-left-to-cry/1399202539?i=1399202959&uo=5&at=11l3eE&ct=5348615A-616D-3235-3830-44754D6D5973&app=itunes"
                      }
                  ],
                  "explicit": false,
                  "previewurl": "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview128/v4/16/a8/ec/16a8ecde-b6e6-6911-d1fa-50ab0e60aee6/mzaf_8704104644886074717.plus.aac.p.m4a",
                  "coverarturl": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg",
                  "trackid": "1399202959",
                  "productid": "1399202539"
              }
          },
          "streams": {
              "applemusic": {
                  "actions": [
                      {
                          "name": "stream:applemusic:connect",
                          "type": "applemusicconnect"
                      },
                      {
                          "name": "stream:applemusic:play",
                          "type": "applemusicplay",
                          "id": "1399202959"
                      },
                      {
                          "name": "stream:applemusic:deeplink",
                          "type": "uri",
                          "uri": "https://itunes.apple.com/gb/album/no-tears-left-to-cry/1399202539?i=1399202959&uo=5&at=1001l4DI&itscg=30201&ct=5348615A-616D-3235-3830-44754D6D5973&app=music&itsct=Shazam_1"
                      }
                  ]
              }
          },
          "artists": [
              {
                  "id": "40985191"
              }
          ],
          "share": {
              "subject": "No Tears Left To Cry - Ariana Grande",
              "text": "I used Shazam to discover No Tears Left To Cry by Ariana Grande.",
              "href": "https://www.shazam.com/track/414762648/no-tears-left-to-cry",
              "image": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg",
              "twitter": "I used @Shazam to discover No Tears Left To Cry by Ariana Grande.",
              "html": "https://www.shazam.com/snippets/email-share/414762648?lang=en&country=GB",
              "avatar": "https://images.shazam.com/artistart/a40985191_s800b1b5.jpg"
          },
          "alias": "no-tears-left-to-cry",
          "url": "https://www.shazam.com/track/414762648/no-tears-left-to-cry",
          "actions": [
              {
                  "name": "track:414762648",
                  "type": "track",
                  "id": "414762648"
              }
          ],
          "urlparams": {
              "{tracktitle}": "No+Tears+Left+To+Cry",
              "{trackartist}": "Ariana+Grande"
          },
          "properties": {}
      },
      {
          "type": "MUSIC",
          "key": "22222222",
          "heading": {
              "title": "No Tears Left To Cry",
              "subtitle": "Ariana Grande"
          },
          "images": {
              "default": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg"
          },
          "stores": {
              "itunes": {
                  "actions": [
                      {
                          "type": "uri",
                          "uri": "https://itunes.apple.com/gb/album/no-tears-left-to-cry/1399202539?i=1399202959&uo=5&at=11l3eE&ct=5348615A-616D-3235-3830-44754D6D5973&app=itunes"
                      }
                  ],
                  "explicit": false,
                  "previewurl": "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview128/v4/16/a8/ec/16a8ecde-b6e6-6911-d1fa-50ab0e60aee6/mzaf_8704104644886074717.plus.aac.p.m4a",
                  "coverarturl": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg",
                  "trackid": "1399202959",
                  "productid": "1399202539"
              }
          },
          "streams": {
              "applemusic": {
                  "actions": [
                      {
                          "name": "stream:applemusic:connect",
                          "type": "applemusicconnect"
                      },
                      {
                          "name": "stream:applemusic:play",
                          "type": "applemusicplay",
                          "id": "1399202959"
                      },
                      {
                          "name": "stream:applemusic:deeplink",
                          "type": "uri",
                          "uri": "https://itunes.apple.com/gb/album/no-tears-left-to-cry/1399202539?i=1399202959&uo=5&at=1001l4DI&itscg=30201&ct=5348615A-616D-3235-3830-44754D6D5973&app=music&itsct=Shazam_1"
                      }
                  ]
              }
          },
          "artists": [
              {
                  "id": "40985191"
              }
          ],
          "share": {
              "subject": "No Tears Left To Cry - Ariana Grande",
              "text": "I used Shazam to discover No Tears Left To Cry by Ariana Grande.",
              "href": "https://www.shazam.com/track/414762648/no-tears-left-to-cry",
              "image": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg",
              "twitter": "I used @Shazam to discover No Tears Left To Cry by Ariana Grande.",
              "html": "https://www.shazam.com/snippets/email-share/414762648?lang=en&country=GB",
              "avatar": "https://images.shazam.com/artistart/a40985191_s800b1b5.jpg"
          },
          "alias": "no-tears-left-to-cry",
          "url": "https://www.shazam.com/track/414762648/no-tears-left-to-cry",
          "actions": [
              {
                  "name": "track:414762648",
                  "type": "track",
                  "id": "414762648"
              }
          ],
          "urlparams": {
              "{tracktitle}": "No+Tears+Left+To+Cry",
              "{trackartist}": "Ariana+Grande"
          },
          "properties": {}
      },
      {
          "type": "MUSIC",
          "key": "111111111",
          "heading": {
              "title": "No Tears Left To Cry",
              "subtitle": "Ariana Grande"
          },
          "images": {
              "default": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg"
          },
          "stores": {
              "itunes": {
                  "actions": [
                      {
                          "type": "uri",
                          "uri": "https://itunes.apple.com/gb/album/no-tears-left-to-cry/1399202539?i=1399202959&uo=5&at=11l3eE&ct=5348615A-616D-3235-3830-44754D6D5973&app=itunes"
                      }
                  ],
                  "explicit": false,
                  "previewurl": "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview128/v4/16/a8/ec/16a8ecde-b6e6-6911-d1fa-50ab0e60aee6/mzaf_8704104644886074717.plus.aac.p.m4a",
                  "coverarturl": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg",
                  "trackid": "1399202959",
                  "productid": "1399202539"
              }
          },
          "streams": {
              "applemusic": {
                  "actions": [
                      {
                          "name": "stream:applemusic:connect",
                          "type": "applemusicconnect"
                      },
                      {
                          "name": "stream:applemusic:play",
                          "type": "applemusicplay",
                          "id": "1399202959"
                      },
                      {
                          "name": "stream:applemusic:deeplink",
                          "type": "uri",
                          "uri": "https://itunes.apple.com/gb/album/no-tears-left-to-cry/1399202539?i=1399202959&uo=5&at=1001l4DI&itscg=30201&ct=5348615A-616D-3235-3830-44754D6D5973&app=music&itsct=Shazam_1"
                      }
                  ]
              }
          },
          "artists": [
              {
                  "id": "40985191"
              }
          ],
          "share": {
              "subject": "No Tears Left To Cry - Ariana Grande",
              "text": "I used Shazam to discover No Tears Left To Cry by Ariana Grande.",
              "href": "https://www.shazam.com/track/414762648/no-tears-left-to-cry",
              "image": "https://images.shazam.com/coverart/t414762648-i1399202959_s400.jpg",
              "twitter": "I used @Shazam to discover No Tears Left To Cry by Ariana Grande.",
              "html": "https://www.shazam.com/snippets/email-share/414762648?lang=en&country=GB",
              "avatar": "https://images.shazam.com/artistart/a40985191_s800b1b5.jpg"
          },
          "alias": "no-tears-left-to-cry",
          "url": "https://www.shazam.com/track/414762648/no-tears-left-to-cry",
          "actions": [
              {
                  "name": "track:414762648",
                  "type": "track",
                  "id": "414762648"
              }
          ],
          "urlparams": {
              "{tracktitle}": "No+Tears+Left+To+Cry",
              "{trackartist}": "Ariana+Grande"
          },
          "properties": {}
      }
  ]
}

const fakeArtistLookup = {
  "avatar": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg",
  "id": "201886252",
  "name": "Dua Lipa",
  "verified": true,
  "url": "https://beta-amp.shazam.com/digest/v1/en/GB/iphone/artist/201886252/recentpost",
  "actions": [
      {
          "type": "artistposts",
          "id": "201886252"
      },
      {
          "type": "artist",
          "id": "201886252"
      }
  ],
  "share": {
      "subject": "I discovered Dua Lipa using Shazam.",
      "text": "I discovered Dua Lipa using Shazam.",
      "href": "https://shz.am/a201886252#dua-lipa",
      "image": "https://images.shazam.com/artistart/a201886252_s800b1b5.jpg",
      "twitter": "I discovered Dua Lipa using @Shazam."
  },
  "toptracks": {
      "url": "https://beta-amp.shazam.com/shazam/v2/en/GB/iphone/-/tracks/artisttoptracks_201886252?startFrom=0&pageSize=20&connected=&channel="
  }
}


app.post('/topSongs', (req, res) => {
    const artistId = fakeTrackLookup.sections[0].id;

    // fetch("https://beta-amp.shazam.com/discovery/v3/en/GB/hackathon/artist/" + artistId)
    const topSongsUrl = fakeArtistLookup.toptracks.url;

    const topSongIds = fakeTopSongs.chart.map(function (songIds) {return songIds.key});

    const topSongs = {};

    
    topSongIds.map( function (id) {
      topSongs[id]  = sanitizeString(fakeTrackLookup.sections[1].text.join());
    })




    res.json(topSongs);

    

                //for each topSongId fetch https://beta-amp.shazam.com/discovery/v5/en/GB/iphone/-/track/ + the ID
                //the response.json().then(json => {const songLirics = json.message.body.sections[1].text; <----it's an array
});