export interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
  icon?: string;
}
