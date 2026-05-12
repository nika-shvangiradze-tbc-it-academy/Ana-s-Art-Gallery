export interface GalleryArtwork {
  /** Translation key segment under `gallery.artworks.{id}` */
  id: string;
  image: string;
  size: string;
  price: string;
}

export const GALLERY_ARTWORKS: GalleryArtwork[] = [
  {
    id: 'ballerinas',
    image: '/assets/main/ana-gallery/balerina.jpg',
    size: '40 x 40 cm',
    price: '120 GEL',
  },
  {
    id: 'girlPearl',
    image: '/assets/main/ana-gallery/woman.jpg',
    size: '25 x 30 cm',
    price: '80 GEL',
  },
  {
    id: 'martin',
    image: '/assets/main/ana-gallery/tekila.jpg',
    size: '30 x 30 cm',
    price: '50 GEL',
  },
  {
    id: 'summerMemory',
    image: '/assets/main/ana-gallery/sea.jpg',
    size: '24 x 32 cm',
    price: '60 GEL',
  },
  {
    id: 'exoticMorning',
    image: '/assets/main/ana-gallery/ocean-flower.jpg',
    size: '40 x 30 cm',
    price: '80 GEL',
  },
  {
    id: 'snowyEvening',
    image: '/assets/main/ana-gallery/merry.jpg',
    size: '40 x 30 cm',
    price: '80 GEL',
  },
  {
    id: 'peaceVillage',
    image: '/assets/main/ana-gallery/green.jpg',
    size: '24 x 32 cm',
    price: '60 GEL',
  },
  {
    id: 'phoenixLily',
    image: '/assets/main/ana-gallery/flower.jpg',
    size: '30 x 30 cm',
    price: '50 GEL',
  },
  {
    id: 'newYear',
    image: '/assets/main/ana-gallery/cat.jpg',
    size: '25 x 20 cm',
    price: '70 GEL',
  },
];
