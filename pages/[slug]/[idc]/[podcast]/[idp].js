import Layout from '../../../../components/Layout';
import 'isomorphic-fetch';
import Link from 'next/link';
import Error from '../../../_error';
import slug from '../../../../helpers/slug';

export async function getServerSideProps({ query: { idp: id }, res }) {
  try {
    const req = await fetch(`https://api.audioboom.com/audio_clips/${id}.mp3`);

    if (req.status >= 400) {
      res.statusCode = req.status;
      return {
        props: {
          channel: null,
          audioClips: null,
          series: null,
          statusCode: req.status,
        },
      };
    }

    const {
      body: { audio_clip: clip },
    } = await req.json();

    return { props: { clip, statusCode: 200 } };
  } catch (err) {
    console.log(err);
    res.statusCode = 503;
    return {
      props: { channel: null, audioClips: null, series: null, statusCode: 503 },
    };
  }
}

const Podcast = ({ clip, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />;
  }
  return (
    <Layout title={`Podcasts audio - ${clip.channel.title}`}>
      <div className='modal'>
        <div className='clip'>
          <nav>
            <Link href={`/${slug(clip.channel.title)}/${clip.channel.id}`}>
              <a className='close'>&lt; Volver</a>
            </Link>
          </nav>

          <picture>
            <div
              style={{
                backgroundImage: `url(${
                  clip.urls.image || clip.channel.urls.logo_image.original
                })`,
              }}
            />
          </picture>

          <div className='player'>
            <h3>{clip.title}</h3>
            <h6>{clip.channel.title}</h6>
            <audio controls autoPlay={true}>
              <source src={clip.urls.high_mp3} type='audio/mpeg' />
            </audio>
          </div>
        </div>
      </div>

      <style jsx>{`
        nav {
          background: none;
        }
        nav a {
          display: inline-block;
          padding: 15px;
          color: white;
          cursor: pointer;
          text-decoration: none;
        }
        .clip {
          display: flex;
          height: 100%;
          flex-direction: column;
          background: #8756ca;
          color: white;
        }
        picture {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1;
          flex-direction: column;
          width: auto;
          padding: 10%;
        }
        picture div {
          width: 100%;
          height: 100%;
          background-position: 50% 50%;
          background-size: contain;
          background-repeat: no-repeat;
        }
        .player {
          padding: 30px;
          background: rgba(0, 0, 0, 0.3);
          text-align: center;
        }
        h3 {
          margin: 0;
        }
        h6 {
          margin: 0;
          margin-top: 1em;
        }
        audio {
          margin-top: 2em;
          width: 100%;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
        }
      `}</style>
    </Layout>
  );
};

export default Podcast;
