// พิกัดโดยประมาณ [lat, lng] ของแต่ละจุด — key ตรงกับ `mapQuery` ใน fukuoka-trip.ts
// จุดที่ไม่มีในนี้ (เช่น Yamanami Highway ที่เป็นเส้นทาง) จะไม่แสดงบนแผนที่
export const tripCoords: Record<string, [number, number]> = {
  // Fukuoka
  'Fukuoka Airport International Terminal': [33.5848, 130.4443],
  'Suzuki Rent a Car Fukuoka Airport International Terminal': [33.5924, 130.4403],
  'Fukuoka Airport': [33.5848, 130.4443],
  'Yoshizuka Hakata Ward Fukuoka': [33.6058, 130.422],
  'Tenjin Yatai Fukuoka': [33.5905, 130.399],
  'JAZZ BAR Browny Tenjin Fukuoka': [33.588, 130.396],
  'HUB Fukuoka Daimyo': [33.5885, 130.3935],
  'Yanagibashi Rengo Market Fukuoka': [33.5835, 130.4045],
  'Daimyo Fukuoka': [33.5875, 130.3925],
  'Shin Shin Ramen Tenjin Fukuoka': [33.588, 130.3975],
  'Mandarake Fukuoka': [33.5866, 130.3955],
  'Ohori Park Fukuoka': [33.586, 130.377],
  'LaLaport Fukuoka': [33.5716, 130.432],
  'Nakasu Yatai Fukuoka': [33.5925, 130.406],

  // Asakura
  'Himiko Roman-no-yu Asakura': [33.4149, 130.6596],

  // Hita
  'Mameda-machi Hita': [33.3248, 130.94],
  'Mameda-machi Kamimachi-dori Parking Hita': [33.327, 130.9375],
  'Sofuren Hita': [33.3201, 130.9395],
  'Mikuma Hanten Hita': [33.3124, 130.9326],
  'Kuncho Shuzo Hita': [33.3289, 130.9374],

  // Kitsuki
  'Kitsuki Castle Town Oita': [33.4189, 131.6222],
  'Kitsuki Castle Oita': [33.4154, 131.6259],

  // Beppu
  '6-3 Noguchi Motomachi Beppu': [33.2795, 131.4985],
  'Hasegawa Beppu': [33.2808, 131.5021],
  'Kannawa Onsen Beppu': [33.317, 131.479],
  'Jigoku Mushi Kobo Kannawa': [33.3167, 131.4787],
  'Umi Jigoku Beppu': [33.3165, 131.473],
  'Yukemuri Observatory Beppu': [33.3131, 131.4808],
  'Hyotan Onsen Beppu': [33.3198, 131.4847],
  'Toriten Shokunin Wataru Beppu': [33.2808, 131.499],

  // Yamanami Highway → Aso
  'Sagiridai Yufuin': [33.2747, 131.3842],
  'Chojabaru Kuju': [33.124, 131.233],
  'Daikanbo Aso': [32.9878, 131.048],
  'Aka Gyu-don Iwasaki Aso': [32.958, 131.064],
  'Kusasenri Aso': [32.8836, 131.064],

  // Kumamoto
  'Kasuga 1-chome Chuo-ku Kumamoto': [32.7937, 130.6929],
  'Luffy Statue Kumamoto Prefectural Office': [32.7894, 130.742],
  'Kumamoto Castle': [32.8063, 130.7058],
  'Suizenji Jojuen Kumamoto': [32.7909, 130.7346],
  'Ezu Lake Kumamoto': [32.779, 130.73],
  'Kumamoto Ramen Kokutei Honten': [32.7929, 130.6895],

  // Kurume
  'Kora Taisha Kurume': [33.3062, 130.565],

  // Munakata / Kitakyushu
  'Miyajidake Shrine Fukutsu': [33.78, 130.4895],
  'Michi-no-eki Munakata': [33.8352, 130.5037],
  'Munakata Taisha Hetsumiya': [33.8314, 130.5141],
  'Sarakurayama Cable Car Sanroku Station': [33.8606, 130.804],
}

