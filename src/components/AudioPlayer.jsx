export default function AudioPlayer({ youtubeId }) {
    return (
      <div style={{ marginTop: '20px' }}>
        <iframe
          width="100%"
          height="100"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0`}
          title="YouTube audio player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    )
  }