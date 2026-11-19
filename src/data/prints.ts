import { galleryOrder } from "./gallery-order";
import a1 from "@/assets/prints/p01-amkor.jpg.asset.json";
import a2 from "@/assets/prints/p02-army.jpg.asset.json";
import a3 from "@/assets/prints/p03-bilu.jpg.asset.json";
import a4 from "@/assets/prints/p04-bloomingdales.jpg.asset.json";
import a5 from "@/assets/prints/p05-contessa.jpg.asset.json";
import a6 from "@/assets/prints/p06-dafna.jpg.asset.json";
import a7 from "@/assets/prints/p07-el-al-paris-asufa.jpg.asset.json";
import a8 from "@/assets/prints/p08-el-al-roma-asufa.jpg.asset.json";
import a9 from "@/assets/prints/p09-el-al-vienna.jpg.asset.json";
import a10 from "@/assets/prints/p10-el-al-usa-asufa.jpg.asset.json";
import a11 from "@/assets/prints/p11-elal-rainboeing.jpg.asset.json";
import a12 from "@/assets/prints/p12-elal-amsterdam.jpg.asset.json";
import a13 from "@/assets/prints/p13-el-al-canada.jpg.asset.json";
import a14 from "@/assets/prints/p14-el-al-zurich-asufe.jpg.asset.json";
import a15 from "@/assets/prints/p15-fifa.jpg.asset.json";
import a16 from "@/assets/prints/p16-japan-ballet.jpg.asset.json";
import a17 from "@/assets/prints/p17-sabra-coffee.jpg.asset.json";
import a18 from "@/assets/prints/p18-amisragaz.jpg.asset.json";
import a19 from "@/assets/prints/p19-architecture-russia.jpg.asset.json";
import a20 from "@/assets/prints/p20-art-festival.jpg.asset.json";
import a21 from "@/assets/prints/p21-bat-sheva.jpg.asset.json";
import a22 from "@/assets/prints/p22-bilu.jpg.asset.json";
import a23 from "@/assets/prints/p23-book-week-blue.jpg.asset.json";
import a24 from "@/assets/prints/p24-el-al-africe.jpg.asset.json";
import a25 from "@/assets/prints/p25-el-al-copenhagen.jpg.asset.json";
import a26 from "@/assets/prints/p26-el-al-holy-land.jpg.asset.json";
import a27 from "@/assets/prints/p27-el-al-israel.jpg.asset.json";
import a28 from "@/assets/prints/p28-el-al-jerusalem.jpg.asset.json";
import a29 from "@/assets/prints/p29-el-al-london.jpg.asset.json";
import a30 from "@/assets/prints/p30-hagrala.jpg.asset.json";
import a31 from "@/assets/prints/p31-hole-in-the-moon-asufa.jpg.asset.json";
import a32 from "@/assets/prints/p32-independance-1972.jpg.asset.json";
import a33 from "@/assets/prints/p33-independance-asufa.jpg.asset.json";
import a34 from "@/assets/prints/p34-ir-noar.jpg.asset.json";
import a35 from "@/assets/prints/p35-israel-1968.jpg.asset.json";
import a36 from "@/assets/prints/p36-israel-festival.jpg.asset.json";
import a37 from "@/assets/prints/p37-israel-festival.jpg.asset.json";
import a38 from "@/assets/prints/p38-jerusalem.jpg.asset.json";
import a39 from "@/assets/prints/p39-kfar-vradim.jpg.asset.json";
import a40 from "@/assets/prints/p40-maccabiah.jpg.asset.json";
import a41 from "@/assets/prints/p41-may-1.jpg.asset.json";
import a42 from "@/assets/prints/p42-million-3.jpg.asset.json";
import a43 from "@/assets/prints/p43-near-east.jpg.asset.json";
import a44 from "@/assets/prints/p44-near-east-israel-1962.jpg.asset.json";
import a45 from "@/assets/prints/p45-olympic-stams.jpg.asset.json";
import a46 from "@/assets/prints/p46-palmach.jpg.asset.json";
import a47 from "@/assets/prints/p47-shalom-asufa-1.jpg.asset.json";
import a48 from "@/assets/prints/p48-steps-march.jpg.asset.json";
import a49 from "@/assets/prints/p49-telegram.jpg.asset.json";
import a50 from "@/assets/prints/p50-west-side-story.jpg.asset.json";

import a51 from "@/assets/prints/p51-zimriya.jpg.asset.json";
import a52 from "@/assets/prints/p52-el-al-istanbul.jpg.asset.json";
import a53 from "@/assets/prints/p53-el-al-tehran.jpg.asset.json";

