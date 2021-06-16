import React, { Fragment, useState } from 'react';
import axios from 'axios';
import ArtistStickerComponent from './ArtistStickerComponent';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFileId, setUploadedFileId] = useState('');
  const [fileArtist, setFileArtist] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [linkToImage, setLinkToImage] = useState('');
  const [fileAlbum, setFileAlbum] = useState('');

  
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log(res.data);
      const { matches: [{trackId, metadata: {title, artist, albumtitle, artistarthq}}]} = res.data;

      setUploadedFileId(trackId);
      setFileArtist(artist);
      setFileTitle(title);
      setFileAlbum(albumtitle);
      setLinkToImage(artistarthq);

      
    } catch (err) {
      if (err.response.status === 500) {
        console.log('There was a problem with the server');
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
    
        {fileArtist && (
            <ArtistStickerComponent trackId={uploadedFileId} fileArtist={fileArtist} fileAlbum={fileAlbum} fileTitle={fileTitle} linkToImage={linkToImage} />
        )}

    </Fragment>
  );
};

export default FileUpload;
