export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    query?: string;
    route?: string;
    children?: NavItem[];
  }
