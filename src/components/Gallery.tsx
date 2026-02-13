import './Gallery.css'

const PHOTOS = [
  { src: '1.jpg', alt: 'Пётр' },
  { src: '2.jpg', alt: 'Пётр' },
]

const base = import.meta.env.BASE_URL

export function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <h2>Ещё Петя</h2>
      <div className="gallery__grid">
        {PHOTOS.map((photo) => (
          <div key={photo.src} className="gallery__item">
            <img
              src={`${base}${photo.src}`}
              alt={photo.alt}
              className="gallery__img"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