// Mapcode สำหรับกรอกใน GPS รถเช่า — key ตรงกับ `mapQuery`
// แปลงจากพิกัด (OSM / GSI) ด้วยตัวแปลงของ saibara.sakura.ne.jp จึงเป็นค่าที่คำนวณ ไม่ใช่ค่าทางการจาก Denso
// `approx: true` = พิกัดต้นทางเป็นกลางพื้นที่/ที่อยู่ที่ยังไม่ยืนยัน ให้เช็คกับ GPS ก่อนออกรถ
export const tripMapcodes: Record<string, { code: string; approx?: boolean }> = {
  // สาขาที่จอง: Suzuki Rent a Car, Enoda 2-3-44 — พิกัดจากที่อยู่ (GSI) ไม่ใช่รหัสทางการของสาขา
  'Suzuki Rent a Car Fukuoka Airport International Terminal': { code: '13 323 603*34' },
  'Fukuoka Airport International Terminal': { code: '13 293 707*13' },
  // พิกัดจากที่อยู่ 198-1 Amagi (GSI ระดับแปลงที่ดิน 198) — ไม่ใช่รหัสทางการ
  'Himiko Roman-no-yu Asakura': { code: '166 874 342*47' },
  // พิกัดจาก pin ของ Google Maps (豆田町上町通り駐車場) — ไม่ใช่รหัสทางการ
  'Mameda-machi Kamimachi-dori Parking Hita': { code: '202 847 773*06' },
  'Mameda-machi Hita': { code: '202 847 862*31' },
  'Sofuren Hita': { code: '202 788 789*06' },
  // พิกัดจาก pin ของ Google Maps (Kuncho) — ไม่ใช่รหัสทางการ
  'Kuncho Shuzo Hita': { code: '202 877 083*55' },
  // พิกัดจากที่อยู่ Kuma 1-5-21 (GSI) — ไม่ใช่รหัสทางการ
  'Mikuma Hanten Hita': { code: '202 817 065*13' },
  '6-3 Noguchi Motomachi Beppu': { code: '46 405 429*30' },
  // พิกัดจาก pin ของ Google Maps (Hasegawa) — ไม่ใช่รหัสทางการ
  'Hasegawa Beppu': { code: '46 405 256*23' },
  'Jigoku Mushi Kobo Kannawa': { code: '46 522 403*25' },
  'Umi Jigoku Beppu': { code: '46 521 469*63' },
  'Yukemuri Observatory Beppu': { code: '46 523 435*13' },
  'Hyotan Onsen Beppu': { code: '46 522 324*56' },
  'Toriten Shokunin Wataru Beppu': { code: '46 405 018*10' },
  'Sagiridai Yufuin': { code: '46 301 725*47' },
  'Chojabaru Kuju': { code: '440 702 808*53' },
  'Daikanbo Aso': { code: '256 878 415*55' },
  // รหัสที่ DriveJapan ระบุว่าเป็น "Parking MAPCODE" ของร้าน
  'Aka Gyu-don Iwasaki Aso': { code: '256 635 736*82' },
  'Kusasenri Aso': { code: '256 456 262*08', approx: true },
  // ที่พัก Kasuga 1-chome 5-3 — พิกัดที่ผู้ใช้ให้มา (32°47'37.3"N 130°41'34.4"E) ไม่ใช่รหัสทางการ
  'Kasuga 1-chome Chuo-ku Kumamoto': { code: '29 428 762*70' },
  // พิกัดจากที่อยู่ 水前寺6-18-1 (GSI ระดับตำบล) — ไม่ใช่รหัสทางการ
  'Luffy Statue Kumamoto Prefectural Office': { code: '29 434 279*37', approx: true },
  'Kumamoto Castle': { code: '29 489 255*08' },
  'Suizenji Jojuen Kumamoto': { code: '29 433 434*82' },
  'Ezu Lake Kumamoto': { code: '29 345 857*62', approx: true },
  'Kumamoto Ramen Kokutei Honten': { code: '29 398 818*32', approx: true },
  'Kora Taisha Kurume': { code: '37 473 695*23' },
}
