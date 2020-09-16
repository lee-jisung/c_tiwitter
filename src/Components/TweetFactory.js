import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

function TweetFactory({ userObj }) {
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const onSubmit = async e => {
    if (message === '') {
      return;
    }
    e.preventDefault();
    let downloadUrl = '';
    if (fileUrl !== '') {
      //create reference of file, upload image to firebase storage
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(fileUrl, 'data_url');
      downloadUrl = await response.ref.getDownloadURL();
    }
    const tweet = {
      text: message,
      createAt: Date.now(),
      creatorId: userObj.uid,
      downloadUrl,
    };
    // add data to Firestorep
    await dbService.collection('tweets').add(tweet);
    setMessage('');
    setFileUrl('');
  };

  const onChange = e => {
    setMessage(e.target.value);
  };

  const onFileChange = e => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      setFileUrl(finishedEvent.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearPhoto = () => setFileUrl('');
  return (
    <div>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={message}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        <label for="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {fileUrl && (
          <div className="factoryForm__attachment">
            <img
              src={fileUrl}
              style={{
                backgroundImage: fileUrl,
              }}
              alt=""
            />
            <div className="factoryForm__clear" onClick={onClearPhoto}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default TweetFactory;
