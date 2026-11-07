/**
 * Everything that names the gym or its contacts lives here.
 * Change these values to rebrand; nothing else in the code hard-codes them.
 */
export const BRAND = {
  name: "SPARTA FITNESS",
  /** Short name for page titles and receipts. */
  short: "SPARTA",
  /** Latin, used in SMS (Latin is cheaper than Cyrillic). */
  smsName: "SPARTA FITNESS",
  tagline: "Спартан хүч, спартан сахилга бат",
  city: "Улаанбаатар",
  phone: "86661231",
  phone2: "88069560",
  branch: "3, 4 хороолол салбар",
  hours: "06:00–22:00, өдөр бүр",
  /** Facebook page name; leave empty to hide the link. */
  facebook: "",
} as const;

/** Real hall photos, used until the admin uploads gallery photos. */
export const DEFAULT_GALLERY = [
  { src: "/img/gym-2.jpg", caption: "Тренажерийн заал" },
  { src: "/img/gym-1.jpg", caption: "Хүчний бүс" },
  { src: "/img/gym-3.jpg", caption: "Бокс, сунгалтын бүс" },
];
