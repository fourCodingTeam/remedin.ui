export enum DosageUnit {
  Mg = 0,
  Ml = 1,
  G = 2,
  Mcg = 3,
  Gota = 4,
  Comprimido = 5,
  Capsula = 6,
  Unidade = 7,
}

export const dosageUnitLabels: Record<DosageUnit, string> = {
  [DosageUnit.Mg]: "Miligramas (mg)",
  [DosageUnit.Ml]: "Mililitros (ml)",
  [DosageUnit.G]: "Gramas (g)",
  [DosageUnit.Mcg]: "Microgramas (mcg)",
  [DosageUnit.Gota]: "Gotas",
  [DosageUnit.Comprimido]: "Comprimidos",
  [DosageUnit.Capsula]: "Cápsulas",
  [DosageUnit.Unidade]: "Unidades",
};

