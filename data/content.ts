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
  {
    id: 'driver',
    name: 'Ek sürücü',
    price: 650,
    unit: 'gün',
    description: 'Bir ek sürücü; aynı yaş ve ehliyet koşullarına tabi.',
  },
  {
    id: 'child',
    name: 'Çocuk koltuğu',
    price: 350,
    unit: 'gün',
    description: 'Bir çocuk koltuğu için örnek günlük hizmet.',
  },
  {
    id: 'cover',
    name: 'Genişletilmiş güvence · demo',
    price: 1450,
    unit: 'gün',
    description:
      'Hasar sorumluluğu azaltma senaryosu. Gerçek sigorta veya poliçe sağlamaz; yakıt, ceza ve kayıp eşya kapsam dışı varsayılır.',
  },
  {
    id: 'airport',
    name: 'Havalimanı karşılama',
    price: 1750,
    unit: 'tek sefer',
    description:
      'Teslim almada bir terminal karşılama. Uçuş numarası gerekir; canlı uçuş takibi yoktur.',
  },
  {
    id: 'delivery',
    name: 'Adrese araç teslimatı',
    price: 2250,
    unit: 'tek sefer',
    description:
      'Seçilen şehirde bir adrese teslim; adres gereklidir. Havalimanı noktalarında sunulmaz.',
  },
  {
    id: 'km',
    name: 'Günlük +100 kilometre',
    price: 950,
    unit: 'gün',
    description:
      'Her kiralama günü için 100 km ek hak; toplam hak gün sayısıyla çarpılır.',
  },
];
export const chauffeurServices = [
  {
    name: 'Havalimanı transferi',
    description:
      'Tek yön terminal karşılama senaryosu; canlı uçuş takibi yoktur.',
    hours: 1,
  },
  {
    name: 'Günlük özel şoför',
    description: '8 saat / 150 km dahil örnek günlük program.',
    hours: 8,
  },
  {
    name: 'Etkinlik ve VIP karşılama',
    description: 'Başlangıç, varış ve süreye göre örnek etkinlik planı.',
    hours: 3,
  },
  {
    name: 'Saatlik paket',
    description: 'En az 3 saatlik şehir içi program.',
    hours: 3,
  },
];
