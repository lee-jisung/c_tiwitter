import Tweet from 'Components/Tweet';
import TweetFactory from 'Components/TweetFactory';
import { dbService, storageService } from 'fbase';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function Home({ userObj }) {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    dbService.collection('tweets').onSnapshot(snapshot => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map(twet => (
          <Tweet
            key={twet.id}
            tweetObj={twet}
            isOwner={twet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
