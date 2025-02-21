import React, { useState, useRef } from 'react';
import { captureImage } from '../../utils/captureImage';
import CollageIndex from './collageIndex';

interface LinkPreviewProps {
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [preview, setPreview] = useState<{ title: string; description: string; image: string } | null>(null);

  const fetchPreview = async () => {
    // Mocking a fetch call to get link preview data
    // Replace this with actual API call to fetch link preview data
    const response = await new Promise<{ title: string; description: string; image: string }>((resolve) => {
      const title = prompt("Enter title:");
      const description = prompt("Enter description:");
      resolve({ title: title || '', description: description || '', image: '' });
    });

    // Use the captureImage utility function to capture the specified element as an image
    const image = await captureImage('capture-element');

    setPreview({
      title: response.title,
      description: response.description,
      image: image,
    });
  };

  React.useEffect(() => {
    fetchPreview();
  }, [url]);

  if (!preview) {
    return <div>Loading preview...</div>;
  }

  return (
    <div className="link-preview">
      <a href={preview.image} download>
        <img src={preview.image} alt={preview.title} />
      </a>
      <h3>{preview.title}</h3>
      <p>{preview.description}</p>
    </div>
  );
};

function ShareButton() {
  const [link, setLink] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const collageRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (collageRef.current) {
      const image = await captureImage('capture-element');
      // Implement your sharing logic here using the captured image
      console.log('Captured image:', image);
    }
    setShowPreview(true);
  };

  return (
    <div className="share-button">
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter link to share"
      />
      <button onClick={handleShare}>Share</button>
      <div id="capture-element" ref={collageRef}>
        <CollageIndex>
          {/* Your content here */}
          <div>Your content here</div>
        </CollageIndex>
      </div>
      {showPreview && <LinkPreview url={link} />}
    </div>
  );
}

export default ShareButton;