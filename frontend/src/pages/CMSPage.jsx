import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicPage from '../components/DynamicPage';

const CMSPage = () => {
  const { pageKey } = useParams();

  return <DynamicPage pageKey={pageKey} defaultTitle="Сторінка" />;
};

export default CMSPage;
