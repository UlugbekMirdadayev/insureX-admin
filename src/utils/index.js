import axios from "axios";

export const _URL = "https://api.insurextest.link/api";

export const GetRegionName = async (regionId) => {
  if (regionId === false) return false;
  return ".";
};

export const InsuranceCompanyName = (insuranceCompanyId) => {
  axios.get(`${_URL}/insurance-companies/${insuranceCompanyId}`).then((res) => {
    return res?.data?.message?.insurance_company?.title;
  });
};

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
};

export const CaseTypeExtract = (data) => {
  return typeCase?.find(
    (item) =>
      item.event_type_id === data?.event_type_id &&
      item.property_type_id === data?.property_type_id
  );
};

export const getRequest = async (url) => {
  return await axios.get(`${URL}` + url);
};

export const typeCase = [
  {
    event_type_id: 1,
    property_type_id: 1,
    link: "accident",
    name: "תאונת דרכים",
    icon: "accident",
  },
  {
    event_type_id: 3,
    property_type_id: 1,
    link: "carburglary",
    name: "פריצה",
    icon: "carburglary",
  },
  {
    event_type_id: 5,
    property_type_id: 1,
    link: "theftcar",
    name: "גניבה",
    icon: "theftcar",
  },
  {
    event_type_id: 9,
    property_type_id: 2,
    link: "nature-damage-home",
    name: "נזקי טבע",
    icon: "nature",
  },
  {
    event_type_id: 9,
    property_type_id: 3,
    link: "nature-damage-office",
    name: "נזקי טבע",
    icon: "nature",
  },
  {
    event_type_id: 2,
    property_type_id: 2,
    link: "water-damage-home",
    name: "מים",
    icon: "water",
  },
  {
    event_type_id: 2,
    property_type_id: 3,
    link: "water-damage-office",
    name: "מים",
    icon: "water",
  },
  {
    event_type_id: 4,
    property_type_id: 2,
    link: "fire-damage-home",
    name: "אש",
    icon: "fire",
  },
  {
    event_type_id: 4,
    property_type_id: 3,
    link: "fire-damage-office",
    name: "אש",
    icon: "fire",
  },
  {
    event_type_id: 6,
    property_type_id: 2,
    link: "burglary-home",
    name: "פריצה / גניבה",
    icon: "burglary",
  },
  {
    event_type_id: 6,
    property_type_id: 3,
    link: "burglary-office",
    name: "פריצה / גניבה",
    icon: "burglary",
  },
  {
    event_type_id: 7,
    property_type_id: 2,
    link: "person-3d-home",
    name: "צד שלישי",
    icon: "person-3d",
  },
  {
    event_type_id: 7,
    property_type_id: 3,
    link: "person-3d-office",
    name: "צד שלישי",
    icon: "person-3d",
  },
  {
    event_type_id: 8,
    property_type_id: 2,
    link: "others-home",
    name: "אחר",
    icon: "other",
  },
  {
    event_type_id: 8,
    property_type_id: 3,
    link: "others-office",
    name: "אחר",
    icon: "other",
  },
];

export const StatusesData = (isType) => {
  return ["accident", "carburglary", "theftcar"]?.includes(isType)
    ? [
        {
          id: 1,
          title: "פתיחת אירוע",
        },
        {
          id: 2,
          title: `ממתינים למספר תביעה השלמת את מילוי טופס התביעה`,
        },
        {
          id: 3,
          title: `התקבל מספר תביעה`,
        },
        {
          id: 4,
          title: `הרכב נקלט במוסך`,
        },
        {
          id: 5,
          title: `בוצעה בדיקת שמאי`,
        },
        {
          id: 6,
          title: `דו"ח שמאי נשלח לחברת הביטוח`,
        },
        {
          id: 7,
          title: `תיקון הרכב הושלם`,
        },
      ]
    : [
        {
          id: 1,
          title: `פתיחת אירוע`,
        },
        {
          id: 2,
          title: `ממתינים למספר תביעה השלמת את מילוי טופס התביעה`,
        },
        {
          id: 3,
          title: `התקבל מספר תביעה`,
        },
        {
          id: 4,
          title: `הקריאה התקבלה`,
        },
        {
          id: 5,
          title: `בוצעה בדיקת שמאי`,
        },
        {
          id: 6,
          title: `דו"ח שמאי נשלח לחברת הביטוח`,
        },
      ];
};

export const supplier_types = [
  {
    id: 1,
    name: "שרברב",
    description: "Pipe burst, flooding",
    ru_description: "Прорыв труб, затопление",
  },
  {
    id: 3,
    name: "קבלן שיקום",
    description: "Rehabilitation Contractor",
    ru_description: "Подрядчик по реабилитации",
  },
  {
    id: 4,
    name: "גרר",
    description: "Tow truck",
    ru_description: "Эвакуатор",
  },
  {
    id: 5,
    name: "מוסך",
    description: "Service station",
    ru_description: "СТО",
  },
  {
    id: 6,
    name: "בודק תכולת רטיבות",
    description: "Damage check",
    ru_description: "Проверка ущерба",
  },
  {
    id: 7,
    name: "חוקר שרפות",
    description: "Fire inspector",
    ru_description: "Пожарный испектор",
  },
  {
    id: 8,
    name: "מהנדס כללי",
    description: "Engineer",
    ru_description: "Инженер",
  },
  {
    id: 2,
    name: "מאתר נזילות",
    description: "Damage locator",
    ru_description: "Локатор повреждений",
  },
];
