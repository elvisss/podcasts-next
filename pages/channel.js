import fetch from 'isomorphic-fetch';
import Link from 'next/link';

const Channel = ({ channel, audioClips, series }) => {
  return (
    <>
      <header>Podcasts</header>

      <div
        className='banner'
        style={{
          backgroundImage: `url(${channel.urls.banner_image.original})`,
        }}
      />

      <h1>{channel.title}</h1>

      {series.length > 0 && (
        <>
          <h2>Series</h2>
          <div className='channels'>
            {series.map((serie, key) => (
              <Link key={`${serie.id}-${key}`} href={`/channel?id=${serie.id}`}>
                <a className='channel'>
                  <img src={serie.urls.logo_image.original} alt='' />
                  <h2>{serie.title}</h2>
                </a>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2>Ultimos Podcasts</h2>
      {audioClips.map((clip) => (
        <Link key={clip.id} href={`/podcast?id=${clip.id}`}>
          <a className='podcast'>{clip.title}</a>
        </Link>
      ))}

      <style jsx>{`
        header {
          color: #fff;
          background: #8756ca;
          padding: 15px;
          text-align: center;
        }

        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }

        .channels {
          display: grid;
          grid-gap: 15px;
          padding: 15px;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
        a.channel {
          display: block;
          margin-bottom: 0.5em;
          color: #333;
          text-decoration: none;
        }
        .channel img {
          border-radius: 3px;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
          width: 100%;
        }
        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 5px;
          font-size: 0.9em;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        .podcast {
          display: block;
          text-decoration: none;
          color: #333;
          padding: 15px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        .podcast:hover {
          color: #000;
        }
        .podcast h3 {
          margin: 0;
        }
        .podcast .meta {
          color: #666;
          margin-top: 0.5em;
          font-size: 0.8em;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui;
          background: white;
        }
      `}</style>
    </>
  );
};

export async function getServerSideProps({ query: { id } }) {
  try {
    const [reqChannel, reqAudios, reqSeries] = await Promise.all([
      fetch(`https://api.audioboom.com/channels/${id}`),
      fetch(`https://api.audioboom.com/channels/${id}/audio_clips`),
      fetch(`https://api.audioboom.com/channels/${id}/child_channels`),
    ]);

    const {
      body: { channel },
    } = await reqChannel.json();
    const {
      body: { audio_clips: audioClips },
    } = await reqAudios.json();
    const {
      body: { channels: series },
    } = await reqSeries.json();

    return {
      props: {
        channel,
        audioClips,
        series,
      },
    };
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default Channel;
