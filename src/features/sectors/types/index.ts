export interface SectorTheme {
  primary: string;
  primaryForeground: string;
  radius: string;
}

export interface SectorDescriptor {
  key: string;
  nameKey: string;
  roleNames: string[];
  planFeatureKeys: string[];
  theme: SectorTheme;
}
