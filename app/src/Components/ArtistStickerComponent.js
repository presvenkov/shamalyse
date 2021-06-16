import React, { useState, Fragment } from 'react'
import GraphComponent from './GraphComponent';

function ArtistStickerComponent({trackId, fileArtist, fileAlbum, fileTitle, linkToImage}) {

    const [file, setFile] = useState({});
    const [lyrics, setLyrics] = useState()

    const data = { id: trackId }

    const onSubmit = async e => {
        e.preventDefault();

        const url = "/topSongs";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(response => {
            response.json().then(json => {
                const lyrResp = json;
                setFile(lyrResp);
                console.log(lyrResp)
            })
          }).catch(error => {
            console.log(error);
        });
    };

    const getLyricsFreq = lyrics => {
        const freq = {};
      
        Object.values(lyrics).forEach((lyric) => {
          lyric.forEach((word) => {
            if (freq[word] > 0) {
              freq[word]++;
            } else {
              freq[word] = 1;
            }
          });
        });
      
        const sorted = Object.keys(freq)
          .map(word => [word, freq[word]])
          .sort((first, second) => second[1] - first[1])
      
        return sorted;
    }
    
    // componentDidMount() {
    //     updateComponent();
    // }
    

    

    const lyricsFreq = getLyricsFreq(file);

    return (
        <div className='artistSticker mt-4'>
            <h2 className='fileName'>This is: "{fileTitle}"</h2>
            <h5 className='artistName'>by</h5>
            <h3 className='artistName'>{fileArtist}</h3>
            <div className='songsInfo'>
                <img src= {linkToImage} className="rounded float-center mt-3" alt="..." width = "300" />
            </div>
        
            
            <Fragment>
                <form onSubmit={onSubmit}>
                <div className='custom-file mb-4'>
                    <input
                    type='file'
                    className='custom-file-input'
                    id='customFile'/>
                </div>
                <input
                    type='submit'
                    value='Get lyrics analysed'
                    className='btn btn-primary btn-block mb-4'/>
                </form>

                {<GraphComponent freq={lyricsFreq} artist={fileArtist}/>}
            </Fragment>
        </div>
    )
    
}


export default ArtistStickerComponent;
