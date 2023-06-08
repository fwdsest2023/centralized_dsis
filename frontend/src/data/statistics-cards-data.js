import {
  BanknotesIcon,
  UserPlusIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "blue",
    icon: BanknotesIcon,
    title: "Today's Sales",
    value: "0",
    footer: {
      color: "text-green-500",
      value: "0%",
      label: "than last week",
    },
  },
  {
    color: "pink",
    icon: UserIcon,
    title: "Clients",
    value: "0",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "",
    },
  },
  {
    color: "green",
    icon: UserPlusIcon,
    title: "Patients",
    value: "0",
    footer: {
      color: "text-red-500",
      value: "",
      label: "",
    },
  },
  {
    color: "orange",
    icon: ChartBarIcon,
    title: "Overall Sales",
    value: "0",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
