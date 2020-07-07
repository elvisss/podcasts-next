import 'isomorphic-fetch';
import Link from 'next/link';
import slug from '../helpers/slug';

const ChannelGrid = ({ channels }) => {
  return (
    <>
      <div className='channels'>
        {channels.map((channel, index) => (
          <Link
            key={`${channel.id}-${index}`}
            href={`/${slug(channel.title)}/${channel.id}`}
          >
            <a className='channel'>
              <img src={channel.urls.logo_image.original} alt={channel.title} />
              <h2>{channel.title}</h2>
            </a>
          </Link>
        ))}
      </div>

      <style jsx>
        {`
          .channels {
            display: grid;
            grid-gap: 15px;
            padding: 15px;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }

          .channel {
            color: #333;
            display: block;
            border-radius: 3px;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
            margin-bottom: 0.5em;
            text-decoration: none;
          }

          .channel:hover {
            text-decoration: underline;
          }

          .channel img {
            width: 100%;
          }

          .channel h2 {
            color: #333;
            padding: 5px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }
        `}
      </style>
    </>
  );
};

export default ChannelGrid;