export type Print = {
  id: string;
  title: string;
  year: string;
  technique: string;
  description: string;
  image: string;
};

const catalogPrints: Print[] = [
  {
    id: "p1",
    title: "אמקור",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת פרסום למותג החשמל אמקור — צבע, קצב וצמצום גרפי.",
    image: a1.url,
  },
  {
    id: "p2",
    title: "צה״ל",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה בשפה גרפית חדה, בשירות מסר ממלכתי.",
    image: a2.url,
  },
  {
    id: "p3",
    title: "ביל״ו",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה היסטורית בעיצוב מודרניסטי ישראלי.",
    image: a3.url,
  },
  {
    id: "p4",
    title: "בלומינגדייל׳ס · ישראל",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה לתערוכת ישראל בבלומינגדייל׳ס בניו יורק.",
    image: a4.url,
  },
  {
    id: "p5",
    title: "קונטסה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת מותג בקו נקי ובצבעוניות עזה.",
    image: a5.url,
  },
  {
    id: "p6",
    title: "דפנה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה בשפה גרפית מינימליסטית ומדויקת.",
    image: a6.url,
  },
  {
    id: "p7",
    title: "אל על · פריז",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "סדרת היעדים של אל על — אייקון עיר שנולד מתוך הלוגו.",
    image: a7.url,
  },
  {
    id: "p8",
    title: "אל על · רומא",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "סדרת היעדים של אל על — סמל עיר בשפה טיפוגרפית.",
    image: a8.url,
  },
  {
    id: "p9",
    title: "אל על · וינה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "סדרת היעדים של אל על — צמצום גרפי מושלם.",
    image: a9.url,
  },
  {
    id: "p10",
    title: "אל על · ארצות הברית",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד לאל על בשפה גרפית נועזת.",
    image: a10.url,
  },
  {
    id: "p11",
    title: "אל על · Rainboeing",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "קשת צבעים ומטוס — משחק מילים גרפי קלאסי.",
    image: a11.url,
  },
  {
    id: "p12",
    title: "אל על · אמסטרדם",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "צבעוני שצומח מתוך אות בלוגו על רקע זוהר.",
    image: a12.url,
  },
  {
    id: "p13",
    title: "אל על · קנדה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד עם עלה מייפל ושפה גרפית מדויקת.",
    image: a13.url,
  },
  {
    id: "p14",
    title: "אל על · ציריך",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד אלפינית בשפת הסדרה.",
    image: a14.url,
  },
  {
    id: "p15",
    title: "פיפ״א",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת ספורט בקומפוזיציה דינמית.",
    image: a15.url,
  },
  {
    id: "p16",
    title: "להקת הבלט היפנית",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "קליגרפיה יפנית פוגשת עיצוב ישראלי.",
    image: a16.url,
  },
  {
    id: "p17",
    title: "סברה · קפה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "צבר, צבע והומור מקומי בשנות השישים.",
    image: a17.url,
  },
  {
    id: "p18",
    title: "אמישראגז",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת מותג בקו גרפי נקי ובוטח.",
    image: a18.url,
  },
  {
    id: "p19",
    title: "אדריכלות · רוסיה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת תערוכה בשפה קונסטרוקטיביסטית.",
    image: a19.url,
  },
  {
    id: "p20",
    title: "פסטיבל האמנות",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "אופ־ארט בפסים מתעקלים לפסטיבל הציור והפיסול.",
    image: a20.url,
  },
  {
    id: "p21",
    title: "להקת בת שבע",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "תנועה ומחול בשפה גרפית מופשטת.",
    image: a21.url,
  },
  {
    id: "p22",
    title: "ביל״ו · גרסה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "גרסה נוספת לכרזת ביל״ו.",
    image: a22.url,
  },
  {
    id: "p23",
    title: "שבוע הספר העברי",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "ספר שנפתח למניפת דפים — תנועה וקצב.",
    image: a23.url,
  },
  {
    id: "p24",
    title: "אל על · אפריקה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד בצבעוניות חמה.",
    image: a24.url,
  },
  {
    id: "p25",
    title: "אל על · קופנהגן",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד סקנדינבית בשפת הסדרה.",
    image: a25.url,
  },
  {
    id: "p26",
    title: "אל על · ארץ הקודש",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד עם סמלי הארץ.",
    image: a26.url,
  },
  {
    id: "p27",
    title: "אל על · ישראל",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "הכרזה האיקונית — כנף שהופכת לסימן.",
    image: a27.url,
  },
  {
    id: "p28",
    title: "אל על · ירושלים",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "אריה יהודה יוצא מתוך אותיות הלוגו.",
    image: a28.url,
  },
  {
    id: "p29",
    title: "אל על · לונדון",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת יעד בריטית בשפה טיפוגרפית.",
    image: a29.url,
  },
  {
    id: "p30",
    title: "ההגרלה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה בקומפוזיציה משחקית וצבעונית.",
    image: a30.url,
  },
  {
    id: "p31",
    title: "חור בלבנה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת הסרט האיקוני בשפה גרפית פורצת דרך.",
    image: a31.url,
  },
  {
    id: "p32",
    title: "יום העצמאות 1972",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת חג בעיצוב חגיגי ומדויק.",
    image: a32.url,
  },
  {
    id: "p33",
    title: "יום העצמאות",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת חג בשכבות צבע שקופות.",
    image: a33.url,
  },
  {
    id: "p34",
    title: "עיר הנוער",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה צעירה ותוססת בצבעי יסוד.",
    image: a34.url,
  },
  {
    id: "p35",
    title: "ישראל 1968",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת עשרים שנה למדינה בשפה ציורית.",
    image: a35.url,
  },
  {
    id: "p36",
    title: "הפסטיבל הישראלי",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "משולשים בקצב מדוד — אופ־ארט ישראלי.",
    image: a36.url,
  },
  {
    id: "p37",
    title: "הפסטיבל הישראלי · גרסה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "גרסה נוספת לכרזת הפסטיבל הישראלי.",
    image: a37.url,
  },
  {
    id: "p38",
    title: "ירושלים",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "חומות, אור וצבע בשפה גרפית מרוכזת.",
    image: a38.url,
  },
  {
    id: "p39",
    title: "כפר ורדים",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה מקומית בעיצוב נקי.",
    image: a39.url,
  },
  {
    id: "p40",
    title: "המכביה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזת ספורט בתנופה גרפית.",
    image: a40.url,
  },
  {
    id: "p41",
    title: "באחד במאי",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "דגלים מתפתלים לספרה אחת ענקית.",
    image: a41.url,
  },
  {
    id: "p42",
    title: "שלושה מיליון",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה ממלכתית בשפה מספרית־גרפית.",
    image: a42.url,
  },
  {
    id: "p43",
    title: "יריד המזרח",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "עיר תערוכה נוצצת בלילה כחול.",
    image: a43.url,
  },
  {
    id: "p44",
    title: "בקרו בישראל · 1962",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "סוס מכונף מעל תרני דגלים על טורקיז.",
    image: a44.url,
  },
  {
    id: "p45",
    title: "בולים אולימפיים",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה בשפה גרפית של תנועה וספורט.",
    image: a45.url,
  },
  {
    id: "p46",
    title: "פלמ״ח",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה היסטורית בעיצוב ישיר ועוצמתי.",
    image: a46.url,
  },
  {
    id: "p47",
    title: "שלום",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כף יד פרושה בצבעי פסיכדליה — הדימוי המוכר ביותר.",
    image: a47.url,
  },
  {
    id: "p48",
    title: "צעדה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "קצב, מדרגות ותנועה בשפה מופשטת.",
    image: a48.url,
  },
  {
    id: "p49",
    title: "מברק",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "כרזה טיפוגרפית בקו מינימליסטי.",
    image: a49.url,
  },
  {
    id: "p50",
    title: "ווסט סייד סטורי · הבימה",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description:
      "שתי דמויות רוקדות מול קו רקיע ניו יורקי.",
    image: a50.url,
  },
  {
    id: "p51",
    title: "הזמריה הבינלאומית השמינית בישראל",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description: "",
    image: a51.url,
  },
  {
    id: "p52",
    title: "אל על לאיסטנבול",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description: "",
    image: a52.url,
  },
  {
    id: "p53",
    title: "עם אל על לטהרן",
    year: "",
    technique: "הדפס רשמי, 33×46 ס״מ",
    description: "",
    image: a53.url,
  },
];

export const prints: Print[] = galleryOrder
  .slice()
  .sort((a, b) => a.number - b.number)
  .map(({ id, title }) => {
    const print = catalogPrints.find((item) => item.id === id);
    if (!print) throw new Error(`Missing catalog print: ${id}`);
    return { ...print, title };
  });
