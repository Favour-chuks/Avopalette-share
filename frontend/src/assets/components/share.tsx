import React, { useState } from 'react';
import html2canvas from 'html2canvas';

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

  // Use html2canvas to capture the current page as an image
  const canvas = await html2canvas(document.body);
  const image = canvas.toDataURL('image/png');

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

const ShareButton: React.FC = () => {
 const [link, setLink] = useState('');
 const [showPreview, setShowPreview] = useState(false);

 const handleShare = () => {
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
  {showPreview && <LinkPreview url={link} />}
 </div>
 );
};

export default ShareButton;