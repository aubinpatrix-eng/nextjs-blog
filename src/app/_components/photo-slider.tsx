"use client";

import { useRef } from "react";

type Props = {
  photos: { image: string; caption: string }[];
};

export default function PhotoSlider({ photos }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="slider">
      <div className="slider-track" ref={track} tabIndex={0} aria-label="Photos de l'ATHX Paris 2026">
        {photos.map((photo) => (
          <figure className="slide" key={photo.image}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.image} alt={photo.caption} loading="lazy" width={1000} height={1333} />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="slider-controls">
        <button type="button" onClick={() => scroll(-1)} aria-label="Photos précédentes">
          ←
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Photos suivantes">
          →
        </button>
      </div>
    </div>
  );
}
