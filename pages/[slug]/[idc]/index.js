import 'isomorphic-fetch';
import Layout from '../../../components/Layout';
import ChannelGrid from '../../../components/ChannelGrid';
import PodcastList from '../../../components/PodcastList';
import Error from '../../_error';
import { useState } from 'react';
import PodcastPlayer from '../../../components/PodcastPlayer';

export async function getServerSideProps({ query: { idc: id }, res }) {
  try {
    const [reqChannel, reqAudios, reqSeries] = await Promise.all([
      fetch(`https://api.audioboom.com/channels/${id}`),
      fetch(`https://api.audioboom.com/channels/${id}/audio_clips`),
      fetch(`https://api.audioboom.com/channels/${id}/child_channels`),
    ]);

    if (reqChannel.status >= 400) {
      res.statusCode = reqChannel.status;
      return {
        props: {
          channel: null,
          audioClips: null,
          series: null,
          statusCode: reqChannel.status,
        },
      };
    }

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
        statusCode: 200,
      },
    };
  } catch (err) {
    res.statusCode = 503;
    return {
      props: { channel: null, audioClips: null, series: null, statusCode: 503 },
    };
  }
}

const Channel = ({ channel, audioClips, series, statusCode }) => {
  const [openPodcast, setPodcast] = useState(null);
  const setOpenPodcast = (event, podcast) => {
    event.preventDefault();
    setPodcast(podcast);
  };

  const closePodcast = (event) => {
    event.preventDefault();
    setPodcast(null);
  };


  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />;
  }
  return (
    <Layout title={`Podcasts - ${channel.title}`}>
      <div
        className='banner'
        style={{
          backgroundImage: `url(${channel.urls.banner_image.original})`,
        }}
      />

      {openPodcast && (
        <div className='modal'>
          <PodcastPlayer clip={openPodcast} onClose={closePodcast} />
        </div>
      )}

      <h1>{channel.title}</h1>

      {series.length > 0 && (
        <>
          <h2>Series</h2>
          <ChannelGrid channels={series}></ChannelGrid>
        </>
      )}

      <h2>Ultimos Podcasts</h2>
      <PodcastList
        podcasts={audioClips}
        onClickPodCast={setOpenPodcast}
      ></PodcastList>

      <style jsx>{`
        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
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

export default Channel;
