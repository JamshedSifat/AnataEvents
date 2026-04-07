import React from 'react';
import { useParams } from 'react-router';
import AwardShowDetail from './Details/AwardShowDetail';
import ConvocationDetail from './Details/ConvocationDetail';
import ReunionDetail from './Details/ReunionDetail';
import FashionShowDetail from './Details/FashionShowDetail';
import MusicConcertDetail from './Details/MusicConcertDetail';

const SpecialEventDetail = () => {
  const { eventId } = useParams();

  switch(eventId) {
    case 'award-show':
      return <AwardShowDetail />;
    case 'convocation-event':
      return <ConvocationDetail />;
    case 'reunion-event':
      return <ReunionDetail />;
    case 'fashion-show':
      return <FashionShowDetail />;
    case 'music-concert':
      return <MusicConcertDetail />;
    default:
      return <AwardShowDetail />;
  }
};

export default SpecialEventDetail;