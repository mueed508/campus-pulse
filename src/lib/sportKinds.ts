import {
  BadmintonIcon,
  BasketballIcon,
  CricketIcon,
  FootballIcon,
  SportsIcon,
  TennisIcon,
  VolleyballIcon,
} from "@/components/icons";

export const SPORT_KINDS = [
  "football",
  "cricket",
  "tennis",
  "basketball",
  "badminton",
  "volleyball",
  "other",
] as const;

export type SportKind = (typeof SPORT_KINDS)[number];

interface SportKindMeta {
  label: string;
  Icon: typeof SportsIcon;
  gradient: string;
}

export const SPORT_KIND_META: Record<SportKind, SportKindMeta> = {
  football: {
    label: "Football",
    Icon: FootballIcon,
    gradient: "linear-gradient(135deg, var(--cui-primary-light), var(--cui-primary-main))",
  },
  cricket: {
    label: "Cricket",
    Icon: CricketIcon,
    gradient: "linear-gradient(135deg, var(--cui-secondary-light), var(--cui-secondary-main))",
  },
  tennis: {
    label: "Tennis",
    Icon: TennisIcon,
    gradient: "linear-gradient(135deg, var(--cui-primary-light), var(--cui-secondary-main))",
  },
  basketball: {
    label: "Basketball",
    Icon: BasketballIcon,
    gradient: "linear-gradient(135deg, var(--cui-primary-main), var(--cui-primary-dark))",
  },
  badminton: {
    label: "Badminton",
    Icon: BadmintonIcon,
    gradient: "linear-gradient(135deg, var(--cui-secondary-main), var(--cui-secondary-dark))",
  },
  volleyball: {
    label: "Volleyball",
    Icon: VolleyballIcon,
    gradient: "linear-gradient(135deg, var(--cui-secondary-light), var(--cui-primary-main))",
  },
  other: {
    label: "Other",
    Icon: SportsIcon,
    gradient: "linear-gradient(135deg, var(--cui-primary-dark), var(--cui-secondary-dark))",
  },
};
