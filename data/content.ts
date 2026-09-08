export const locations = [
  {
    slug: 'istanbul-havalimani',
    name: 'İstanbul Havalimanı',
    code: 'IST',
    eta: 'Terminalde 15 dk',
    address: 'Tayakadın, Arnavutköy / İstanbul',
    description:
      'Uçuş numaranıza göre planlanan terminal karşılama ve vale teslimatı.',
  },
  {
    slug: 'sabiha-gokcen',
    name: 'Sabiha Gökçen',
    code: 'SAW',
    eta: 'Terminalde 15 dk',
    address: 'Sanayi, Pendik / İstanbul',
    description:
      'İç ve dış hatlarda isim panolu karşılama ve hızlı araç teslimi.',
  },
  {
    slug: 'istanbul-merkez',
    name: 'İstanbul Merkez',
    code: 'IST-C',
    eta: 'Aynı gün',
    address: 'Levent, Beşiktaş / İstanbul',
    description: 'Avrupa ve Anadolu yakasında adrese premium teslimat ağı.',
  },
  {
    slug: 'ankara',
    name: 'Ankara',
    code: 'ANK',
    eta: '24 saat',
    address: 'Çankaya / Ankara',
    description:
      'Şehir merkezi, Esenboğa ve kurumsal kampüslere planlı teslimat.',
  },
  {
    slug: 'izmir',
    name: 'İzmir',
    code: 'IZM',
    eta: '24 saat',
    address: 'Bayraklı / İzmir',
    description: 'Adnan Menderes, merkez ve Çeşme hattında teslimat.',
  },
  {
    slug: 'antalya',
    name: 'Antalya',
    code: 'AYT',
    eta: '24 saat',
    address: 'Muratpaşa / Antalya',
    description: 'Havalimanı, otel ve marina teslimat seçenekleri.',
  },
];
export const packages = [
  { name: 'Günlük', discount: 'Esnek kullanım', note: '1–6 gün' },
  { name: 'Haftalık', discount: 'Haftalık araç tarifesi', note: '7–29 gün' },
  { name: 'Aylık', discount: 'Aylık araç tarifesi', note: '30+ gün' },
  { name: 'Kurumsal', discount: 'Özel teklif', note: '12–36 ay' },
];
export const extras = [
  { id: 'driver', name: 'Ek sürücü', price: 650, unit: 'gün' },
  { id: 'child', name: 'Çocuk koltuğu', price: 350, unit: 'gün' },
  { id: 'cover', name: 'Tam kapsamlı güvence', price: 1450, unit: 'gün' },
  {
    id: 'airport',
    name: 'Havalimanı karşılama',
    price: 1750,
    unit: 'tek sefer',
  },
  {
    id: 'delivery',
    name: 'Adrese araç teslimatı',
    price: 2250,
    unit: 'tek sefer',
  },
  { id: 'km', name: 'Günlük ek kilometre', price: 950, unit: 'gün' },
];
