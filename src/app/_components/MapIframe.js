export default function MapIframe({ title, className, latitude, longitude }) {
  const src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d294.1145122865875!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708bdbb1512c33%3A0x2c62649d51c1add5!2sPKM%20FMIPA!5e0!3m2!1sid!2sid!4v1713297853373!5m2!1sid!2sid`
  return (
    <div className={' ' + className + ' '}>
      <iframe
        title={title}
        src={src}
        width="600"
        height="450"
        style={{ border: 0, width: "100%", height: "100%"}}
        allowFullScreen=""
      ></iframe>
    </div>
  );
}
