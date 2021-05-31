import elGR from "antd/es/locale/el_GR";
import enGB from "antd/es/locale/en_GB";

import el from "./el.json";
import en from "./en.json";

export default [
  { id: "el", antd: elGR, i18n: el, moment: "el", label: "Ελληνικά" },
  {
    id: "en",
    antd: enGB,
    i18n: en,
    moment: "en-gb",
    label: "English",
    default: true,
  },
];
