
import React, { useEffect, useState } from 'react';
import { getRandomTitle } from '@/utils/roast-utils';

const RandomTitle: React.FC = () => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(getRandomTitle());
  }, []);

  return (
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
      {title}
    </h1>
  );
};

export default RandomTitle;
