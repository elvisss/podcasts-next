import Layout from '../../../../components/Layout';
import 'isomorphic-fetch';
import Error from '../../../_error';

import PodcastPlayer from '../../../../components/PodcastPlayer';

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
      <PodcastPlayer clip={clip} />
    </Layout>
  );
};

export default Podcast;
