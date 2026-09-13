export interface AdministrativeUnit {
  id: string;
  code: string;
  name: string;
  typeCode?: string;
  parentId?: string | null;
}
